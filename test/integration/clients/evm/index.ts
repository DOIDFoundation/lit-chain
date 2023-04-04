import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { Chains, describeExternal, fundAddress } from '../../common';
import { deploy } from '../../deploy';
import { shouldBehaveLikeWalletProvider } from '../../wallet/wallet.test';
import { shouldSignTypedData } from './signTypedData.behavior';
import { shouldUpdateTransactionFee } from './updateTransactionFee.behavior';

export function shouldBehaveLikeEvmClient() {
    before(async () => {
        await deploy(Chains.evm.hd.client);
    });

    describe('EVM Client - HD Wallet', () => {
        const chain = Chains.evm.hd;
        shouldBehaveLikeChainProvider(chain);
        shouldBehaveLikeWalletProvider(chain);
        shouldBehaveLikeWalletProvider(chain, false);
        shouldUpdateTransactionFee(chain);
        shouldSignTypedData(chain);
    });
}
