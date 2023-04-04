import { Client } from '@lit-chain/client';
import { Asset, BigNumber, Network } from '@lit-chain/types';

export interface IConfig {
    network: Network;
    walletOptions?: Record<string, any>;
    chainOptions?: Record<string, any>;
    walletExpectedResult?: {
        address?: string;
        privateKey?: string;
        privateKeyRegex?: RegExp;
        signedMessage?: string;
        unusedAddress?: string;
        numberOfUsedAddresses?: number;
    };
    sendParams: {
        value?: BigNumber;
        feeAsset?: Asset;
    };
    assets: Asset[];
    recipientAddress?: string;
    multicallAddress?: string;
}

export enum ChainType {
    evm = 'evm',
}

export enum WalletType {
    hd = 'hd',
}

export interface Chain {
    id: string;
    name: string;
    client: Client;
    config: IConfig;
    network?: Network;
    segwitFeeImplemented?: boolean;
    funded?: boolean;
}
