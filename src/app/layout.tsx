import { ApolloWrapper } from '@/lib/apollo-wrapper';
import { StockNotifications } from '@/components/ui/notification-toast';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/header';
import '@/styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
