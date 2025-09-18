import { Sequelize } from "@sequelize/core";
import { SqliteDialect } from "@sequelize/sqlite3";

export const db = new Sequelize({
  dialect: SqliteDialect,
  storage: "db.sqlite",
  pool: {
    max: 1,
    idle: Infinity,
    maxUses: Infinity,
    acquire: 3600000,
  },
});
