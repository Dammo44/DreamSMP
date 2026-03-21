// db/server-datenbank.js
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve("db/server.db");
const db = new Database(dbPath);

// Tabelle erstellen, falls nicht vorhanden
db.prepare(`
    CREATE TABLE IF NOT EXISTS server_config (
        key TEXT PRIMARY KEY,
        value TEXT
    )
`).run();

// Standard-Passwort setzen, falls nicht vorhanden
const exists = db.prepare("SELECT value FROM server_config WHERE key = 'password'").get();
if (!exists) {
    db.prepare("INSERT INTO server_config (key, value) VALUES ('password', 'default123')").run();
}

export const serverDB = {
    getPassword() {
        const row = db.prepare("SELECT value FROM server_config WHERE key = 'password'").get();
        return row?.value || "default123";
    },

    setPassword(newPassword) {
        db.prepare("UPDATE server_config SET value = ? WHERE key = 'password'")
          .run(newPassword);
    }
};
