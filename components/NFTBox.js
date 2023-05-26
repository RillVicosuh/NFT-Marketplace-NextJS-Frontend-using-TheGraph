import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../contants/BasicNft.json"
import Image from "next/image"
import { Card } from "web3uikit"
import { ethers } from "ethers"

//This is an arrow function that can take any address(first parameter) and truncate it to an address that is the length of strLen(second parameter)
//This will be used to show a shortened version of the nft owners address
const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr
    const separator = "..."
    const separatorLength = separator.length
    const charsToShow = strLen - separatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
}

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")


    //Utilizing useWeb3Contract to allow us to use the getTokenURI function from the BasicNft in our front end code
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenUri",
        params: {
            tokenId: tokenId,
        },
    })

    //This is the function that tokenURI in order to update the ImageURI so that the image can be displayed in the front end
    async function updateUI() {
        //Using the getTokenURI function that we imported with the basicNft contract abi to get the tokenURI
        const tokenURI = await getTokenURI()
        console.log(`The token URI is ${tokenURI}`)

        //If the tokenURI exists, continue
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            //Get the json data from the tokenURI
            const tokenURIResponse = await (await fetch(requestURL)).json()
            //retrieve the imageURI in the json data
            const imageURI = tokenURIResponse.imageURI
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            //Set the imageURI retrieved from the tokenURI as the imageURI for the front end to display
            setImageURI(imageURIURL)
            //Also setting the token name and description
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    //This will automatically call the updateUI function when necessary to get the tokenURI so that the NFT image can be displayed
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    //Sees if the seller of the nft is the current wallet that is connected
    const isOwnedByUser = seller === account || seller === undefined
    //If the current wallet that is connected is the seller, then it will display "you" instead of the seller address
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

    //This code will actually display the image on the front end using the imageURI that was set when we called setImageURI in the updateUI function 
    //We will also display the token Name, token description, the owner, and the price
    return (
        <div>
            <div>
                {imageURI ? (
                    <Card title={tokenName} description={tokenDescription}>
                        <div>
                            <div>
                                <div>#{tokenId}</div>
                                <div className="italic text-sm">Owned by {formattedSellerAddress}</div>
                                <Image
                                    loader={() => imageURI}
                                    src={imageURI}
                                    height="200"
                                    width="200"
                                />
                                <div className="font-bold">
                                    {ethers.utils.formatUnits(price, "ether")} ETH
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}