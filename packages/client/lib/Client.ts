import Chain from './Chain';
import Wallet from './Wallet';

export default class Client<
    ChainType extends Chain<any> = Chain<any>,
    WalletType extends Wallet<any, any> = Wallet<any, any>
> {
    private _chain: ChainType;
    private _wallet: WalletType;

    constructor(chain?: ChainType, wallet?: WalletType) {
        this._chain = chain;
        this._wallet = wallet;
    }

    connect(provider: ChainType | WalletType) {
        switch (true) {
            case provider instanceof Chain: {
                this.chain = provider as ChainType;
                if (this.wallet) {
                    this.wallet.setChainProvider(this.chain);
                }
                break;
            }

            case provider instanceof Wallet: {
                this.wallet = provider as WalletType;
                this.connectChain();
                break;
            }
        }

        return this;
    }

    get chain() {
        return this._chain;
    }

    set chain(chain: ChainType) {
        this._chain = chain;
    }

    get wallet() {
        return this._wallet;
    }

    set wallet(wallet: WalletType) {
        this._wallet = wallet;
    }
    private connectChain() {
        const chain = this.wallet?.getChainProvider() as ChainType;
        if (chain) {
            this.chain = chain;
        }
    }
}
