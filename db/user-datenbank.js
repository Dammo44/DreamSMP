// db/user-datenbank.js
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve("db/user.db");
const db = new Database(dbPath);

// Tabelle erstellen
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        session TEXT PRIMARY KEY,
        id INTEGER,
        linked INTEGER,
        player TEXT
    )
`).run();

export const userDB = {
    createSession(session, id) {
        db.prepare(`
            INSERT INTO users (session, id, linked, player)
            VALUES (?, ?, 0, NULL)
        `).run(session, id);
    },

    getSession(session) {
        return db.prepare("SELECT * FROM users WHERE session = ?").get(session);
    },

    updateSession(session, data) {
        const existing = this.getSession(session);
        if (!existing) return;

        db.prepare(`
            UPDATE users
            SET id = ?, linked = ?, player = ?
            WHERE session = ?
        `).run(
            data.id ?? existing.id,
            data.linked ?? existing.linked,
            data.player ?? existing.player,
            session
        );
    },

    deleteSession(session) {
        db.prepare("DELETE FROM users WHERE session = ?").run(session);
    }
};
