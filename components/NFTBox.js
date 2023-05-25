import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../contants/BasicNft.json"

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled } = useMoralis()
    const [imageURI, setImageURI] = useState("")

    //Utilizing useWeb3Contract to allow us to use the getTokenURI function from the BasicNft in our front end code
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenUri",
        params: {
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        console.log(`The token URI is ${tokenURI}`)
    }

    //This will automatically call the updateUI function when necessary to get the tokenURI so that the NFT image can be displayed
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])
}