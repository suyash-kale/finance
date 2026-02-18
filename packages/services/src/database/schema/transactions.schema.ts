import {
  pgTable,
  serial,
  integer,
  varchar,
  decimal,
  timestamp,
  foreignKey,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';

import { Accounts } from '@/database/schema/accounts.schema';
import { Users } from '@/database/schema/users.schema';
import { TRANSACTION_CATEGORIES } from '@/types/transactions';

export const transactionCategoryEnum = pgEnum(
  'transaction_category',
  TRANSACTION_CATEGORIES,
);

export const Transactions = pgTable(
  'transactions',
  {
    transaction_id: serial('transaction_id').primaryKey().notNull(),
    user_id: integer('user_id').notNull(),
    account_id: integer('account_id').notNull(),
    title: varchar('title', { length: 50 }).notNull(),
    category: transactionCategoryEnum('transaction_category').notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    date: timestamp('date').notNull().defaultNow(),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.user_id],
      foreignColumns: [Users.user_id],
    }),
    accountIdFk: foreignKey({
      columns: [table.account_id],
      foreignColumns: [Accounts.account_id],
    }),
    userIdIdx: index('transactions_user_id_idx').on(table.user_id),
    accountIdIdx: index('transactions_account_id_idx').on(table.account_id),
  }),
);
