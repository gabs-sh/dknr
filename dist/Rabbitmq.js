"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rabbitmq = void 0;
const amqplib_1 = require("amqplib");
class Rabbitmq {
    // Avoid new instance
    constructor() { }
    // Singleton
    static getInstance() {
        if (!Rabbitmq.instance)
            Rabbitmq.instance = new Rabbitmq();
        return Rabbitmq.instance;
    }
    connect(connectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield (0, amqplib_1.connect)("amqp://guest:guest@localhost:5672", {
                clientProperties: { connection_name: connectionName },
            });
            this.defaultChannel = yield this.connection.createChannel();
            yield this.defaultChannel.assertExchange(Rabbitmq.BASE_EXCHANGE_NAME, "direct", {
                durable: true,
            });
            yield this.defaultChannel.assertQueue(Rabbitmq.BASE_QUEUE_NAME, {
                durable: true,
            });
            yield this.defaultChannel.bindQueue(Rabbitmq.BASE_QUEUE_NAME, Rabbitmq.BASE_EXCHANGE_NAME, Rabbitmq.BASE_QUEUE_NAME);
        });
    }
    /** Para o consumer */
    consume() {
        return __awaiter(this, void 0, void 0, function* () {
            // cria um canal para cada consumer
            const channel = yield this.connection.createChannel();
            yield channel.consume(Rabbitmq.BASE_QUEUE_NAME, (message) => __awaiter(this, void 0, void 0, function* () {
                if (message) {
                    console.log(message.content.toString());
                    channel.ack(message);
                }
            }), { noAck: false });
        });
    }
    /** Para o producer */
    sendToQueue(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.defaultChannel.publish(Rabbitmq.BASE_EXCHANGE_NAME, Rabbitmq.BASE_QUEUE_NAME, Buffer.from(JSON.stringify(data)));
        });
    }
}
exports.Rabbitmq = Rabbitmq;
Rabbitmq.BASE_EXCHANGE_NAME = "docker-exchange";
Rabbitmq.BASE_QUEUE_NAME = "docker-queue";
