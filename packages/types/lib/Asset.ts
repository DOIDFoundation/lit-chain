export type AssetType = 'native' | 'erc20' | 'nft';

export enum ChainId {
    Bitcoin = "bitcoin",
    Ethereum = "ethereum",
    Rootstock = "rsk",
    BinanceSmartChain = "bsc",
    Near = "near",
    Polygon = "polygon",
    Arbitrum = "arbitrum",
    Solana = "solana",
    Fuse = "fuse",
    Terra = "terra",
    Avalanche = "avalanche",
    Optimism = "optimism"
}

export enum AssetTypes {
    native = 'native',
    erc20 = 'erc20',
    nft = 'nft',
}

export interface Asset {
    name: string;
    code: string;
    chain: ChainId;
    type: AssetType;
    decimals: number;
    contractAddress?: string;
}

export interface TokenDetails {
    decimals: number;
    name: string;
    symbol: string;
}
