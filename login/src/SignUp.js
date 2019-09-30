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
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { register } from './loginAPI';
import logo from './logoboxtxt.png';

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
		marginTop: theme.spacing(3),
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

class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signInClick: props.signInClick,
			wrongEmail: false,
			wrongPassword1: false,
			wrongPassword2: false,
			email: '',
			password1: "",
			password2: "",
			newsletter: false,
			privacyPolicy: false,
			handleLogin: props.handleLogin,
			registered: false,
			privkey: null,
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
		}, () => this.validate());
	}

	async validate() {
		if (validateEmail(this.state.email) || !this.state.email) {
			this.setState({
				wrongEmail: false
			});
		} else {
			this.setState({
				wrongEmail: "Your email address seems to be wrong"
			});
		}

		if (this.state.password1 !== this.state.password2 && this.state.password2) {
			this.setState({
				wrongPassword2: "Passwords do not match"
			});
		} else {
			this.setState({
				wrongPassword2: false
			});
		}

		return import("zxcvbn").then((zxcvbn) => {
			zxcvbn = zxcvbn.default;
			let pwdSecurity = zxcvbn(this.state.password1);
			if (pwdSecurity.score < 3 && this.state.password1) {
				this.setState({
					wrongPassword1: "Your password is too weak.\n" + pwdSecurity.feedback.suggestions.join('\n')
				});
			} else {
				this.setState({
					wrongPassword1: false
				});
			}

			return (this.state.password1 === this.state.password2) && validateEmail(this.state.email) && (pwdSecurity.score >= 3) && this.state.privacyPolicy;
		})
	}

	async handleSubmit(event) {
		event.preventDefault();
		if (!(await this.validate())) {
			return;
		}

		register(this.state.email, this.state.password1, this.state.newsletter ? "true" : "false")
			.then(privkey => {
				this.setState({
					privkey: privkey,
					registered: true,
				});
				/*
				downloadFile("This file contains your private key, which you will need in case you ever lose or forget your NeoLogin password.\nThis file must be kept in a safe place and not shared with anyone else, as doing so will put your funds and wallet at risk of being stolen.\nPrivate Key: " + privkey);
				this.state.handleLogin(privkey, false);
				*/
			})
			.catch(err => {
				this.setState({
					wrongEmail: "Email already exists"
				});
				console.log(err);
			});
	}

	render() {
		const { classes } = this.props;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					{/* <Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar> */}
					<img src={logo} style={{ height: '5em', marginBottom: '2em' }} />
					<Typography component="h1" variant="h5" style={{ color: '#6A737D' }}>
						{this.state.registered ? "Welcome!" : "Sign up"}
					</Typography>
					{this.state.registered ? (
						<div style={{ marginTop: '2em' }}>
							<Typography component="p">
								Please download your private key, after that you will be returned to the dApp webpage. 
							</Typography>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={async () => {
									await downloadPrivkey(this.state.privkey);
									this.state.handleLogin(this.state.privkey, false);
								}}
							>
								Download
							</Button>
							{/*
							<Button
								fullWidth
								variant="contained"
								color="primary"
								onClick={() => window.alert(this.state.privkey)}
							>
								Display Key
							</Button>
							<Typography component="p">
								Clicking on continue will take you to the dApp
							</Typography>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={() => this.state.handleLogin(this.state.privkey, false)}
							>
								Continue
							</Button>
							*/}
						</div>
					) : (
						<form className={classes.form} onSubmit={this.handleSubmit}>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											id="email"
											label="Email Address"
											name="email"
											autoComplete="email"
											value={this.state.email}
											error={this.state.wrongEmail ? true : null}
											helperText={this.state.wrongEmail}
											onChange={this.handleInputChange}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											variant="outlined"
											required
											fullWidth
											name="password1"
											label="Password"
											type="password"
											id="password1"
											autoComplete="current-password"
											value={this.state.password1}
											error={this.state.wrongPassword1 ? true : null}
											helperText={this.state.wrongPassword1}
											onChange={this.handleInputChange}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											variant="outlined"
											required
											fullWidth
											name="password2"
											label="Confirm Password"
											type="password"
											id="password2"
											autoComplete="current-password"
											value={this.state.password}
											error={this.state.wrongPassword2 ? true : null}
											helperText={this.state.wrongPassword2}
											onChange={this.handleInputChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormControlLabel
											control={<Checkbox value="newsletter" color="primary" name="newsletter" checked={this.state.newsletter} onChange={this.handleInputChange} />}
											label="I want to receive inspiration, marketing promotions and updates via email."
										/>
									</Grid>
									<Grid item xs={12}>
										<FormControlLabel
											control={<Checkbox value="privacyPolicy" color="primary" name="privacyPolicy" checked={this.state.privacyPolicy} onChange={this.handleInputChange} />}
											label={<span>I agree with <Link href="/privacy-policy.pdf">NeoLogin's privacy policy</Link> and <Link href="/NeoLogin-EndUserLicenseAgreement.pdf">license agreement</Link>.</span>}
										/>
										{this.state.privacyPolicy ? null :
											<FormHelperText error={true}>You must agree to the privacy policy and license agreement</FormHelperText>
										}
									</Grid>
								</Grid>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
								>
									Sign Up
								</Button>
								<Grid container justify="flex-end">
									<Grid item>
										<Link href="#" variant="body2" onClick={this.state.signInClick}>
											Already have an account? Sign in
									</Link>
									</Grid>
								</Grid>
							</form>
						)}
				</div>
			</Container>
		);
	}
}

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function downloadFile(data) {
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
		.catch(() => alert('Could not be downloaded, please copy paste the following string into a local file: ' + data));
}

function downloadPrivkey(privkey) {
	downloadFile("This file contains your private key, which you will need in case you ever lose or forget your NeoLogin password.\nThis file must be kept in a safe place and not shared with anyone else, as doing so will put your funds and wallet at risk of being stolen.\nPrivate Key: " + privkey);
}

SignUp.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUp);
