document.addEventListener('DOMContentLoaded', () => {
  const quadrigaBuys = document.querySelector('#KB');
  const quadrigaSells = document.querySelector('#KS');
  const liquiBuys = document.querySelector('#LB');
  const liquiSells = document.querySelector('#LS');
  const liquiPromise = fetch('https://api.liqui.io/api/3/depth/eth_btc?limit=10');
  const quadrigaPromise = fetch('https://api.quadrigacx.com/public/orders?book=eth_btc&group=1');

  liquiPromise
    .then(data => data.json())
    .then((data) => {
      const bids = (data.eth_btc.bids).map(info => `${info[0]}BTC | QTY = ${info[1]}`);
      for (let i = 0; i < bids.length; i++) {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(bids[i]));
        liquiBuys.appendChild(li);
      }
      const asks = (data.eth_btc.asks).map(info => `${info[0]}BTC | QTY = ${info[1]}`);
      for (let i = 0; i < asks.length; i++) {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(asks[i]));
        liquiSells.appendChild(li);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // switched to QuadrigaCX
  quadrigaPromise
    .then(response => response.json())
    .then((response) => {
      const sells = response.sell.splice(0,10).map(sell => `${sell.rate}BTC | QTY = ${sell.amount}`);
      const buys = response.buy.splice(0,10).map(buy => `${buy.rate}BTC | QTY = ${buy.amount}`);
      sells.forEach(sell => {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(sell));
        quadrigaSells.appendChild(li);
      })
      buys.forEach(sell => {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(sell));
        quadrigaBuys.appendChild(li);
      })
    })
    .catch((err) => {
      console.log(err);
    });
});
