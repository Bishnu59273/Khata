import { useTranslation } from 'react-i18next';
import type { Shop } from '../../types/auth';
import type { Transaction } from '../../types/models';
import { serviceName, formatBillDate } from './billHelpers';
import { formatINR } from '../../utils/currency';

export function BillInvoiceTemplate({
  shop,
  transactions,
}: {
  shop: Shop;
  transactions: Transaction[];
}) {
  const { t, i18n } = useTranslation('bills');
  const customerName = transactions.find((tx) => tx.customer_name)?.customer_name ?? t('walkInCustomer');
  const subtotal = transactions.reduce((sum, tx) => sum + tx.customer_charge, 0);
  const totalDiscount = transactions.reduce((sum, tx) => sum + (tx.discount ?? 0), 0);
  const grandTotal = subtotal - totalDiscount;
  const today = formatBillDate(new Date().toISOString(), i18n.language);

  return (
    <div className="mx-auto max-w-2xl bg-white p-8 text-black">
      <div className="flex items-start justify-between border-b border-black pb-4">
        <div>
          <div className="text-xl font-bold">{shop.name}</div>
          {shop.address && <div className="text-sm">{shop.address}</div>}
          {shop.phone && <div className="text-sm">{shop.phone}</div>}
          {shop.gstin && <div className="text-sm">GSTIN: {shop.gstin}</div>}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold uppercase tracking-wide">{t('invoice')}</div>
          <div className="text-sm">{today}</div>
        </div>
      </div>

      <div className="my-4 text-sm">
        <span className="font-semibold">{t('billTo')}: </span>
        {customerName}
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-black text-left">
            <th className="py-2">{t('table.service')}</th>
            <th className="py-2 text-right">{t('table.qty')}</th>
            <th className="py-2">{t('table.paymentMode')}</th>
            <th className="py-2 text-right">{t('table.date')}</th>
            <th className="py-2 text-right">{t('table.amount')}</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-gray-300">
              <td className="py-2">{serviceName(tx, i18n.language)}</td>
              <td className="py-2 text-right">×{tx.quantity}</td>
              <td className="py-2">{t(`paymentMode.${tx.payment_mode}`, { ns: 'transactions' })}</td>
              <td className="py-2 text-right">{formatBillDate(tx.created_at, i18n.language)}</td>
              <td className="py-2 text-right">{formatINR(tx.customer_charge)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <div className="w-56">
          {totalDiscount > 0 && (
            <>
              <div className="flex items-center justify-between py-1 text-sm">
                <div>{t('subtotal')}</div>
                <div>{formatINR(subtotal)}</div>
              </div>
              <div className="flex items-center justify-between py-1 text-sm">
                <div>{t('discount')}</div>
                <div>−{formatINR(totalDiscount)}</div>
              </div>
            </>
          )}
          <div className="flex items-center justify-between border-t border-black pt-2 text-base font-bold">
            <div>{t('grandTotal')}</div>
            <div>{formatINR(grandTotal)}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs">{t('thankYou')}</div>
    </div>
  );
}
