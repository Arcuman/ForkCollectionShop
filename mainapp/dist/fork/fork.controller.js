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
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const typedi_1 = require("typedi");
const fork_dto_1 = __importDefault(require("./fork.dto"));
const fork_service_1 = __importDefault(require("./fork.service"));
const paginationParams_1 = require("../utils/types/paginationParams");
const ForkNotFoundException_1 = __importDefault(require("../exceptions/ForkNotFoundException"));
const InternalServerErrorException_1 = __importDefault(require("../exceptions/InternalServerErrorException"));
let ForkController = class ForkController {
    forkService;
    path = "/forks";
    router = express.Router();
    constructor(forkService) {
        this.forkService = forkService;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router
            .use(`${this.path}`, auth_middleware_1.default)
            .get(`${this.path}/`, validation_middleware_1.default(paginationParams_1.PaginationParams, true, "query"), this.getAllForks)
            .get(`${this.path}/:id`, this.getForkById)
            .post(this.path, validation_middleware_1.default(fork_dto_1.default), this.createFork);
    }
    createFork = async (request, response, next) => {
        const forkData = request.body;
        try {
            const newFork = await this.forkService.createFork(forkData, request.user);
            newFork.owner = undefined;
            response.send(newFork);
        }
        catch (e) {
            next(new InternalServerErrorException_1.default());
        }
    };
    getAllForks = async (request, response, next) => {
        const { offset, limit, startId } = request.query;
        try {
            const { items, count } = await this.forkService.getForks(offset, limit, startId);
            response.send({ forks: items, count });
        }
        catch (e) {
            next(e);
        }
    };
    getForkById = async (request, response, next) => {
        const id = request.params.id;
        try {
            const fork = await this.forkService.getForkById(+id);
            response.send(fork);
        }
        catch (e) {
            next(new ForkNotFoundException_1.default(+id));
        }
    };
};
ForkController = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [fork_service_1.default])
], ForkController);
exports.default = ForkController;
//# sourceMappingURL=fork.controller.js.map