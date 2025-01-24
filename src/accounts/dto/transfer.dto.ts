import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class TransferDto {
  @IsUUID()
  fromAccountId: string;

  @IsUUID()
  toAccountId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
