import { Client } from '@lit-chain/client';
import * as EVM from '@lit-chain/evm';
import { Network, WalletOptions } from '@lit-chain/types';
import { providers } from 'ethers';
import { EVMConfig } from './config';
import { EIP1559MockFeeProvider } from './mock/EIP1559MockFeeProvider';

function getEvmClient(network: Network) {
    const config = EVMConfig(network);
    const provider = new providers.StaticJsonRpcProvider(network.rpcUrl);
    // using mainnet gas fees
    const feeProvider = new EIP1559MockFeeProvider(provider);
    const chainProvider = new EVM.EvmChainProvider(network, provider, feeProvider);
    // we don't have multicall on the common address on Ganache
    void chainProvider.multicall.setMulticallAddress('0x08579f8763415cfCEa1B0F0dD583b1A0DEbfBe2b');
    const walletProvider = new EVM.EvmWalletProvider(config.walletOptions as WalletOptions, chainProvider);
    const client = new Client<EVM.EvmChainProvider, EVM.EvmWalletProvider>().connect(walletProvider);
    return client;
}

export const EVMClient = getEvmClient(EVM.EvmNetworks.ganache);
