import { Kysely } from 'kysely';
import { DB } from '../../prisma/generated/types';

export type KyselyClient = Kysely<DB>;
