import { IsPositive } from 'class-validator';

export class UpdateAccountDto {
  @IsPositive()
  balance: number;
}
