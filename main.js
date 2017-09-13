document.addEventListener('DOMContentLoaded', () => {
  const krackenBuys = document.querySelector('#KB');
  const krackenSells = document.querySelector('#KS');
  const liquiBuys = document.querySelector('#LB');
  const liquiSells = document.querySelector('#LS');
  const liquiPromise = fetch('https://api.liqui.io/api/3/depth/eth_btc?limit=10', { mode: 'cors' });
  liquiPromise
    .then(data => data.json())
    .then(data => console.log(data))
    .catch((err) => {
      console.log('Whoops');
      console.log(err);
    });
});
