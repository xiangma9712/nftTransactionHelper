import nftTransactionHelper from '../index';
import { setup } from './env/setup';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import {mainAccount, subAccount} from './testAccount';
const mnemonic = mainAccount.mnemonic;
const url = 'http://localhost:8545';
const helper = new nftTransactionHelper(mnemonic, url);

before('set up contract', async function () {
    this.timeout(10 * 1000);
    const contractAddress = await setup();
    helper.setContract(contractAddress);
});
describe('test', () => {
    it('check ownership by isOwner', async function () {
        const isOwner = await helper.isOwner('1');
        expect(isOwner).to.be.equals(true);
    });
    it('check ownership by getOwner', async function () {
        const owner = await helper.getOwner('1');
        expect(owner).to.be.equals('0x6448D31e71787b09e85CBdFc7969964b4E36033C');
    });
    it('check ownership by getBalance', async function () {
        const balance = await helper.getBalance();
        expect(balance).to.be.equals(3);
    });
});
after('end provide engine', async function () {
    helper.end();
})