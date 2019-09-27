import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { disableTOTP, getUserData, updateUserData, downloadPrivKey, verifyEmail, enableTOTP } from './loginAPI';
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
				console.log('code verified!! ' + result);
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
					console.log('call result ' + result);
					this.setState({ verifyTOTPCodeView: false, preferredMFA: 'SOFTWARE_TOKEN_MFA' })
				});
			},
			onFailure: (err) => {
				if (err.code === "EnableSoftwareTokenMFAException" || err.code === "InvalidParameterException") {
					this.setState({ wrongMFACode: true });
				} else {
					window.alert("Session expired, refresh the window to start again" + err.code);
				}
				console.log(err);
			},
		});
	}

	render() {
		const { classes } = this.props;

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
									}}>Manage account</span>
									<h4 className={classes.subtittle} style={{ marginBottom: '0rem' }}>Subscribe/unsubscribe</h4>
									<FormControlLabel className={classes.settingItem} style={{ marginLeft: '0.4rem' }}
										control={
											<Switch checked={this.state.newsletterChecked} onChange={this.handleNewsletterChange}
												color="primary" name="newsletterChecked" />
										}
										label="Newsletter"
									/>
									<h4 className={classes.subtittle}>Security</h4>
									<Button className={classes.settingItem} color='primary' variant="contained" disabled={this.state.emailIsVerified} onClick={() => {
										verifyEmail(this.props.cognitoUser).then(() => this.setState({ verifyEmailView: true, wrongEmailCode: false }))
									}}>Verify email</Button>
									<Button className={classes.settingItem} color='primary' variant="contained" onClick={
										() => this.state.preferredMFA === 'SOFTWARE_TOKEN_MFA' ?
											disableTOTP(this.props.cognitoUser).then(() => this.setState({ preferredMFA: '' }))
											:
											enableTOTP(this.props.cognitoUser, this.state.email, (secret, email) =>
												this.setState({ verifyTOTPCodeView: true, secretTOTP: secret, email: email, wrongMFACode: false }))

									}>{this.state.preferredMFA === 'SOFTWARE_TOKEN_MFA' ? 'Disable' : 'Enable'} TOTP</Button>
									<h4 className={classes.subtittle}>Private key</h4>
									<Button className={classes.settingItem} color='primary' variant="contained" onClick={() => downloadPrivKey(this.props.privkey)}>DOWNLOAD</Button>
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

export default withStyles(styles)(Settings);
