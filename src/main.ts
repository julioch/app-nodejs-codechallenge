import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { producer, consumer } from './config/kafka.config';

async function waitForKafka() {
  let isConnected = false;
  let retries = 0;
  
  while (!isConnected && retries < 5) {
    try {
      await producer.connect();
      await consumer.connect();
      isConnected = true;
    } catch (err) {
      retries++;
      console.log(`Intento ${retries}/5 - Kafka no está listo, reintentando...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  if (!isConnected) throw new Error('No se pudo conectar a Kafka después de 5 intentos');
}

async function bootstrap() {
  await waitForKafka();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, 
    })
  );

  await producer.connect();
  app.enableShutdownHooks();

  await app.listen(4000);
  console.log(`🚀 Server running on http://localhost:4000/graphql`);
}
bootstrap();