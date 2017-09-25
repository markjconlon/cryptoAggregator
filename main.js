document.addEventListener('DOMContentLoaded', () => {
  const quadrigaBuys = document.querySelector('#QB');
  const quadrigaSells = document.querySelector('#QS');
  const liquiBuys = document.querySelector('#LB');
  const liquiSells = document.querySelector('#LS');
  const poloniexBuys = document.querySelector('#PB');
  const poloniexSells = document.querySelector('#PS');
  const trade = document.querySelector('#trade');
  const amount = document.querySelector('#amount');
  const target = document.querySelector('#target');
  const current = document.querySelector('#current');
  const liquiPromise = fetch('https://api.liqui.io/api/3/depth/eth_btc?limit=10');
  const quadrigaPromise = fetch('https://api.quadrigacx.com/public/orders?book=eth_btc&group=1');
  const poloniexPromise = fetch('https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=10');
  var liquiTen = {}
  var quadrigaTen = {}
  var poloniexTen = {}

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
        isProfit(liquiTen, quadrigaTen, poloniexTen);
      }, 1000)
    })
    .catch((err) => {
      console.log(err);
    });

  poloniexPromise
  .then(response => response.json())
  .then((response) => {
    poloniexTen["buys"] = response.bids;
    poloniexTen["sells"] = response.asks;
    const poloniexBids = (response.bids).map(info => `${info[0]}BTC | QTY = ${info[1]}`);
    const poloniexAsks = (response.asks).map(info => `${info[0]}BTC | QTY = ${info[1]}`);
    toResultsList(poloniexBids, poloniexBuys);
    toResultsList(poloniexAsks, poloniexSells);
  })
  .catch((err) => {
    console.log(err);
  });

  function isProfit(exchangeOne, exchangeTwo, exchangeThree) {
    // Flip the Sells and Buys as we have to Buy the sell listing and sell to the buyer's listing
    const exOneSell = {"trade": exchangeOne.buys[0], "exchangeName": "Liqui", "appendId": "LB"};
    const exOneBuy = {"trade": exchangeOne.sells[0], "exchangeName": "Liqui", "appendId": "LS"};
    const exTwoSell = {"trade": exchangeTwo.buys[0], "exchangeName": "QuadrigaCX", "appendId": "QB"};
    const exTwoBuy = {"trade": exchangeTwo.sells[0], "exchangeName": "QuadrigaCX", "appendId": "QS"};
    const exThreeSell = {"trade": exchangeThree.buys[0], "exchangeName": "Poloniex", "appendId": "PB"};
    const exThreeBuy = {"trade": exchangeThree.sells[0], "exchangeName": "Poloniex", "appendId": "PS"};
    // sorts the array placing the highest sell at position [0]
    let maxSell = [exOneSell, exTwoSell, exThreeSell].sort((a, b) => (a.trade[0] < b.trade[0]) ? 1 : -1 );
    // sorts the array placing the lowest buy at position [0]
    let minBuy = [exOneBuy, exTwoBuy, exThreeBuy].sort((a, b) => (a.trade[0] > b.trade[0]) ? 1 : -1 );;

    if (delta(maxSell[0].trade[0], minBuy[0].trade[0])) {
      trade.appendChild(document.createTextNode("Sell " + maxSell[0].exchangeName +  " @ " + maxSell[0].trade[0] + " Buy " + minBuy[0].exchangeName + " @ " + minBuy[0].trade[0]));
      current.appendChild(document.createTextNode(`${(parseFloat(maxSell[0].trade[0]) - parseFloat(minBuy[0].trade[0])) / parseFloat(maxSell[0].trade[0]) }`));
      target.appendChild(document.createTextNode("0.0061"));
      if (maxSell[0].trade[1] < minBuy[0].trade[1]) {
        amount.appendChild(document.createTextNode(maxSell[0].trade[1]));
      } else {
        amount.appendChild(document.createTextNode(minBuy[0].trade[1]));
      }
      document.querySelector('ul#'+ maxSell[0].appendId + ' li:nth-child(2)').classList.add('highlight');
      document.querySelector('ul#' + minBuy[0].appendId + ' li:nth-child(2)').classList.add('highlight');
    } else {
      trade.appendChild(document.createTextNode("No Profitable Trades"));
      current.appendChild(document.createTextNode(`${(parseFloat(maxSell[0].trade[0]) - parseFloat(minBuy[0].trade[0])) / parseFloat(maxSell[0].trade[0]) }`));
      target.appendChild(document.createTextNode("0.0061"));
    }
  }

  function delta(tradeOne, tradeTwo) {
    //0.0061 is .1% profit or greater depending on trades as you lose 0.2 to liqui & 0.26 to quadriga & 0.25 taker for poloniex
    const diff = 0.0061;
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
