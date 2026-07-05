export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-surface p-8 text-center text-lg text-ink-600 shadow-sm">
      {message}
    </div>
  );
}
