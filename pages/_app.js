import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';

import 'styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>{pageProps.metaTitle ?? 'Driving APP - Rent and sale your car'}</title>
        <meta
          name="description"
          content="Search for all types of car rentals near you, including sailing cars, quads and luxury motorbikes."
        />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
