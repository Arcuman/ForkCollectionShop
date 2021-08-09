"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const rabbitmq_service_1 = __importDefault(require("./rabbitmq/rabbitmq.service"));
class App {
    constructor() {
        this.initializeRabbitMQ();
    }
    initializeRabbitMQ() {
        typedi_1.Container.get(rabbitmq_service_1.default);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map