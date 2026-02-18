import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

import { Users } from '@/database/schema/users.schema';
import { Accounts } from '@/database/schema/accounts.schema';
import { Transactions } from '@/database/schema/transactions.schema';

export const DRIZZLE = Symbol('drizzle-connection');
export const schema = {
  Users,
  Accounts,
  Transactions,
};
export type DrizzleDB = NodePgDatabase<typeof schema>;

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
        return drizzle(pool, { schema }) as DrizzleDB;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
