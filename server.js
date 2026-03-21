// server.js
import express from "express";
import webhookRouter from "./web/webhook.js";
import { sseRouter } from "./web/events.js";
import authRouter from "./web/auth.js";

const app = express();
app.use(express.json());

app.use("/events", sseRouter);
app.use("/auth", authRouter);
app.use("/webhook", webhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("DreamSMP Backend läuft auf Port", PORT);
});
