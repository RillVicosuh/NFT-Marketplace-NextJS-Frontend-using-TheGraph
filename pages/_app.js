import '../styles/globals.css'
import { MoralisProvider } from "react-moralis"
//Will allow us to use the Header code which has the connect button and other things
import Header from "../components/Header"
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    //We are making sure that the tab icon at the top of the search enging says "NFT Marketplace"
    //Also wrapping the components in the Moralis Provider
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <Header />
        <Component {...pageProps} />
      </MoralisProvider>
    </div>
  )
}

export default MyApp
