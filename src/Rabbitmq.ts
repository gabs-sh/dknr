import { connect, Connection, Channel } from "amqplib";

export class Rabbitmq {
  private connection: Connection;
  private defaultChannel: Channel;
  private static instance: Rabbitmq | null;
  private static BASE_EXCHANGE_NAME = "docker-exchange";
  private static BASE_QUEUE_NAME = "docker-queue";

  // Avoid new instance
  private constructor() {}

  // Singleton
  static getInstance(): Rabbitmq {
    if (!Rabbitmq.instance) Rabbitmq.instance = new Rabbitmq();
    return Rabbitmq.instance;
  }

  public async connect(connectionName: string) {
    this.connection = await connect("amqp://guest:guest@localhost:5672", {
      clientProperties: { connection_name: connectionName },
    });

    this.defaultChannel = await this.connection.createChannel();

    await this.defaultChannel.assertExchange(
      Rabbitmq.BASE_EXCHANGE_NAME,
      "direct",
      {
        durable: true,
      }
    );

    await this.defaultChannel.assertQueue(Rabbitmq.BASE_QUEUE_NAME, {
      durable: true,
    });

    await this.defaultChannel.bindQueue(
      Rabbitmq.BASE_QUEUE_NAME,
      Rabbitmq.BASE_EXCHANGE_NAME,
      Rabbitmq.BASE_QUEUE_NAME
    );
  }

  /** Para o consumer */
  public async consume() {
    // cria um canal para cada consumer
    const channel = await this.connection.createChannel();

    await channel.consume(
      Rabbitmq.BASE_QUEUE_NAME,
      async (message) => {
        if (message) {
          console.log(message.content.toString());
          channel.ack(message);
        }
      },
      { noAck: false }
    );
  }

  /** Para o producer */
  public async sendToQueue(data: any) {
    this.defaultChannel.publish(
      Rabbitmq.BASE_EXCHANGE_NAME,
      Rabbitmq.BASE_QUEUE_NAME,
      Buffer.from(JSON.stringify(data))
    );
  }
}
