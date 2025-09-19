import { DataTypes } from "@sequelize/core";
import { db } from "../../db.js";
import { Tracker } from "../tracker/model.js";

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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
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
  }
);

User.hasMany(Tracker, { foreignKey: "user_id" });
Tracker.belongsTo(User, { foreignKey: "user_id" });
