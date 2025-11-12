import fetch from "node-fetch";
import { CookieJar } from "tough-cookie";

// Configuración
const BASE_URL = "http://localhost:3000/api/user";
const TEST_USERS_COUNT = 100;

// Crear un jar de cookies para manejar las cookies HTTP-Only
const cookieJar = new CookieJar();

// Métricas globales
const globalMetrics = {
  startTime: null,
  endTime: null,
  totalLoginTime: 0,
  totalLogoutTime: 0,
  loginResponseTimes: [],
  logoutResponseTimes: [],
  successfulRequests: 0,
  failedRequests: 0,
  totalRequests: 0,
};

// Función para calcular percentiles
function calculatePercentiles(times) {
  if (times.length === 0) return { p50: 0, p95: 0, p99: 0, min: 0, max: 0 };

  const sorted = [...times].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  return { p50, p95, p99, min, max };
}

// Función para calcular estadísticas
function calculateStats(times) {
  if (times.length === 0) return { avg: 0, min: 0, max: 0 };

  const sum = times.reduce((a, b) => a + b, 0);
  const avg = sum / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  return { avg, min, max };
}

// Función para medir el tiempo de una operación
async function measureOperation(operation) {
  const start = Date.now();
  const result = await operation();
  const end = Date.now();
  const duration = end - start;

  return { result, duration, start, end };
}

// Función para hacer fetch con manejo de cookies y métricas
async function fetchWithCookies(url, options = {}) {
  const currentCookies = await cookieJar.getCookieString(url);

  const fetchOptions = {
    ...options,
    headers: {
      ...options.headers,
      Cookie: currentCookies,
    },
  };

  const startTime = Date.now();
  const response = await fetch(url, fetchOptions);
  const endTime = Date.now();

  // Guardar las cookies de la respuesta
  const setCookieHeader = response.headers.get("set-cookie");
  if (setCookieHeader) {
    await cookieJar.setCookie(setCookieHeader, url);
  }

  return {
    response,
    latency: endTime - startTime,
    startTime,
    endTime,
  };
}

// Función para hacer login con métricas
async function loginUser(email, password) {
  try {
    const { response, latency } = await fetchWithCookies(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    return {
      success: response.status === 200,
      status: response.status,
      data: data,
      latency: latency,
      cookies: await cookieJar.getCookieString(BASE_URL),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      latency: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

// Función para hacer logout con métricas
async function logoutUser() {
  try {
    const { response, latency } = await fetchWithCookies(`${BASE_URL}/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return {
      success: response.status === 200,
      status: response.status,
      data: data,
      latency: latency,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      latency: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

// Función para limpiar cookies entre tests
async function clearCookies() {
  await cookieJar.removeAllCookies();
}

// Función para mostrar métricas en formato de tabla
function displayMetricsTable(metrics, title) {
  console.log(`\n${title}`);
  console.log("=".repeat(50));

  if (metrics.length === 0) {
    console.log("No hay datos disponibles");
    return;
  }

  const stats = calculateStats(metrics);
  const percentiles = calculatePercentiles(metrics);

  console.log(`📊 Muestras: ${metrics.length}`);
  console.log(`📈 Promedio: ${stats.avg.toFixed(2)}ms`);
  console.log(`⚡ Mínimo: ${stats.min}ms`);
  console.log(`🐌 Máximo: ${stats.max}ms`);
  console.log(`📊 P50: ${percentiles.p50}ms`);
  console.log(`📊 P95: ${percentiles.p95}ms`);
  console.log(`📊 P99: ${percentiles.p99}ms`);
}

// Función principal que testea todos los usuarios con métricas completas
async function testAllUsersLoginLogout() {
  console.log("🚀 Iniciando tests de login/logout para 100 usuarios...\n");

  // Inicializar métricas globales
  globalMetrics.startTime = Date.now();
  globalMetrics.totalRequests = TEST_USERS_COUNT * 2; // Login + Logout por usuario

  const results = {
    total: TEST_USERS_COUNT,
    successful: 0,
    failed: 0,
    errors: [],
    userMetrics: [],
  };

  for (let i = 1; i <= TEST_USERS_COUNT; i++) {
    const email = `test.user${i}@example.com`;
    const password = "password123";

    console.log(`🔐 Testeando usuario ${i}/${TEST_USERS_COUNT}: ${email}`);

    const userMetric = {
      userNumber: i,
      email: email,
      login: {},
      logout: {},
    };

    // Test de LOGIN con medición de tiempo
    const loginMeasurement = await measureOperation(() =>
      loginUser(email, password),
    );
    const loginResult = loginMeasurement.result;
    userMetric.login = {
      duration: loginMeasurement.duration,
      latency: loginResult.latency || 0,
      success: loginResult.success,
      timestamp: loginResult.timestamp,
    };

    globalMetrics.loginResponseTimes.push(loginResult.latency || 0);
    globalMetrics.totalLoginTime += loginMeasurement.duration;

    if (!loginResult.success) {
      results.failed++;
      globalMetrics.failedRequests++;
      results.errors.push({
        user: email,
        step: "LOGIN",
        error: loginResult.error || `Status: ${loginResult.status}`,
        data: loginResult.data,
        duration: loginMeasurement.duration,
        latency: loginResult.latency,
      });
      console.log(
        `   ❌ LOGIN FALLIDO (${loginMeasurement.duration}ms): ${loginResult.error || loginResult.data?.message}`,
      );
      continue;
    }

    globalMetrics.successfulRequests++;
    console.log(
      `   ✅ LOGIN EXITOSO (${loginMeasurement.duration}ms, Latencia: ${loginResult.latency}ms)`,
    );

    // Pequeña pausa entre operaciones
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Test de LOGOUT con medición de tiempo
    const logoutMeasurement = await measureOperation(() => logoutUser());
    const logoutResult = logoutMeasurement.result;
    userMetric.logout = {
      duration: logoutMeasurement.duration,
      latency: logoutResult.latency || 0,
      success: logoutResult.success,
      timestamp: logoutResult.timestamp,
    };

    globalMetrics.logoutResponseTimes.push(logoutResult.latency || 0);
    globalMetrics.totalLogoutTime += logoutMeasurement.duration;

    if (!logoutResult.success) {
      results.failed++;
      globalMetrics.failedRequests++;
      results.errors.push({
        user: email,
        step: "LOGOUT",
        error: logoutResult.error || `Status: ${logoutResult.status}`,
        data: logoutResult.data,
        duration: logoutMeasurement.duration,
        latency: logoutResult.latency,
      });
      console.log(
        `   ❌ LOGOUT FALLIDO (${logoutMeasurement.duration}ms): ${logoutResult.error || logoutResult.data?.message}`,
      );
      continue;
    }

    globalMetrics.successfulRequests++;
    console.log(
      `   ✅ LOGOUT EXITOSO (${logoutMeasurement.duration}ms, Latencia: ${logoutResult.latency}ms)`,
    );

    results.successful++;
    results.userMetrics.push(userMetric);

    // Limpiar cookies para el siguiente usuario
    await clearCookies();

    // Pequeña pausa para no saturar el servidor
    await new Promise((resolve) => setTimeout(resolve, 30));
  }

  // Calcular métricas finales
  globalMetrics.endTime = Date.now();
  const totalTestTime = globalMetrics.endTime - globalMetrics.startTime;

  // Mostrar resumen completo
  console.log("\n📊 RESUMEN COMPLETO DE MÉTRICAS:");
  console.log("=".repeat(50));

  console.log(`\n⏰ TIEMPOS TOTALES:`);
  console.log(
    `   Duración total del test: ${totalTestTime}ms (${(totalTestTime / 1000).toFixed(2)}s)`,
  );
  console.log(`   Tiempo total en login: ${globalMetrics.totalLoginTime}ms`);
  console.log(`   Tiempo total en logout: ${globalMetrics.totalLogoutTime}ms`);
  console.log(
    `   Tiempo promedio por usuario: ${(totalTestTime / TEST_USERS_COUNT).toFixed(2)}ms`,
  );

  console.log(`\n📈 MÉTRICAS DE LOGIN:`);
  displayMetricsTable(globalMetrics.loginResponseTimes, "Login Response Times");

  console.log(`\n📈 MÉTRICAS DE LOGOUT:`);
  displayMetricsTable(
    globalMetrics.logoutResponseTimes,
    "Logout Response Times",
  );

  console.log(`\n🎯 ESTADÍSTICAS DE ÉXITO:`);
  console.log("=".repeat(30));
  console.log(
    `✅ Éxitos: ${results.successful}/${results.total} (${((results.successful / results.total) * 100).toFixed(2)}%)`,
  );
  console.log(
    `❌ Fallos: ${results.failed}/${results.total} (${((results.failed / results.total) * 100).toFixed(2)}%)`,
  );
  console.log(`📊 Total requests: ${globalMetrics.totalRequests}`);
  console.log(`✅ Successful requests: ${globalMetrics.successfulRequests}`);
  console.log(`❌ Failed requests: ${globalMetrics.failedRequests}`);
  console.log(
    `📈 Success rate: ${((globalMetrics.successfulRequests / globalMetrics.totalRequests) * 100).toFixed(2)}%`,
  );

  console.log(`\n🚀 RENDIMIENTO:`);
  console.log("=".repeat(20));
  const requestsPerSecond = (
    globalMetrics.totalRequests /
    (totalTestTime / 1000)
  ).toFixed(2);
  console.log(`   Throughput: ${requestsPerSecond} requests/segundo`);
  console.log(`   Users por minuto: ${(requestsPerSecond * 60).toFixed(2)}`);

  // Mostrar los 5 usuarios más lentos
  if (results.userMetrics.length > 0) {
    const slowestUsers = [...results.userMetrics]
      .sort(
        (a, b) =>
          b.login.duration +
          b.logout.duration -
          (a.login.duration + a.logout.duration),
      )
      .slice(0, 5);

    console.log(`\n🐌 TOP 5 USUARIOS MÁS LENTOS:`);
    console.log("=".repeat(40));
    slowestUsers.forEach((user, index) => {
      const totalTime = user.login.duration + user.logout.duration;
      console.log(`${index + 1}. ${user.email}`);
      console.log(
        `   Total: ${totalTime}ms (Login: ${user.login.duration}ms, Logout: ${user.logout.duration}ms)`,
      );
    });
  }

  if (results.errors.length > 0) {
    console.log(`\n🔍 ERRORES DETALLADOS (primeros 10):`);
    console.log("=".repeat(40));
    results.errors.slice(0, 10).forEach((error, index) => {
      console.log(`${index + 1}. Usuario: ${error.user}`);
      console.log(`   Paso: ${error.step}`);
      console.log(`   Duración: ${error.duration}ms`);
      console.log(`   Latencia: ${error.latency}ms`);
      console.log(`   Error: ${error.error}`);
      if (error.data) {
        console.log(`   Respuesta: ${JSON.stringify(error.data)}`);
      }
      console.log("   ---");
    });
  }

  return {
    results,
    metrics: globalMetrics,
    totalTestTime,
  };
}

// Función para testear un usuario específico con métricas detalladas
async function testSpecificUser(userNumber) {
  const email = `test.user${userNumber}@example.com`;
  const password = "password123";

  console.log(`\n🔍 Testeando usuario específico: ${email}`);

  await clearCookies();

  // Login con métricas
  console.log("1. Realizando login...");
  const loginMeasurement = await measureOperation(() =>
    loginUser(email, password),
  );
  console.log("   Resultado:", {
    success: loginMeasurement.result.success,
    duration: `${loginMeasurement.duration}ms`,
    latency: `${loginMeasurement.result.latency}ms`,
    status: loginMeasurement.result.status,
  });

  // Logout con métricas
  console.log("2. Realizando logout...");
  const logoutMeasurement = await measureOperation(() => logoutUser());
  console.log("   Resultado:", {
    success: logoutMeasurement.result.success,
    duration: `${logoutMeasurement.duration}ms`,
    latency: `${logoutMeasurement.result.latency}ms`,
    status: logoutMeasurement.result.status,
  });

  await clearCookies();

  return {
    login: loginMeasurement,
    logout: logoutMeasurement,
  };
}

// Ejecutar los tests
async function main() {
  try {
    console.log("🧪 INICIANDO PRUEBAS DE CARGA Y RENDIMIENTO");
    console.log("=".repeat(50));

    // Testear todos los usuarios
    const testResults = await testAllUsersLoginLogout();

    // Para debugging, puedes descomentar la siguiente línea para testear un usuario específico
    // await testSpecificUser(1);
  } catch (error) {
    console.error("❌ Error ejecutando tests:", error);
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  testAllUsersLoginLogout,
  testSpecificUser,
  loginUser,
  logoutUser,
  calculatePercentiles,
  calculateStats,
};
