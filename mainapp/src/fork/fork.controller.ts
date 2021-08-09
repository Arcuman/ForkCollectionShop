import * as express from "express";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import { Service } from "typedi";
import CreateForkDto from "./fork.dto";
import ForkService from "./fork.service";
import { PaginationParams } from "../utils/types/paginationParams";
import ForkNotFoundException from "../exceptions/ForkNotFoundException";
import InternalServerErrorException from "../exceptions/InternalServerErrorException";

@Service()
class ForkController implements Controller {
  public path = "/forks";
  public router = express.Router();

  constructor(private readonly forkService: ForkService) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .use(`${this.path}`, authMiddleware)
      .get(
        `${this.path}/`,
        validationMiddleware(PaginationParams, true, "query"),
        this.getAllForks
      )
      .get(`${this.path}/:id`, this.getForkById)
      .post(this.path, validationMiddleware(CreateForkDto), this.createFork);
  }

  private createFork = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const forkData: CreateForkDto = request.body;
    try {
      const newFork = await this.forkService.createFork(forkData, request.user);
      newFork.owner = undefined;
      response.send(newFork);
    } catch (e) {
      next(new InternalServerErrorException());
    }
  };

  private getAllForks = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { offset, limit, startId } = request.query as PaginationParams;
    try {
      const { items, count } = await this.forkService.getForks(
        offset,
        limit,
        startId
      );
      response.send({ forks: items, count });
    } catch (e) {
      next(e);
    }
  };

  private getForkById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    try {
      const fork = await this.forkService.getForkById(+id);
      response.send(fork);
    } catch (e) {
      next(new ForkNotFoundException(+id));
    }
  };
}

export default ForkController;
