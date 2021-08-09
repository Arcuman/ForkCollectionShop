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
const category_dto_1 = __importDefault(require("./category.dto"));
const typedi_1 = require("typedi");
const category_service_1 = __importDefault(require("./category.service"));
const subscription_service_1 = __importDefault(require("./subscription/subscription.service"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const InternalServerErrorException_1 = __importDefault(require("../exceptions/InternalServerErrorException"));
let CategoryController = class CategoryController {
    categoryService;
    subscriptionService;
    path = "/categories";
    router = express.Router();
    constructor(categoryService, subscriptionService) {
        this.categoryService = categoryService;
        this.subscriptionService = subscriptionService;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAllCategories);
        this.router.get(`${this.path}/:id`, this.getCategoryById);
        this.router.get(`${this.path}/:id/subscription`, this.getSubscriptionsByCategoryId);
        this.router.post(`${this.path}/:id/subscription`, auth_middleware_1.default, this.subscribe);
        this.router.get(`${this.path}/:id/forks`, this.getCategoryWithForksById);
        this.router.post(this.path, validation_middleware_1.default(category_dto_1.default), this.createCategory);
    }
    getAllCategories = async (request, response) => {
        const categories = await this.categoryService.getAllCategories();
        response.send(categories);
    };
    getCategoryById = async (request, response, next) => {
        const id = request.params.id;
        try {
            const category = await this.categoryService.getCategoryById(+id);
            response.send(category);
        }
        catch (e) {
            next(e);
        }
    };
    getCategoryWithForksById = async (request, response, next) => {
        const id = request.params.id;
        const { offset, limit, startId } = request.query;
        try {
            const { items, count } = await this.categoryService.getCategoryWithForksById(+id, offset, limit, startId);
            response.send({ category: items, count });
        }
        catch (e) {
            next(e);
        }
    };
    createCategory = async (request, response) => {
        const categoryData = request.body;
        const newCategory = await this.categoryService.createCategory(categoryData);
        response.send(newCategory);
    };
    subscribe = async (request, response, next) => {
        try {
            //TODO: add validation
            const id = +request.params.id;
            const newCategory = await this.subscriptionService.subscribe({ category: { id } }, request.user);
            response.send(newCategory);
        }
        catch (e) {
            next(InternalServerErrorException_1.default);
        }
    };
    getSubscriptionsByCategoryId = async (request, response, next) => {
        const id = request.params.id;
        try {
            const subscriptions = await this.subscriptionService.getSubscriptionsByCategoryId(+id);
            response.send(subscriptions);
        }
        catch (e) {
            next(e);
        }
    };
};
CategoryController = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [category_service_1.default,
        subscription_service_1.default])
], CategoryController);
exports.default = CategoryController;
//# sourceMappingURL=category.controller.js.map