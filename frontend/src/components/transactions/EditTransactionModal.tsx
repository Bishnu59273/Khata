import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { PaymentModeToggle } from "./PaymentModeToggle";
import { getAllServices } from "../../api/services";
import { updateTransaction } from "../../api/transactions";
import { formatINR } from "../../utils/currency";
import type { PaymentMode, Service, Transaction } from "../../types/models";

function serviceName(service: Service, lang: string): string {
  if (lang === "hi") return service.name_hi;
  if (lang === "bn") return service.name_bn;
  return service.name_en;
}

export function EditTransactionModal({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation("transactions");
  const queryClient = useQueryClient();

  const { data: services } = useQuery({
    queryKey: ["services", "all"],
    queryFn: getAllServices,
  });

  const [serviceId, setServiceId] = useState(transaction.service_id);
  const [customerName, setCustomerName] = useState(transaction.customer_name ?? '');
  const [quantity, setQuantity] = useState(String(transaction.quantity));
  const [charge, setCharge] = useState(String(transaction.customer_charge));
  const [cost, setCost] = useState(String(transaction.cost_paid));
  const [mode, setMode] = useState<PaymentMode>(transaction.payment_mode);
  const [attempted, setAttempted] = useState(false);

  const saveMutation = useMutation({
    mutationFn: () =>
      updateTransaction(transaction.id, {
        service_id: serviceId,
        customer_name: customerName.trim() || undefined,
        customer_charge: Number(charge || 0),
        cost_paid: Number(cost || 0),
        quantity: Number(quantity || 1),
        payment_mode: mode,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(t("toast.updated"));
      onClose();
    },
    onError: () => {
      toast.error(t("toast.saveError"));
    },
  });

  const chargeNum = Number(charge || 0);
  const costNum = Number(cost || 0);
  const chargeInvalid = !(chargeNum > 0);
  const showChargeError = attempted && chargeInvalid;
  const showLossWarning = !chargeInvalid && costNum > chargeNum;
  const liveProfit = chargeNum - costNum;

  function handleSave() {
    setAttempted(true);
    if (chargeInvalid) return;
    saveMutation.mutate();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("entryDetails")}</DialogTitle>
        </DialogHeader>

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t("selectService")}
        </label>
        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="mb-4 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
        >
          {(services ?? []).map((service) => (
            <option key={service.id} value={service.id}>
              {serviceName(service, i18n.language)}
            </option>
          ))}
        </select>

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t("customerName")}
        </label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder={t("customerNamePlaceholder")}
          className="mb-4 w-full rounded-xl border border-border-soft bg-white px-3.5 py-3 text-base font-medium text-ink-900 outline-none"
        />

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t("quantity")}
        </label>
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border-soft bg-white px-3.5">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-transparent py-3 text-xl font-bold text-ink-900 outline-none"
          />
        </div>

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t("customerCharge")}
        </label>
        <div
          className={`flex items-center gap-2 rounded-xl border bg-white px-3.5 ${
            showChargeError ? "mb-1.5 border-danger-600" : "mb-4 border-border-soft"
          }`}
        >
          <span className="text-lg font-bold text-ink-600">₹</span>
          <input
            type="number"
            value={charge}
            onChange={(e) => setCharge(e.target.value)}
            className="w-full bg-transparent py-3 text-xl font-bold text-ink-900 outline-none"
          />
        </div>
        {showChargeError && (
          <p className="mb-4 text-sm font-semibold text-danger-600">
            {t("validation.chargePositive", { ns: "common" })}
          </p>
        )}

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t("costPaid")}
        </label>
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border-soft bg-white px-3.5">
          <span className="text-lg font-bold text-ink-600">₹</span>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full bg-transparent py-3 text-xl font-bold text-ink-900 outline-none"
          />
        </div>

        {showLossWarning && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-cost-600/30 bg-cost-600/[8%] px-3.5 py-2.5 text-sm font-semibold text-cost-600">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            {t("validation.negativeProfitWarning", { ns: "common" })}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between rounded-xl border border-success-border bg-success-bg px-4 py-3">
          <span className="text-sm font-semibold text-[#4d7a5e]">
            {t("table.profit", { ns: "dashboard" })}
          </span>
          <span className="text-2xl font-bold text-success-600">
            {formatINR(liveProfit)}
          </span>
        </div>

        <label className="mb-2 block text-sm font-semibold text-ink-700">
          {t("paymentModeLabel")}
        </label>
        <div className="mb-5">
          {/* Udhaar needs a linked customer record; only offer it when one exists. */}
          <PaymentModeToggle
            value={mode}
            onChange={setMode}
            modes={
              transaction.customer_id
                ? ["cash", "upi", "online", "udhaar"]
                : ["cash", "upi", "online"]
            }
          />
        </div>

        <Button
          type="button"
          variant="success"
          size="lg"
          className="w-full"
          onClick={handleSave}
          disabled={saveMutation.isPending}
        >
          {t("actions.save", { ns: "common" })}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
