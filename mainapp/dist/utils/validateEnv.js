"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
function validateEnv() {
    envalid_1.cleanEnv(process.env, {
        JWT_ACCESS_SECRET: envalid_1.str(),
        JWT_ACCESS_SECRET_EXPIRES: envalid_1.num(),
        JWT_REFRESH_SECRET: envalid_1.str(),
        JWT_REFRESH_SECRET_EXPIRES: envalid_1.num(),
        POSTGRES_HOST: envalid_1.str(),
        POSTGRES_PORT: envalid_1.port(),
        POSTGRES_USER: envalid_1.str(),
        POSTGRES_PASSWORD: envalid_1.str(),
        POSTGRES_DB: envalid_1.str(),
        PORT: envalid_1.port(),
        RABBITMQ: envalid_1.str(),
    });
}
exports.default = validateEnv;
//# sourceMappingURL=validateEnv.js.map