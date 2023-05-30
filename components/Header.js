import { ConnectButton } from "web3uikit"
import Link from "next/link"
import styles from '../styles/Header.module.css';

export default function Header() {
    return (
        //This will be a sort of navigation bar that includes the pages we can visit and the connect button
        //The className is defining how the text is displayed
        /*<nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
            <Link href="/">
                <a className="mr-4 p-6">Home</a>
            </Link>
            <Link href="/sell-nft">
                <a className="mr-4 p-6">Sell Page</a>
            </Link>
            <ConnectButton moralisAuth={false} />
        </nav>*/
        <nav className={styles.navbar}>
            <h1 className={styles.logo}>NFT Marketplace</h1>
            <div className={styles.navLinks}>
                <Link href="/">
                    <a className={styles.link}>Home</a>
                </Link>
                <Link href="/sell-nft">
                    <a className={styles.link}>Sell Page</a>
                </Link>
            </div>
            <ConnectButton moralisAuth={false} className={styles.connectButton} />
        </nav>

    )
}