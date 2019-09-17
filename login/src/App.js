import React from 'react';
import './App.css';
import SignIn from './SignIn';
import SignUp from './SignUp';
import LostPassword from './LostPassword';
import { server } from './config';

class App extends React.Component {
	constructor(props) {
		super(props);
		if(!server.includes("localhost") && (!window.opener || !window.opener.location || window.opener.location.href !== server+"/widget/")){
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
			};
		}
	}

	handleLogin(privkey, rememberMe){
		window.opener.postMessage({privkey, rememberMe}, server);
		window.close();
	}

	render() {
		if(this.state.loginScreen){
			return <SignIn 
					signUpClick={()=>this.setState({
						registerScreen: true,
						loginScreen: false,
					})} 
					passwordLostClick={()=>this.setState({
						lostPasswordScreen: true,
						loginScreen: false,
					})} 
					handleLogin={this.handleLogin}
				/>;
		}
		if(this.state.lostPasswordScreen){
			return <LostPassword 
					goBackClick={()=>this.setState({
						lostPasswordScreen: false,
						loginScreen: true,
					})} 
					handleLogin={this.handleLogin}
				/>;
		}
		if(this.state.registerScreen){
			return <SignUp 
					signInClick={()=>this.setState({
						registerScreen: false,
						loginScreen: true,
					})} 
					handleLogin={this.handleLogin}
				/>;
		}
	}
}

export default App;
