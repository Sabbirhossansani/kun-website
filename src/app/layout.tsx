import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KUN BY SAFA - Anti-Tarnish & Waterproof Jewellery',
  description: '✨ Elevate Your Style with KUN BY SAFA. 100% Anti-Tarnish, Waterproof & Hypoallergenic Jewellery with Cash on Delivery across Bangladesh.',
  icons: {
    icon: '/kun-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
