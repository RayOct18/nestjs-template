import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { accountTable } from '../db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AccountsRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(username: string) {
    const [account] = await this.drizzleService.db
      .insert(accountTable)
      .values({ id: uuid(), username })
      .returning();
    return account;
  }

  async findAll() {
    return this.drizzleService.db.select().from(accountTable);
  }

  async findById(id: string, tx: NodePgDatabase = this.drizzleService.db) {
    const [account] = await tx
      .select()
      .from(accountTable)
      .where(eq(accountTable.id, id));
    return account;
  }

  async updateBalance(id: string, balance: number) {
    const [account] = await this.drizzleService.db
      .update(accountTable)
      .set({ balance })
      .where(eq(accountTable.id, id))
      .returning();
    return account;
  }

  async delete(id: string) {
    const [account] = await this.drizzleService.db
      .delete(accountTable)
      .where(eq(accountTable.id, id))
      .returning();
    return account;
  }

  async findByIdForUpdate(
    id: string,
    tx: NodePgDatabase = this.drizzleService.db,
  ) {
    const [account] = await tx
      .select()
      .from(accountTable)
      .where(eq(accountTable.id, id))
      .for('update');
    return account;
  }

  async incrementBalance(
    id: string,
    amount: number,
    tx: NodePgDatabase = this.drizzleService.db,
  ) {
    const [account] = await tx
      .update(accountTable)
      .set({ balance: sql`${accountTable.balance} + ${amount}` })
      .where(eq(accountTable.id, id))
      .returning();
    return account;
  }

  async decrementBalance(
    id: string,
    amount: number,
    tx: NodePgDatabase = this.drizzleService.db,
  ) {
    const [account] = await tx
      .update(accountTable)
      .set({ balance: sql`${accountTable.balance} - ${amount}` })
      .where(eq(accountTable.id, id))
      .returning();
    return account;
  }
}
