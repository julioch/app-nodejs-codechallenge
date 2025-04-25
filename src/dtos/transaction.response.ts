import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TransactionStatusResponse {
  @Field()
  name!: string;
}

@ObjectType()
export class TransactionTypeResponse {
  @Field()
  name!: string;
}

@ObjectType()
export class TransactionResponse {
  @Field()
  transactionExternalId!: string;

  @Field(() => TransactionTypeResponse)
  transactionType!: TransactionTypeResponse;

  @Field(() => TransactionStatusResponse)
  transactionStatus!: TransactionStatusResponse;

  @Field()
  value!: number;

  @Field()
  createdAt!: Date;
}