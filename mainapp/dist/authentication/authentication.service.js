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
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const UserWithThatEmailAlreadyExistsException_1 = __importDefault(require("../exceptions/auth/UserWithThatEmailAlreadyExistsException"));
const WrongCredentialsException_1 = __importDefault(require("../exceptions/auth/WrongCredentialsException"));
const user_service_1 = __importDefault(require("../user/user.service"));
const postgresErrorCode_enum_1 = __importDefault(require("../exceptions/database/postgresErrorCode.enum"));
const InternalServerErrorException_1 = __importDefault(require("../exceptions/InternalServerErrorException"));
const typedi_1 = require("typedi");
let AuthenticationService = class AuthenticationService {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async register(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            return await this.userService.create({
                ...userData,
                password: hashedPassword,
            });
        }
        catch (e) {
            console.error(e);
            if (e?.code === postgresErrorCode_enum_1.default.UniqueViolation) {
                throw new UserWithThatEmailAlreadyExistsException_1.default(userData.email);
            }
            throw new InternalServerErrorException_1.default();
        }
    }
    async logIn(logInData) {
        try {
            const user = await this.userService.getByEmail(logInData.email);
            if (!user) {
                console.error(`User with this email not found ${logInData.email}`);
                throw new WrongCredentialsException_1.default();
            }
            const isPasswordMatching = this.userService.isPasswordMatching(user.id, logInData.password);
            if (isPasswordMatching) {
                return user;
            }
            else {
                throw new WrongCredentialsException_1.default();
            }
        }
        catch (e) {
            throw new WrongCredentialsException_1.default();
        }
    }
    getCookieWithJwtAccessToken(userId) {
        const payload = { userId };
        const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: `${process.env.JWT_ACCESS_SECRET_EXPIRES}s`,
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_SECRET_EXPIRES}`;
    }
    getCookieWithJwtRefreshToken(userId) {
        const payload = { userId };
        const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: `${process.env.JWT_REFRESH_SECRET_EXPIRES}s`,
        });
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_SECRET_EXPIRES}`;
        return {
            cookie,
            token,
        };
    }
};
AuthenticationService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [user_service_1.default])
], AuthenticationService);
exports.default = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map