import zxcvbn from 'zxcvbn';
import { server } from '../config';
import QRCode from 'qrcode';
import { register, login } from './loginAPI';

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

function getCode(message){
	return new Promise((resolve, reject) => {
		var verificationCode = prompt('Please input verification code' ,'');
		resolve(verificationCode);
	});
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

document.getElementById("login").addEventListener("click", ()=>login(getVal("uname-login"), getVal("psw-login"), getCode).then((res) => sendPrivkeyAndClose(res.privkey)));
document.getElementById("register").addEventListener("click", ()=>register(getVal("uname-register"), getVal("psw-register")).then((res) => sendPrivkeyAndClose(res.privkey)));
/*
document.getElementById("add-totp").addEventListener("click", ()=>login(getVal("uname-login"), getVal("psw-login"), true).then(()=>alert('Setup completed')));
document.getElementById("verify-email").addEventListener("click", ()=>login(getVal("uname-login"), getVal("psw-login"), false, true).then(()=>alert('Verified')));
document.getElementById("add-phone").addEventListener("click", ()=>login(getVal("uname-login"), getVal("psw-login"), false, false, false, getVal("phone-login")).then(()=>alert('Added')));
document.getElementById("verify-phone").addEventListener("click", ()=>login(getVal("uname-login"), getVal("psw-login"), false, false, true).then(()=>alert('Verified')));
*/
