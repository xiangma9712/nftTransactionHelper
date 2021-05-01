declare class nftTransactionHelper {
    private client;
    private provider;
    private contract;
    constructor(mnemonicOrPrivateKey: string, url: string);
    setContract(contractAddress: string): void;
    getAddress(): string;
    isOwner(tokenId: string): Promise<boolean>;
    transferToken(tokenId: string, toAddress: string): Promise<string>;
    end(): void;
    private isInitialized;
}
export default nftTransactionHelper;
