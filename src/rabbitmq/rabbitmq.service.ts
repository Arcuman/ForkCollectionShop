import { Service } from "typedi";
import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";
import { NewForkInCategoryNotification } from "../interfaces/NewForkInCategoryNotification";
@Service()
class RabbitMqService {
  private connection: Connection;
  private channel: Channel;
  private queueName = "new-fork-in-category";
  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    try {
      await this.initializeConnection();
      await this.initializeChannel();
      await this.initializeQueues();
      await this.startConsuming();
    } catch (err) {
      console.error(err);
    }
  }
  private async initializeConnection() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ);
      console.log("Connected to RabbitMQ Server");
    } catch (err) {
      throw err;
    }
  }

  private async initializeChannel() {
    try {
      this.channel = await this.connection.createChannel();
      console.log("Created RabbitMQ Channel");
    } catch (err) {
      throw err;
    }
  }

  private async initializeQueues() {
    try {
      await this.channel.assertQueue(this.queueName, {
        durable: true,
      });
      console.log("Initialized RabbitMQ Queues");
    } catch (err) {
      throw err;
    }
  }

  public async sendToQueue(message: string) {
    this.channel.sendToQueue(this.queueName, Buffer.from(message), {
      persistent: true,
    });
    console.log(`sent: ${message} to queue ${this.queueName}`);
  }
  //TODO: make separate worker to consume messages
  public async startConsuming() {
    this.channel.prefetch(1);
    this.channel.consume(
      this.queueName,
      async (msg: ConsumeMessage | null) => {
        if (msg) {
          const notificationDTOMessage: NewForkInCategoryNotification =
            JSON.parse(msg.content.toString());
          try {
            console.log(
              `Send info to user ${notificationDTOMessage.user.fullName} about new fork` +
                ` ${notificationDTOMessage.fork.name} in category ${notificationDTOMessage.category.name}`
            );
          } catch (err) {
            console.error("Failed to send notification");
          }
        }
      },
      {
        noAck: false,
      }
    );
  }
}

export default RabbitMqService;
