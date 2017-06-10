import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import lottery_artifacts from '../build/contracts/Lottery.json'

import './App.css';

var $ = window.$;
var Lottery = contract(lottery_artifacts);
window.Lottery = Lottery;
window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
window.contract = contract;

Lottery.setProvider(window.web3.currentProvider);

var watcher;
startListener();

function init() {
  //$('#AddressList').empty();
  //$('#Statistics').empty();
  //$('#Statistics').append('<p>window.web3.eth.accounts 0 ' + window.web3.eth.accounts[0] + '</p>')
  //getOwner();
  //getCreationTime();
  //getFaucetCount();
  //getFaucetIndex();
  //getAddresses();
  //getLastBlock();
  //getCurrentBlock();
  //getBlockReward();
  //getBalance();
  //timesMined();
}

function startListener() {
  Lottery.deployed().then(function(contract_instance) {
    watcher = contract_instance.allEvents();
    watcher.watch(function(err, evt) {
      if (!err)
        handleEvent(evt);
    });
  })
}

function handleEvent(event) {
  var evt = event.event;
  switch (evt) {
    case "Mine":
      $('#Logs').prepend('<div class="round-finished">Round Finished: ' + event.blockNumber +
        ' Block Reward: ' + event.args.blockReward.c[0] +
        ' Pot Size: ' + event.args.pot.c[0] +
        ' Split Size: ' + event.args.split.c[0] +
        ' Total Tickets: ' + event.args.totalTickets.c[0] +
        '</div>')
      break;
    case "AddToFaucet":
      $('#Logs').prepend('<div class="faucet-add">AddToFaucet: ' + event.args.addr +
      ' faucetIndex: ' + event.args.faucetIndex +
      ' faucetCount: ' + event.args.faucetCount + '</div>')
      break;
    case "LotteryPaid":
      $('#Logs').prepend('<div class="lottery-paid">Lottery Paid: ' + event.args.addr +
      ' Random: ' + event.args.ran +
      ' Split: ' + event.args.split +
      ' Prize: ' + event.args.prize +
      ' Remainder: ' + event.args.remainder + '</div>')
      break;
    case "StartNewRound":
      $('#Logs').prepend('<div class="new-round">StartNewRound -- Round Number: ' + event.args.roundNumber +
      ' Faucet Index: ' + event.args.faucetIndex +
      ' Faucet Count: ' + event.args.faucetCount +
      ' Block Number: ' + event.args.blockNumber +
      ' Round Count: ' + event.args.roundCount +
      ' Block Hash: ' + event.args.blockHash +
      ' Total Rounds: ' + event.args.totalRounds + '</div>')
      break;
    case  "Lottery":
      $('#Logs').prepend('<div class="lottery-run">Lottery Run: ' + event.args.blockReward +
      ' Block Count: ' + event.args.blockCount +
      ' Pot Size: ' + event.args.pot +
      ' Split Size: ' + event.args.split +
      ' Round Remainder: ' + event.args.roundRemainder +
      ' Block Remainder: ' + event.args.blockRemainder +
      ' Total Reward:' + event.args.totalReward +
      ' Total Tickets:' + event.args.totalTickets +
      ' Faucet Index:' + event.args.faucetIndex +
      ' Faucet Count:' + event.args.faucetCount +
      ' Round Count:' + event.args.roundCount + '</div>')
      break;
    case "CreateWisp":
      $('#Logs').prepend('<div class="create-wisp">Create Wisp - Owner: ' + event.args.owner +
      ' Creator:' + event.args.creator +
      ' Wisp:' + event.args.wispAddr + '</div>')
      break;
    default:
      console.log('unknown event detected')
      console.log(evt);
  }
}


function createWisp() {
  Lottery.deployed().then(function(contract_instance) {
    contract_instance.createWisp('', {gas: 5000000, from: window.web3.eth.accounts[0]})
    .then(function(receipt, i) {
      console.log(receipt)
      console.log(i)
    });
  });
}

window.createWisp = createWisp;

function getSomeLottery() {
  Lottery.deployed().then(function(contract_instance) {
    contract_instance.addToFaucet($('#Accounts').val(), {gas: 500000, from: window.web3.eth.accounts[0]})
    .then(function(receipt) {
      console.log(receipt)
      init();
    });
  });
}

function currentAddress() {

}

function getFaucetCount() {
  Lottery.deployed().then(function(contract_instance) {
    contract_instance.faucetCount().then(function(count) {
      $('#FaucetCount').text(count['c'][0] + ' (faucetCount)');
    });
  });
}
function getFaucetIndex() {
  Lottery.deployed().then(function(contract_instance) {
    contract_instance.faucetIndex().then(function(count) {
      $('#FaucetIndex').text(count['c'][0] + ' (faucetIndex)');
    });
  });
}
function getFaucetQueue(index) {
  Lottery.deployed().then(function(contract_instance) {
    contract_instance.faucetQueue(index).then(function(q) {
      $('#AddressList').prepend('<p>' + index + ': ' + q + ' (faucetQueue)</p>')
    })
  });
}

function getLastBlock() {
  Lottery.deployed().then(function(contract_instance) {
    contract_instance.lastBlock().then(function(n) {
      $('#Statistics').append('<p>The last block reward was ' + n + ' (lastBlock)</p>')
    })
  });
}

function getOwner() {
  Lottery.deployed().then(function(contract_instance) {
    contract_instance.owner().then(function(n) {
      $('#Statistics').append('<p>The contract owner is: ' + n + ' (owner)</p>')
    })
  });
}

function getCreationTime() {
  Lottery.deployed().then(function(contract_instance) {
    contract_instance.creationTime().then(function(n) {
      $('#Statistics').append('<p>The contract creation time is: ' + n + ' (creationTime)</p>')
    })
  });
}

function getCurrentBlock() {
  Lottery.deployed().then(function(contract_instance) {
    contract_instance.currentBlock().then(function(n) {
      $('#Statistics').append('<p>The current block is ' + n + ' (currentBlock)</p>')
    })
  });
}

function getBlockReward() {
  Lottery.deployed().then(function(contract_instance) {
    contract_instance.blockReward().then(function(n) {
      $('#Statistics').append('<p>The current block reward is ' + n + ' (blockReward)</p>')
    })
  });
}

function getBalance() {
  Lottery.deployed().then(function(contract_instance) {
    contract_instance.balanceOf(window.web3.eth.accounts[0]).then(function(n) {
      $('#Statistics').append('<p>Balance0: ' + n + ' (balanceOf)</p>')
    })

    contract_instance.balanceOf(window.web3.eth.accounts[1]).then(function(n) {
      $('#Statistics').append('<p>Balance1: ' + n + ' (balanceOf)</p>')
    })

    contract_instance.balanceOf(window.web3.eth.accounts[2]).then(function(n) {
      $('#Statistics').append('<p>Balance2: ' + n + ' (balanceOf)</p>')
    })

  });
}

function timesMined() {
  Lottery.deployed().then(function(contract_instance) {
    contract_instance.timesMined().then(function(n) {
      $('#Statistics').append('<p>Times Mined: ' + n + ' (timesMined)</p>')
    })
  });
}

function getAddresses() {
  var index;
  var count;
  Lottery.deployed().then(function(contract_instance) {

    contract_instance.faucetIndex().then(function(idx) {
      index = idx['c'][0];

    contract_instance.faucetCount().then(function(c) {
      count = c['c'][0];


      getFaucetQueue(count-1);


      });
    });
  });
}

function asyncLoop(o){
  var i=-1;
  var loop = function(){
      i++;
      if(i===o.length){o.callback(); return;}
      o.functionToLoop(loop, i);
  }
  loop();
}

window.web3.eth.accounts.forEach(function(acct) {
  $('#Accounts').append('<option value="'+acct+'">'+acct+'</option>');
})

$('#FaucetSubmit').on('click', function() {
  getSomeLottery();
  console.log('getting some Lottery')
});
