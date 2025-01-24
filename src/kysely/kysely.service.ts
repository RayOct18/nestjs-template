import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kysely, PostgresDialect, sql } from 'kysely';
import { Pool } from 'pg';
import { DB } from '../../prisma/generated/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KyselyService
  extends Kysely<DB>
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly logger = new Logger(KyselyService.name);
  constructor(private readonly configService: ConfigService) {
    const dialect = new PostgresDialect({
      pool: new Pool({
        database: configService.get('DB_NAME'),
        host: configService.get('DB_HOST'),
        user: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        port: configService.get('DB_PORT'),
      }),
    });
    super({ dialect });
  }

  async onModuleInit() {
    await sql`SELECT 1`.execute(this);
    this.logger.log('Database connection established');
  }

  async onApplicationShutdown() {
    await this.destroy();
    this.logger.log('Database connection closed');
  }
}
