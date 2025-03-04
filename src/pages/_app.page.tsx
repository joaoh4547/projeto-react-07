import type { AppProps } from 'next/app'
import { globalStyes } from '../styles/global'
import '../lib/dayjs'

import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { query } from '../lib/react-query'
import { DefaultSeo } from 'next-seo'

globalStyes()
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={query}>
      <SessionProvider session={session}>
        <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'pt_BR',
            siteName: 'IgniteCall',
          }}
        />
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
