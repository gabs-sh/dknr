import { Rabbitmq } from "./Rabbitmq";
import { pid } from "process";

(async () => {
  const rabbit = Rabbitmq.getInstance();
  await rabbit.connect(`consumer_connection: ${pid}`);
  await rabbit.consume();
})();
