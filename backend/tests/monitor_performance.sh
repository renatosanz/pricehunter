#!/bin/bash

LOG_FILE="performance.log"
INTERVAL=0.2
PID=$1  # Pasar el PID del proceso como argumento

if [ -z "$PID" ]; then
    echo "Usage: $0 <PID>"
    echo "Ejemplo: $0 1234"
    exit 1
fi

# Verificar si el proceso existe
if ! ps -p $PID > /dev/null 2>&1; then
    echo "Error: El proceso con PID $PID no existe"
    exit 1
fi

echo "Iniciando monitor para PID: $PID"
echo "Timestamp,Elapsed_Time(ms),Total_RAM(MB),Free_RAM(MB),Used_RAM(MB),RAM_Usage_Percentage,Process_RAM(MB),CPU_Total_Percentage,Process_CPU_Percentage" > $LOG_FILE

START_TIME=$(date +%s%3N)

# Inicializar variables para cálculo de CPU
LAST_TOTAL_CPU=0
LAST_PROCESS_CPU=0
FIRST_RUN=true

get_cpu_usage() {
    local pid=$1
    
    # Obtener estadísticas de CPU del sistema
    local cpu_stats=$(grep '^cpu ' /proc/stat)
    local total_cpu=$(echo $cpu_stats | awk '{for(i=2;i<=NF;i++) sum+=$i} END {print sum}')
    
    # Obtener estadísticas de CPU del proceso
    local process_stats=$(grep '^cpu ' /proc/$pid/stat 2>/dev/null || echo "")
    if [ -z "$process_stats" ]; then
        echo "0,0"
        return
    fi
    
    local utime=$(echo $process_stats | awk '{print $14}')
    local stime=$(echo $process_stats | awk '{print $15}')
    local cutime=$(echo $process_stats | awk '{print $16}')
    local cstime=$(echo $process_stats | awk '{print $17}')
    local process_cpu=$((utime + stime + cutime + cstime))
    
    echo "$total_cpu,$process_cpu"
}

calculate_cpu_percentage() {
    local current_total=$1
    local current_process=$2
    local last_total=$3
    local last_process=$4
    local interval=$5
    
    if [ $last_total -eq 0 ] || [ $last_process -eq 0 ]; then
        echo "0,0"
        return
    fi
    
    local total_diff=$((current_total - last_total))
    local process_diff=$((current_process - last_process))
    
    if [ $total_diff -eq 0 ]; then
        echo "0,0"
        return
    fi
    
    # CPU del proceso como porcentaje de una sola CPU
    local process_cpu_percent=$(echo "scale=2; ($process_diff * 100) / $total_diff" | bc)
    
    # CPU total del sistema (todas las cores)
    local cpu_count=$(nproc)
    local total_cpu_percent=$(echo "scale=2; ($total_diff * 100) / ($total_diff + 1)" | bc)
    
    echo "$total_cpu_percent,$process_cpu_percent"
}

echo "🚀 Iniciando monitor de performance..."
echo "📊 PID: $PID | Intervalo: ${INTERVAL}s | Log: $LOG_FILE"
echo ""

while true; do
    CURRENT_TIME=$(date +%s%3N)
    ELAPSED=$((CURRENT_TIME - START_TIME))
    TIMESTAMP=$(date -Iseconds)
    
    # Memoria del sistema
    TOTAL_MEM=$(free -m | awk 'NR==2{print $2}')
    FREE_MEM=$(free -m | awk 'NR==2{print $4}')
    USED_MEM=$((TOTAL_MEM - FREE_MEM))
    RAM_USAGE_PERCENT=$(echo "scale=2; $USED_MEM * 100 / $TOTAL_MEM" | bc)
    
    # Memoria del proceso específico
    PROCESS_MEM=$(ps -o rss= -p $PID 2>/dev/null | awk '{print $1}')
    if [ -z "$PROCESS_MEM" ] || [ "$PROCESS_MEM" = "0" ]; then
        PROCESS_MEM=0
        PROCESS_MEM_MB=0
    else
        PROCESS_MEM_MB=$((PROCESS_MEM / 1024))
    fi
    
    # CPU usage
    CPU_STATS=$(get_cpu_usage $PID)
    CURRENT_TOTAL_CPU=$(echo $CPU_STATS | cut -d',' -f1)
    CURRENT_PROCESS_CPU=$(echo $CPU_STATS | cut -d',' -f2)
    
    if [ "$FIRST_RUN" = true ]; then
        # Primera ejecución, solo guardar valores
        CPU_TOTAL_PERCENT=0
        PROCESS_CPU_PERCENT=0
        FIRST_RUN=false
    else
        # Calcular porcentajes de CPU
        CPU_PERCENTS=$(calculate_cpu_percentage $CURRENT_TOTAL_CPU $CURRENT_PROCESS_CPU $LAST_TOTAL_CPU $LAST_PROCESS_CPU $INTERVAL)
        CPU_TOTAL_PERCENT=$(echo $CPU_PERCENTS | cut -d',' -f1)
        PROCESS_CPU_PERCENT=$(echo $CPU_PERCENTS | cut -d',' -f2)
    fi
    
    # Guardar valores actuales para la siguiente iteración
    LAST_TOTAL_CPU=$CURRENT_TOTAL_CPU
    LAST_PROCESS_CPU=$CURRENT_PROCESS_CPU
    
    # Escribir al log
    echo "$TIMESTAMP,$ELAPSED,$TOTAL_MEM,$FREE_MEM,$USED_MEM,$RAM_USAGE_PERCENT,$PROCESS_MEM_MB,$CPU_TOTAL_PERCENT,$PROCESS_CPU_PERCENT" >> $LOG_FILE
    
    # Mostrar en consola cada 2 segundos
    if [ $((ELAPSED % 2000)) -lt 200 ]; then
        # Crear una barra visual para CPU
        CPU_BAR=""
        CPU_INT=$(printf "%.0f" "$PROCESS_CPU_PERCENT" 2>/dev/null || echo "0")
        if [ $CPU_INT -gt 100 ]; then
            CPU_INT=100
        fi
        BAR_LENGTH=$((CPU_INT / 10))
        for ((i=0; i<BAR_LENGTH; i++)); do
            CPU_BAR="${CPU_BAR}█"
        done
        for ((i=BAR_LENGTH; i<10; i++)); do
            CPU_BAR="${CPU_BAR}░"
        done
        
        # Crear barra visual para RAM
        RAM_BAR=""
        RAM_INT=$(printf "%.0f" "$RAM_USAGE_PERCENT" 2>/dev/null || echo "0")
        if [ $RAM_INT -gt 100 ]; then
            RAM_INT=100
        fi
        BAR_LENGTH=$((RAM_INT / 10))
        for ((i=0; i<BAR_LENGTH; i++)); do
            RAM_BAR="${RAM_BAR}█"
        done
        for ((i=BAR_LENGTH; i<10; i++)); do
            RAM_BAR="${RAM_BAR}░"
        done
        
        echo "🕒 $(date '+%H:%M:%S') | Elapsed: ${ELAPSED}ms"
        echo "   🖥️  CPU: ${PROCESS_CPU_PERCENT}% [${CPU_BAR}] | Sistema: ${CPU_TOTAL_PERCENT}%"
        echo "   💾 RAM: ${USED_MEM}MB/${TOTAL_MEM}MB (${RAM_USAGE_PERCENT}%) [${RAM_BAR}]"
        echo "   📊 Proceso: ${PROCESS_MEM_MB}MB RAM | PID: $PID"
        echo "   ──────────────────────────────────────────────────────────"
    fi
    
    sleep $INTERVAL
    
    # Verificar si el proceso todavía existe
    if ! ps -p $PID > /dev/null 2>&1; then
        echo ""
        echo "🛑 El proceso $PID ha terminado. Cerrando monitor..."
        break
    fi
done
