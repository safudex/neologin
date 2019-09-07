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

function getCode(message){
	return new Promise((resolve, reject) => {
		var verificationCode = prompt('Please input verification code' ,'');
		resolve(verificationCode);
	});
}

function getVal(id){
	return document.getElementById(id).value; 
}

document.getElementById("login").addEventListener("click", ()=>login(getVal("uname-login"), getVal("psw-login"), getCode).then((res) => sendPrivkeyAndClose(res.privkey)));
document.getElementById("register").addEventListener("click", ()=>register(getVal("uname-register"), getVal("psw-register")).then((res) => sendPrivkeyAndClose(res.privkey)));

document.getElementById("psw-register").addEventListener("input", 
	()=> {
		let pwd = getVal("psw-register");
		let pwdSecurity = zxcvbn(pwd);
		document.getElementById("psw-tips").innerText = `Viable: ${pwdSecurity.score >= 3}\nWarnings: ${pwdSecurity.feedback.warning}\nSuggestions: ${JSON.stringify(pwdSecurity.feedback.suggestions)}`;
	}
);
