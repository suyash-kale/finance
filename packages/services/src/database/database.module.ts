import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

import { Users, Accounts, Transactions } from '@root/database/schema';

export const DRIZZLE = Symbol('drizzle-connection');
export const Schema = {
  Users,
  Accounts,
  Transactions,
};
export type DrizzleDB = NodePgDatabase<typeof Schema>;

@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseURL = configService.get<string>('DATABASE_URL');
        const pool = new Pool({
          connectionString: databaseURL,
        });
        return drizzle(pool, { schema: Schema }) as DrizzleDB;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
