import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils/cn";
import { Providers } from "@/components/layout/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kinetix HomeCare",
  description: "Home-visit physiotherapy platform for personalized recovery.",
  keywords: ["physiotherapy", "home visit", "rehabilitation", "Romania"],
  metadataBase: new URL("https://example.com")
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-slate-50", inter.className)}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
