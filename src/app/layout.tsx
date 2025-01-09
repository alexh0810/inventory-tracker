import { ThemeProvider } from '@/providers/theme-provider';
import { ApolloWrapper } from '@/lib/apollo-wrapper';
import { StockNotifications } from '@/components/ui/notification-toast';
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
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApolloWrapper>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <StockNotifications />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster position="bottom-right" />
            </div>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
