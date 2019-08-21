import connectToParent from 'penpal/lib/connectToParent';
//import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import Cryptr from 'cryptr';

//Check spawning/owner window is trusted (Headjack)
if(window.parent.location.hostname != "headjack.to"){
	//Trying to hack the user
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


let userPool = new AmazonCognitoIdentity.CognitoUserPool({
	UserPoolId : '...', // Your user pool id here
	ClientId : '...' // Your client id here
});

function login(email, password){
	cognitoUser.getUserAttributes(function(err, result) {
		if (err) {
			alert(err.message || JSON.stringify(err));
			return;
		}
		for (i = 0; i < result.length; i++) {
			console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
			if(result[i].getName()=="privkey"){
				//Decrypt
				let privkey=decrypt(result[i].getValue(), password);
				//Send
				window.successLogin(privkey);
			}
		}
	});
}

function register(email, password){
	var poolData = {
		UserPoolId : '...', // Your user pool id here
		ClientId : '...' // Your client id here
	};
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

	var attributeList = [];

	var dataEmail = {
		Name : 'email',
		Value : 'email@mydomain.com'
	};

	var dataPhoneNumber = {
		Name : 'phone_number',
		Value : '+15555555555'
	};
	var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
	var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);

	attributeList.push(attributeEmail);
	attributeList.push(attributePhoneNumber);

	userPool.signUp('username', 'password', attributeList, null, function(err, result){
		if (err) {
			alert(err.message || JSON.stringify(err));
			return;
		}
		var cognitoUser = result.user;
		console.log('user name is ' + cognitoUser.getUsername());
	});
}

function encrypt(plaintext, key){
	return new Cryptr(key).encrypt(plaintext);
}

function decrypt(ciphertext, key){
	return new Cryptr(key).decrypt(ciphertext);
}

function generateEncryptedKey(password) {
	var array = new Uint32Array(10);
	window.crypto.getRandomValues(array);

	var randText = document.getElementById("myRandText");
	randText.innerHTML = "The random numbers are: "
	for (var i = 0; i < array.length; i++) {
		randText.innerHTML += array[i] + " ";
	}
	return encrypt(randText, password);
}

