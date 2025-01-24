import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async create(createAccountDto: CreateAccountDto) {
    return await this.accountsRepository.create(createAccountDto.username);
  }

  findAll() {
    return this.accountsRepository.findAll();
  }

  findOne(id: string) {
    return this.accountsRepository.findById(id);
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    return await this.accountsRepository.updateBalance(
      id,
      updateAccountDto.balance,
    );
  }

  async remove(id: string) {
    return await this.accountsRepository.delete(id);
  }
}
