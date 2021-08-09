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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const user_dto_1 = __importDefault(require("../user/user.dto"));
const authentication_service_1 = __importDefault(require("./authentication.service"));
const login_dto_1 = __importDefault(require("./login.dto"));
const user_service_1 = __importDefault(require("../user/user.service"));
const typedi_1 = require("typedi");
const InvalidRefreshTokenException_1 = __importDefault(require("../exceptions/auth/InvalidRefreshTokenException"));
const jwt = __importStar(require("jsonwebtoken"));
let AuthenticationController = class AuthenticationController {
    userService;
    authenticationService;
    path = "/auth";
    router = express.Router();
    constructor(userService, authenticationService) {
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, validation_middleware_1.default(user_dto_1.default), this.registration);
        this.router.post(`${this.path}/login`, validation_middleware_1.default(login_dto_1.default), this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
        this.router.get(`${this.path}/refresh`, this.refresh);
    }
    registration = async (request, response, next) => {
        const userData = request.body;
        try {
            const user = await this.authenticationService.register(userData);
            response.send(user);
        }
        catch (error) {
            next(error);
        }
    };
    loggingIn = async (request, response, next) => {
        const logInData = request.body;
        try {
            const user = await this.authenticationService.logIn(logInData);
            const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
            const { cookie: refreshTokenCookie, token: refreshToken } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
            await this.userService.setCurrentRefreshToken(refreshToken, user.id);
            request.res.setHeader("Set-Cookie", [
                accessTokenCookie,
                refreshTokenCookie,
            ]);
            response.send(user);
        }
        catch (error) {
            next(error);
        }
    };
    loggingOut = async (request, response) => {
        await this.userService.removeRefreshToken(request.user.id);
        response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
        response.send(200);
    };
    //TODO: move it to auth service
    refresh = async (request, response, next) => {
        const cookies = request.cookies;
        if (!cookies || !cookies.Refresh) {
            next(new InvalidRefreshTokenException_1.default());
        }
        const secret = process.env.JWT_REFRESH_SECRET;
        try {
            const payload = jwt.verify(cookies.Refresh, secret);
            const user = await this.userService.getUserIfRefreshTokenMatches(cookies.Refresh, payload.userId);
            if (!user) {
                next(new InvalidRefreshTokenException_1.default());
            }
            const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
            request.res.setHeader("Set-Cookie", accessTokenCookie);
            response.send(user);
        }
        catch (e) {
            console.error(e);
            next(new InvalidRefreshTokenException_1.default());
        }
    };
};
AuthenticationController = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [user_service_1.default,
        authentication_service_1.default])
], AuthenticationController);
exports.default = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map