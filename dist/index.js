"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hdwallet_provider_1 = __importDefault(require("@truffle/hdwallet-provider"));
const web3_1 = __importDefault(require("web3"));
const abi_1 = __importDefault(require("./lib/abi"));
class nftTransactionHelper {
    constructor(mnemonicOrPrivateKey, url) {
        this.client = new web3_1.default();
        const provider = new hdwallet_provider_1.default(mnemonicOrPrivateKey, url);
        this.client.setProvider(provider);
        this.provider = provider;
    }
    /**
     * Set contract address you want to send transaction to.
     * @param contractAddress
     */
    setContract(contractAddress) {
        this.contract = new this.client.eth.Contract(abi_1.default, contractAddress);
    }
    /**
     * @returns user address
     */
    getAddress() {
        var _a, _b;
        return (_b = (_a = this.provider) === null || _a === void 0 ? void 0 : _a.getAddress()) !== null && _b !== void 0 ? _b : '';
    }
    /**
     * @param tokenId
     * @returns owner address of token
     */
    async getOwner(tokenId) {
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
    async getApproved(tokenId) {
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
    async isOwner(tokenId) {
        const owner = await this.getOwner(tokenId);
        return owner.toLowerCase() === this.getAddress().toLowerCase();
    }
    /**
     * @param tokenId
     * @returns if user is approved to perform transferFrom
     */
    async isApproved(tokenId) {
        const approvedOperator = await this.getApproved(tokenId);
        return approvedOperator.toLowerCase() === this.getAddress().toLowerCase();
    }
    /**
     * same as defined in EIP721
     * @returns user's NFT possession count
     */
    async getBalance() {
        if (this.isInitialized(this.contract)) {
            const balance = await this.contract.methods.balanceOf(this.getAddress()).call();
            return Number(balance);
        }
        throw new Error('Contract not initialized');
    }
    /**
     * transferFrom used internally.
     * @param toAddress
     * @param tokenId
     * @returns txHash
     */
    async transfer(toAddress, tokenId) {
        if (this.isInitialized(this.contract)) {
            const txHash = await this.contract.methods.transferFrom(this.getAddress(), toAddress, tokenId).send(this.getSendOption());
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
    async approve(toAddress, tokenId) {
        if (this.isInitialized(this.contract)) {
            const txHash = await this.contract.methods.approve(toAddress, tokenId).send(this.getSendOption());
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
    async transferFrom(fromAddress, toAddress, tokenId, option) {
        if (this.isInitialized(this.contract)) {
            const isApproved = await this.isApproved(tokenId) || await this.isApprovedForAllBy(fromAddress);
            if (!isApproved)
                throw new Error('You are not approved to execute transaction');
            const method = (option === null || option === void 0 ? void 0 : option.useSafeTransferFrom) ? 'safeTransferFrom' : 'transferFrom';
            const txHash = await this.contract.methods[method](fromAddress, toAddress, tokenId).send(this.getSendOption());
            return String(txHash);
        }
        throw new Error('Contract not initialized');
    }
    /**
     * check current approval before sending transaction to save gas.
     * @param operator address to trust
     * @returns txHash
     */
    async setApprovalForAll(operator) {
        if (this.isInitialized(this.contract)) {
            const before = await this.isApprovedForAll(operator);
            if (before)
                throw new Error('Already Approved');
            const txHash = await this.contract.methods.setApprovalForAll(operator, true).send(this.getSendOption());
            return String(txHash);
        }
        throw new Error('Contract not initialized');
    }
    /**
     * @param operator
     * @returns if user approved the address for all
     */
    async isApprovedForAll(operator) {
        if (this.isInitialized(this.contract)) {
            const isApproved = await this.contract.methods.isApprovedForAll(this.getAddress(), operator).call();
            return isApproved;
        }
        throw new Error('Contract not initialized');
    }
    /**
     * @param owner
     * @returns if user is approved by the address for all
     */
    async isApprovedForAllBy(owner) {
        if (this.isInitialized(this.contract)) {
            const isApproved = await this.contract.methods.isApprovedForAll(owner, this.getAddress()).call();
            return isApproved;
        }
        throw new Error('Contract not initialized');
    }
    /**
     * Stop HD wallet provider engine. Make sure to call this method when all is done.
     */
    end() {
        var _a;
        (_a = this.provider) === null || _a === void 0 ? void 0 : _a.engine.stop();
    }
    isInitialized(contract) {
        return this.provider !== undefined && this.contract !== undefined;
    }
    getSendOption() {
        return {
            from: this.getAddress()
        };
    }
}
exports.default = nftTransactionHelper;
