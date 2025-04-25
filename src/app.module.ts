import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TransactionResolver } from './resolvers/transaction.resolver';
import { TransactionService } from './services/transaction.service';
import { AntiFraudService } from './services/anti-fraud.service';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatus } from './entities/transaction-status.entity';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionController } from './controllers/transaction.controller';

@Module({
  controllers: [TransactionController],
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Transaction, TransactionStatus, TransactionType]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
  ],
  providers: [TransactionService, AntiFraudService, TransactionResolver],
})
export class AppModule {}