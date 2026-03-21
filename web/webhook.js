import express from "express";
import { broadcastPlayers, currentPlayers } from "./events.js";

const router = express.Router();

router.post("/", (req, res) => {
    const { action, player } = req.body;

    console.log("[Webhook]", action, player);

    if (action === "join") currentPlayers.add(player);
    if (action === "quit") currentPlayers.delete(player);

    broadcastPlayers([...currentPlayers]);

    res.sendStatus(200);
});

export default router;
