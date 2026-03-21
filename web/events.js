// web/events.js
import express from "express";

export const currentPlayers = new Set();
const clients = new Set();

export const sseRouter = express.Router();

sseRouter.get("/players", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    clients.add(res);

    res.write(`event: players\ndata: ${JSON.stringify({ players: [...currentPlayers] })}\n\n`);

    req.on("close", () => {
        clients.delete(res);
    });
});

export function broadcastPlayers(data) {
    for (const client of clients) {
        client.write(`event: players\ndata: ${JSON.stringify(data)}\n\n`);
    }
}
