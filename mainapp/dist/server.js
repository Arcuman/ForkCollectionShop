"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const typeorm_1 = require("typeorm");
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const typeorm_2 = require("typeorm");
const ormconfig_1 = __importDefault(require("./ormconfig"));
const typedi_1 = require("typedi");
validateEnv_1.default();
(async () => {
    try {
        typeorm_1.useContainer(typedi_1.Container);
        await typeorm_2.createConnection(ormconfig_1.default);
    }
    catch (error) {
        console.log(error);
        return error;
    }
    const app = new app_1.default();
    await app.initializeApp();
    app.listen();
})();
//# sourceMappingURL=server.js.map