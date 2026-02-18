export const ACCOUNT_CATEGORIES = ['CASH', 'CREDIT'] as const;

export type AccountCategory = (typeof ACCOUNT_CATEGORIES)[number];
