import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { updateShop } from "../api/shops";
import { AUTH_QUERY_KEY, useAuth } from "../context/AuthContext";

export function SettingsPage() {
  const { t } = useTranslation("settings");
  const queryClient = useQueryClient();
  const { shop } = useAuth();

  const [name, setName] = useState(shop?.name ?? "");
  const [address, setAddress] = useState(shop?.address ?? "");
  const [phone, setPhone] = useState(shop?.phone ?? "");
  const [gstin, setGstin] = useState(shop?.gstin ?? "");
  const [buttonState, setButtonState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const mutation = useMutation({
    mutationFn: updateShop,

    onMutate: () => {
      setButtonState("saving");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });

      setButtonState("saved");
      toast.success(t("toast.saved"));

      setTimeout(() => {
        setButtonState("idle");
      }, 2000);
    },

    onError: () => {
      setButtonState("idle");
      toast.error(t("toast.error"));
    },
  });

  function handleSave() {
    mutation.mutate({
      name: name.trim() || undefined,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
      gstin: gstin.trim() || undefined,
    });
  }

  return (
    <div className="max-w-lg">
      <div className="rounded-2xl border border-border-soft bg-surface p-6">
        <h2 className="mb-4 text-base font-bold text-ink-900">{t("title")}</h2>

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t("shopName")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 w-full rounded-xl border border-border-soft bg-white px-3.5 py-3 text-base font-medium text-ink-900 outline-none"
        />

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t("address")}
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t("optional")}
          className="mb-4 w-full rounded-xl border border-border-soft bg-white px-3.5 py-3 text-base font-medium text-ink-900 outline-none"
        />

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t("phone")}
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("optional")}
          className="mb-4 w-full rounded-xl border border-border-soft bg-white px-3.5 py-3 text-base font-medium text-ink-900 outline-none"
        />

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t("gstin")}
        </label>
        <input
          type="text"
          value={gstin}
          onChange={(e) => setGstin(e.target.value)}
          placeholder={t("optional")}
          className="mb-5 w-full rounded-xl border border-border-soft bg-white px-3.5 py-3 text-base font-medium text-ink-900 outline-none"
        />

        <button
          type="button"
          disabled={buttonState === "saving"}
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-brand-500 py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check size={20} />

          {buttonState === "saving"
            ? t("saving...")
            : buttonState === "saved"
              ? t("saved")
              : t("save")}
        </button>
      </div>
    </div>
  );
}
