import headjack from './headjack';

document.getElementById("getAccount").addEventListener("click", ()=>{ 
	headjack.getAccount()
		.then((account) => {
			const {
				address,
				label
			} = account;

			alert(address);
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
});

headjack.getProvider().then(console.log);
