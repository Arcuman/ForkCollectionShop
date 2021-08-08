import * as express from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreateCategoryDto from "./category.dto";
import { Service } from "typedi";
import CategoryService from "./category.service";
import { PaginationParams } from "../utils/types/paginationParams";
import CategorySubscriptionService from "./subscription/subscription.service";
import CategorySubscriptionDto from "./subscription/subscription.dto";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import InternalServerErrorException from "../exceptions/InternalServerErrorException";

@Service()
class CategoryController implements Controller {
  public path = "/categories";
  public router = express.Router();

  constructor(
    private readonly categoryService: CategoryService,
    private readonly subscriptionService: CategorySubscriptionService
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllCategories);
    this.router.get(`${this.path}/:id`, this.getCategoryById);
    this.router.get(
      `${this.path}/:id/subscription`,
      this.getSubscriptionsByCategoryId
    );
    this.router.post(
      `${this.path}/:id/subscription`,
      authMiddleware,
      this.subscribe
    );
    this.router.get(`${this.path}/:id/forks`, this.getCategoryWithForksById);
    this.router.post(
      this.path,
      validationMiddleware(CreateCategoryDto),
      this.createCategory
    );
  }

  private getAllCategories = async (
    request: express.Request,
    response: express.Response
  ) => {
    const categories = await this.categoryService.getAllCategories();
    response.send(categories);
  };

  private getCategoryById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    try {
      const category = await this.categoryService.getCategoryById(+id);
      response.send(category);
    } catch (e) {
      next(e);
    }
  };

  private getCategoryWithForksById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const { offset, limit, startId } = request.query as PaginationParams;
    try {
      const { items, count } =
        await this.categoryService.getCategoryWithForksById(
          +id,
          offset,
          limit,
          startId
        );
      response.send({ category: items, count });
    } catch (e) {
      next(e);
    }
  };

  private createCategory = async (
    request: express.Request,
    response: express.Response
  ) => {
    const categoryData: CreateCategoryDto = request.body;
    const newCategory = await this.categoryService.createCategory(categoryData);
    response.send(newCategory);
  };

  private subscribe = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      //TODO: add validation
      const id = +request.params.id;
      const newCategory = await this.subscriptionService.subscribe(
        { category: { id } },
        request.user
      );
      response.send(newCategory);
    } catch (e) {
      next(InternalServerErrorException);
    }
  };

  private getSubscriptionsByCategoryId = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    try {
      const subscriptions =
        await this.subscriptionService.getSubscriptionsByCategoryId(+id);
      response.send(subscriptions);
    } catch (e) {
      next(e);
    }
  };
}

export default CategoryController;
