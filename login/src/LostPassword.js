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
						emailCompleted: true
					});
					console.log(data)
				})
				.catch(err => {
					this.setState({
						wrongEmail: "Email is not registered"
					});
					console.log(err)
				});
		} else if(!this.state.codeCompleted){
			Auth.forgotPasswordSubmit(this.state.email, this.state.code, this.state.password)
				.then(data => {
					this.setState({
						emailCompleted: true
					});
					console.log(data)
				})
				.catch(err => {
					this.setState({
						wrongCode: "Wrong code"
					});
					console.log(err)
				});
		} else {

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
					id="privkey"
					label="Private Key"
					name="privkey"
					autoFocus
					value={this.state.privkey}
					onChange={this.handleInputChange}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					id="password"
					autoComplete="current-password"
					value={this.state.password}
					onChange={this.handleInputChange}
				/>
			</div>
		}

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
						<Button
							fullWidth
							variant="contained"
							color="secondary"
							onClick={this.state.goBackClick}
						>
							Go Back to Sign In
						</Button>
					</form>
				</div>
			</Container>
		);
	}
}


LostPassword.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LostPassword);
