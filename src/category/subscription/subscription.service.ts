import { Container, Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import User from "../../user/user.entity";
import CategorySubscriptionDto from "./subscription.dto";
import CategorySubscription from "./subscription.entity";
import EventEmitter from "../../utils/eventEmitter";
import { Events } from "../../utils/types/events.enum";
import Fork from "../../fork/fork.entity";
import RabbitMqService from "../../rabbitmq/rabbitmq.service";
import { NewForkInCategoryNotification } from "../../interfaces/NewForkInCategoryNotification";
@Service()
class CategorySubscriptionService {
  constructor(
    @InjectRepository(CategorySubscription)
    private readonly subscriptionRepository: Repository<CategorySubscription>
  ) {
    this.initializeEvents();
  }

  private initializeEvents() {
    EventEmitter.on(Events.ForkCreated, async (fork: Fork) => {
      console.log("Fork Created");
      const categories = fork.categories;
      fork.categories = undefined;
      fork.owner = undefined;
      for (const category of categories) {
        await this.sendNotification(category.id, fork);
      }
    });
  }

  async sendNotification(categoryId: number, fork: Fork) {
    const rabbitMQInstance = Container.get(RabbitMqService);
    const subscriptions = await this.getSubscriptionsByCategoryId(categoryId);
    for (const subscription of subscriptions) {
      const newFork: NewForkInCategoryNotification = {
        user: subscription.subscriber,
        category: subscription.category,
        fork,
      };
      rabbitMQInstance.sendToQueue(JSON.stringify(newFork));
    }
  }

  async subscribe(subscription: CategorySubscriptionDto, user: User) {
    const newSubscription = await this.subscriptionRepository.create({
      ...subscription,
      subscriber: user,
    });
    await this.subscriptionRepository.save(newSubscription);
    newSubscription.category = undefined;
    newSubscription.subscriber = undefined;
    return newSubscription;
  }

  async getSubscriptionsByCategoryId(categoryId: number) {
    return this.subscriptionRepository.find({
      where: {
        categoryId,
      },
      relations: ["category", "subscriber"],
    });
  }
}
export default CategorySubscriptionService;
