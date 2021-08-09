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
const subscription_entity_1 = __importDefault(require("./subscription.entity"));
const eventEmitter_1 = __importDefault(require("../../utils/eventEmitter"));
const events_enum_1 = require("../../utils/types/events.enum");
const rabbitmq_service_1 = __importDefault(require("../../rabbitmq/rabbitmq.service"));
let CategorySubscriptionService = class CategorySubscriptionService {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.initializeEvents();
    }
    initializeEvents() {
        eventEmitter_1.default.on(events_enum_1.Events.ForkCreated, async (fork) => {
            console.log("Fork Created");
            const categories = fork.categories;
            for (const category of categories) {
                await this.sendNotification(category.id, fork);
            }
        });
    }
    async sendNotification(categoryId, fork) {
        const rabbitMQInstance = typedi_1.Container.get(rabbitmq_service_1.default);
        const subscriptions = await this.getSubscriptionsByCategoryId(categoryId);
        for (const subscription of subscriptions) {
            const newFork = {
                subscriberFullName: subscription.subscriber.fullName,
                subscriberEmail: subscription.subscriber.email,
                categoryName: subscription.category.name,
                forkName: fork.name,
            };
            rabbitMQInstance.sendToQueue(JSON.stringify(newFork));
        }
    }
    async subscribe(subscription, user) {
        const newSubscription = await this.subscriptionRepository.create({
            ...subscription,
            subscriber: user,
        });
        await this.subscriptionRepository.save(newSubscription);
        newSubscription.category = undefined;
        newSubscription.subscriber = undefined;
        return newSubscription;
    }
    async getSubscriptionsByCategoryId(categoryId) {
        return this.subscriptionRepository.find({
            where: {
                categoryId,
            },
            relations: ["category", "subscriber"],
        });
    }
};
CategorySubscriptionService = __decorate([
    typedi_1.Service(),
    __param(0, typeorm_typedi_extensions_1.InjectRepository(subscription_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], CategorySubscriptionService);
exports.default = CategorySubscriptionService;
//# sourceMappingURL=subscription.service.js.map