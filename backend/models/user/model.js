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
    for (let admin of admins_list) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(admin.password, salt, async (err, hash) => {
          await User.create({ ...admin, password: hash });
        });
      });
      console.log(`admin: ${admin.name} created!`);
    }
  }
}
