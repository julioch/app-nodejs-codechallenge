import { Kafka, logLevel, Partitioners } from 'kafkajs';
import { Socket } from 'net';

export const kafka = new Kafka({
  clientId: 'transaction-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:29092'],
  logLevel: logLevel.ERROR,
  retry: {
    initialRetryTime: 5000,
    maxRetryTime: 30000,
    retries: Infinity,
    factor: 0.2,
    multiplier: 2
  },
  socketFactory: () => {
    const socket = new Socket();
    // Configuración post-creación
    socket.setKeepAlive(true, 30000); 
    socket.setTimeout(30000); 
    return socket;
  },
});

export const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner, // Compatibilidad
  allowAutoTopicCreation: true,
  idempotent: true,
  maxInFlightRequests: 1
});

export const consumer = kafka.consumer({
  groupId: 'transaction-group',
  sessionTimeout: 30000,
  heartbeatInterval: 10000,
  allowAutoTopicCreation: true
});

export const TOPICS = {
  TRANSACTION_CREATED: 'transaction-created',
  TRANSACTION_STATUS_UPDATED: 'transaction-status-updated',
};