import awsconfig from './aws-exports';
//import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

let userPool = new AmazonCognitoIdentity.CognitoUserPool({
	UserPoolId: awsconfig["aws_user_pools_id"], // Your user pool id here
	ClientId: awsconfig["aws_user_pools_web_client_id"] // Your client id here
});

function verifyAttribute(attribute, cognitoUser, resolve) {
	cognitoUser.getAttributeVerificationCode(attribute, {
		onSuccess: function (result) {
			resolve();
		},
		onFailure: function (err) {
			alert(err.message || JSON.stringify(err));
		}/* ,
		inputVerificationCode:  function () {
			var verificationCode = prompt('Please input verification code: ', '');
			cognitoUser.verifyAttribute('email', verificationCode, this);
		} */
	});
}

function login(email, password) {
	return new Promise((resolve, reject) => {
		var authenticationData = {
			Username: email, // your username here
			Password: password, // your password here
		};
		var authenticationDetails =
			new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

		var userData = {
			Username: email,
			Pool: userPool
		};

		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (result) {
				//var accessToken = result.getAccessToken().getJwtToken();
				getPrivKey(cognitoUser, password).then((privkey) => resolve({
					privkey,
					email,
					password,
					cognitoUser,
					challengeName: null
				}));
			},
			onFailure: function (err) {
				reject(err);
			},
			mfaSetup: function (challengeName, challengeParameters) {
				//Should never happen
				cognitoUser.associateSoftwareToken(this);
			},
			selectMFAType: function (challengeName, challengeParameters) {
				var mfaType = prompt('Please select the MFA method.', ''); // valid values for mfaType is "SMS_MFA", "SOFTWARE_TOKEN_MFA"
				cognitoUser.sendMFASelectionAnswer(mfaType, this);
			},
			totpRequired: function (secretCode) {
				resolve({
					challengeName: 'SOFTWARE_TOKEN_MFA',
					challengeSolve: (challengeAnswer) => {
						return new Promise((resolve, reject) => {
							cognitoUser.sendMFACode(
								challengeAnswer,
								{
									onSuccess: function (result) {
										getPrivKey(cognitoUser, password).then((privkey) => resolve({
											privkey,
											email,
											password,
											cognitoUser,
											challengeName: null
										}));
									},
									onFailure: function (err) {
										reject(err);
									},
								},
								'SOFTWARE_TOKEN_MFA')
						});
					}
				});
				/*
				var challengeAnswer = await get2FAcode('Please input the TOTP code.');
				cognitoUser.sendMFACode(challengeAnswer, this, 'SOFTWARE_TOKEN_MFA');
				*/
			},
			mfaRequired: function (codeDeliveryDetails) {
				resolve({
					challengeName: 'SMS_MFA',
					challengeSolve: (challengeAnswer) => {
						return new Promise((resolve, reject) => {
							cognitoUser.sendMFACode(
								challengeAnswer,
								{
									onSuccess: function (result) {
										getPrivKey(cognitoUser, password).then((privkey) => resolve({
											privkey,
											email,
											password,
											cognitoUser,
											challengeName: null
										}));
									},
									onFailure: function (err) {
										reject(err);
									},
								})
						});
					}
				});
				/*
				var verificationCode = await get2FAcode('Please input verification code');
				cognitoUser.sendMFACode(verificationCode, this);
				*/
			}
		});
	});
}

function resolveUser(cognitoUser, email, password, resolve, reject) {
}

function enableTOTP(cognitoUser, email, openQRView) {
	return new Promise((resolve, reject) => {
		cognitoUser.associateSoftwareToken({
			onSuccess: resolve,
			onFailure: function (err) {
				alert(err.message || JSON.stringify(err));
				reject();
			},
			mfaSetup: function (challengeName, challengeParameters) {
				cognitoUser.associateSoftwareToken(this);
			},
			associateSecretCode: function (secretCode) {
				openQRView(secretCode, email)
				resolve()
				//var challengeAnswer = prompt('Please input the TOTP code.', '');
				/* cognitoUser.verifySoftwareToken(challengeAnswer, 'My TOTP device', {
					onSuccess: function (result) {
						const totpMfaSettings = {
							PreferredMfa: true,
							Enabled: true
						};
						cognitoUser.setUserMfaPreference(null, totpMfaSettings, function (err, result) {
							if (err) {
								alert(err.message || JSON.stringify(err));
								return;
							}
							console.log('call result ' + result);
							resolve();
						});
					},
					onFailure: function (err) {
						alert(err.message || JSON.stringify(err));
						reject();
					},
				}); */
			},
		});
	});
}

function disableTOTP(cognitoUser) {
	return new Promise((resolve, reject) => {
		const totpMfaSettings = {
			PreferredMfa: false,
			Enabled: false,
		};
		cognitoUser.setUserMfaPreference(null, totpMfaSettings, function (err, result) {
			if (err) {
				reject(err)
				alert(err.message || JSON.stringify(err));
			}
			resolve(result)
		});
	})
}

function verifyEmail(cognitoUser) {
	return new Promise((resolve, reject) => {
		verifyAttribute('email', cognitoUser, resolve);
	});
}
function verifyPhone(cognitoUser) {
	return new Promise((resolve, reject) => {
		verifyAttribute("phone_number", cognitoUser, resolve);
	});
}
function addPhone(phone, cognitoUser) {
	return new Promise((resolve, reject) => {
		var attributeList = [];
		var dataPhoneNumber = {
			Name: 'phone_number',
			Value: phone //Style: '+15555555555'
		};
		var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);
		attributeList.push(attributePhoneNumber);
		cognitoUser.updateAttributes(attributeList, function (err, result) {
			if (err) {
				alert(err.message || JSON.stringify(err));
				return;
			}
			resolve();
		});
	});
}

function register(email, password, newsletter) {
	return new Promise(async (resolve, reject) => {
		var attributeList = [];

		var dataEmail = {
			Name: 'email',
			Value: email
		};

		const privkey = await generatePrivateKey();
		const encryptedPrivkey = await encrypt(privkey, password);

		var dataPrivkey = {
			Name: 'custom:privkey',
			Value: encryptedPrivkey
		};

		var dataNewsletter = {
			Name: "custom:newsletter",
			Value: newsletter
		};

		var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
		var attributePrivkey = new AmazonCognitoIdentity.CognitoUserAttribute(dataPrivkey);
		var attributeNewsletter = new AmazonCognitoIdentity.CognitoUserAttribute(dataNewsletter);

		attributeList.push(attributeEmail);
		attributeList.push(attributePrivkey);
		attributeList.push(attributeNewsletter);

		userPool.signUp(email, password, attributeList, null, function (err, result) {
			if (err) {
				reject(err);
				return;
			}
			var cognitoUser = result.user;
			resolve(privkey);
		});
	});
}

function getPrivKey(cognitoUser, password) {
	return new Promise((resolve, reject) => {
		cognitoUser.getUserAttributes(function (err, result) {
			if (err) {
				reject(err);
				return;
			}
			for (let i = 0; i < result.length; i++) {
				if (result[i].getName() == "custom:privkey") {
					//Decrypt
					let privkey = decrypt(result[i].getValue(), password);
					//Send
					resolve(privkey);
				}
			}
		});
	});
}

function forgotPassword(email) {
	return new Promise((resolve, reject) => {
		let userData = {
			Username: email,
			Pool: userPool,
		}
		let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

		cognitoUser.forgotPassword({
			onSuccess: function (result) {},
			onFailure: function (err) {
				alert(err.message);
				console.log(err);
			},
			inputVerificationCode() {
				resolve(cognitoUser)
				/* cognitoUser.confirmPassword(verificationCode, newPassword, this); */
			}
		})
	});
}

function decrypt(ciphertext, key) {
	return import("cryptr")
		.then((Cryptr) => {
			Cryptr = Cryptr.default;
			return new Cryptr(key).decrypt(ciphertext);
		});
}

function encrypt(plaintext, key) {
	return import("cryptr")
		.then((Cryptr) => {
			Cryptr = Cryptr.default;
			return new Cryptr(key).encrypt(plaintext);
		});
}

function generatePrivateKey() {
	return import("@cityofzion/neon-js")
		.then((Neon) => {
			Neon = Neon.default;
			return Neon.create.privateKey();
		});
}

function getUserData(cognitoUser) {
	return new Promise((resolve, reject) => {
		cognitoUser.getUserAttributes(function (err, result) {
			if (err) {
				reject(err);
				return;
			}
			let data = {}
			for (let i = 0; i < result.length; i++) {
				data[result[i].getName()] = result[i].getValue()
			}
			resolve(data)
		});
	});
}

function updateUserData(cognitoUser, name, value) {
	return new Promise((resolve, reject) => {
		var attributeList = [];
		var data = {
			Name: name,
			Value: value
		};
		var attribute2Update = new AmazonCognitoIdentity.CognitoUserAttribute(data);
		attributeList.push(attribute2Update);
		cognitoUser.updateAttributes(attributeList, function (err, result) {
			if (err) {
				alert(err.message || JSON.stringify(err));
				return;
			}
			resolve(result);
		});
	});
}

async function updatePrivkey(cognitoUser, password, privkey) {
	const encryptedPrivkey = await encrypt(privkey, password);
	updateUserData(cognitoUser, "custom:privkey", encryptedPrivkey);
}

function downloadPrivKey(data) {
	return fetch('data:text/plain;base64,' + window.btoa(data))
		.then(resp => resp.blob())
		.then(blob => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			// the filename you want
			a.download = 'private-key.txt';
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		})
		.catch(() => alert('Could not be downloaded, please copy paste the following string: ' + data));
}

// Preload stuff
window.fetch("https://cognito-idp.eu-west-1.amazonaws.com/");
import("cryptr");
import("zxcvbn");
import("@cityofzion/neon-js");

export { register, login, addPhone, enableTOTP, disableTOTP, verifyEmail, verifyPhone, getUserData, updateUserData, downloadPrivKey, forgotPassword, updatePrivkey }; 
