import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { consumer, TOPICS, producer } from '../config/kafka.config';

@Injectable()
export class AntiFraudService implements OnModuleInit {
  private readonly logger = new Logger(AntiFraudService.name);

  async onModuleInit() {
    await this.setupConsumer();
  }

  private async setupConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: TOPICS.TRANSACTION_CREATED, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          if (!message.value) {
            this.logger.warn('Recibio nulo or undefined');
            return;
          }

          const messageContent = message.value.toString();
          const { transactionExternalId, value } = JSON.parse(messageContent);

          if (!transactionExternalId || value === undefined) {
            this.logger.error('Formato de mensaje invalido', { messageContent });
            return;
          }

          const status = value > 1000 ? 'rejected' : 'approved';

          await producer.connect();
          await producer.send({
            topic: TOPICS.TRANSACTION_STATUS_UPDATED,
            messages: [{
              value: JSON.stringify({ transactionExternalId, status }),
            }],
          });
          await producer.disconnect();

        } catch (error) {
          this.logger.error('Error processing Kafka message', error);
        }
      },
    });
  }
}