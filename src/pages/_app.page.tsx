import type { AppProps } from 'next/app'
import { globalStyes } from '../styles/global'

import { SessionProvider } from 'next-auth/react'

globalStyes()
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
