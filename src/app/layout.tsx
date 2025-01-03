import { ApolloWrapper } from '../lib/apollo-wrapper';
import { ThemeProvider } from '../components/theme-provider';
import { Header } from '@/components/header';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ApolloWrapper>
            <Header />
            <main>{children}</main>
            <Toaster position="bottom-right" />
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
