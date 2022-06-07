import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { wrapper } from '@store';
import Layout from '@components/Layout';
import { SWRConfig } from 'swr';
import { axiosFetcher } from '@libs/client/axiosClient';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: axiosFetcher }}>
      <Layout>
        <Component {...pageProps} />
        <div />
      </Layout>
    </SWRConfig>
  );
}

export default wrapper.withRedux(MyApp);
