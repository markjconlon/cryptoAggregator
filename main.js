document.addEventListener('DOMContentLoaded', () => {
  const krackenBuys = document.querySelector('#KB');
  const krackenSells = document.querySelector('#KS');
  const liquiBuys = document.querySelector('#LB');
  const liquiSells = document.querySelector('#LS');
  const liquiPromise = fetch('https://api.liqui.io/api/3/depth/eth_btc?limit=10', { mode: 'cors' });
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
      console.log('Whoops');
      console.log(err);
    });
});
