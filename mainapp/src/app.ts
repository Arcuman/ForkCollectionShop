import express from "express";
import errorMiddleware from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
import { Container } from "typedi";
import ForkController from "./fork/fork.controller";
import CategoryController from "./category/category.controller";
import AuthenticationController from "./authentication/authentication.controller";
import RabbitMqService from "./rabbitmq/rabbitmq.service";
class App {
  public app: express.Application;
  constructor() {
    this.app = express();
  }
  public async initializeApp() {
    await this.initializeRabbitMQ();
    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  private async initializeRabbitMQ() {
    const rabbitMq = Container.get(RabbitMqService);
    await rabbitMq.initializeService();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private initializeControllers() {
    const controllers = [
      Container.get(AuthenticationController),
      Container.get(ForkController),
      Container.get(CategoryController),
    ];
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
