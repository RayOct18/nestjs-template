import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsRepository } from './accounts.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly drizzleService: DrizzleService,
  ) {}

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

  async transfer(transferDto: TransferDto) {
    const { fromAccountId, toAccountId, amount } = transferDto;

    return this.drizzleService.db.transaction(async (tx) => {
      const fromAccount = await this.accountsRepository.findByIdForUpdate(
        fromAccountId,
        tx,
      );

      if (!fromAccount) {
        this.logger.error({
          message: 'From account not found',
          accountId: fromAccountId,
        });
        throw new NotFoundException('From account not found');
      }

      if (fromAccount.balance < amount) {
        this.logger.error({
          message: 'From account does not have enough balance',
          accountId: fromAccountId,
          amount,
        });
        throw new BadRequestException(
          'From account does not have enough balance',
        );
      }

      const toAccount = await this.accountsRepository.findById(toAccountId, tx);

      if (!toAccount) {
        this.logger.error({
          message: 'To account not found',
          accountId: toAccountId,
        });
        throw new NotFoundException('To account not found');
      }

      await this.accountsRepository.decrementBalance(fromAccountId, amount, tx);
      await this.accountsRepository.incrementBalance(toAccountId, amount, tx);

      this.logger.log({
        message: 'Transfer successful',
        fromAccountId,
        toAccountId,
        amount,
      });
    });
  }
}
