import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";

const clients = {};
const messages = [];

const wss = new WebSocketServer({ port: 8000 });

wss.on("connection", (ws) => {
  const id = uuid();
  clients[id] = ws;
  console.log(`New client connected: ${id}`);
  ws.send(JSON.stringify(messages));

  ws.on("message", (rawMessage) => {
    const { name, userMessage } = JSON.parse(rawMessage);
    messages.push({ name, userMessage });
    for (const id in clients) {
      clients[id].send(JSON.stringify([{ name, userMessage }]));
    }
  });

  ws.on("close", () => {
    delete clients[id];
    console.log(`Client ${id} has closed the connection.`);
  });
});
