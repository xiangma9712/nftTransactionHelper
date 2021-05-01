"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hdwallet_provider_1 = __importDefault(require("@truffle/hdwallet-provider"));
const web3_1 = __importDefault(require("web3"));
const fs = __importStar(require("fs"));
const erc721abi = JSON.parse(fs.readFileSync('./lib/abi.json', 'UTF-8'));
class nftTransactionHelper {
    constructor(mnemonicOrPrivateKey, url) {
        this.client = new web3_1.default();
        const provider = new hdwallet_provider_1.default(mnemonicOrPrivateKey, url);
        this.client.setProvider(provider);
        this.provider = provider;
    }
    setContract(contractAddress) {
        this.contract = new this.client.eth.Contract(erc721abi, contractAddress);
    }
    getAddress() {
        var _a, _b;
        return (_b = (_a = this.provider) === null || _a === void 0 ? void 0 : _a.getAddress()) !== null && _b !== void 0 ? _b : '';
    }
    async isOwner(tokenId) {
        if (this.isInitialized(this.contract)) {
            const ownerAddress = await this.contract.methods.ownerOf(tokenId).call();
            return ownerAddress === this.getAddress();
        }
        return false;
    }
    async transferToken(tokenId, toAddress) {
        if (this.isInitialized(this.contract)) {
            const txHash = await this.contract.methods.transfer(tokenId, toAddress).send();
            return String(txHash);
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
