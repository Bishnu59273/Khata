import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import { deleteTransaction } from "../../api/transactions";
import { formatINRNumber } from "../../utils/currency";
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
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(t("toast.deleted"));
      onClose();
    },
    onError: () => {
      toast.error(t("toast.deleteError"));
    },
  });

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteTransaction")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteConfirmMessage", {
              service: serviceName(transaction, i18n.language),
              amount: formatINRNumber(transaction.customer_charge),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("actions.cancel", { ns: "common" })}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              deleteMutation.mutate();
            }}
          >
            {t("actions.delete", { ns: "common" })}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
