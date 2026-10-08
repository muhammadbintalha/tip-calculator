import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tip & Bill Splitter Calculator - Talha Sadiq',
  description: 'Calculate tips and split restaurant bills effortlessly with pre-tax tipping options and rounding.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
