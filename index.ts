import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import erc721abi from './lib/abi';

class nftTransactionHelper {
    private client = new Web3();
    private provider: HDWalletProvider | undefined;
    private contract: Contract | undefined;

    constructor(mnemonicOrPrivateKey: string, url: string) {
        const provider = new HDWalletProvider(mnemonicOrPrivateKey, url);
        this.client.setProvider(provider);
        this.provider = provider;
    }

    /**
     * Set contract address you want to send transaction to.
     * @param contractAddress 
     */
    public setContract(contractAddress: string): void {
        this.contract = new this.client.eth.Contract(erc721abi, contractAddress);
    }

    /**
     * @returns user address
     */
    public getAddress(): string {
        return this.provider?.getAddress() ?? '';
    }

    /**
     * @param tokenId 
     * @returns owner address of token
     */
    public async getOwner(tokenId: string): Promise<string> {
        if (this.isInitialized(this.contract)) {
            return await this.contract.methods.ownerOf(tokenId).call();
        }
        throw new Error('Contract not initialized');
    }

    /**
     * same as defined in EIP721
     * @param tokenId 
     * @returns address approved to perform transferFrom
     */
    public async getApproved(tokenId: string): Promise<string> {
        if (this.isInitialized(this.contract)) {
            const approvedOperator = await this.contract.methods.getApproved(tokenId).call();
            return String(approvedOperator);
        }
        throw new Error('Contract not initialized');
    }

    /**
     * @param tokenId 
     * @returns if user is owner
     */
    public async isOwner(tokenId: string): Promise<boolean> {
        const owner = await this.getOwner(tokenId);
        return owner === this.getAddress();
    }

    /**
     * @param tokenId 
     * @returns if user is approved to perform transferFrom
     */
    public async isApproved(tokenId: string): Promise<boolean> {
        const approvedOperator = await this.getApproved(tokenId);
        return approvedOperator === this.getAddress();
    }

    /**
     * same as defined in EIP721
     * @returns user's NFT possession count 
     */
    public async getBalance(): Promise<number> {
        if (this.isInitialized(this.contract)) {
            const balance = await this.contract.methods.balanceOf(this.getAddress()).call();
            return Number(balance);
        }
        throw new Error('Contract not initialized');
    }

    /**
     * same as defined in EIP721
     * @param toAddress 
     * @param tokenId 
     * @returns txHash
     */
    public async transfer(toAddress: string, tokenId: string): Promise<string> {
        if (this.isInitialized(this.contract)) {
            const txHash = await this.contract.methods.transfer(tokenId, toAddress).send();
            return String(txHash);
        }
        throw new Error('Contract not initialized');
    }

    /**
     * same as defined in EIP721
     * @param toAddress 
     * @param tokenId 
     * @returns txHash
     */
    public async approve(toAddress: string, tokenId: string): Promise<string> {
        if (this.isInitialized(this.contract)) {
            const txHash = await this.contract.methods.approve(toAddress, tokenId).send();
            return String(txHash);
        }
        throw new Error('Contract not initialized');
    }

    /**
     * check user is approved before sending transaction to save gas.
     * @param fromAddress 
     * @param toAddress 
     * @param tokenId 
     * @param option whether use safeTransferFrom or not
     * @returns txHash
     */
    public async transferFrom(fromAddress: string, toAddress: string, tokenId: string, option?: {useSafeTransferFrom: boolean}): Promise<string> {
        if (this.isInitialized(this.contract)) {
            if (this.isApproved(tokenId)) throw new Error('You are not approved to execute transaction');
            const method = option?.useSafeTransferFrom ? 'safeTransferFrom' : 'transferFrom';
            const txHash = await this.contract.methods[method](fromAddress, toAddress, tokenId).send();
            return String(txHash);
        }
        throw new Error('Contract not initialized');
    }

    /**
     * check current approval before sending transaction to save gas.
     * @param operator address to trust
     * @returns txHash
     */
    public async setApprovalForAll(operator: string): Promise<string> {
        if (this.isInitialized(this.contract)) {
            if (this.isApprovedForAll(operator)) throw new Error('Already Approved');
            const txHash = await this.contract.methods.setApprovalForAll(operator, true).send();
            return String(txHash);
        }
        throw new Error('Contract not initialized');
    }

    /**
     * @param operator
     * @returns if user approved the address for all 
     */
    public async isApprovedForAll(operator: string): Promise<boolean> {
        if (this.isInitialized(this.contract)) {
            const isApproved: boolean = await this.contract.methods.isApprovedForAll(this.getAddress(), operator).call();
            return isApproved;
        }
        throw new Error('Contract not initialized');
    }

    /**
     * Stop HD wallet provider engine. Make sure to call this method after all transactions have done.
     */
    public end(): void {
        this.provider?.engine.stop();
    }

    private isInitialized(contract: Contract | undefined): contract is Contract {
        return this.provider !== undefined && this.contract !== undefined;
    }
}

export default nftTransactionHelper;