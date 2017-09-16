document.addEventListener('DOMContentLoaded', () => {
  const quadrigaBuys = document.querySelector('#QB');
  const quadrigaSells = document.querySelector('#QS');
  const liquiBuys = document.querySelector('#LB');
  const liquiSells = document.querySelector('#LS');
  const trade = document.querySelector('#trade');
  const amount = document.querySelector('#amount');
  const liquiPromise = fetch('https://api.liqui.io/api/3/depth/eth_btc?limit=10');
  const quadrigaPromise = fetch('https://api.quadrigacx.com/public/orders?book=eth_btc&group=1');
  var liquiTen = {}
  var quadrigaTen = {}

  liquiPromise
    .then(data => data.json())
    .then((data) => {
      liquiTen["buys"] = data.eth_btc.bids;
      liquiTen["sells"] = data.eth_btc.asks;
      const bids = (data.eth_btc.bids).map(info => `${info[0]}BTC | QTY = ${info[1]}`);
      const asks = (data.eth_btc.asks).map(info => `${info[0]}BTC | QTY = ${info[1]}`);
      toResultsList(bids, liquiBuys);
      toResultsList(asks, liquiSells);
    })
    .catch((err) => {
      console.log(err);
    });
  // switched to QuadrigaCX
  quadrigaPromise
    .then(response => response.json())
    .then((response) => {
      quadrigaTen["buys"] = response.buy.splice(0,10).map(buy => [buy.rate, buy.amount])
      quadrigaTen["sells"] = response.sell.splice(0,10).map(sell => [sell.rate, sell.amount])
      const buys = quadrigaTen["buys"].map(buy => `${buy[0]}BTC | QTY = ${buy[1]}`);
      const sells = quadrigaTen["sells"].map(sell => `${sell[0]}BTC | QTY = ${sell[1]}`);
      toResultsList(sells, quadrigaSells);
      toResultsList(buys, quadrigaBuys);
      setTimeout(function(){
        isProfit(liquiTen, quadrigaTen);
      }, 500)
    })
    .catch((err) => {
      console.log(err);
    });

    function isProfit(exchangeOne, exchangeTwo) {
      // Flip the Sells and Buys as we have to Buy the sell listing and sell to the buyer's listing
      const exOneSell = exchangeOne.buys[0];
      const exOneBuy = exchangeOne.sells[0];
      const exTwoSell = exchangeTwo.buys[0];
      const exTwoBuy = exchangeTwo.sells[0];
      if (delta(exTwoSell[0], exOneBuy[0])) {
        trade.appendChild(document.createTextNode("Sell Quadriga at " + exTwoSell[0] + " Buy Liqui at " + exOneBuy[0]));
        if (exTwoSell[1] > exOneBuy[1]) {
          amount.appendChild(document.createTextNode(exOneBuy[1]));
        } else {
          amount.appendChild(document.createTextNode(exTwoSell[1]));
        }
        document.querySelector('ul#LS li:nth-child(2)').classList.add('highlight');
        document.querySelector('ul#QB li:nth-child(2)').classList.add('highlight');
      } else if (delta(exOneSell[0], exTwoBuy[0])) {
        trade.appendChild(document.createTextNode("Sell Liqui at " + exOneSell[0] + " Buy Quadriga at " + exTwoBuy[0]));
        if (exOneSell[1] > exTwoBuy[1]) {
          amount.appendChild(document.createTextNode(exTwoBuy[1]));
        } else {
          amount.appendChild(document.createTextNode(exOneSell[1]));
        }
        document.querySelector('ul#QS li:nth-child(2)').classList.add('highlight');
        document.querySelector('ul#LB li:nth-child(2)').classList.add('highlight');
      } else {
        trade.appendChild(document.createTextNode("No Profitable Trades"));
      }
    }

    function delta(tradeOne, tradeTwo) {
      //0.0146 is 1% profit as you lose 0.2 to liqui and 0.26 to quadriga
      const diff = 0.0146;
      let tradeOneNum = parseFloat(tradeOne);
      let tradeTwoNum = parseFloat(tradeTwo);
      const average = (tradeOneNum + tradeTwoNum) / 2;
      if ((tradeOneNum - tradeTwoNum) / average >= diff) {
        return true;
      } else {
        return false;
      }
    }

    function toResultsList(arr, list){
      arr.forEach(item => {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(item));
        list.appendChild(li);
      })
    }
});
