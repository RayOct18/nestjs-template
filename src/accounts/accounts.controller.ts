import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  SerializeOptions,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountResponseDto } from './dto/account.response.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @SerializeOptions({ type: AccountResponseDto })
  @Post()
  create(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountResponseDto> {
    return this.accountsService.create(createAccountDto);
  }

  @SerializeOptions({ type: AccountResponseDto })
  @Get()
  findAll(): Promise<AccountResponseDto[]> {
    return this.accountsService.findAll();
  }

  @SerializeOptions({ type: AccountResponseDto })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AccountResponseDto> {
    return this.accountsService.findOne(id);
  }

  @SerializeOptions({ type: AccountResponseDto })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<AccountResponseDto> {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.accountsService.remove(id);
  }
}
