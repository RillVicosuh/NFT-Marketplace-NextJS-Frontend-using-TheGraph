import '../styles/globals.css'
import { MoralisProvider } from "react-moralis"
//Will allow us to use the Header code which has the connect button and other things
import Header from "../components/Header"
import Head from 'next/head'
import { NotificationProvider } from 'web3uikit'
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  //This can be retrieved on in the subgraph studio for you subgraph on thegraph.com
  uri: "https://api.studio.thegraph.com/query/47555/nft-marketplace/version/latest"
})

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
        <ApolloProvider client={client}>
          <NotificationProvider>
            <Header />
            <Component {...pageProps} />
          </NotificationProvider>
        </ApolloProvider>
      </MoralisProvider>
    </div>
  )
}

export default MyApp
