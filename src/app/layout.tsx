import { ThemeProvider } from '@/providers/theme-provider';
import { ApolloWrapper } from '@/lib/apollo-wrapper';
import { StockNotifications } from '@/components/ui/notification-toast';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/header';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ApolloWrapper>
            <Header />
            <StockNotifications />
            <main>{children}</main>
            <Toaster position="bottom-right" />
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
