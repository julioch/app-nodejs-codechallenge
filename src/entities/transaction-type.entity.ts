import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TransactionType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}