import * as dotenv from 'dotenv';
dotenv.config();
import nftTransactionHelper from '../index';

const privateKey: string = process.env.PRIVATE_KEY ?? '';
const url: string = process.env.URL ?? 'http://localhost:8545';
const contractAddress: string = process.env.CONTRACT_ADDRESS ?? '';

const helper = new nftTransactionHelper(privateKey, url);
const addresss = helper.getAddress();
console.log(addresss);
helper.end();