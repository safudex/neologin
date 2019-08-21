import connectToParent from 'penpal/lib/connectToParent';
//import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import Cryptr from 'cryptr';

let userPool = new AmazonCognitoIdentity.CognitoUserPool({
	UserPoolId : 'eu-west-1_SN8JpQrzS', // Your user pool id here
	ClientId : '2r79pmi7f4msr8mgbnssgnq2uv' // Your client id here
});

//Check spawning/owner window is trusted (Headjack)
if(window.parent.location.hostname != "headjack.to"){
	//Trying to hack the user
	userPool = null;
	window.close();
}

//Set up communication with owner window
const connection = connectToParent({
	// Methods child is exposing to parent
	methods: {
		getPrivateKey(num1, num2) {
			// Return a promise if the value being returned requires asynchronous processing.
			return new Promise((resolve, reject) => {
				window.successLogin=resolve;
				window.failLogin=reject;
				/*
				setTimeout(() => {
					resolve(num1 / num2);
				}, 1000);
				*/
			});
		}
	}
});


function login(email, password){
	var authenticationData = {
		Username : email, // your username here
		Password : password, // your password here
	};
	var authenticationDetails =
		new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

	var userData = {
		Username : email,
		Pool : userPool
	};

	var cognitoUser =
		new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: function (result) {
			var accessToken = result.getAccessToken().getJwtToken();
			cognitoUser.getUserAttributes(function(err, result) {
				if (err) {
					alert(err.message || JSON.stringify(err));
					return;
				}
				for (i = 0; i < result.length; i++) {
					console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
					if(result[i].getName()=="custom:privkey"){
						//Decrypt
						let privkey=decrypt(result[i].getValue(), password);
						//Send
						window.successLogin(privkey);
					}
				}
			});

		},
		onFailure: function(err) {
			alert(err);
		},
		mfaRequired: function(codeDeliveryDetails) {
			var verificationCode = prompt('Please input verification code' ,'');
			cognitoUser.sendMFACode(verificationCode, this);
		}
	});
}

function register(email, password){
	var attributeList = [];

	var dataEmail = {
		Name : 'email',
		Value : email
	};

	let privkey = encrypt(generateEncryptedKey(), password);

	var dataPrivkey = {
		Name : 'custom:privkey',
		Value : privkey
	};
	
	/*
	var dataPhoneNumber = {
		Name : 'phone_number',
		Value : '+15555555555'
	};
	*/
	var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
	var attributePrivkey = new AmazonCognitoIdentity.CognitoUserAttribute(dataPrivkey);
	//var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);

	attributeList.push(attributeEmail);
	attributeList.push(attributePrivkey);
	//attributeList.push(attributePhoneNumber);

	userPool.signUp(email, password, attributeList, null, function(err, result){
		if (err) {
			alert(err.message || JSON.stringify(err));
			return;
		}
		var cognitoUser = result.user;
		console.log('user name is ' + cognitoUser.getUsername());

		window.successLogin(privkey);
	});
}

function encrypt(plaintext, key){
	return new Cryptr(key).encrypt(plaintext);
}

function decrypt(ciphertext, key){
	return new Cryptr(key).decrypt(ciphertext);
}

function generateEncryptedKey() {
	var array = new Uint32Array(10);
	window.crypto.getRandomValues(array);

	var randText = document.getElementById("myRandText");
	randText.innerHTML = "The random numbers are: "
	for (var i = 0; i < array.length; i++) {
		randText.innerHTML += array[i] + " ";
	}
	return randText;
}

