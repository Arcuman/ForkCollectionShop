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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = __importDefault(require("../../user/user.entity"));
const category_entity_1 = __importDefault(require("../category.entity"));
let CategorySubscription = class CategorySubscription {
    id;
    subscriberId;
    subscriber;
    categoryId;
    category;
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CategorySubscription.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.RelationId((categorySubscription) => categorySubscription.subscriber),
    __metadata("design:type", Number)
], CategorySubscription.prototype, "subscriberId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_entity_1.default, (subscriber) => subscriber.subscriptions),
    __metadata("design:type", user_entity_1.default)
], CategorySubscription.prototype, "subscriber", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.RelationId((categorySubscription) => categorySubscription.category),
    __metadata("design:type", Number)
], CategorySubscription.prototype, "categoryId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => category_entity_1.default, (category) => category.subscriptions),
    __metadata("design:type", category_entity_1.default)
], CategorySubscription.prototype, "category", void 0);
CategorySubscription = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique("subscriber", ["categoryId", "subscriberId"])
], CategorySubscription);
exports.default = CategorySubscription;
//# sourceMappingURL=subscription.entity.js.map