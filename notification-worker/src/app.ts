import { Container } from "typedi";
import RabbitMqService from "./rabbitmq/rabbitmq.service";

class App {
  public async initializeApp() {
    await this.initializeRabbitMQ();
  }
  private async initializeRabbitMQ() {
    const rabbitMq = Container.get(RabbitMqService);
    await rabbitMq.initializeService();
  }
}

export default App;
