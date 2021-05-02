import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';
import * as fs from 'fs';
import {mainAccount} from '../testAccount';
const mnemonic = mainAccount.mnemonic;
const url = 'http://localhost:8545';
const compileResult = JSON.parse(fs.readFileSync('./test/env/MyNftLibrary.json', 'UTF-8'));

export const setup = async () => {
    const client = new Web3();
    const provider = new HDWalletProvider(mnemonic, url);
    client.setProvider(provider);
    const contractBeforeDeploy = new client.eth.Contract(compileResult.abi);
    const contract = await contractBeforeDeploy
        .deploy({data: compileResult.bytecode})
        .send({from: provider.getAddress()});
        
    await contract.methods.mint(1).send({from: provider.getAddress()});
    await contract.methods.mint(2).send({from: provider.getAddress()});
    await contract.methods.mint(3).send({from: provider.getAddress()});
    provider.engine.stop();
    return contract.options.address;
};