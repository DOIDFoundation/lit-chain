import { Logger, LogLevel } from '@lit-chain/logger';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { shouldBehaveLikeEvmClient } from './clients/evm';
import { describeExternal } from './common';
import { startLocalNetworks, stopLocalNetworks } from './environment';
import { shouldBehaveLikeDOIDWallet } from './wallet/wallet_for_doid';

chai.use(chaiAsPromised);

// turn off the logger for the tests
Logger.setLogLevel(LogLevel.OFF);

describe('Integration tests', function () {
    before(async () => {
        await startLocalNetworks();
    });

    describe('Clients', () => {
        // shouldBehaveLikeEvmClient();
    });

    describe('doid wallets', () => {
        shouldBehaveLikeDOIDWallet(true);
    });

    

    after(async () => {
        await stopLocalNetworks();
    });
});
