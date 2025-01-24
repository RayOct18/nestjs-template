import { Expose } from 'class-transformer';

export class AccountResponseDto {
  @Expose()
  username: string;
  @Expose()
  balance: number;
}
