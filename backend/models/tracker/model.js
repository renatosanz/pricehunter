import { DataTypes } from "@sequelize/core";
import { db } from "../../db.js";


export const Tracker = db.define(
  "Tracker",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        min: 5,
        max: 64,
      },
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
        min: 5,
      },
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
        min: 5,
      },
    },
    traceInterval: { // en minutos
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 1440,
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "tracker",
  }
);
