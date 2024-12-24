import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '@/components/layout';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}
