import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"

//Won't need Cloud Function or frp folders with the cloud. Also for the graph, index.js and app.js will be different
export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis()
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

  //Using GET_ACTIVE_ITEMS from subgraphQueries to return the listed nfts
  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div>
        {!isWeb3Enabled && (
          <div>Please Connect Your Wallet</div>
        )}
        {isWeb3Enabled && chainString !== "11155111" && (
          <div>Please Connect Your Wallet To The Sepolia Network</div>
        )}
        <div className="flex flex-wrap">
          {loading || !listedNfts ? (
            <div>Loading...</div>
          ) : (
            listedNfts.activeItems.map((nft) => {
              const { price, nftAddress, tokenId, seller } = nft
              return (
                <NFTBox
                  price={price}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  marketplaceAddress={marketplaceAddress}
                  seller={seller}
                  key={`${nftAddress}${tokenId}`}
                />
              )
            })
          )}
        </div>
      </div>
    </div>
  )

  /*return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled && chainId ? (
          //If it's loading or we don't have listed nfts
          loading || !listedNfts ? (
            <div>Loading...</div>
          ) : (
            //retrieving the price, nftAddress, tokenId, and seller of the listed items to pass is to the NFTBox
            listedNfts.activeItems.map((nft) => {
              const { price, nftAddress, tokenId, seller } = nft
              return marketplaceAddress ? (
                <NFTBox
                  price={price}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  marketplaceAddress={marketplaceAddress}
                  seller={seller}
                  key={`${nftAddress}${tokenId}`}
                />
              ) : (
                <div>Network error, please switch to a supported network. </div>
              )
            })
          )
        ) : (
          <div>Please Connect Your Wallet To The Sepolia Network</div>
        )}
      </div>
    </div>
  )*/
}
