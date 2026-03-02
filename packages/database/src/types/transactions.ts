export const TRANSACTION_CATEGORIES = ['DEBIT', 'CREDIT'] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];
