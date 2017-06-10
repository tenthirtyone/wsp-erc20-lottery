# ERC-20 Lottery Token

This Ethereum contract is an ERC-20 compliant token with a built in lottery distribution function.

### Installation

Requirements:
```sh
$ npm install -g truffle
$ npm install -g ethereumjs-testrpc
```

testrpc is used to simulate the ethereum blockchain in a dev environment.
truffle will compile and migrate our smart contracts to the testrpc blockchain.

In its own terminal window run:
```sh
$ testrpc --gasLimit 100000000 -b 3
```

After cloning the repository,
```sh
$ cd erc20-lottery
$ npm install
$ truffle compile && truffle migrate && npm run start
```

### How the Lottery Works
Tokens are distributed in a randomized lottery. A single address may be added to the lottery per transaction. The block reward is split evenly among addresses. Each address receives a reward equal to:

```sh
Split % uint64(SHA3(Lottery Queue Index, Address, Future Block Hash1, Future Block Hash2, Future Block Hash3))
```

This is similar to the randomness strategy employed by services like Etherdice. Each address matures through three generations. Each generation is 3 blocks long. After hashing, the address reward is recorded in the ledger. The unclaimed remainder snowballs or trickles into the next block reward.
