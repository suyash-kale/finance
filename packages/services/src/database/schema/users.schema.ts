import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

export const Users = pgTable(
  'users',
  {
    user_id: serial('user_id').primaryKey().notNull(),
    fname: varchar('fname', { length: 20 }).notNull(),
    lname: varchar('lname', { length: 20 }),
    email: varchar('email').notNull().unique(),
    password: text('password').notNull(),
    active: boolean('active').notNull().default(true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
  }),
);

export type UserType = typeof Users.$inferSelect;
