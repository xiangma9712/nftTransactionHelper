import nftTransactionHelper from '../index';
import { setup } from './env/setup';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import {mainAccount, subAccount} from './testAccount';
const mnemonic = mainAccount.mnemonic;
const url = 'http://localhost:8545';
const helper = new nftTransactionHelper(mnemonic, url);
let contractAddress = '';

before('set up contract', async function () {
    this.timeout(10 * 1000);
    contractAddress = await setup();
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
    it('check approval by getApproved', async function () {
        const approvedAddress = await helper.getApproved('1');
        expect(approvedAddress).to.be.equals('0x0000000000000000000000000000000000000000'); // Up to contract implementation
    });
    it('check approval by approve, isApproved', async function () {
        await helper.approve(subAccount.address,'1');
        const approvedAddress = await helper.getApproved('1');
        expect(approvedAddress).to.be.equals(subAccount.address);

        const subHelper = new nftTransactionHelper(subAccount.mnemonic, url);
        subHelper.setContract(contractAddress);
        const isApproved = await subHelper.isApproved('1');
        subHelper.end();
        expect(isApproved).to.be.equals(true);
    });
    it('check approval by setApprovalForAll, isApprovedForAll', async function () {
        const before = await helper.isApprovedForAll(subAccount.address);
        expect(before).to.be.equals(false);
        await helper.setApprovalForAll(subAccount.address);
        const after = await helper.isApprovedForAll(subAccount.address);
        expect(after).to.be.equals(true);
    });
    it('check transaction : transfer', async function () {
        await helper.transfer(subAccount.address, '1');
        const balance = await helper.getBalance();
        expect(balance).to.be.equals(2);
        const owner = await helper.getOwner('1');
        expect(owner).to.be.equals(subAccount.address);
    });
    it('check transaction : approve/transferFrom', async function () {
        const subHelper = new nftTransactionHelper(subAccount.mnemonic, url);
        subHelper.setContract(contractAddress);
        const balanceBefore = await subHelper.getBalance();
        expect(balanceBefore).to.be.equals(1);

        await helper.approve(subAccount.address, '2');
        await subHelper.transferFrom(mainAccount.address, subAccount.address, '2');

        const balanceAfter = await subHelper.getBalance();
        const owner = await helper.getOwner('2');
        subHelper.end();
        expect(balanceAfter).to.be.equals(2);
        expect(owner).to.be.equals(subAccount.address);
    });
    it('check transaction : setApproveForAll/transferFrom', async function () {
        const subHelper = new nftTransactionHelper(subAccount.mnemonic, url);
        subHelper.setContract(contractAddress);
        const balanceBefore = await subHelper.getBalance();
        expect(balanceBefore).to.be.equals(2);

        const isApprovedForAll = await helper.isApprovedForAll(subAccount.address);
        const isApprovedForSpecificToken = await subHelper.isApproved('3')
        expect(isApprovedForAll).to.be.equals(true);
        expect(isApprovedForSpecificToken).to.be.equals(false);
        await subHelper.transferFrom(mainAccount.address, subAccount.address, '3');

        const balanceAfter = await subHelper.getBalance();
        const owner = await helper.getOwner('3');
        subHelper.end();
        expect(balanceAfter).to.be.equals(3);
        expect(owner).to.be.equals(subAccount.address);
    });
});
after('end provide engine', async function () {
    helper.end();
})