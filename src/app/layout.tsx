import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Приглашение',
  description: 'Сайт-приглашение на мероприятие',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
