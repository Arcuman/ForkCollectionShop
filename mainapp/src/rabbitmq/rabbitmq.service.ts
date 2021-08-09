import { Service } from "typedi";
import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";
import { NewForkInCategoryNotification } from "../interfaces/NewForkInCategoryNotification";
@Service()
class RabbitMqService {
  private connection: Connection;
  private channel: Channel;
  private queueName = "new-fork-in-category";

  public async initializeService() {
      await this.initializeConnection();
      await this.initializeChannel();
      await this.initializeQueues();
  }

  private async initializeConnection() {
      this.connection = await amqp.connect(process.env.RABBITMQ);
      console.log("Connected to RabbitMQ Server");
  }

  private async initializeChannel() {
      this.channel = await this.connection.createChannel();
      console.log("Created RabbitMQ Channel");
  }

  private async initializeQueues() {
      await this.channel.assertQueue(this.queueName, {
        durable: true,
      });
      console.log("Initialized RabbitMQ Queues");
  }

  public async sendToQueue(message: string) {
    this.channel.sendToQueue(this.queueName, Buffer.from(message), {
      persistent: true,
    });
    console.log(`sent: ${message} to queue ${this.queueName}`);
  }
}

export default RabbitMqService;
