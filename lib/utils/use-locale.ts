"use client";

import { usePathname } from "next/navigation";

const SUPPORTED = ["en", "ro"] as const;

export function useLocale(): (typeof SUPPORTED)[number] {
  const pathname = usePathname();
  const locale = pathname?.split("/")?.[1];
  return SUPPORTED.includes(locale as any) ? (locale as (typeof SUPPORTED)[number]) : "en";
}
