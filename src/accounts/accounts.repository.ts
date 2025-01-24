import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  async findById(id: string) {
    return this.prismaService.account.findUnique({
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
}
