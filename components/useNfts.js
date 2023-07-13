import { useState, useEffect } from 'react';
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";

function useNFTs() {
    const [nfts, setNFTs] = useState(null);
    const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS);

    useEffect(() => {
        if (!loading && !error && data) {
            setNFTs(data.activeItems);
        }
    }, [loading, error, data]);

    return { nfts, loading, error };
}

export default useNFTs;