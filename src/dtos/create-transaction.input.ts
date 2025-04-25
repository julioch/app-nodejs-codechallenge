import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsNumber, IsPositive } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  @IsUUID('4')
  accountExternalIdDebit!: string;

  @Field(() => String)
  @IsUUID('4')
  accountExternalIdCredit!: string;

  @Field(() => Number)
  @IsNumber()
  @IsPositive()
  tranferTypeId!: number;

  @Field(() => Number)
  @IsNumber()
  @IsPositive()
  value!: number;
}