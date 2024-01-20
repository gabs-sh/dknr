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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Rabbitmq_1 = require("./Rabbitmq");
const PORT = 3333;
const app = (0, express_1.default)();
app.use(express_1.default.json());
const rabbit = Rabbitmq_1.Rabbitmq.getInstance();
app.post("/api/producer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Enviando mensagem para a fila");
    yield rabbit.sendToQueue(req.body);
    return res.json({ send: true });
}));
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield rabbit.connect("producer_connection");
        console.log(`Producer is running at ${PORT}`);
    }
    catch (error) {
        console.error(error);
    }
}));
