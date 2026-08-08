// database/db.ts
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, "app.db"));
const initSql = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");

db.exec(initSql);

export default db;
