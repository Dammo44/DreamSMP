import express from "express";

export const sseRouter = express.Router();
export const currentPlayers = new Set();
let clients = [];

sseRouter.get("/players", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const client = { res };
    clients.push(client);

    req.on("close", () => {
        clients = clients.filter(c => c !== client);
    });
});

export function broadcastPlayers(players) {
    const payload = JSON.stringify({ players });

    for (const c of clients) {
        c.res.write(`event: players\ndata: ${payload}\n\n`);
    }
}
