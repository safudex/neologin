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

class LostPassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			goBackClick: props.goBackClick,
			wrongEmail: false,
			wrongCode: false,
			wrongPassword: false,
			email: "",
			password: "",
			code: "",
			privkey: "",
			handleLogin: props.handleLogin,
			emailCompleted: false,
			codeCompleted: false,
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	async handleSubmit(event){
		event.preventDefault();
		if(!this.state.emailCompleted){
			Auth.forgotPassword(this.state.email)
				.then(data => {
					this.setState({
						emailCompleted: true,
						wrongEmail: false
					});
					console.log(data)
				})
				.catch(err => {
					this.setState({
						wrongEmail: "Email is not registered"
					});
					console.log(err)
				});
		} else {
			if(this.state.password.length<=6){
				alert("Password is too weak");
				return;
			}
			if(this.state.password.privkey<=100){
				alert("Wrong privkey");
				return;
			}
			Auth.forgotPasswordSubmit(this.state.email, this.state.code, this.state.password)
				.then(async data => {
					this.setState({
						codeCompleted: true
					});
					console.log(data)

					try{
						const user = await Auth.signIn(this.state.email, this.state.password);
						if (user.challengeName === 'SMS_MFA' ||
							user.challengeName === 'SOFTWARE_TOKEN_MFA') {
							const code = prompt("Enter "+user.challengeName+" code:");
							const loggedUser = await Auth.confirmSignIn(
								user,   // Return object from Auth.signIn()
								code,   // Confirmation code
								user.challengeName // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
							);
							updatePrivkey(loggedUser, this.state.privkey, this.state.password);
						} else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
						} else if (user.challengeName === 'MFA_SETUP') {
						} else {
							updatePrivkey(user, this.state.privkey, this.state.password);
						}
					} catch (err) {
						alert("An error has ocurred, please contact support@neologin.io and provide them with the following report:\n"+JSON.stringify(err))
					}
				})
				.catch(err => {
					this.setState({
						wrongCode: "Wrong code"
					});
					console.log(err)
				});
		}
	}

	render(){
		let body = null;
		if(!this.state.emailCompleted){
			body=<div>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					id="email"
					label="Email"
					name="email"
					value={this.state.email}
					autoFocus
					error={this.state.wrongEmail? true : null}
					helperText={this.state.wrongEmail}
					onChange={this.handleInputChange}
				/>
			</div>
		} else {
			body=<div>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					id="code"
					label="Code"
					name="code"
					autoFocus
					value={this.state.code}
					error={this.state.wrongCode? true : null}
					helperText={this.state.wrongCode? this.state.wrongCode : "Input the code received through email."}
					onChange={this.handleInputChange}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					id="privkey"
					label="Private Key"
					name="privkey"
					autoFocus
					value={this.state.privkey}
					helperText= "You can find the code for this field in the file that was downloaded when you registered for NeoLogin. Please make sure that the code you are inputting is effecively the same that you downloaded, as it will become the private key associated with this account."
					onChange={this.handleInputChange}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="password"
					label="New Password"
					type="password"
					id="password"
					autoComplete="current-password"
					value={this.state.password}
					onChange={this.handleInputChange}
				/>
					</div>
		}

		const goBackButton=<Button
							fullWidth
							variant="contained"
							color="secondary"
							onClick={this.state.goBackClick}
						>
							Go Back to Sign In
						</Button>

		const { classes } = this.props;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Lost Password
					</Typography>
					{ this.state.codeCompleted?
					<div>
						<Typography component="h2" variant="h4">
							Password recovery succeeded
						</Typography>
						{goBackButton}
					</div> :
					<form className={classes.form} onSubmit={this.handleSubmit}>
						{body}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Reset password
						</Button>
						{goBackButton}
					</form>
					}
				</div>
			</Container>
		);
	}
}

async function updatePrivkey(user, privkey, password){
	const encryptedPrivkey = await encrypt(privkey, password);
	let result = await Auth.updateUserAttributes(user, {
		"custom:privkey": encryptedPrivkey,
	});
}

// TODO: Eliminate replication of this function with SignUp.js
function encrypt(plaintext, key){
	return import("cryptr")
		.then(( Cryptr ) => {
			Cryptr = Cryptr.default;
			return new Cryptr(key).encrypt(plaintext);
		});
}

LostPassword.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LostPassword);
