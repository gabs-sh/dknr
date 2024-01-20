import express from "express";
import { Rabbitmq } from "./Rabbitmq";

const PORT = 3333;

const app = express();

app.use(express.json());

const rabbit = Rabbitmq.getInstance();

app.post("/api/producer", async (req, res) => {
  console.log("Enviando mensagem para a fila");
  await rabbit.sendToQueue(req.body);
  return res.json({ send: true });
});

app.listen(PORT, async () => {
  try {
    await rabbit.connect("producer_connection");
    console.log(`Producer is running at ${PORT}`);
  } catch (error) {
    console.error(error);
  }
});
