import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EmojiPicker as EmojiPickerPrimitive, type Locale } from 'frimousse';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/animate-ui/primitives/radix/popover';

const SUPPORTED_LOCALES: Locale[] = ['en', 'hi', 'bn'];

export function EmojiPicker({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (emoji: string) => void;
  className?: string;
}) {
  const { t, i18n } = useTranslation('services');
  const [open, setOpen] = useState(false);

  const locale = SUPPORTED_LOCALES.includes(i18n.language as Locale)
    ? (i18n.language as Locale)
    : 'en';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border-soft bg-brand-50 text-2xl transition-colors hover:bg-brand-500/[13%]',
            className,
          )}
        >
          {value}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="z-50 w-72 overflow-hidden rounded-2xl border border-border-soft bg-surface p-0 shadow-lg"
      >
        <EmojiPickerPrimitive.Root
          key={locale}
          locale={locale}
          columns={6}
          className="isolate flex h-80 flex-col"
          onEmojiSelect={({ emoji }) => {
            onChange(emoji);
            setOpen(false);
          }}
        >
          <EmojiPickerPrimitive.Search
            placeholder={t('searchEmoji')}
            className="m-2 rounded-lg border border-border-soft bg-white px-3 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-600"
          />
          <EmojiPickerPrimitive.Viewport className="relative min-h-0 flex-1 overflow-auto px-2 pb-2">
            <EmojiPickerPrimitive.Loading className="absolute inset-0 flex items-center justify-center text-sm text-ink-600">
              {t('emojiLoading')}
            </EmojiPickerPrimitive.Loading>
            <EmojiPickerPrimitive.Empty className="absolute inset-0 flex items-center justify-center text-sm text-ink-600">
              {t('emojiNotFound')}
            </EmojiPickerPrimitive.Empty>
            <EmojiPickerPrimitive.List
              className="select-none pb-1"
              components={{
                CategoryHeader: ({ category, ...props }) => (
                  <div
                    {...props}
                    className="bg-surface px-1 py-1.5 text-xs font-semibold text-ink-600"
                  >
                    {category.label}
                  </div>
                ),
                Row: ({ children, ...props }) => (
                  <div {...props} className="flex gap-1 px-1">
                    {children}
                  </div>
                ),
                Emoji: ({ emoji, ...props }) => (
                  <button
                    {...props}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg text-xl',
                      emoji.isActive && 'bg-brand-50',
                    )}
                  >
                    {emoji.emoji}
                  </button>
                ),
              }}
            />
          </EmojiPickerPrimitive.Viewport>
        </EmojiPickerPrimitive.Root>
      </PopoverContent>
    </Popover>
  );
}
