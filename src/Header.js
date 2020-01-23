import React, { Component } from 'react'
import './App.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';

export default class Header extends Component {
    render() {
        return (
            <div>
                <AppBar position="static">
                    <Grid container spacing={1}>
                        <Grid item xs={8}>
                            <Typography variant="h4" component="h4" gutterBottom>
                                Ethereum Blockchain Document Attestation
                        </Typography></Grid>
                        <Grid item xs={4}>
                            <Paper >
                                <b>Account:  {this.props.account}</b>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} align='center' >
                            <ButtonGroup variant="contained" aria-label="contained primary button group">
                                <Button>Home</Button>
                                <Button>Uploads</Button>
                            </ButtonGroup><br /><br /></Grid>
                    </Grid>
                </AppBar>
                <br />
            </div>
        )
    }
}
