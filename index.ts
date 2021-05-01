import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';
import * as fs from 'fs';
const erc721abi = JSON.parse(fs.readFileSync('./lib/abi.json','UTF-8'));

class nftTransactionHelper {
    private client = new Web3();
    private provider: HDWalletProvider | undefined;
    private contract: Contract | undefined;
    
    constructor (mnemonicOrPrivateKey: string, url: string) {
        const provider = new HDWalletProvider(mnemonicOrPrivateKey, url);
        this.client.setProvider(provider);
        this.provider = provider;
    }

    public setContract(contractAddress: string): void {
        this.contract = new this.client.eth.Contract(erc721abi, contractAddress);
    }

    public getAddress(): string {
        return this.provider?.getAddress() ?? '';
    }

    public async isOwner(tokenId: string): Promise<boolean>{
        if(this.isInitialized(this.contract)){
            const ownerAddress = await this.contract.methods.ownerOf(tokenId).call();
            return ownerAddress === this.getAddress();
        }
        return false;
    }

    public async transferToken(tokenId: string, toAddress: string): Promise<string> {
        if(this.isInitialized(this.contract)){
            const txHash = await this.contract.methods.transfer(tokenId, toAddress).send();
            return String(txHash);
        }
        throw new Error('Contract not initialized');
    }

    public end(): void {
        this.provider?.engine.stop();
    }

    private isInitialized(contract: Contract | undefined): contract is Contract {
        return this.provider !== undefined && this.contract !== undefined;
    }
}

export default nftTransactionHelper;