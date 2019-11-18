import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { disableTOTP, getUserData, updateUserData, downloadPrivKey, verifyEmail, enableTOTP } from './loginAPI';
import { withTranslation } from 'react-i18next';
import VerifyEmail from './Views/VerifyEmail'
import TOTPQR from './Views/TOTPQR'

const styles = (theme => ({
	'@global': {
		body: {
			backgroundColor: theme.palette.common.white,
		},
	},
	paper: {
		marginTop: '64px',
		marginBottom: '40px',
		display: 'flex',
		flexDirection: 'column'
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
	subtittle: {
		color: 'gray',
		marginBottom: '0.4rem'
	},
	settingItem: {
		marginLeft: '1rem',
		marginBottom: '0.4rem'
	}
}));


class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newsletterChecked: false,
			verifyEmailView: false,
			verifyTOTPCodeView: false,
			emailIsVerified: true,
			email: '',
			preferredMFA: props.preferredMFA,
			wrongMFACode: ''
		};
	}

	handleNewsletterChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});

		updateUserData(this.props.cognitoUser, 'custom:newsletter', value ? 'true' : 'false')
	}

	componentDidMount() {//todo save value emailisverified
		getUserData(this.props.cognitoUser).then(data => this.setState({
			newsletterChecked: data['custom:newsletter'] == 'true',
			emailIsVerified: data.email_verified == 'true',
			emial: data.email
		}))
	}

	verifyCodeEmail = (verificationCode) => {
		this.props.cognitoUser.verifyAttribute('email', verificationCode, {
			onSuccess: (result) => {
				this.setState({ verifyEmailView: false })
			},
			onFailure: (err) => {
				console.log(err)
				if (err.code === "CodeMismatchException" || err.code === "InvalidParameterException") {
					this.setState({ wrongEmailCode: true });
				} else {
					window.alert(err.message || JSON.stringify(err));
				}
				console.log('Code incorrect!!')
			}
		});
	}

	verifyCodeTOTP = (challengeAnswer) => {
		this.props.cognitoUser.verifySoftwareToken(challengeAnswer, 'My TOTP device', {
			onSuccess: (result) => {
				const totpMfaSettings = {
					PreferredMfa: true,
					Enabled: true
				};
				this.props.cognitoUser.setUserMfaPreference(null, totpMfaSettings, (err, result) => {
					if (err) {
						alert(err.message || JSON.stringify(err));
						return;
					}
					this.setState({ verifyTOTPCodeView: false, preferredMFA: 'SOFTWARE_TOKEN_MFA' })
				});
			},
			onFailure: (err) => {
				if (err.code === "EnableSoftwareTokenMFAException" || err.code === "InvalidParameterException") {
					this.setState({ wrongMFACode: true });
				} else {
					window.alert(this.props.t("common:alert_session_expired"));
				}
				console.log(err);
			},
		});
	}

	render() {
		const { classes, t } = this.props;

		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div style={{
					marginTop: '64px',
					marginBottom: '40px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: (!this.state.verifyEmailView && !this.state.verifyTOTPCodeView ? 'flex-start' : 'center')
				}}>
					{
						this.state.verifyEmailView ? <VerifyEmail wrongEmailCode={this.state.wrongEmailCode} verifyCode={this.verifyCodeEmail} navigateBack={() => this.setState({ verifyEmailView: false })} /> :
							this.state.verifyTOTPCodeView ? <TOTPQR email={this.state.email} wrongMFACode={this.state.wrongMFACode} navigateBack={() => this.setState({ verifyTOTPCodeView: false })} verifyCode={this.verifyCodeTOTP} secretTOTP={this.state.secretTOTP} /> :
								<>
									<span style={{
										fontSize: '2rem', marginBottom: '2rem', marginLeft: 'auto',
										marginRight: 'auto'
									}}>{t("tittle")}</span>
									<h4 className={classes.subtittle} style={{ marginBottom: '0rem' }}>{t("section_susbcribe")}</h4>
									<FormControlLabel className={classes.settingItem} style={{ marginLeft: '0.4rem' }}
										control={
											<Switch checked={this.state.newsletterChecked} onChange={this.handleNewsletterChange}
												color="primary" name="newsletterChecked" />
										}
										label={t("label_newsletter")}
									/>
									<h4 className={classes.subtittle}>{t("section_privket")}</h4>
									<Button className={classes.settingItem} color='primary' variant="contained" onClick={() => downloadPrivKey(this.props.privkey)}>{t("common:button_download")}</Button>
									<h4 className={classes.subtittle}>{t("section_security")}</h4>
									<Button className={classes.settingItem} color='primary' variant="contained" disabled={this.state.emailIsVerified} onClick={() => {
										verifyEmail(this.props.cognitoUser).then(() => this.setState({ verifyEmailView: true, wrongEmailCode: false }))
									}}>{t("button_verifyEmail")}</Button>
									<Button className={classes.settingItem} color='primary' variant="contained" onClick={
										() => this.state.preferredMFA === 'SOFTWARE_TOKEN_MFA' ?
											disableTOTP(this.props.cognitoUser).then(() => this.setState({ preferredMFA: '' }))
											:
											enableTOTP(this.props.cognitoUser, this.state.email, (secret, email) =>
												this.setState({ verifyTOTPCodeView: true, secretTOTP: secret, email: email, wrongMFACode: false }))

									}>{this.state.preferredMFA === 'SOFTWARE_TOKEN_MFA' ? t("button_enableTOTP") : t("button_disableTOTP")}</Button>
									<Button className={classes.settingItem} style={{ background: 'darkred' }} color='primary' variant="contained" onClick={() => {
										window.localStorage.removeItem('privkey')
										window.close()
									}} >{t("button_logout")}</Button>
								</>
					}
				</div>
			</Container >
		);
	}
}

Settings.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withTranslation("settings")(withStyles(styles)(Settings))
