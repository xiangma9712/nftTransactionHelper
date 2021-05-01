# Address derived by mnemonic is not used on mainnet
docker run --detach --rm --name localethereum -p 8545:8545 trufflesuite/ganache-cli \
--accounts 1 \
--mnemonic "hospital absorb snow because blanket adapt life grape someone elite current fatal" \
--defaultBalanceEther 100 \
--quiet