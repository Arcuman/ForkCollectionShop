"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const typedi_1 = require("typedi");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const typeorm_1 = require("typeorm");
const fork_entity_1 = __importDefault(require("./fork.entity"));
const ForkNotFoundException_1 = __importDefault(require("../exceptions/ForkNotFoundException"));
const events_enum_1 = require("../utils/types/events.enum");
const eventEmitter_1 = __importDefault(require("../utils/eventEmitter"));
let ForkService = class ForkService {
    forkRepository;
    constructor(forkRepository) {
        this.forkRepository = forkRepository;
    }
    async getForks(offset, limit, startId, options) {
        const where = {};
        let separateCount = 0;
        if (startId) {
            where.id = typeorm_1.MoreThan(startId);
            separateCount = await this.forkRepository.count();
        }
        const [items, count] = await this.forkRepository.findAndCount({
            order: {
                id: "ASC",
            },
            skip: offset,
            take: limit,
            ...options,
        });
        return {
            items,
            count: startId ? separateCount : count,
        };
    }
    async getForkById(id) {
        const fork = await this.forkRepository.findOne(id, {
            relations: ["author"],
        });
        if (fork) {
            return fork;
        }
        throw new ForkNotFoundException_1.default(id);
    }
    async createFork(fork, user) {
        const newFork = await this.forkRepository.create({
            ...fork,
            owner: user,
        });
        await this.forkRepository.save(newFork);
        eventEmitter_1.default.emit(events_enum_1.Events.ForkCreated, newFork);
        return newFork;
    }
};
ForkService = __decorate([
    typedi_1.Service(),
    __param(0, typeorm_typedi_extensions_1.InjectRepository(fork_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ForkService);
exports.default = ForkService;
//# sourceMappingURL=fork.service.js.map