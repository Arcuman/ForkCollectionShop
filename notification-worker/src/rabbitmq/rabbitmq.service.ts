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

  public async startConsuming() {
    this.channel.prefetch(1);
    console.info(" Waiting for messages in %s", this.queueName);
    this.channel.consume(
      this.queueName,
      async (msg: ConsumeMessage | null) => {
        if (msg) {
          const notificationDTOMessage: NewForkInCategoryNotification =
            JSON.parse(msg.content.toString());
          try {
            console.log(
              `Send info to user ${notificationDTOMessage.subscriberFullName} about new fork` +
                ` ${notificationDTOMessage.forkName} in category ${notificationDTOMessage.categoryName}`
            );
            this.channel.ack(msg);
          } catch (err) {
            console.error("Failed to send notification");
            this.channel.reject(msg, true);
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
