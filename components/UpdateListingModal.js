import { Modal, Input } from "web3uikit"

export default function UpdateListingModal({ nftAddress, tokenId, isVisisble }) {
    return (
        <Modal isVisible={isVisisble}>
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New listing price"
                type="number"
            />
        </Modal>
    )
}