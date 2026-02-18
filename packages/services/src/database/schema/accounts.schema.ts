import {
  pgTable,
  serial,
  integer,
  varchar,
  boolean,
  timestamp,
  foreignKey,
  index,
} from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';

import { Users } from '@/database/schema/users.schema';
import { ACCOUNT_CATEGORIES } from '@/types/accounts';

export const accountCategoryEnum = pgEnum(
  'account_category',
  ACCOUNT_CATEGORIES,
);

export const Accounts = pgTable(
  'accounts',
  {
    account_id: serial('account_id').primaryKey().notNull(),
    user_id: integer('user_id').notNull(),
    category: accountCategoryEnum('account_category').notNull(),
    title: varchar('title', { length: 50 }).notNull(),
    active: boolean('active').notNull().default(true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.user_id],
      foreignColumns: [Users.user_id],
    }),
    userIdIdx: index('accounts_user_id_idx').on(table.user_id),
  }),
);
