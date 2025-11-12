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
  },
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

    // Función para generar usuarios de prueba masivos
    const generateTestUsers = (count) => {
      const firstNames = [
        "Juan",
        "María",
        "Carlos",
        "Ana",
        "José",
        "Laura",
        "Miguel",
        "Isabel",
        "Francisco",
        "Elena",
        "Roberto",
        "Carmen",
        "Javier",
        "Patricia",
        "Ricardo",
        "Sofia",
        "Daniel",
        "Adriana",
        "Alejandro",
        "Gabriela",
      ];
      const lastNames = [
        "Pérez",
        "García",
        "López",
        "Martínez",
        "Rodríguez",
        "Hernández",
        "González",
        "Díaz",
        "Morales",
        "Castro",
        "Silva",
        "Reyes",
        "Ortega",
        "Vargas",
        "Mendoza",
        "Ríos",
        "Herrera",
        "Luna",
        "Cruz",
        "Paredes",
      ];

      const test_users = [];

      for (let i = 1; i <= count; i++) {
        const firstName =
          firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName =
          lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${firstName} ${lastName}`;
        const email = `test.user${i}@example.com`;
        const phone = `2210000000`;
        test_users.push({
          name,
          email,
          phone,
        });
      }

      return test_users;
    };

    // Generar 100 usuarios de prueba
    const test_users = generateTestUsers(100);

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
      `✅ Created ${admins_list.length} admin(s) and ${test_users.length} test users!`,
    );
  } else {
    console.log("Users already exist in database, skipping default creation.");
  }
}
