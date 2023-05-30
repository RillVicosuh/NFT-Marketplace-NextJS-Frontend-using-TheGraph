import { useWeb3Contract } from "react-moralis"
import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"

export default function UpdateListingModal({ nftAddress, tokenId, isVisible, marketplaceAddress, onClose }) {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)
    const dispatch = useNotification()

    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing updated",
            title: "Listing updated - refresh and move blocks",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith("0")
    }
    //Using useWeb3Contract to utilize the updateListing function from the NftMarketplace contract
    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0")
        }
    })
    return (
        //isVisible and onClose are passed from the NFTBox.js when UpdateListingModal is called
        //isVisible will determine when the Modal is shown
        //onClose is a function that calls setShowModal(false), which changes the showModal function to false, which means isVisible is set to false
        //Onclose is called when the modal is canceled or the close button is pressed
        <Modal isVisible={isVisible} onCancel={onClose} onCloseButtonPressed={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: () => handleUpdateListingSuccess(),
                })
            }}
        >
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
            />
        </Modal>
    )
}