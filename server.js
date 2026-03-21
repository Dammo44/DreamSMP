import express from "express";
import webhookRouter from "./web/webhook.js";
import { sseRouter } from "./web/events.js";

const app = express();
app.use(express.json());

// SSE (Spielerliste)
app.use("/events", sseRouter);

// Webhook (Minecraft Plugin)
app.use("/webhook", webhookRouter);

// Render Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("DreamSMP Backend läuft auf Port", PORT);
});
