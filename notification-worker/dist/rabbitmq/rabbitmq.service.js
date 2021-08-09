"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
    constructor() {
        this.initializeService();
    }
    async initializeService() {
        try {
            await this.initializeConnection();
            await this.initializeChannel();
            await this.initializeQueues();
            await this.startConsuming();
        }
        catch (err) {
            console.error(err);
        }
    }
    async initializeConnection() {
        try {
            this.connection = await amqplib_1.default.connect(process.env.RABBITMQ);
            console.log("Connected to RabbitMQ Server");
        }
        catch (err) {
            throw err;
        }
    }
    async initializeChannel() {
        try {
            this.channel = await this.connection.createChannel();
            console.log("Created RabbitMQ Channel");
        }
        catch (err) {
            throw err;
        }
    }
    async initializeQueues() {
        try {
            await this.channel.assertQueue(this.queueName, {
                durable: true,
            });
            console.log("Initialized RabbitMQ Queues");
        }
        catch (err) {
            throw err;
        }
    }
    async startConsuming() {
        this.channel.prefetch(1);
        console.info(" Waiting for messages in %s", this.queueName);
        this.channel.consume(this.queueName, async (msg) => {
            if (msg) {
                const notificationDTOMessage = JSON.parse(msg.content.toString());
                try {
                    console.log(`Send info to user ${notificationDTOMessage.subscriberFullName} about new fork` +
                        ` ${notificationDTOMessage.forkName} in category ${notificationDTOMessage.categoryName}`);
                    this.channel.ack(msg);
                }
                catch (err) {
                    console.error("Failed to send notification");
                    this.channel.reject(msg, true);
                }
            }
        }, {
            noAck: false,
        });
    }
};
RabbitMqService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], RabbitMqService);
exports.default = RabbitMqService;
//# sourceMappingURL=rabbitmq.service.js.map