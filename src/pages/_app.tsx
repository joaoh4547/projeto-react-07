import type { AppProps } from 'next/app'
import { globalStyes } from '../styles/global'

globalStyes()
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
