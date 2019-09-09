import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
// https://aws-amplify.github.io/docs/js/authentication

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://material-ui.com/">
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const styles = (theme => ({
	'@global': {
		body: {
			backgroundColor: theme.palette.common.white,
		},
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

class SignIn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wrongEmail: false,
			wrongPassword: false,
			twoFA: false,
			passwordLostClick: props.passwordLostClick,
			signUpClick: props.signUpClick,
			email: '',
			password: '',
			rememberMe: false,
			MFACode: '',
			wrongMFACode: '',
			handleLogin: props.handleLogin,
		};
	
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleMFASubmit = this.handleMFASubmit.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});

		if(name == "email" && this.state.wrongEmail){
			this.setState({
				wrongEmail: false
			});
		}
		if(name == "password" && this.state.wrongPassword){
			this.setState({
				wrongPassword: false
			});
		}
		if(name == "MFACode" && this.state.wrongMFACode){
			this.setState({
				wrongMFACode: false
			});
		}
	}

	async handleMFASubmit(event){
		event.preventDefault();
		try{
			const loggedUser = await Auth.confirmSignIn(
				this.state.user,   // Return object from Auth.signIn()
				this.state.MFACode,   // Confirmation code  
				this.state.twoFA // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
			);
			this.state.handleLogin(loggedUser);
		} catch (err) {
			if(err.code=="CodeMismatchException"){
				this.setState({wrongMFACode:true});
			} else {
				window.alert("Session expired, refresh the window to start again");
			}
			console.log(err);
		}
	}

	async handleSubmit(event){
		event.preventDefault();
		try {
			const user = await Auth.signIn(this.state.email, this.state.password);
			if (user.challengeName === 'SMS_MFA' ||
				user.challengeName === 'SOFTWARE_TOKEN_MFA') {
				// You need to get the code from the UI inputs
				// and then trigger the following function with a button click
				// If MFA is enabled, sign-in should be confirmed with the confirmation code
				this.setState({
					twoFA: user.challengeName,
					user: user,
				});
			} else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
				const {requiredAttributes} = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
				// You need to get the new password and required attributes from the UI inputs
				// and then trigger the following function with a button click
				// For example, the email and phone_number are required attributes
				/*
				const {username, email, phone_number} = getInfoFromUserInput();
				const loggedUser = await Auth.completeNewPassword(
					user,              // the Cognito User Object
					newPassword,       // the new password
					// OPTIONAL, the required attributes
					{
						email,
						phone_number,
					}
				);
				*/
			} else if (user.challengeName === 'MFA_SETUP') {
				// This happens when the MFA method is TOTP
				// The user needs to setup the TOTP before using it
				// More info please check the Enabling MFA part
				Auth.setupTOTP(user);
			} else {
				// The user directly signs in
				console.log(user);
			}
		} catch (err) {
			if (err.code === 'UserNotConfirmedException') {
				// The error happens if the user didn't finish the confirmation step when signing up
				// In this case you need to resend the code and confirm the user
				// About how to resend the code and confirm the user, please check the signUp part
			} else if (err.code === 'PasswordResetRequiredException') {
				// The error happens when the password is reset in the Cognito console
				// In this case you need to call forgotPassword to reset the password
				// Please check the Forgot Password part.
			} else if (err.code === 'NotAuthorizedException') {
				// The error happens when the incorrect password is provided
				this.setState({wrongPassword: true});
			} else if (err.code === 'UserNotFoundException') {
				// The error happens when the supplied username/email does not exist in the Cognito user pool
				this.setState({wrongEmail: true});
			} else {
				console.log(err);
			}
		}
	}

	render(){
		const { classes } = this.props;

		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<form className={classes.form} onSubmit={this.state.twoFA?this.handleMFASubmit:this.handleSubmit}>
						{this.state.twoFA?
							([
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									key="MFACode"
									id="MFACode"
									label={this.state.twoFA=="SMS_MFA"?"SMS Code":"TOTP Code"}
									name="MFACode"
									autoFocus
									value={this.state.MFACode}
									error={this.state.wrongMFACode? true : null}
									helperText={this.state.wrongMFACode? "Wrong code" : "Input the "+(this.state.twoFA=="SMS_MFA"?"SMS code that we sent you":"the time-based code from your authenticator App")}
									onChange={this.handleInputChange}
								/>
							]):([
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									key="email"
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									autoFocus
									value={this.state.email}
									error={this.state.wrongEmail? true : null}
									helperText={this.state.wrongEmail? "No user with this email" : null}
									onChange={this.handleInputChange}
								/>,
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									name="password"
									key="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
									value={this.state.password}
									error={this.state.wrongPassword? true : null}
									helperText={this.state.wrongPassword? "Wrong password" : null}
									onChange={this.handleInputChange}
								/>,
								<FormControlLabel
									control={<Checkbox value="remember" color="primary" name="rememberMe" checked={this.state.rememberMe} onChange={this.handleInputChange} />}
									label="Remember me"
								/>
							])}
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								Sign In
							</Button>
							{this.state.twoFA? null : (
								<Grid container>
									<Grid item xs>
										<Link href="#" variant="body2" onClick={this.state.passwordLostClick}>
											Forgot password?
										</Link>
									</Grid>
									<Grid item>
										<Link href="#" variant="body2" onClick={this.state.signUpClick}>
											{"Don't have an account? Sign Up"}
										</Link>
									</Grid>
								</Grid>
							)}
						</form>
					</div>
				</Container>
		);
	}
}


SignIn.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);
