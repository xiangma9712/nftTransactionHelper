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
    setContract(contractAddress) {
        this.contract = new this.client.eth.Contract(abi_1.default, contractAddress);
    }
    getAddress() {
        var _a, _b;
        return (_b = (_a = this.provider) === null || _a === void 0 ? void 0 : _a.getAddress()) !== null && _b !== void 0 ? _b : '';
    }
    async getOwner(tokenId) {
        if (this.isInitialized(this.contract)) {
            return await this.contract.methods.ownerOf(tokenId).call();
        }
        throw new Error('Contract not initialized');
    }
    async getApproved(tokenId) {
        if (this.isInitialized(this.contract)) {
            const approvedOperator = await this.contract.methods.getApproved(tokenId).call();
            return String(approvedOperator);
        }
        throw new Error('Contract not initialized');
    }
    async isOwner(tokenId) {
        const owner = await this.getOwner(tokenId);
        return owner === this.getAddress();
    }
    async isApproved(tokenId) {
        const approvedOperator = await this.getApproved(tokenId);
        return approvedOperator === this.getAddress();
    }
    async getBalance() {
        if (this.isInitialized(this.contract)) {
            const balance = await this.contract.methods.balanceOf(this.getAddress()).call();
            return Number(balance);
        }
        throw new Error('Contract not initialized');
    }
    async transfer(toAddress, tokenId) {
        if (this.isInitialized(this.contract)) {
            const txHash = await this.contract.methods.transfer(tokenId, toAddress).send();
            return String(txHash);
        }
        throw new Error('Contract not initialized');
    }
    async approve(toAddress, tokenId) {
        if (this.isInitialized(this.contract)) {
            const txHash = await this.contract.methods.approve(toAddress, tokenId).send();
            return String(txHash);
        }
        throw new Error('Contract not initialized');
    }
    async transferFrom(fromAddress, toAddress, tokenId, option) {
        if (this.isInitialized(this.contract)) {
            if (this.isApproved(tokenId))
                throw new Error('You are not approved to execute transaction');
            const method = (option === null || option === void 0 ? void 0 : option.useSafeTransferFrom) ? 'safeTransferFrom' : 'transferFrom';
            const txHash = await this.contract.methods[method](fromAddress, toAddress, tokenId).send();
            return String(txHash);
        }
        throw new Error('Contract not initialized');
    }
    async setApprovalForAll(operator) {
        if (this.isInitialized(this.contract)) {
            if (this.isApprovedForAll(operator))
                throw new Error('Already Approved');
            const txHash = await this.contract.methods.setApprovalForAll(operator, true).send();
            return String(txHash);
        }
        throw new Error('Contract not initialized');
    }
    async isApprovedForAll(operator) {
        if (this.isInitialized(this.contract)) {
            const isApproved = await this.contract.methods.isApprovedForAll(this.getAddress(), operator).call();
            return isApproved;
        }
        throw new Error('Contract not initialized');
    }
    end() {
        var _a;
        (_a = this.provider) === null || _a === void 0 ? void 0 : _a.engine.stop();
    }
    isInitialized(contract) {
        return this.provider !== undefined && this.contract !== undefined;
    }
}
exports.default = nftTransactionHelper;
