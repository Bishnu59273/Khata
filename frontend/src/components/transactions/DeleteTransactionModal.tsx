import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Modal } from "../common/Modal";
import { deleteTransaction } from "../../api/transactions";
import type { Transaction } from "../../types/models";

function serviceName(transaction: Transaction, lang: string): string {
  const service = transaction.service;
  if (!service) return "—";
  if (lang === "hi") return service.name_hi;
  if (lang === "bn") return service.name_bn;
  return service.name_en;
}

export function DeleteTransactionModal({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation("transactions");
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteTransaction(transaction.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onClose();
    },
  });

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-2 text-lg font-bold text-ink-900">
        {t("deleteTransaction")}
      </h2>
      <p className="mb-6 text-sm text-ink-600">
        {t("deleteConfirmMessage", {
          service: serviceName(transaction, i18n.language),
          amount: `${transaction.customer_charge.toFixed(2)}`,
        })}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border-2 border-border-soft px-5 py-3 text-base font-bold text-ink-700 transition-colors hover:bg-brand-50"
        >
          {t("actions.cancel", { ns: "common" })}
        </button>
        <button
          type="button"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          className="flex-1 rounded-xl bg-danger-600 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-danger-600/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t("actions.delete", { ns: "common" })}
        </button>
      </div>
    </Modal>
  );
}
