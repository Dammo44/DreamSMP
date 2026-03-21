// db/server-datenbank.js
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve("db/server.db");
const db = new Database(dbPath);

db.prepare(`
    CREATE TABLE IF NOT EXISTS server_config (
        key TEXT PRIMARY KEY,
        value TEXT
    )
`).run();

function ensureDefault(key, value) {
    const row = db.prepare("SELECT value FROM server_config WHERE key = ?").get(key);
    if (!row) {
        db.prepare("INSERT INTO server_config (key, value) VALUES (?, ?)").run(key, value);
    }
}

ensureDefault("password", "default123");
ensureDefault("ip", "unknown");
ensureDefault("data", "");

export const serverDB = {
    get(key) {
        const row = db.prepare("SELECT value FROM server_config WHERE key = ?").get(key);
        return row?.value || null;
    },

    set(key, value) {
        db.prepare("UPDATE server_config SET value = ? WHERE key = ?").run(value, key);
    },

    getPassword() {
        return this.get("password");
    },

    setPassword(newPw) {
        this.set("password", newPw);
    },

    setIP(ip) {
        this.set("ip", ip);
    },

    setData(data) {
        this.set("data", data);
    }
};
