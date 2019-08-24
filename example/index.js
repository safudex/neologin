import Headjack from 'headjack';

const headjack = new Headjack('MainNet');

headjack.getAccount()
.then((account) => {
  const {
    address,
    label
  } = account;

  console.log('Provider address: ' + address);
  console.log('Provider account label (Optional): ' + label);
})
.catch(({type, description, data}) => {
  switch(type) {
    case 'NO_PROVIDER':
      console.log('No provider available');
      break;
    case 'CONNECTION_DENIED':
      console.log('The user rejected the request');
      break;
  }
});
