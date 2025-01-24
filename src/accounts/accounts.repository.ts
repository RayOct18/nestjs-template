import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Account, Prisma } from '@prisma/client';

@Injectable()
export class AccountsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(username: string) {
    return this.prismaService.account.create({
      data: { username },
    });
  }

  async findAll() {
    return this.prismaService.account.findMany();
  }

  async findById(
    id: string,
    tx: Prisma.TransactionClient = this.prismaService,
  ) {
    return tx.account.findUnique({
      where: { id },
    });
  }

  async updateBalance(id: string, balance: number) {
    return this.prismaService.account.update({
      where: { id },
      data: { balance },
    });
  }

  async delete(id: string) {
    return this.prismaService.account.delete({
      where: { id },
    });
  }

  async findByIdForUpdate(id: string, tx: Prisma.TransactionClient) {
    const account = await tx.$queryRaw<
      Account[]
    >`SELECT * FROM "Account" WHERE id = ${id} FOR UPDATE`;
    if (account.length === 0) {
      return null;
    }
    return account[0];
  }

  async incrementBalance(
    id: string,
    amount: number,
    tx: Prisma.TransactionClient,
  ) {
    return tx.account.update({
      where: { id },
      data: { balance: { increment: amount } },
    });
  }

  async decrementBalance(
    id: string,
    amount: number,
    tx: Prisma.TransactionClient,
  ) {
    return tx.account.update({
      where: { id },
      data: { balance: { decrement: amount } },
    });
  }
}
