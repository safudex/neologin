//import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
import Cryptr from 'cryptr';
import Neon from "@cityofzion/neon-js";

let userPool = new AmazonCognitoIdentity.CognitoUserPool({
	UserPoolId : 'eu-west-1_SN8JpQrzS', // Your user pool id here
	ClientId : '2r79pmi7f4msr8mgbnssgnq2uv' // Your client id here
});

function verifyAttribute(attribute, cognitoUser, resolve){
	cognitoUser.getAttributeVerificationCode(attribute, {
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
}

function login(email, password, get2FAcode){ 
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

		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (result) {
				var accessToken = result.getAccessToken().getJwtToken();
				cognitoUser.getUserAttributes(function(err, result) {
					if (err) {
						alert(err.message || JSON.stringify(err));
						return;
					}
					getPrivKey(cognitoUser, password).then((privkey)=>resolve({
						privkey,
						email,
						password,
						cognitoUser
					}));
				});

			},
			onFailure: function(err) {
				alert(err.message || JSON.stringify(err));
			},
			mfaSetup: function(challengeName, challengeParameters) {
				cognitoUser.associateSoftwareToken(this);
			},
			selectMFAType : function(challengeName, challengeParameters) {
				var mfaType = prompt('Please select the MFA method.', ''); // valid values for mfaType is "SMS_MFA", "SOFTWARE_TOKEN_MFA"
				cognitoUser.sendMFASelectionAnswer(mfaType, this);
			},
			totpRequired : function(secretCode) {
				get2FAcode('Please input the TOTP code').then(challengeAnswer => cognitoUser.sendMFACode(challengeAnswer, this, 'SOFTWARE_TOKEN_MFA'));
				/*
				var challengeAnswer = await get2FAcode('Please input the TOTP code.');
				cognitoUser.sendMFACode(challengeAnswer, this, 'SOFTWARE_TOKEN_MFA');
				*/
			},
			mfaRequired: function(codeDeliveryDetails) {
				get2FAcode('Please input verification code').then(verificationCode => cognitoUser.sendMFACode(verificationCode, this));
				/*
				var verificationCode = await get2FAcode('Please input verification code');
				cognitoUser.sendMFACode(verificationCode, this);
				*/
			}
		});
	});
}

function enableTOTP(cognitoUser, email, drawQR){
	return new Promise((resolve, reject) => {
		cognitoUser.associateSoftwareToken({
			onSuccess: resolve,
			onFailure: function(err) {
				alert(err.message || JSON.stringify(err));
				reject();
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
								resolve();
							});
						},
						onFailure: function(err) {
							alert(err.message || JSON.stringify(err));
							reject();
						},
					});
				});
			},
		});
	});
}
function verifyEmail(cognitoUser){
	return new Promise((resolve, reject) => {
		verifyAttribute('email', cognitoUser, resolve);
	});
}
function verifyPhone(cognitoUser){
	return new Promise((resolve, reject) => {
		verifyAttribute("phone_number", cognitoUser, resolve);
	});
}
function addPhone(phone, cognitoUser){
	return new Promise((resolve, reject) => {
		var attributeList = [];
		var dataPhoneNumber = {
			Name : 'phone_number',
			Value : phone //Style: '+15555555555'
		};
		var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);
		attributeList.push(attributePhoneNumber);
		cognitoUser.updateAttributes(attributeList, function(err, result) {
			if (err) {
				alert(err.message || JSON.stringify(err));
				return;
			}
			console.log('call result: ' + result);
			resolve();
		});
	});
}

function register(email, password, twofa){
	return new Promise((resolve, reject) => {
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

		var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
		var attributePrivkey = new AmazonCognitoIdentity.CognitoUserAttribute(dataPrivkey);

		attributeList.push(attributeEmail);
		attributeList.push(attributePrivkey);

		userPool.signUp(email, password, attributeList, null, function(err, result){
			if (err) {
				alert(err.message || JSON.stringify(err));
				return;
			}
			var cognitoUser = result.user;
			console.log('user name is ' + cognitoUser.getUsername());
			resolve({privkey});
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

export { register, login, addPhone, enableTOTP, verifyEmail, verifyPhone }; 
