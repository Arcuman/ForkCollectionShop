"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const amqplib_1 = __importDefault(require("amqplib"));
let RabbitMqService = class RabbitMqService {
    connection;
    channel;
    queueName = "new-fork-in-category";
    async initializeService() {
        await this.initializeConnection();
        await this.initializeChannel();
        await this.initializeQueues();
    }
    async initializeConnection() {
        this.connection = await amqplib_1.default.connect(process.env.RABBITMQ);
        console.log("Connected to RabbitMQ Server");
    }
    async initializeChannel() {
        this.channel = await this.connection.createChannel();
        console.log("Created RabbitMQ Channel");
    }
    async initializeQueues() {
        await this.channel.assertQueue(this.queueName, {
            durable: true,
        });
        console.log("Initialized RabbitMQ Queues");
    }
    async sendToQueue(message) {
        this.channel.sendToQueue(this.queueName, Buffer.from(message), {
            persistent: true,
        });
        console.log(`sent: ${message} to queue ${this.queueName}`);
    }
};
RabbitMqService = __decorate([
    typedi_1.Service()
], RabbitMqService);
exports.default = RabbitMqService;
//# sourceMappingURL=rabbitmq.service.js.map