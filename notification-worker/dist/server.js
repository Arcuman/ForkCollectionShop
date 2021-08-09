"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
validateEnv_1.default();
(async () => {
    const app = new app_1.default();
})();
//# sourceMappingURL=server.js.map