import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      duration={2500}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-xl !border-border-soft !bg-surface !text-ink-900 !shadow-sm",
          title: "!font-semibold",
          success: "[&_svg]:!text-success-600",
          error: "[&_svg]:!text-danger-600",
        },
      }}
    />
  );
}
