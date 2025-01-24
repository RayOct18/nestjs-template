import { IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  username: string;
}
