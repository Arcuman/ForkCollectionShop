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
const fork_entity_1 = __importDefault(require("../fork/fork.entity"));
const subscription_entity_1 = __importDefault(require("./subscription/subscription.entity"));
let Category = class Category {
    id;
    name;
    description;
    forks;
    subscriptions;
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToMany(() => fork_entity_1.default, (fork) => fork.categories),
    __metadata("design:type", Array)
], Category.prototype, "forks", void 0);
__decorate([
    typeorm_1.OneToMany(() => subscription_entity_1.default, (subscription) => subscription.category),
    __metadata("design:type", Array)
], Category.prototype, "subscriptions", void 0);
Category = __decorate([
    typeorm_1.Entity()
], Category);
exports.default = Category;
//# sourceMappingURL=category.entity.js.map