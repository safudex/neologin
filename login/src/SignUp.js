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
import { register, downloadPrivKey } from './loginAPI';
import logo from './logoboxtxt.png';

import { makeStyles } from '@material-ui/core/styles';

import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';

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
			showMore: false,
			syncPrivKey: true,
			importPrivKey: false,
			importedPrivKey: null
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
		if (name === 'importPrivKey' && !value)
			this.setState({ importedPrivKey: null })
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

		register(this.state.email, this.state.password1, this.state.newsletter ? "true" : "false", this.state.syncPrivKey, this.state.importedPrivKey)
			.then(privkey => {
				/*
				*/
				downloadPrivKey("This file contains your private key, which you will need in case you ever lose or forget your NeoLogin password.\nThis file must be kept in a safe place and not shared with anyone else, as doing so will put your funds and wallet at risk of being stolen.\nPrivate Key: " + privkey)
					.then(() => this.state.handleLogin(privkey, !this.state.syncPrivKey))
					.catch(() => {
						this.setState({
							privkey: privkey,
							registered: true,
						})
					});
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
								Please try to download your private key, you can also display it and then copy-paste it somewhere safe. Clicking on the Continue button will take you back to the dApp.
							</Typography>
							<a download="private-key.txt" href={'data:text/plain;base64,' + window.btoa(craftDownloadMessage(this.state.privkey))}>
								<Button
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
								>
									Download
								</Button>
							</a>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								onClick={() => window.alert(this.state.privkey)}
							>
								Display Key
							</Button>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={() => this.state.handleLogin(this.state.privkey, false)}
							>
								Continue
							</Button>
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
										<div className={classes.root}>
											<p style={{ margin: '0', cursor: 'pointer', color: '#78818c' }} onClick={() => this.setState({ showMore: !this.state.showMore })}>Advanced settings</p>
											{/* <FormControlLabel
												control={<Switch checked={checked} onChange={handleChange} />}
												label="Show"
											/> */}
											<Collapse in={this.state.showMore}>

												<FormControlLabel
													control={<Switch checked={this.state.syncPrivKey} color="primary" name="syncPrivKey" onChange={this.handleInputChange} />}
													label="Sync my encrypted key across devices"
												/>
												<p style={{ color: 'darkred', marginTop: '0' }}>
													Warning: If you disable this option you assume all responsability for your keys, as they will not be recoverable once deleted from the website's storage.
												</p>
												<FormControlLabel
													control={<Switch checked={this.state.importPrivKey} color="primary" name="importPrivKey" onChange={this.handleInputChange} />}
													label="Import my private key"
												/>
												<Collapse in={this.state.importPrivKey}>
													<div style={{ marginTop: '0.5rem' }}>
														<TextField
															variant="outlined"
															fullWidth
															name="importedPrivKey"
															label="Private key"
															type="password"
															id="importedPrivKey"
															value={this.state.password}
															error={this.state.wrongPassword2 ? true : null}
															helperText={this.state.wrongPassword2}
															onChange={this.handleInputChange}
															novalidate
														/>
													</div>
												</Collapse>
											</Collapse>
										</div>
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
								<Typography component="p">
									Upon registration, you will download a file which contains your private key. You will need it in case you ever lose or forget your NeoLogin password, so save it well!
								</Typography>
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

function craftDownloadMessage(privkey) {
	return "This file contains your private key, which you will need in case you ever lose or forget your NeoLogin password.\nThis file must be kept in a safe place and not shared with anyone else, as doing so will put your funds and wallet at risk of being stolen.\nPrivate Key: " + privkey;
}

SignUp.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUp);
