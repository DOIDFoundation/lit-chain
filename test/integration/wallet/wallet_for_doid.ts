import { UnimplementedMethodError } from '@lit-chain/errors';
import { AssetTypes, BigNumber, TxStatus } from '@lit-chain/types';
import { Network, WalletOptions } from '@lit-chain/types';
import { providers } from 'ethers';
import { expect } from 'chai';
import { mineBlock } from '../common';
import * as EVM from '@lit-chain/evm';
import { EVMConfig } from '../clients/evm/config';
import { Chain } from '../types';
import { EIP1559MockFeeProvider } from '../clients/evm/mock/EIP1559MockFeeProvider';

export function shouldBehaveLikeDOIDWallet( isNative = true) {

    
    const network = EVM.EvmNetworks.ganache
    const config = EVMConfig(network);

    const provider = new providers.StaticJsonRpcProvider(network.rpcUrl);
    // using mainnet gas fees
    const feeProvider = new EIP1559MockFeeProvider(provider);
    const chainProvider = new EVM.EvmChainProvider(network, provider, feeProvider);
    const walletProvider = new EVM.EvmWalletProvider(config.walletOptions as WalletOptions, chainProvider);

    describe(`Evm Wallet Provider`, function () {

        before(async () => {
            // await startLocalNetworks();
        });

        it('should use the expected address', async () => {
            const address = await walletProvider.getAddress();
            if (config.walletExpectedResult.address) {
                expect(address.toString()).to.be.equal(config.walletExpectedResult.address);
            }
        });

        it('should return first address at index 0 derivationPath from getAddresses', async () => {
            const addresses = await walletProvider.getAddresses();
            if (config.walletExpectedResult.address) {
                expect(addresses[0].toString()).to.be.equal(config.walletExpectedResult.address);
            }
        });

        it('should return first address at index 0 derivationPath from getUnusedAddress', async () => {
            const address = await walletProvider.getUnusedAddress();
            if (config.walletExpectedResult.unusedAddress) {
                expect(address.toString()).to.equal(config.walletExpectedResult.unusedAddress);
            }
        });

        it('should return first used address from getUsedAddresses', async () => {
            const addresses = await walletProvider.getUsedAddresses();
            if (config.walletExpectedResult.address) {
                expect(addresses.length).to.equal(config.walletExpectedResult.numberOfUsedAddresses);
                expect(addresses[0].toString()).to.equal(config.walletExpectedResult.address);
            }
        });

        it('should sign message', async () => {
            const from = await walletProvider.getAddress();
            const signedMessage = await walletProvider.signMessage('secret', from);
            if (config.walletExpectedResult.signedMessage) {
                expect(signedMessage).to.be.equal(config.walletExpectedResult.signedMessage);
            }
        });

        it('should return hex of signed message', async () => {
            const from = await walletProvider.getAddress();
            const signedMessage = await walletProvider.signMessage('secret', from);
            const signedMessageBuffer = Buffer.from(signedMessage, 'hex');
            if (config.walletExpectedResult.signedMessage) {
                expect(signedMessage).to.equal(signedMessageBuffer.toString('hex')).to.be.equal(config.walletExpectedResult.signedMessage);
            } else {
                expect(signedMessage).to.equal(signedMessageBuffer.toString('hex'));
            }
        });

        it('should return the same hex if signed twice', async () => {
            const from = await walletProvider.getAddress();
            const signedMessage1 = await walletProvider.signMessage('secret', from);
            const signedMessage2 = await walletProvider.signMessage('secret', from);
            if (config.walletExpectedResult.signedMessage) {
                expect(signedMessage1).to.be.equal(signedMessage2).to.be.equal(config.walletExpectedResult.signedMessage);
            } else {
                expect(signedMessage1).to.be.equal(signedMessage2);
            }
        });

        it('should return connected networks', async () => {
            const network = await walletProvider.getConnectedNetwork();
            expect(network).to.deep.equal(network);
        });

        it('should export private key', async () => {
            try {
                const privateKey = await walletProvider.exportPrivateKey();
                expect(privateKey).to.be.equal(config.walletExpectedResult.privateKey);
            } catch (error) {
                if (!(error instanceof UnimplementedMethodError)) {
                    throw error;
                }
            }
        });

        it(`should send ${isNative ? 'native' : 'ERC20'} asset transaction`, async () => {
            const txRequest = {
                to: config.recipientAddress,
                value: config.sendParams.value || new BigNumber(1000000),
                asset: config.assets.find((a) => a.type === (isNative ? AssetTypes.native : AssetTypes.erc20)),
                feeAsset: config.sendParams.feeAsset,
            };
            const tx = await walletProvider.sendTransaction(txRequest);

            // await mineBlock(chain);

            const txReceipt = await chainProvider.getTransactionByHash(tx.hash);

            if (config.sendParams.value) {
                if (txRequest.asset.type === AssetTypes.native) {
                    expect(txReceipt.value === config.sendParams.value.toNumber()).to.be.true;
                }
                expect(txReceipt.status).to.equal(TxStatus.Success);
            }
        });
    });
}
