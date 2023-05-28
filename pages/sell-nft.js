import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Form, useNotification } from "web3uikit"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { useWeb3Contract, useMoralis } from 'react-moralis'
import networkMapping from "../constants/networkMapping.json"

export default function Home() {
    const { chainId } = useMoralis()
    //Chain id comes in hex form so we need to convert it if it exists
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    //This is the function that will take care of approving the marketplace to take the nft out of the wallet address and list it.
    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId
            }
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            }
        })

    }

    //This function will actually list the nft and is called in the approveAndList if the nft is successfully approved
    async function handleApproveSuccess(nftAddress, tokenId, price) {
        console.log("Approved! Now time to list")
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            }
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: () => handleListSuccess(),
            onError: (error) => console.log(error),
        })
    }

    //Called in the handleApproveSuccess when the nft is successfully listed
    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT Listed",
            position: "topR"
        })
    }

    return (
        <div className={styles.container}>
            <Form
                onSubmit={approveAndList}//This will call approveAndList function when the form is submitted and automatically pass data below
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        value: "",
                        key: "price"
                    }
                ]}
                title="Sell Your NFT"
                id="Main Form"
            />
        </div>
    )
}
