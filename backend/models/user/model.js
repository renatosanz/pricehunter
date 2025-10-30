import { DataTypes } from "@sequelize/core";
import { db } from "../../db.js";
import { Tracker } from "../tracker/model.js";
import bcrypt from "bcrypt";

export const User = db.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
      validate: { isIn: [["user", "admin"]] },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
        is: /^\d{10}$/,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 8,
      },
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    isLogged: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  {
    tableName: "user",
    hooks: {
      afterSync: async function () {
        await create_default_admins();
      },
    },
  }
);

User.hasMany(Tracker, { foreignKey: "user_id" });
Tracker.belongsTo(User, { foreignKey: "user_id" });

export async function create_default_admins() {
  if ((await User.count()) == 0) {
    const admins_list = [
      {
        name: "rnt admin",
        role: "admin",
        email: "user@pricehunter.com",
        phone: "2212783296",
        password: "renatosanchez",
      },
    ];

    // Crear usuarios de prueba
    const test_users = [
      {
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        phone: "2211234567",
      },
      {
        name: "María García",
        email: "maria.garcia@example.com",
        phone: "2212345678",
      },
      {
        name: "Carlos López",
        email: "carlos.lopez@example.com",
        phone: "2213456789",
      },
      {
        name: "Ana Martínez",
        email: "ana.martinez@example.com",
        phone: "2214567890",
      },
      {
        name: "José Rodríguez",
        email: "jose.rodriguez@example.com",
        phone: "2215678901",
      },
      {
        name: "Laura Hernández",
        email: "laura.hernandez@example.com",
        phone: "2216789012",
      },
      {
        name: "Miguel González",
        email: "miguel.gonzalez@example.com",
        phone: "2217890123",
      },
      {
        name: "Isabel Díaz",
        email: "isabel.diaz@example.com",
        phone: "2218901234",
      },
      {
        name: "Francisco Morales",
        email: "francisco.morales@example.com",
        phone: "2219012345",
      },
      {
        name: "Elena Castro",
        email: "elena.castro@example.com",
        phone: "2210123456",
      },
      {
        name: "Roberto Silva",
        email: "roberto.silva@example.com",
        phone: "2221234567",
      },
      {
        name: "Carmen Reyes",
        email: "carmen.reyes@example.com",
        phone: "2222345678",
      },
      {
        name: "Javier Ortega",
        email: "javier.ortega@example.com",
        phone: "2223456789",
      },
      {
        name: "Patricia Vargas",
        email: "patricia.vargas@example.com",
        phone: "2224567890",
      },
      {
        name: "Ricardo Mendoza",
        email: "ricardo.mendoza@example.com",
        phone: "2225678901",
      },
      {
        name: "Sofia Ríos",
        email: "sofia.rios@example.com",
        phone: "2226789012",
      },
      {
        name: "Daniel Herrera",
        email: "daniel.herrera@example.com",
        phone: "2227890123",
      },
      {
        name: "Adriana Luna",
        email: "adriana.luna@example.com",
        phone: "2228901234",
      },
      {
        name: "Alejandro Cruz",
        email: "alejandro.cruz@example.com",
        phone: "2229012345",
      },
      {
        name: "Gabriela Paredes",
        email: "gabriela.paredes@example.com",
        phone: "2220123456",
      },
      {
        name: "Oscar Salazar",
        email: "oscar.salazar@example.com",
        phone: "2231234567",
      },
      {
        name: "Verónica Meza",
        email: "veronica.meza@example.com",
        phone: "2232345678",
      },
      {
        name: "Fernando Campos",
        email: "fernando.campos@example.com",
        phone: "2233456789",
      },
      {
        name: "Lucía Rojas",
        email: "lucia.rojas@example.com",
        phone: "2234567890",
      },
      {
        name: "Arturo León",
        email: "arturo.leon@example.com",
        phone: "2235678901",
      },
      {
        name: "Diana Vega",
        email: "diana.vega@example.com",
        phone: "2236789012",
      },
      {
        name: "Sergio Guzmán",
        email: "sergio.guzman@example.com",
        phone: "2237890123",
      },
      {
        name: "Beatriz Medina",
        email: "beatriz.medina@example.com",
        phone: "2238901234",
      },
      {
        name: "Raúl Soto",
        email: "raul.soto@example.com",
        phone: "2239012345",
      },
      {
        name: "Claudia Navarro",
        email: "claudia.navarro@example.com",
        phone: "2230123456",
      },
    ];

    // Función helper para crear usuarios con hash de password
    const createUserWithHash = async (userData) => {
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function (err, salt) {
          if (err) {
            reject(err);
            return;
          }
          bcrypt.hash(userData.password, salt, async (err, hash) => {
            if (err) {
              reject(err);
              return;
            }
            try {
              await User.create({ ...userData, password: hash });
              resolve(true);
            } catch (error) {
              reject(error);
            }
          });
        });
      });
    };

    // Crear administradores
    for (let admin of admins_list) {
      try {
        await createUserWithHash(admin);
        console.log(`admin: ${admin.name} created!`);
      } catch (error) {
        console.error(`Error creating admin ${admin.name}:`, error);
      }
    }

    // Crear usuarios de prueba
    const defaultPassword = "password123"; // Contraseña por defecto para usuarios de prueba

    for (let user of test_users) {
      try {
        await createUserWithHash({
          ...user,
          role: "user",
          password: defaultPassword,
        });
        console.log(`user: ${user.name} created!`);
      } catch (error) {
        console.error(`Error creating user ${user.name}:`, error);
      }
    }

    console.log(
      `✅ Created ${admins_list.length} admin(s) and ${test_users.length} test users!`
    );
  } else {
    console.log("Users already exist in database, skipping default creation.");
  }
}
