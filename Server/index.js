import express from "express";
import { WebSocketServer } from "ws";
import { connectDB, getMessagesCollection } from "./mongo.js";
import cors from "cors";

const port = 8000;
const app = express();

app.use(cors());
app.use(express.json());


let messagesCollection;

connectDB().then((collection) => {
  messagesCollection = collection;
});

// HTTP endpoint to fetch messages (optional)
app.get("/messages", async (req, res) => {
  try {
    const messages = await messagesCollection
      .find()
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", async (ws) => {
  console.log("Client connected");

  // Send last 10 messages as history
  const history = await messagesCollection
    .find()
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();
  ws.send(JSON.stringify({ type: "history", messages: history.reverse() }));

  ws.on("message", async (data) => {
    const parsed = JSON.parse(data);
    const newMsg = {
      message: parsed.message,
      createdAt: new Date().toISOString(),
    };

    // Insert into DB
    await messagesCollection.insertOne(newMsg);

    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify({ type: "new_message", message: newMsg }));
      }
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});
