import { pgTable, uuid, varchar, bigint } from 'drizzle-orm/pg-core';

export const accountTable = pgTable('Account', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 255 }).unique(),
  balance: bigint('balance', { mode: 'number' }).default(0),
});
