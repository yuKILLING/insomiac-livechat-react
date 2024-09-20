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
    const data = JSON.parse(rawMessage);

    if (data.type === "message") {
      const { name, userMessage } = data;
      messages.push({ name, userMessage });
      for (const clientId in clients) {
        clients[clientId].send(JSON.stringify([{ name, userMessage }]));
      }
    } else if (data.type === "typing") {
      for (const clientId in clients) {
        if (clientId !== id) {
          clients[clientId].send(
            JSON.stringify({ type: "typing", name: data.name })
          );
        }
      }
    }
  });

  ws.on("close", () => {
    delete clients[id];
    console.log(`Client ${id} has closed the connection.`);
  });
});
