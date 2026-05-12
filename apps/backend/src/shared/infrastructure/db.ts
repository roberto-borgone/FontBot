import { Kysely } from 'kysely';
import { BunWorkerDialect } from 'kysely-bun-worker';
import type { DB } from 'kysely-codegen';

export const db = new Kysely<DB>({
    dialect: new BunWorkerDialect({
        url: process.env.DATABASE_URL
    }),
});