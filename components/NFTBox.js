import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"
import cardStyles from '../styles/Card.module.css';
import modalStyles from '../styles/Modal.module.css';

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
    const [showModal, setShowModal] = useState(false) //showModal is set to false intially, to change it, setShowModal(true) must be called
    const hideModal = () => setShowModal(false)//Will be used to set showModal to false. Need to be done this way because we are essetially going to pass the setShowModal function to UpdateListingModal script
    const dispatch = useNotification()

    //Utilizing useWeb3Contract to allow us to use the getTokenURI function from the BasicNft in our front end code
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        }
    })

    //This is the function that tokenURI in order to update the ImageURI so that the image can be displayed in the front end
    async function updateUI() {
        //Using the getTokenURI function that we imported with the basicNft contract abi to get the tokenURI
        const tokenURI = await getTokenURI()
        console.log(`The token URI is ${tokenURI}`)

        //If the tokenURI exists, continue
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            console.log(requestURL)
            //Get the json data from the tokenURI
            const tokenURIResponse = await (await fetch(requestURL)).json()
            //retrieve the imageURI in the json data
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            console.log(imageURIURL)
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

    //This arrow function is called when the card is clicked. 
    //If the owner is the one that clicks the card, it set showModal to true.
    //If not the owner, the buyItem function we imported from the NftMarketplace address will be invoked and metamask will pop up to initiate a purchase
    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                onError: (error) => console.log(error),
                onSuccess: () => handleBuyItemSuccess(),
            })
    }

    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Item has been purchased!", //message displayed on the dispatch
            title: "Item Purchased",
            position: "topR", //This means the dispatch will appear at the top right
        })
    }

    //This code will actually display the image on the front end using the imageURI that was set when we called setImageURI in the updateUI function 
    //We will also display the token Name, token description, the owner, and the price
    /*return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <UpdateListingModal
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={{ marketplaceAddress }}
                            nftAddress={{ nftAddress }}
                            onClose={hideModal}
                        />
                        <Card title={tokenName} description={tokenDescription} onClick={handleCardClick}>
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
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )*/
    /*return (
        <div>
            <div>
                {imageURI ? (
                    <div className={cardStyles.card}>
                        <UpdateListingModal
                            className={modalStyles.modal}
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={{ marketplaceAddress }}
                            nftAddress={{ nftAddress }}
                            onClose={hideModal}
                        />
                        <div className={cardStyles['card-content']} onClick={handleCardClick}>
                            <h2>{tokenName}</h2>
                            <p>{tokenDescription}</p>
                            <div>
                                <div>#{tokenId}</div>
                                <div className="italic text-sm">Owned by {formattedSellerAddress}</div>
                                <Image
                                    className={cardStyles['card-image']}
                                    loader={() => imageURI}
                                    src={imageURI}
                                    width={200}
                                    height={200}
                                />
                                <div className="font-bold">
                                    {ethers.utils.formatUnits(price, "ether")} ETH
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={cardStyles.loader}>Loading...</div>
                )}
            </div>
        </div>
    )*/
    return (
        <div>
            <div>
                {imageURI ? (
                    <div className={cardStyles.card}>
                        <UpdateListingModal
                            className={modalStyles.modal}
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={{ marketplaceAddress }}
                            nftAddress={{ nftAddress }}
                            onClose={hideModal}
                        />
                        <Card title={tokenName} description={tokenDescription} onClick={handleCardClick}>
                            <div>
                                <div>
                                    <div>#{tokenId}</div>
                                    <div className="italic text-sm">Owned by {formattedSellerAddress}</div>
                                    <Image
                                        className={cardStyles['card-image']}
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
                    </div>
                ) : (
                    <div className={cardStyles.loader}>Loading...</div>
                )}
            </div>
        </div>
    )
}