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
		}, ()=>this.validate());
	}

	async validate(){
		if(validateEmail(this.state.email) || !this.state.email){
			this.setState({
				wrongEmail: false 
			});
		} else {
			this.setState({
				wrongEmail: "Your email address seems to be wrong" 
			});
		}

		if(this.state.password1 !== this.state.password2 && this.state.password2){
			this.setState({
				wrongPassword2: "Passwords do not match"
			});
		} else {
			this.setState({
				wrongPassword2: false
			});
		}

		return import("zxcvbn").then((zxcvbn)=>{
			zxcvbn = zxcvbn.default;
			let pwdSecurity = zxcvbn(this.state.password1);
			if (pwdSecurity.score < 3 && this.state.password1){
				this.setState({
					wrongPassword1: "Your password is too weak.\n"+pwdSecurity.feedback.suggestions.join('\n')
				});
			} else {
				this.setState({
					wrongPassword1: false
				});
			}

			return (this.state.password1 === this.state.password2) && validateEmail(this.state.email) && (pwdSecurity.score >= 3) && this.state.privacyPolicy;
		})
	}

	async handleSubmit(event){
		event.preventDefault();
		if(!(await this.validate())){
			return;
		}

		const privkey = await generatePrivateKey();
		const encryptedPrivkey = await encrypt(privkey, this.state.password1);
		Auth.signUp({
			username: this.state.email,
			password: this.state.password1,
			attributes: {
				email: this.state.email,
				"custom:privkey": encryptedPrivkey,
				"custom:newsletter": this.state.newsletter?"true":"false",
			},
			validationData: []  //optional
		})
			.then(data => {
				/*
				this.setState({
					privkey: privkey,
					registered: true,
				});
				*/
				downloadFile("This file contains your private key, which you will need in case you ever lose or forget your NeoLogin password.\nThis file must be kept in a safe place and not shared with anyone else, as doing so will put your funds and wallet at risk of being stolen.\nPrivate Key: " + privkey);
				this.status.handleLogin(privkey);
				console.log(data);
			})
			.catch(err => {
				this.setState({
					wrongEmail: "Email already exists" 
				});
				console.log(err);
			});
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
						{this.state.registered?"Sucess!":"Sign up"}
					</Typography>
					{this.state.registered?(
						<div>
							<Typography component="p">
								You should store your private key, given that if you lose your password the private key will be the only means of recovery. You can either download a file cointaining or just directly copy-paste it somewhere safe 
							</Typography>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={()=>downloadFile(this.state.privkey)}
							>
								Download
							</Button>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								onClick={()=>window.alert(this.state.privkey)}
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
								onClick={()=>this.status.handleLogin(this.state.privkey)}
							>
								Continue
							</Button>
						</div>
					):(
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
										error={this.state.wrongEmail? true : null}
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
										error={this.state.wrongPassword1? true : null}
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
										error={this.state.wrongPassword2? true : null}
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
										label={<span>I agree with <Link href="/privacy">NeoLogin's privacy policy</Link></span>}
									/>
									{this.state.privacyPolicy? null :
									<FormHelperText error={true}>You must agree to the privacy policy</FormHelperText>
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

function encrypt(plaintext, key){
	return import("cryptr")
		.then(( Cryptr ) => {
			Cryptr = Cryptr.default;
			return new Cryptr(key).encrypt(plaintext);
		});
}

function generatePrivateKey() {
	return import("@cityofzion/neon-js")
		.then(( Neon ) => {
			Neon = Neon.default;
			return Neon.create.privateKey();
		});
}

function downloadFile(data){
	fetch('data:text/plain;base64,'+window.btoa(data))
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
		.catch(() => alert('Could not be downloaded, please copy paste the following string: '+data));
}

SignUp.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUp);
