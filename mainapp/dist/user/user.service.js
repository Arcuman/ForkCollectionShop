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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = __importDefault(require("../user/user.entity"));
const UserNotFoundException_1 = __importDefault(require("../exceptions/UserNotFoundException"));
const typedi_1 = require("typedi");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(userData) {
        const newUser = await this.userRepository.create({
            ...userData,
        });
        await this.userRepository.save(newUser);
        newUser.password = undefined;
        newUser.currentHashedRefreshToken = undefined;
        return newUser;
    }
    async getById(id) {
        const user = await this.userRepository.findOne({ id });
        if (user) {
            return user;
        }
        throw new UserNotFoundException_1.default({ type: "id", value: id });
    }
    async getByEmail(email) {
        const user = await this.userRepository.findOne({ email });
        if (user) {
            return user;
        }
        throw new UserNotFoundException_1.default({ type: "email", value: email });
    }
    async isPasswordMatching(id, password) {
        const user = await this.userRepository.findOne({ id }, {
            select: ["password"],
        });
        return bcrypt.compare(user.password, password);
    }
    async setCurrentRefreshToken(refreshToken, userId) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(userId, {
            currentHashedRefreshToken,
        });
    }
    async removeRefreshToken(userId) {
        return this.userRepository.update(userId, {
            currentHashedRefreshToken: null,
        });
    }
    async getUserIfRefreshTokenMatches(refreshToken, userId) {
        const user = await this.userRepository
            .createQueryBuilder()
            .where({ id: userId })
            .addSelect("User.currentHashedRefreshToken")
            .getOne();
        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
        if (isRefreshTokenMatching) {
            user.currentHashedRefreshToken = undefined;
            return user;
        }
        return null;
    }
};
UserService = __decorate([
    typedi_1.Service(),
    __param(0, typeorm_typedi_extensions_1.InjectRepository(user_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserService);
exports.default = UserService;
//# sourceMappingURL=user.service.js.map