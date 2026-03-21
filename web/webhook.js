// web/webhook.js
import express from "express";
import { serverDB } from "../db/server-datenbank.js";
import { broadcastPlayers, currentPlayers } from "./events.js";

const router = express.Router();

// Spieler-Webhook (join/quit)
router.post("/", (req, res) => {
    const { password, action, player, online } = req.body;

    const realPassword = serverDB.getPassword();

    if (!password || password !== realPassword) {
        return res.status(403).json({ error: "Ungültiges Passwort" });
    }

    if (action === "join") currentPlayers.add(player);
    if (action === "quit") currentPlayers.delete(player);

    broadcastPlayers({
        players: [...currentPlayers],
        online: online || currentPlayers.size
    });

    res.sendStatus(200);
});

// NEUE ROUTE: Datenpaket empfangen
router.post("/data", (req, res) => {
    const { pw, ip, data, new_pw } = req.body;

    const realPassword = serverDB.getPassword();

    // Passwort prüfen
    if (!pw || pw !== realPassword) {
        return res.status(403).json({ error: "Ungültiges Passwort" });
    }

    // IP speichern
    if (ip) {
        serverDB.setIP(ip);
    }

    // Daten speichern (z. B. "neuespw123,.:altespw123")
    if (data) {
        serverDB.setData(data);
    }

    // Passwort ändern
    if (new_pw) {
        serverDB.setPassword(new_pw);
    }

    res.json({
        ok: true,
        message: "Datenpaket gespeichert",
        new_password: new_pw ? "Passwort wurde geändert" : "Passwort unverändert"
    });
});

export default router;
