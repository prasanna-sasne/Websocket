import express from "express";
import { WebSocketServer } from "ws";

const port = 8000;
const app = express();
let counter = 0;

const server = app.listen(port, () => {
    console.log('Server is listning on..' + port);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log('Client connected');
    ws.send(JSON.stringify({ message: 'Welcome client' }));

    ws.on('message', (data) => {
        console.log('Received:', data.toString());

        // Echo back
        ws.send(JSON.stringify({ message: `Message received ${counter++}` }));
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
