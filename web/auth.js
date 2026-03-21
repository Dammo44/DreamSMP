// web/auth.js
import express from "express";
import crypto from "crypto";
import { userDB } from "../db/user-datenbank.js";

const router = express.Router();

const FRONTEND_TOKEN = process.env.FRONTEND_TOKEN || "frontend123";

router.post("/create", (req, res) => {
    if (req.headers["x-auth"] !== FRONTEND_TOKEN)
        return res.status(403).json({ error: "Unauthorized" });

    const session = crypto.randomUUID();
    const id = Math.floor(Math.random() * 900000 + 100000);

    userDB.createSession(session, id);

    res.json({ session, id });
});

router.get("/status", (req, res) => {
    if (req.headers["x-auth"] !== FRONTEND_TOKEN)
        return res.status(403).json({ error: "Unauthorized" });

    const session = req.query.session;
    const data = userDB.getSession(session);

    if (!data) return res.json({ linked: false });

    res.json(data);
});

router.post("/logout", (req, res) => {
    if (req.headers["x-auth"] !== FRONTEND_TOKEN)
        return res.status(403).json({ error: "Unauthorized" });

    const { session } = req.body;
    userDB.deleteSession(session);

    res.json({ ok: true });
});

export default router;
