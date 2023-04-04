import { Client } from '@lit-chain/client';
import { EvmNetworks } from '@lit-chain/evm';

import { Address, AddressType, AssetTypes, BigNumber, FeeType, Transaction } from '@lit-chain/types';
import { retry, sha256, sleep } from '@lit-chain/utils';
import { expect } from 'chai';
import {

    EVMClient,

} from './clients';
import {
    EVMConfig,
} from './config';
import { Chain, ChainType, IConfig, WalletType } from './types';

export const describeExternal = process.env.RUN_EXTERNAL ? describe.only : describe.skip;

export const Chains: { [key in ChainType]: Partial<{ [key in WalletType]: Chain }> } = {
    

    [ChainType.evm]: {
        hd: {
            id: 'EVM',
            name: 'evm',
            config: EVMConfig(EvmNetworks.ganache),
            client: EVMClient,
        },

       
    },

    
};



export async function increaseTime(chain: Chain, timestamp: number) {
    switch (chain.id) {
        case 'EVM': {
            await chain.client.chain.sendRpcRequest('evm_increaseTime', [1000]);
            await chain.client.chain.sendRpcRequest('evm_mine', []);
            break;
        }

        
    }
}

export async function fundWallet(chain: Chain) {
    if (chain.funded) {
        return;
    }

    const address = await chain.client.wallet.getUnusedAddress();
    await fundAddress(chain, address.address);
    chain.funded = true;
}

export async function mineBlock(chain: Chain, numberOfBlocks = 1) {
    const { client } = chain;
    switch (chain.id) {
        case 'EVM': {
            return client.chain.sendRpcRequest('evm_mine', []);
        }
        
    }
}







export async function fundAddress(chain: Chain, address: AddressType, value?: BigNumber) {
    let tx: Transaction;
    switch (chain.id) {
        case 'EVM': {
            await chain.client.wallet.sendTransaction({
                to: address,
                value: value || new BigNumber(1e18),
            });
            break;
        }
    }

    await mineBlock(chain);
    await sleep(1000);
    return tx;
}

export async function getNewAddress(chain: Chain, _refund = false): Promise<Address> {
    switch (chain.id) {
        default: {
            return chain.client.wallet.getUnusedAddress();
        }
    }
}




