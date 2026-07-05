import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enDashboard from './locales/en/dashboard.json';
import enTransactions from './locales/en/transactions.json';
import enReports from './locales/en/reports.json';
import enExpenses from './locales/en/expenses.json';

import hiCommon from './locales/hi/common.json';
import hiDashboard from './locales/hi/dashboard.json';
import hiTransactions from './locales/hi/transactions.json';
import hiReports from './locales/hi/reports.json';
import hiExpenses from './locales/hi/expenses.json';

import bnCommon from './locales/bn/common.json';
import bnDashboard from './locales/bn/dashboard.json';
import bnTransactions from './locales/bn/transactions.json';
import bnReports from './locales/bn/reports.json';
import bnExpenses from './locales/bn/expenses.json';

export const defaultNS = 'common';

export const resources = {
  en: {
    common: enCommon,
    dashboard: enDashboard,
    transactions: enTransactions,
    reports: enReports,
    expenses: enExpenses,
  },
  hi: {
    common: hiCommon,
    dashboard: hiDashboard,
    transactions: hiTransactions,
    reports: hiReports,
    expenses: hiExpenses,
  },
  bn: {
    common: bnCommon,
    dashboard: bnDashboard,
    transactions: bnTransactions,
    reports: bnReports,
    expenses: bnExpenses,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['en', 'hi', 'bn'],
    fallbackLng: 'bn',
    defaultNS,
    ns: ['common', 'dashboard', 'transactions', 'reports', 'expenses'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'khata_lang',
    },
  });

export default i18n;
