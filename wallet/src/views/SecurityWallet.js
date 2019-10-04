import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { server } from '../config';

class SecurityWallet extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            address: '-',
            balance: [],
            toAddress: '',
            fasms: false,
            fatotp: false
        };
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        })
    }

    render() {
        return (
            <div>
                <Grid container direction="column" justify={this.props.isMobile ? "center" : "flex-start"} alignItems={this.props.isMobile ? "center" : "flex-start"}>
                    {/* <Grid item style={{ margin: '1rem 0 0 0', width: '100%' }}>
                        Open settings
                    </Grid> */}
                    <Grid item>
                        <Button variant="contained" color="primary" style={{ marginTop: '1rem' }}
                            onClick={() => {
                                window.open(server.includes("localhost") ? server + "?settings=true" : server + "?settings=true/", 'NeoLogin - Login', 'width=400,height=660')
                            }}>
                            OPEN SETTINGS
                        </Button>
                    </Grid>
                    {/* <Grid item style={{ margin: '1rem 0 0 0', width: '100%' }}>
                        2 FACTOR AUTHENTICATION
                    </Grid>
                    <Grid item>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch checked={this.state.fatotp} onChange={this.handleInputChange}
                                        color="primary" name="fatotp" />
                                }
                                label="TOTP 2FA"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.fasms}
                                        onChange={this.handleInputChange}
                                        color="primary"
                                        name="fasms"
                                    />
                                }
                                label="SMS 2FA"
                            />
                        </FormGroup>
                    </Grid>*/}
                </Grid>
            </div>
        )
    }
}

export default SecurityWallet
