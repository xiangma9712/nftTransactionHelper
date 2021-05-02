# NftTransactionHelper

Making ERC721 transaction easy

## Instllation

To install NftTransactionHelper, use npm.  
```
$ npm i nfttransactionhelper
```

Then import to your project.
```index.js
import NftTransactionHelper from 'nfttransactionhelper';

const privatekey = 'hoge'; // set your private key or mnemonic
const url = 'https://mainnet.infura.io' // tho I suggest to use infra.io, it's up to you.  
const helper = new NftTransactionHelper(privatekey, url);

const contractAddress = 'hoge'; // set contract address of ERC721 token
helper.setContract(contractAddress);

const toAddress = 'hoge';
const tokenId = '12'; // string required to prevent overflow.
await helper.transfer(toAddress, tokenId); // top level await require node v14.8 or later
helper.end();
```

## Method
check doc from source.