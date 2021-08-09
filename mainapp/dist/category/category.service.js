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
const category_entity_1 = __importDefault(require("./category.entity"));
const CategoryNotFoundException_1 = __importDefault(require("../exceptions/CategoryNotFoundException"));
const fork_entity_1 = __importDefault(require("../fork/fork.entity"));
let CategoryService = class CategoryService {
    categoryRepository;
    forkRepository;
    constructor(categoryRepository, forkRepository) {
        this.categoryRepository = categoryRepository;
        this.forkRepository = forkRepository;
    }
    async createCategory(category) {
        const newCategory = this.categoryRepository.create(category);
        await this.categoryRepository.save(newCategory);
        return newCategory;
    }
    async getAllCategories() {
        return await this.categoryRepository.find();
    }
    async getCategoryById(id) {
        const category = await this.categoryRepository.findOne(id);
        if (category) {
            return category;
        }
        else {
            throw new CategoryNotFoundException_1.default(id);
        }
    }
    async getCategoryWithForksById(id, offset, limit, startId) {
        let separateCount = 0;
        //TODO: move to fork module for path .../forks?categories=1&categories=2
        const getAllForkByCategoryIdQuery = this.forkRepository
            .createQueryBuilder("fork")
            .leftJoin("fork.categories", "category")
            .where(`category.id = :id ${startId ? "and fork.id > :startId" : ""}`, {
            id,
            startId,
        })
            .skip(offset)
            .take(limit)
            .orderBy({ "fork.id": "ASC" })
            .getManyAndCount();
        if (startId) {
            separateCount = await this.categoryRepository.count();
        }
        const [items, count] = await getAllForkByCategoryIdQuery;
        return {
            items,
            count: startId ? separateCount : count,
        };
    }
};
CategoryService = __decorate([
    typedi_1.Service(),
    __param(0, typeorm_typedi_extensions_1.InjectRepository(category_entity_1.default)),
    __param(1, typeorm_typedi_extensions_1.InjectRepository(fork_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], CategoryService);
exports.default = CategoryService;
//# sourceMappingURL=category.service.js.map