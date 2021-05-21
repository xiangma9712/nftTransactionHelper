import Web3 from 'web3';

const client = new Web3('http://localhost:8545');
const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

async function waitUntilContainerReady(seconds: number): Promise<void> {
    const promises: Promise<unknown>[] = [];
    promises.push((async () => {
        sleep(seconds * 1000);
        console.error('Fial to check test env status');
    })());
    promises.push((async () => {
        while(true) {
            try {
                const blockNumber = await client.eth.getBlockNumber();
                console.log('Prepared. block number: ' + JSON.stringify(blockNumber));
                return;
            } catch (error) {
                console.log('Not prepared yet...');
                await sleep(1000 * 5);
            }
        }
    })());
    await Promise.race(promises);
}

waitUntilContainerReady(60);