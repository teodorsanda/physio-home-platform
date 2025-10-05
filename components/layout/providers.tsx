"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { IntlProvider } from "react-intl";
import en from "@/i18n/en.json";
import ro from "@/i18n/ro.json";
import { useLocale } from "@/lib/utils/use-locale";

const queryClient = new QueryClient();

const messages: Record<string, Record<string, string>> = {
  en,
  ro
};

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const locale = useLocale();
  return (
    <IntlProvider locale={locale} messages={messages[locale] ?? en} defaultLocale="en">
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </IntlProvider>
  );
}
