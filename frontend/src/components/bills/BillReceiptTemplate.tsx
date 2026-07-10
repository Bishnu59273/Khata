import { useTranslation } from 'react-i18next';
import type { Shop } from '../../types/auth';
import type { Transaction } from '../../types/models';
import { serviceName, formatBillDate } from './billHelpers';
import { formatINR } from '../../utils/currency';

export function BillReceiptTemplate({
  shop,
  transactions,
}: {
  shop: Shop;
  transactions: Transaction[];
}) {
  const { t, i18n } = useTranslation('bills');
  const customerName = transactions.find((tx) => tx.customer_name)?.customer_name ?? t('walkInCustomer');
  const grandTotal = transactions.reduce((sum, tx) => sum + tx.customer_charge, 0);

  return (
    <div className="mx-auto max-w-sm bg-white p-6 text-black">
      <div className="text-center">
        <div className="text-lg font-bold">{shop.name}</div>
        {shop.address && <div className="text-xs">{shop.address}</div>}
        {shop.phone && <div className="text-xs">{shop.phone}</div>}
        {shop.gstin && <div className="text-xs">GSTIN: {shop.gstin}</div>}
      </div>

      <div className="my-3 border-t border-dashed border-black" />

      <div className="text-sm">
        <div>
          {t('billTo')}: {customerName}
        </div>
        <div>
          {t('date')}: {formatBillDate(transactions[0].created_at, i18n.language)}
        </div>
      </div>

      <div className="my-3 border-t border-dashed border-black" />

      <div className="flex flex-col gap-2 text-sm">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-baseline justify-between gap-2">
            <div>
              {serviceName(tx, i18n.language)} <span className="text-xs">×{tx.quantity}</span>
            </div>
            <div className="font-semibold">{formatINR(tx.customer_charge)}</div>
          </div>
        ))}
      </div>

      <div className="my-3 border-t border-dashed border-black" />

      <div className="flex items-baseline justify-between text-base font-bold">
        <div>{t('grandTotal')}</div>
        <div>{formatINR(grandTotal)}</div>
      </div>

      <div className="mt-6 text-center text-xs">{t('thankYou')}</div>
    </div>
  );
}
