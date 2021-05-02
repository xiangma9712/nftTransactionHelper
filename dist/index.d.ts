declare class nftTransactionHelper {
    private client;
    private provider;
    private contract;
    constructor(mnemonicOrPrivateKey: string, url: string);
    /**
     * Set contract address you want to send transaction to.
     * @param contractAddress
     */
    setContract(contractAddress: string): void;
    /**
     * @returns user address
     */
    getAddress(): string;
    /**
     * @param tokenId
     * @returns owner address of token
     */
    getOwner(tokenId: string): Promise<string>;
    /**
     * same as defined in EIP721
     * @param tokenId
     * @returns address approved to perform transferFrom
     */
    getApproved(tokenId: string): Promise<string>;
    /**
     * @param tokenId
     * @returns if user is owner
     */
    isOwner(tokenId: string): Promise<boolean>;
    /**
     * @param tokenId
     * @returns if user is approved to perform transferFrom
     */
    isApproved(tokenId: string): Promise<boolean>;
    /**
     * same as defined in EIP721
     * @returns user's NFT possession count
     */
    getBalance(): Promise<number>;
    /**
     * same as defined in EIP721
     * @param toAddress
     * @param tokenId
     * @returns txHash
     */
    transfer(toAddress: string, tokenId: string): Promise<string>;
    /**
     * same as defined in EIP721
     * @param toAddress
     * @param tokenId
     * @returns txHash
     */
    approve(toAddress: string, tokenId: string): Promise<string>;
    /**
     * check user is approved before sending transaction to save gas.
     * @param fromAddress
     * @param toAddress
     * @param tokenId
     * @param option whether use safeTransferFrom or not
     * @returns txHash
     */
    transferFrom(fromAddress: string, toAddress: string, tokenId: string, option?: {
        useSafeTransferFrom: boolean;
    }): Promise<string>;
    /**
     * check current approval before sending transaction to save gas.
     * @param operator address to trust
     * @returns txHash
     */
    setApprovalForAll(operator: string): Promise<string>;
    /**
     * @param operator
     * @returns if user approved the address for all
     */
    isApprovedForAll(operator: string): Promise<boolean>;
    /**
     * Stop HD wallet provider engine. Make sure to call this method after all transactions have done.
     */
    end(): void;
    private isInitialized;
}
export default nftTransactionHelper;
