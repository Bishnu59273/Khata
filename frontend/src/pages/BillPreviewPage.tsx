import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BillReceiptTemplate } from '../components/bills/BillReceiptTemplate';
import { BillInvoiceTemplate } from '../components/bills/BillInvoiceTemplate';
import type { Transaction } from '../types/models';

type BillTemplate = 'receipt' | 'invoice';

export function BillPreviewPage() {
  const { t } = useTranslation('bills');
  const navigate = useNavigate();
  const location = useLocation();
  const { shop } = useAuth();
  const [template, setTemplate] = useState<BillTemplate>('receipt');

  const transactions = (location.state as { transactions?: Transaction[] } | null)?.transactions;

  if (!transactions || transactions.length === 0 || !shop) {
    return <Navigate to="/transactions" replace />;
  }

  return (
    <div className="min-h-svh bg-cream p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="flex items-center gap-1.5 rounded-xl border border-border-soft bg-white px-3.5 py-2 text-sm font-semibold text-ink-700 hover:bg-brand-50"
        >
          <ArrowLeft size={16} />
          {t('back')}
        </button>

        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 rounded-xl border border-border bg-brand-50 p-1.5">
            <button
              type="button"
              onClick={() => setTemplate('receipt')}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                template === 'receipt' ? 'bg-surface text-brand-600 shadow-sm' : 'text-ink-700'
              }`}
            >
              {t('template.receipt')}
            </button>
            <button
              type="button"
              onClick={() => setTemplate('invoice')}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                template === 'invoice' ? 'bg-surface text-brand-600 shadow-sm' : 'text-ink-700'
              }`}
            >
              {t('template.invoice')}
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-sm font-bold text-white hover:bg-brand-600"
          >
            <Printer size={16} />
            {t('print')}
          </button>
        </div>
      </div>

      {template === 'receipt' ? (
        <BillReceiptTemplate shop={shop} transactions={transactions} />
      ) : (
        <BillInvoiceTemplate shop={shop} transactions={transactions} />
      )}
    </div>
  );
}
