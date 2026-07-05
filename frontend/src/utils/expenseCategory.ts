import type { CSSProperties } from 'react';

const KNOWN_CATEGORIES = ['fixed', 'utility', 'supplies'] as const;
export type KnownExpenseCategory = (typeof KNOWN_CATEGORIES)[number];

export const EXPENSE_CATEGORIES: KnownExpenseCategory[] = [...KNOWN_CATEGORIES];

const STYLES: Record<KnownExpenseCategory, CSSProperties> = {
  fixed: { backgroundColor: '#f6efe3', color: '#a9752b' },
  utility: { backgroundColor: '#eef1f6', color: '#4a5f9e' },
  supplies: { backgroundColor: '#eef5f0', color: '#3f7d5a' },
};

const OTHER_STYLE: CSSProperties = { backgroundColor: '#f4ede1', color: '#7d7264' };

export function isKnownExpenseCategory(category: string): category is KnownExpenseCategory {
  return (KNOWN_CATEGORIES as readonly string[]).includes(category);
}

export function expenseCategoryStyle(category: string): CSSProperties {
  return isKnownExpenseCategory(category) ? STYLES[category] : OTHER_STYLE;
}
