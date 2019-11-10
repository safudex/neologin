import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { login } from './loginAPI';
import logo from './logoboxtxt.png';
import logo2 from './logo2.png';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/EmailOutlined';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

const styles = (theme => ({
	'@global': {
		body: {
			backgroundColor: theme.palette.common.white,
		},
	},
	paper: {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(5),
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

const useStyles = makeStyles(theme => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center'
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
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

		if (name === "email" && this.state.wrongEmail) {
			this.setState({
				wrongEmail: false
			});
		}
		if (name === "password" && this.state.wrongPassword) {
			this.setState({
				wrongPassword: false
			});
		}
		if (name === "MFACode" && this.state.wrongMFACode) {
			this.setState({
				wrongMFACode: false
			});
		}
	}

	async handleMFASubmit(event) {
		event.preventDefault();
		try {
			const user = await this.state.twoFASolve(this.state.MFACode);
			this.state.handleLogin(user.privkey, this.state.rememberMe, user.cognitoUser, this.state.twoFA);
		} catch (err) {
			if (err.code === "CodeMismatchException") {
				this.setState({ wrongMFACode: true });
			} else {
				window.alert("Session expired, refresh the window to start again");
			}
			console.log(err);
		}
	}

	async handleSubmit(event) {
		event.preventDefault();
		try {
			const user = await login(this.state.email, this.state.password);
			if (user.challengeName === 'SMS_MFA' ||
				user.challengeName === 'SOFTWARE_TOKEN_MFA') {
				// You need to get the code from the UI inputs
				// and then trigger the following function with a button click
				// If MFA is enabled, sign-in should be confirmed with the confirmation code
				this.setState({
					twoFA: user.challengeName,
					twoFASolve: user.challengeSolve,
				});
			} else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
				/*
				const {requiredAttributes} = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
				// You need to get the new password and required attributes from the UI inputs
				// and then trigger the following function with a button click
				// For example, the email and phone_number are required attributes
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
			} else {
				// The user directly signs in
				this.state.handleLogin(user.privkey, this.state.rememberMe, user.cognitoUser);
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
				this.setState({ wrongPassword: true });
			} else if (err.code === 'UserNotFoundException') {
				// The error happens when the supplied username/email does not exist in the Cognito user pool
				this.setState({ wrongEmail: true });
			} else {
				console.log(err);
			}
		}
	}

	render() {
		const { classes } = this.props;

		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<img src={logo} style={{ height: '5em', marginBottom: '5em' }} />
					{/* <span style={{ fontSize: '2rem', marginBottom: '2rem' }}>
						NEO<span style={{ color: '' }}>LOGIN</span>
					</span> */}
					<Typography component="h1" variant="h5" style={{ color: '#6A737D' }}>
						Sign in
					</Typography>
					<form className={classes.form} onSubmit={this.state.twoFA ? this.handleMFASubmit : this.handleSubmit}>
						{this.state.twoFA ?
							([
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									key="MFACode"
									id="MFACode"
									label={this.state.twoFA === "SMS_MFA" ? "SMS Code" : "TOTP Code"}
									name="MFACode"
									autoFocus
									value={this.state.MFACode}
									error={this.state.wrongMFACode ? true : null}
									helperText={this.state.wrongMFACode ? "Wrong code" : "Input the " + (this.state.twoFA === "SMS_MFA" ? "SMS code that we sent you" : "the time-based code from your authenticator App")}
									onChange={this.handleInputChange}
								/>
							]) : ([
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
									error={this.state.wrongEmail ? true : null}
									helperText={this.state.wrongEmail ? "No user with this email" : null}
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
									error={this.state.wrongPassword ? true : null}
									helperText={this.state.wrongPassword ? "Wrong password" : null}
									onChange={this.handleInputChange}
								/>,
								<FormControlLabel
									control={<Checkbox value="remember" color="primary" name="rememberMe" checked={this.state.rememberMe} onChange={this.handleInputChange} />}
									label="Remember me"
								/>
							])}
						<button className='buttonContinue' type="submit" style={{ margin: '1rem 0' }}>
							Sign In
          				</button>
						{this.state.twoFA ? null : (
							<Grid container direction='colummn'>
								<Grid item style={{ width: '100%' }}>
									<Grid container>
										<Grid item xs>
											<Link href="#" variant="body2" onClick={this.state.passwordLostClick}>
												<span style={{ color: '#2e5aac' }}>Forgot password?</span>
											</Link>
										</Grid>
										<Grid item>
											<Link href="#" variant="body2" onClick={this.state.signUpClick}>
												<span style={{ color: '#2e5aac' }}>Don't have an account? Sign Up</span>
											</Link>
										</Grid>
									</Grid>
								</Grid>
								<Grid item style={{ width: '100%', marginTop: '0.5rem' }}>
									<Grid container justify="flex-end" >
										<Grid item>
											<Link target="_blank" rel="noopener" variant="body2" href="https://github.com/safudex/neologin/issues">
												<span style={{ color: '#2e5aac' }}>Experimenting issues?</span>
											</Link>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						)}
					</form>
				</div>
			</Container >
		);
	}
}

SignIn.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);
