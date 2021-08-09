"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
function validateEnv() {
    envalid_1.cleanEnv(process.env, {
        RABBITMQ: envalid_1.str(),
    });
}
exports.default = validateEnv;
//# sourceMappingURL=validateEnv.js.map