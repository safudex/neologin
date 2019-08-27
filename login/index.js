//import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
import Cryptr from 'cryptr';
import zxcvbn from 'zxcvbn';
import { server } from '../config';
import Neon from "@cityofzion/neon-js";
import QRCode from 'qrcode';

let userPool = new AmazonCognitoIdentity.CognitoUserPool({
	UserPoolId : 'eu-west-1_SN8JpQrzS', // Your user pool id here
	ClientId : '2r79pmi7f4msr8mgbnssgnq2uv' // Your client id here
});

//Check spawning/owner window is trusted (Headjack)
if(!window.opener || !window.opener.location || window.opener.location.href != server+"/widget/index.html"){
	//Trying to hack the user
	userPool = null;
	window.close();
}

function sendPrivkeyAndClose(privkey){
	window.opener.postMessage({privkey: privkey}, server);
	window.close();
}

function login(email, password, enableTOTP=false, verifyEmail=false){ //Only one of the extra options (the ones that default to false) should be set to true at a time
	return new Promise((resolve, reject) => {
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
				if(enableTOTP){
					cognitoUser.associateSoftwareToken(this);
					return;
				}
				if(verifyEmail){
					cognitoUser.getAttributeVerificationCode('email', {
						onSuccess: function (result) {
							console.log('call result: ' + result);
							resolve();
						},
						onFailure: function(err) {
							alert(err.message || JSON.stringify(err));
						},
						inputVerificationCode: function() {
							var verificationCode = prompt('Please input verification code: ' ,'');
							cognitoUser.verifyAttribute('email', verificationCode, this);
						}
					});
					return;
				}
				var accessToken = result.getAccessToken().getJwtToken();
				cognitoUser.getUserAttributes(function(err, result) {
					if (err) {
						alert(err.message || JSON.stringify(err));
						return;
					}
					getPrivKey(cognitoUser, password).then(resolve);
				});

			},
			onFailure: function(err) {
				alert(err.message || JSON.stringify(err));
			},
			mfaSetup: function(challengeName, challengeParameters) {
				cognitoUser.associateSoftwareToken(this);
			},
			associateSecretCode : function(secretCode) {
				console.log(secretCode);
				drawQR(secretCode, email).then(()=>{
					var challengeAnswer = prompt('Please input the TOTP code.' ,'');
					cognitoUser.verifySoftwareToken(challengeAnswer, 'My TOTP device', {
						onSuccess: function (result) {
							const totpMfaSettings = {
								PreferredMfa : true,
								Enabled : true
							};
							cognitoUser.setUserMfaPreference(null, totpMfaSettings, function(err, result) {
								if (err) {
									alert(err.message || JSON.stringify(err));
									return;
								}
								console.log('call result ' + result);
								getPrivKey(cognitoUser, password).then(resolve);
							});
						},
						onFailure: function(err) {
							alert(err.message || JSON.stringify(err));
						},
					});
				});
			},
			selectMFAType : function(challengeName, challengeParameters) {
				var mfaType = prompt('Please select the MFA method.', ''); // valid values for mfaType is "SMS_MFA", "SOFTWARE_TOKEN_MFA"
				cognitoUser.sendMFASelectionAnswer(mfaType, this);
			},
			totpRequired : function(secretCode) {
				var challengeAnswer = prompt('Please input the TOTP code.' ,'');
				cognitoUser.sendMFACode(challengeAnswer, this, 'SOFTWARE_TOKEN_MFA');
			},
			mfaRequired: function(codeDeliveryDetails) {
				var verificationCode = prompt('Please input verification code' ,'');
				cognitoUser.sendMFACode(verificationCode, this);
			}
		});
	});
}

function register(email, password, twofa){
	var attributeList = [];

	var dataEmail = {
		Name : 'email',
		Value : email
	};

	const privkey = generatePrivateKey();

	const encryptedPrivkey = encrypt(privkey, password);

	var dataPrivkey = {
		Name : 'custom:privkey',
		Value : encryptedPrivkey
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
	});
}

function drawQR(secret, email){
	return new Promise((resolve, reject) => {
		let canvas = document.getElementById('canvas')
		let code = "otpauth://totp/Headjack:"+email+"?secret="+secret+"&issuer=Headjack";

		QRCode.toCanvas(canvas, code, function (error) {
			if (error){
				console.error(error);
				reject(error);
			} else {
				setTimeout(resolve, 100);
			}
		});
	});
}

function getPrivKey(cognitoUser, password){
	return new Promise((resolve, reject) => {
		cognitoUser.getUserAttributes(function(err, result) {
			if (err) {
				alert(err.message || JSON.stringify(err));
				return;
			}
			for (let i = 0; i < result.length; i++) {
				console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
				if(result[i].getName()=="custom:privkey"){
					//Decrypt
					let privkey=decrypt(result[i].getValue(), password);
					//Send
					resolve(privkey);
				}
			}
		});
	});
}

function encrypt(plaintext, key){
	return new Cryptr(key).encrypt(plaintext);
}

function decrypt(ciphertext, key){
	return new Cryptr(key).decrypt(ciphertext);
}

function generatePrivateKey() {
	return Neon.create.privateKey();
}

// See https://github.com/dropbox/zxcvbn for docs
// TODO: This must be imporved to use zxcvbn suggestion & warning system
function checkPasswordStrength(password){ //Returns true or false depending on if the password is strong enough
	return zxcvbn(password).score >= 3; // A score superior to 3 means that the password offers "moderate protection from offline slow-hash scenario. (guesses < 10^10)"
}

// EVERYTHING ONWARDS HAS TO BE REMODELED TO IMPROVE THE USER INTERFACE

function getVal(id){
	return document.getElementById(id).value; 
}

document.getElementById("login").addEventListener("click", ()=>login(getVal("uname-login"), getVal("psw-login")).then(sendPrivkeyAndClose));
document.getElementById("verify-email").addEventListener("click", ()=>login(getVal("uname-login"), getVal("psw-login"), false, true).then(()=>alert('Verified')));
document.getElementById("add-totp").addEventListener("click", ()=>login(getVal("uname-login"), getVal("psw-login"), true, false).then(()=>alert('Setup completed')));
document.getElementById("register").addEventListener("click", ()=>register(getVal("uname-register"), getVal("psw-register"), document.getElementById("2fa").checked));
