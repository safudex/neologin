import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';

import logo from './logoboxtxt.png';

import { forgotPassword, updatePrivkey } from './loginAPI';

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
		backgroundColor: '#2e5aac',
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
			recovered: false
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

	async handleSubmit(event) {
		event.preventDefault();
		if (!this.state.emailCompleted) {
			/*
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
			*/
			forgotPassword(this.state.email).then(cognitoUser => {
				this.setState({
					emailCompleted: true,
					wrongEmail: false
				});
				this.setState({ cognitoUser: cognitoUser })
			})
				.catch(err => {
					this.setState({
						wrongEmail: "Email is not registered"
					});
					console.log(err)
				});
		} else {
			if (this.state.password.length <= 6) {
				alert("Password is too weak");
				return;
			}
			if (this.state.privkey <= 100) {
				alert("Wrong privkey");
				return;
			}
			this.state.cognitoUser.confirmPassword(this.state.code, this.state.password, {
				onSuccess: (result) => {
					this.setState({ codeCompleted: true })
					updatePrivkey(this.state.cognitoUser, this.state.password, this.state.privkey)
				},
				onFailure: (err) => {
					alert(err.message);
					console.log(err)
				}
			});
			/*
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
			*/
		}
	}

	render() {
		let body = null;
		if (!this.state.emailCompleted) {
			body = <div>
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
					error={this.state.wrongEmail ? true : null}
					helperText={this.state.wrongEmail}
					onChange={this.handleInputChange}
				/>
			</div>
		} else {
			body = <div>
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
					error={this.state.wrongCode ? true : null}
					helperText={this.state.wrongCode ? this.state.wrongCode : "Input the code received through email."}
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
					helperText="You can find the code for this field in the file that was downloaded when you registered for NeoLogin. Please make sure that the code you are inputting is effecively the same that you downloaded, as it will become the private key associated with this account."
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
		
		const goBackButton = <button className='buttonContinue buttonBack' onClick={this.state.goBackClick}>
			Go back to sign in
		</button>

		const { classes } = this.props;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<img src={logo} style={{ height: '5em', marginBottom: '5em' }} />
					<Typography component="h1" variant="h5" style={{ color: '#6A737D' }}>
						Reset password
					</Typography>
					{this.state.codeCompleted ?
						<div>
							<Typography component="h2" variant="h5">
								Password recovery succeeded
						</Typography>
							{goBackButton}
						</div> :
						<form className={classes.form} onSubmit={this.handleSubmit}>
							{body}
							<button className='buttonContinue' type="submit" style={{ margin: '0.5rem 0' }}>
								RESET PASSWORD
							</button>
							{goBackButton}
						</form>
					}
				</div>
			</Container>
		);
	}
}

LostPassword.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LostPassword);
