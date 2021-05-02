declare class nftTransactionHelper {
    private client;
    private provider;
    private contract;
    constructor(mnemonicOrPrivateKey: string, url: string);
    setContract(contractAddress: string): void;
    getAddress(): string;
    getOwner(tokenId: string): Promise<string>;
    getApproved(tokenId: string): Promise<string>;
    isOwner(tokenId: string): Promise<boolean>;
    isApproved(tokenId: string): Promise<boolean>;
    getBalance(): Promise<number>;
    transfer(toAddress: string, tokenId: string): Promise<string>;
    approve(toAddress: string, tokenId: string): Promise<string>;
    transferFrom(fromAddress: string, toAddress: string, tokenId: string, option?: {
        useSafeTransferFrom: boolean;
    }): Promise<string>;
    setApprovalForAll(operator: string): Promise<string>;
    isApprovedForAll(operator: string): Promise<boolean>;
    end(): void;
    private isInitialized;
}
export default nftTransactionHelper;
