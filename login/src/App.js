import React from 'react';
import './App.css';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Settings from './Settings';
import LostPassword from './LostPassword';
import { server } from './config';

class App extends React.Component {
	constructor(props) {
		super(props);
		if (!server.includes("localhost") && (!window.opener || !window.opener.location || (window.opener.location.href !== server + "/widget/" && window.opener.location.href !== server + "/wallet/"))) {
			//Trying to hack the user
			window.close();
			this.state = {
				loginScreen: false,
				twoFAScreen: false,
				registerScreen: false,
				lostPasswordScreen: false,
			};
		} else {
			this.state = {
				loginScreen: true,
				twoFAScreen: false,
				registerScreen: false,
				lostPasswordScreen: false,
				openSettings: false,
				preferredMFA: '',
			};
		}

		this.handleLogin = this.handleLogin.bind(this)
	}

	handleLogin(privkey, rememberMe, cognitoUser, preferredMFA) {
		var url_string = window.location.href
		var url = new URL(url_string);
		var settings = url.searchParams.get("settings");
		if (settings && settings.includes("true")) {
			this.setState({ settings: true, cognitoUser: cognitoUser, privkey: privkey, preferredMFA: preferredMFA })
		}
		else {
			window.opener.postMessage({ privkey, rememberMe }, server);
			window.close();
		}
	}

	render() {
		if (this.state.settings) {
			return <Settings
				signUpClick={() => this.setState({
					registerScreen: true,
					loginScreen: false,
				})}
				passwordLostClick={() => this.setState({
					lostPasswordScreen: true,
					loginScreen: false,
				})}
				handleLogin={this.handleLogin}
				cognitoUser={this.state.cognitoUser}
				privkey={this.state.privkey}
				preferredMFA={this.state.preferredMFA}
			/>;
		}
		if (this.state.loginScreen) {
			return <SignIn
				signUpClick={() => this.setState({
					registerScreen: true,
					loginScreen: false,
				})}
				passwordLostClick={() => this.setState({
					lostPasswordScreen: true,
					loginScreen: false,
				})}
				handleLogin={this.handleLogin}
			/>;
		}
		if (this.state.lostPasswordScreen) {
			return <LostPassword
				goBackClick={() => this.setState({
					lostPasswordScreen: false,
					loginScreen: true,
				})}
				cognitoUser={this.state.cognitoUser}
				handleLogin={this.handleLogin}
			/>;
		}
		if (this.state.registerScreen) {
			return <SignUp
				signInClick={() => this.setState({
					registerScreen: false,
					loginScreen: true,
				})}
				handleLogin={this.handleLogin}
			/>;
		}
	}
}

export default App;
