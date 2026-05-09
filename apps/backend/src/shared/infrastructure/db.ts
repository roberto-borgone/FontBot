import { Kysely, SqliteDialect } from 'kysely';
import type { DB } from 'kysely-codegen';
import Database from 'better-sqlite3';

export const db = new Kysely<DB>({
    dialect: new SqliteDialect({
        database: new Database(process.env.DATABASE_URL, {
            fileMustExist: true
        }),
    }),
});