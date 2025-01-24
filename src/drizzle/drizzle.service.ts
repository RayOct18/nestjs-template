import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sql } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Injectable()
export class DrizzleService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(DrizzleService.name);
  db: NodePgDatabase;
  private pool: Pool;
  constructor(private readonly configService: ConfigService) {
    const dbUrl = configService.get('DATABASE_URL');
    this.pool = new Pool({ connectionString: dbUrl });
    this.db = drizzle(this.pool);
  }

  async onModuleInit() {
    await this.db.execute(sql`SELECT 1`);
    this.logger.log('Database connection established');
  }

  onApplicationShutdown() {
    this.pool.end();
    this.logger.log('Database connection closed');
  }
}
