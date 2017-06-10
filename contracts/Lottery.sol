pragma solidity ^0.4.6;

import './StandardToken.sol';

contract Lottery is StandardToken {

  function () {
      //if ether is sent to this address, send it back.
      throw;
  }

  address public owner = msg.sender;
  uint public creationTime = now;
  string public name = 'Lottery';
  uint8 public decimals = 6;
  string public symbol = 'LTO';
  address[] public faucetQueue;
  uint64 public faucetCount;
  uint64 public faucetIndex = 0;
  uint256 public blockReward = 100000000;
  uint256 public blockRemainder = 0;
  uint256 public lastBlock = block.number;
  uint256 public currentBlock = block.number;
  uint8 public ownerReward = 10;
  uint256[] public roundBlocks;
  uint64[] public roundHashes;
  uint64[] public roundCounts;
  uint256 public currentRound = 1;
  uint8 genLength = 1;
  uint8 genTotal = 3;

  function Lottery(uint256 _initialAmount) {
    balances[msg.sender] = _initialAmount;
  }


  function approveAndCall(address _spender, uint256 _value, bytes _extraData) returns (bool success) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);

    if(!_spender.call(bytes4(bytes32(sha3("receiveApproval(address,uint256,address,bytes)"))), msg.sender, _value, this, _extraData)) { throw; }
    return true;
  }

  function addToFaucet(address a) {
    faucetQueue.push(a);
    faucetCount += 1;
    if (currentBlock != block.number) {
      currentBlock = block.number;
      startNewRound();
    }
    AddToFaucet(a, faucetIndex, faucetCount);
  }

  function startNewRound() {
    // record the block number
    roundBlocks.push(block.number);
    // record the queue count for the last round
    uint64 roundCount = faucetCount - 1;
    roundCounts.push(roundCount);
    // record first 8 bytes of the bock hash
    uint64 blockHash = uint64(uint256(block.blockhash(block.number-1)));
    roundHashes.push(blockHash);
    // Do not start the lottery until enough rounds have passed
    // to generate randomness
    uint8 maturity = genLength * genTotal;
    if (roundBlocks.length > maturity) {
      runLottery();
    }

    StartNewRound(currentRound, faucetIndex, faucetCount, roundBlocks.length, block.number, roundCount, blockHash);
  }

  function getQueueAddressAt(uint index) constant returns(address) {
    return faucetQueue[index];
  }

  function runLottery() {
    if (blockReward % 2102400000000 == 0) {
      blockReward = blockReward / 2;
      if (blockReward < 10000000) {
        blockReward = 10000000;
      }
    }

    uint256 blockCount = roundBlocks[currentRound] - lastBlock;
    // Award 10% of block reward to the contract owner
    uint256 reward = blockCount * blockReward;
    balances[owner] += reward / ownerReward;
    reward = reward - (reward / ownerReward);

    // Split the remaining pot between the addresses;
    uint256 totalTickets = roundCounts[currentRound] - faucetIndex;
    uint256 pot = reward + blockRemainder;
    uint256 split = pot / totalTickets;
    uint256 roundRemainder = blockRemainder;

    // Wipe the block remainder
    blockRemainder = 0;

    while (faucetIndex < roundCounts[currentRound]) {
      uint256 ran = uint256(sha3(faucetIndex, faucetQueue[faucetIndex], roundHashes[currentRound], roundHashes[currentRound+1], roundHashes[currentRound+2]));
      uint256 prize = ran % split;
      uint256 remainder = split - prize;

      blockRemainder += remainder;
      balances[faucetQueue[faucetIndex]] += prize;
      LotteryPaid(faucetQueue[faucetIndex], reward, split, ran, prize, remainder);
      faucetIndex++;
    }

    // Move the index forward, rewards have been distributed
    lastBlock = roundBlocks[currentRound];
    // End the round
    currentRound++;
    Lotto(blockReward, blockCount, roundRemainder, blockRemainder, reward, pot, split, totalTickets, currentRound, faucetIndex, faucetCount, roundCounts[currentRound]);
  }

  event AddToFaucet(address indexed addr, uint256 faucetIndex, uint256 faucetCount);
  event Lotto(uint blockReward, uint256 blockCount, uint256 roundRemainder, uint256 blockRemainder, uint256 totalReward, uint256 pot, uint256 split, uint256 totalTickets, uint256 roundNumber, uint256 faucetIndex, uint256 faucetCount, uint256 roundCount);
  event LotteryPaid(address addr, uint256 totalReward, uint256 split, uint256 ran, uint256 prize, uint256 remainder);
  event StartNewRound(uint256 roundNumber, uint256 faucetIndex, uint256 faucetCount, uint256 totalRounds, uint256 blockNumber, uint256 roundCount, uint64 blockHash);
}
