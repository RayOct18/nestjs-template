import { Injectable } from '@nestjs/common';
import { KyselyService } from '../kysely/kysely.service';
import { KyselyClient } from 'src/kysely/kyserly.type';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AccountsRepository {
  constructor(private readonly kyselyService: KyselyService) {}

  async create(username: string) {
    return this.kyselyService
      .insertInto('Account')
      .values({
        id: uuid(),
        username,
      })
      .returningAll()
      .executeTakeFirst();
  }

  async findAll() {
    return this.kyselyService.selectFrom('Account').selectAll().execute();
  }

  async findById(id: string, tx: KyselyClient = this.kyselyService) {
    return tx
      .selectFrom('Account')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();
  }

  async updateBalance(id: string, balance: number) {
    return this.kyselyService
      .updateTable('Account')
      .set({ balance })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }

  async delete(id: string) {
    return this.kyselyService
      .deleteFrom('Account')
      .where('id', '=', id)
      .execute();
  }

  async findByIdForUpdate(id: string, tx: KyselyClient) {
    return tx
      .selectFrom('Account')
      .where('id', '=', id)
      .forUpdate()
      .selectAll()
      .executeTakeFirst();
  }

  async incrementBalance(id: string, amount: number, tx: KyselyClient) {
    return tx
      .updateTable('Account')
      .set((eb) => ({ balance: eb('balance', '+', amount) }))
      .where('id', '=', id)
      .execute();
  }

  async decrementBalance(id: string, amount: number, tx: KyselyClient) {
    return tx
      .updateTable('Account')
      .set((eb) => ({ balance: eb('balance', '-', amount) }))
      .where('id', '=', id)
      .execute();
  }
}
