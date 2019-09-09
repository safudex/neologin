import React from 'react';
import './App.css';
import SignIn from './SignIn';
import SignUp from './SignUp';
import LostPassword from './LostPassword';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loginScreen: true,
			twoFAScreen: false,
			registerScreen: false,
			lostPasswordScreen: false,
		};
	}
	handleLogin(user){

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
			return <LostPassword goBackClick={()=>this.setState({
				lostPasswordScreen: false,
				loginScreen: true,
			})} />;
		}
		if(this.state.registerScreen){
			return <SignUp signInClick={()=>this.setState({
				registerScreen: false,
				loginScreen: true,
			})} />;
		}
	}
}

export default App;
