"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const typedi_1 = require("typedi");
const fork_controller_1 = __importDefault(require("./fork/fork.controller"));
const category_controller_1 = __importDefault(require("./category/category.controller"));
const authentication_controller_1 = __importDefault(require("./authentication/authentication.controller"));
const rabbitmq_service_1 = __importDefault(require("./rabbitmq/rabbitmq.service"));
class App {
    app;
    constructor() {
        this.app = express_1.default();
    }
    async initializeApp() {
        await this.initializeRabbitMQ();
        this.initializeMiddlewares();
        this.initializeControllers();
        this.initializeErrorHandling();
    }
    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
    async initializeRabbitMQ() {
        const rabbitMq = typedi_1.Container.get(rabbitmq_service_1.default);
        await rabbitMq.initializeService();
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(cookie_parser_1.default());
    }
    initializeControllers() {
        const controllers = [
            typedi_1.Container.get(authentication_controller_1.default),
            typedi_1.Container.get(fork_controller_1.default),
            typedi_1.Container.get(category_controller_1.default),
        ];
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.default);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map