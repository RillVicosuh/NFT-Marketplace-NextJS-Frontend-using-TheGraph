import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import useNfts from '../components/useNfts';


export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis()
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  //const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
  const marketplaceAddress = networkMapping["11155111"].NftMarketplace[0]//Hardcoding the network here so that it displays even if the user is connected to a different network

  //Using GET_ACTIVE_ITEMS from subgraphQueries to return the listed nfts
  //const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)
  const { nfts, loading, error } = useNfts();


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
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : !listedNfts ? (
            <div>No NFTs found</div>
          ) : (
            listedNfts.activeItems.map((nft) => {
              const { price, nftAddress, tokenId, seller } = nft;
              return (
                <NFTBox
                  price={price}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  marketplaceAddress={marketplaceAddress}
                  seller={seller}
                  key={`${nftAddress}${tokenId}`}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  )

  /*return (
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
              console.log(nftAddress)
              console.log(tokenId)
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
  )*/

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
