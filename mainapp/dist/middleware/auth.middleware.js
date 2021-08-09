"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const AuthenticationTokenMissingException_1 = __importDefault(require("../exceptions/auth/AuthenticationTokenMissingException"));
const WrongAuthenticationTokenException_1 = __importDefault(require("../exceptions/auth/WrongAuthenticationTokenException"));
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const user_service_1 = __importDefault(require("../user/user.service"));
async function authMiddleware(request, response, next) {
    const cookies = request.cookies;
    if (!cookies || !cookies.Authentication) {
        next(new AuthenticationTokenMissingException_1.default());
        return;
    }
    const secret = process.env.JWT_ACCESS_SECRET;
    try {
        const payload = jwt.verify(cookies.Authentication, secret);
        const id = payload.userId;
        console.log(id);
        const userService = typeorm_typedi_extensions_1.Container.get(user_service_1.default);
        const user = await userService.getById(id);
        console.log(1);
        if (!user) {
            next(new WrongAuthenticationTokenException_1.default());
        }
        request.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        next(new WrongAuthenticationTokenException_1.default());
    }
}
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map