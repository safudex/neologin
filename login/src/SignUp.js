import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { register, downloadPrivKey } from './loginAPI';
import logo from './logoboxtxt.png';
import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';
import { withTranslation } from 'react-i18next';

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
				wrongEmail: this.props.t("wrongEmail")
			});
		}

		if (this.state.password1 !== this.state.password2 && this.state.password2) {
			this.setState({
				wrongPassword2: this.props.t("wrongPassword2")
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
					wrongPassword1: this.props.t("wrongPassword1", { suggestion: pwdSecurity.feedback.suggestions.join('\n') })
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
		if (!this.state.privacyPolicy || this.state.syncPrivKey && !(await this.validate())) {
			return;
		}

		register(this.state.email, this.state.password1, this.state.newsletter ? "true" : "false", this.state.syncPrivKey, this.state.importedPrivKey)
			.then(privkey => {
				/*
				*/
				downloadPrivKey(this.props.t("common:downloadedPKFileTxt", { privkey: privkey }))
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
					wrongEmail: this.props.t("registerWrongEmail")
				});
				console.log(err);
			});
	}

	render() {
		const { classes, t } = this.props;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<img src={logo} style={{ height: '5em', marginBottom: '2em' }} />
					<Typography component="h1" variant="h5" style={{ color: '#6A737D' }}>
						{this.state.registered ? t("tittle_welcome") : t("tittle_signup")}
					</Typography>
					{this.state.registered ? (
						<div style={{ marginTop: '2em' }}>
							<Typography component="p">
								{t('instructionsPrivKey')}
							</Typography>
							<a download="private-key.txt" href={'data:text/plain;base64,' + window.btoa(t("common:downloadedPKFileTxt", { privKey: this.state.privkey }))}>
								<Button
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
								>
									{t("common:button_download")}
								</Button>
							</a>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								onClick={() => window.alert(this.state.privkey)}
							>
								{t("button_displaykey")}
							</Button>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={() => this.state.handleLogin(this.state.privkey, false)}
							>
								{t("button_continue")}
							</Button>
						</div>
					) : (
							<form className={classes.form} onSubmit={this.handleSubmit}>
								<Grid container spacing={2}>
									{
									this.state.syncPrivKey ?
									<><Grid item xs={12}>
										<TextField
											variant="outlined"
											required={this.state.syncPrivKey}
											fullWidth
											id="email"
											label={t("label_email")}
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
											required={this.state.syncPrivKey}
											fullWidth
											name="password1"
											label={t("label_password")}
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
											required={this.state.syncPrivKey}
											fullWidth
											name="password2"
											label={t("label_confirmEmail")}
											type="password"
											id="password2"
											autoComplete="current-password"
											value={this.state.password}
											error={this.state.wrongPassword2 ? true : null}
											helperText={this.state.wrongPassword2}
											onChange={this.handleInputChange}
										/>
									</Grid></>
									:null
									}
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
													label={t("switch_sync")}
												/>
												<p style={{ color: 'darkred', marginTop: '0' }}>
													{t("warning_sync")}
												</p>
												<FormControlLabel
													control={<Switch checked={this.state.importPrivKey} color="primary" name="importPrivKey" onChange={this.handleInputChange} />}
													label={t("switch_import")}
												/>
												<Collapse in={this.state.importPrivKey}>
													<div style={{ marginTop: '0.5rem' }}>
														<TextField
															variant="outlined"
															fullWidth
															name="importedPrivKey"
															label={t("label_privkey")}
															type="password"
															id="importedPrivKey"
															value={this.state.password}
															error={this.state.wrongPassword2 ? true : null}
															helperText={this.state.wrongPassword2}
															onChange={this.handleInputChange}
															noValidate
														/>
													</div>
												</Collapse>
											</Collapse>
										</div>
									</Grid>
									<Grid item xs={12}>
										<FormControlLabel
											control={<Checkbox value="newsletter" color="primary" name="newsletter" checked={this.state.newsletter} onChange={this.handleInputChange} />}
											label={t("checkbox_newsletter")}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormControlLabel
											control={<Checkbox value="privacyPolicy" color="primary" name="privacyPolicy" checked={this.state.privacyPolicy} onChange={this.handleInputChange} />}
											label={<span>{t("checkbox_privacy_0_5")}<Link href="/privacy-policy.pdf">{t("checkbox_privacy_1_5")}</Link>{t("checkbox_privacy_2_5")}<Link href="/NeoLogin-EndUserLicenseAgreement.pdf">{t("checkbox_privacy_3_5")}</Link>.</span>}
										/>
										{this.state.privacyPolicy ? null :
											<FormHelperText error={true}>{t("helper_privacy")}</FormHelperText>
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
									{t("button_singUp")}
								</Button>
								<Typography component="p">
									{t("info_registration")}
								</Typography>
								<Grid container justify="flex-end">
									<Grid item>
										<Link href="#" variant="body2" onClick={this.state.signInClick}>
											{t("link_signIn")}
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

export default withTranslation("signUp_form")(withStyles(styles)(SignUp))
