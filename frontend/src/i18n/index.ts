import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enDashboard from './locales/en/dashboard.json';
import enTransactions from './locales/en/transactions.json';
import enReports from './locales/en/reports.json';
import enExpenses from './locales/en/expenses.json';
import enServices from './locales/en/services.json';
import enAuth from './locales/en/auth.json';
import enSettings from './locales/en/settings.json';
import enBills from './locales/en/bills.json';

import hiCommon from './locales/hi/common.json';
import hiDashboard from './locales/hi/dashboard.json';
import hiTransactions from './locales/hi/transactions.json';
import hiReports from './locales/hi/reports.json';
import hiExpenses from './locales/hi/expenses.json';
import hiServices from './locales/hi/services.json';
import hiAuth from './locales/hi/auth.json';
import hiSettings from './locales/hi/settings.json';
import hiBills from './locales/hi/bills.json';

import bnCommon from './locales/bn/common.json';
import bnDashboard from './locales/bn/dashboard.json';
import bnTransactions from './locales/bn/transactions.json';
import bnReports from './locales/bn/reports.json';
import bnExpenses from './locales/bn/expenses.json';
import bnServices from './locales/bn/services.json';
import bnAuth from './locales/bn/auth.json';
import bnSettings from './locales/bn/settings.json';
import bnBills from './locales/bn/bills.json';

export const defaultNS = 'common';

export const resources = {
  en: {
    common: enCommon,
    dashboard: enDashboard,
    transactions: enTransactions,
    reports: enReports,
    expenses: enExpenses,
    services: enServices,
    auth: enAuth,
    settings: enSettings,
    bills: enBills,
  },
  hi: {
    common: hiCommon,
    dashboard: hiDashboard,
    transactions: hiTransactions,
    reports: hiReports,
    expenses: hiExpenses,
    services: hiServices,
    auth: hiAuth,
    settings: hiSettings,
    bills: hiBills,
  },
  bn: {
    common: bnCommon,
    dashboard: bnDashboard,
    transactions: bnTransactions,
    reports: bnReports,
    expenses: bnExpenses,
    services: bnServices,
    auth: bnAuth,
    settings: bnSettings,
    bills: bnBills,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['en', 'hi', 'bn'],
    fallbackLng: 'en',
    defaultNS,
    ns: ['common', 'dashboard', 'transactions', 'reports', 'expenses', 'services', 'auth', 'settings', 'bills'],
    interpolation: { escapeValue: false },
    // Only an explicit prior choice overrides the English default — the OS/browser
    // locale (e.g. a Hindi-language Windows install) must not silently win.
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'khata_lang',
    },
  });

export default i18n;
