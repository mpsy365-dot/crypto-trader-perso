import './globals.css';
import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { ScannerProvider } from '@/contexts/ScannerContext'; 

export const metadata: Metadata = {
  title: "Trader Pro",
  description: "Développé par Tarek Boussebci",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-[#050505] text-white antialiased" suppressHydrationWarning>
        <Providers>
          <ScannerProvider> {/* ← Ajoute ce wrapper */}
            {children}
          </ScannerProvider>
        </Providers>
      </body>
    </html>
  );
}