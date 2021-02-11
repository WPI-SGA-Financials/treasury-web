import Axios from "axios";
import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import { Button, CircularProgress, Typography } from '@material-ui/core';
import Paper from "@material-ui/core/Paper";

import Header from './Header';

import { ArrowUpwardSharp } from '@material-ui/icons';

import { PublicClientApplication } from '@azure/msal-browser';
import jwtDecode from 'jwt-decode';

import FilterableTable from 'react-filterable-table';
import DataTable from "./DataTable";

import appLogo from '../Assets/treasury-logo.png';

 
const msalApp = new PublicClientApplication({
    auth: {
        clientId: "b050c73f-fe32-4b29-a7c8-ee6a3af75dab",
        authority: "https://login.microsoftonline.com/wpi.edu",
        redirectUri: window.location.origin,
        navigateToLoginRequestUrl: true
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
      },
      system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                console.log(message);
            },
            piiLoggingEnabled: false
        },
        windowHashTimeout: 60000,
        iframeHashTimeout: 6000,
        loadFrameTimeout: 0
    }
});

const loginRequest = {
    scopes: ["openid", "profile", "User.Read"],
    prompt: "select_account",
    optionalClaims: {
        "idToken": [
            {
                "name": "given_name",
                "essential": false
            }
        ],
        "accessToken": [
            {
                "name": "given_name",
                "essential": false
            }
        ],
    }
};

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        type: 'dark',
        primary: {
            main: '#AC2B37',
        },
        secondary: {
            main: '#751019',
        },
    },
});


const styles = theme => ({
    root: {
        textAlign: 'center',
        // backgroundColor: '#303030',
        color: '#EEE',
        opacity: 1.0,
        visibility: 'visible',
        transition: 'opacity 100ms 0ms'
    },
    rootHidden: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        // backgroundColor: '#303030',
        color: '#EEE',
        opacity: 0.0,
        visibility: 'hidden',
    },
    paper: {
        maxWidth: 1500,
        margin: theme.spacing(3),
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: theme.spacing(3),
    },
    loginPaper: {
        maxWidth: 550,
        margin: 'auto',
        marginTop: 150,
        marginBottom: 150,
        padding: theme.spacing(3),
    },
    shown: {
        opacity: 1.0,
        visibility: 'visible',
        transition: 'opacity 500ms 0ms'
    },
    hidden: {
        opacity: 0.0,
        visibility: 'hidden',
        transition: 'opacity 500ms 0ms',
    },
    table: {
        backgroundColor: 'grey'
    }
});

const signIn = () => {
    msalApp.loginRedirect(loginRequest);
};

const App = (props) => {
    const classes = props.classes;

    const [rootClass, setRootClass] = useState(classes.rootHidden);
    const [appClass, setAppClass] = useState(classes.rootHidden);
    const [app, setApp] = useState(classes.hidden);
    const [user, setUser] = useState(undefined);
    const [value, setValue] = useState([]);
    const [photo, setPhoto] = useState(null);

    useEffect( () => {
        const accounts = msalApp.getAllAccounts();
        msalApp.handleRedirectPromise().then((tokenResponse) => {
            if(!tokenResponse) {
                if(window.sessionStorage.getItem("session")) {
                    tokenResponse = JSON.parse(window.sessionStorage.getItem("session"));
                } else {
                    return;
                }
            } else {
                window.sessionStorage.setItem("session", JSON.stringify(tokenResponse));
            }
            let profile = jwtDecode(tokenResponse.idToken);
            let access = jwtDecode(tokenResponse.accessToken);
            setUser(profile);
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect( () => {
        if(!user) {
            return;
        }
        let accessToken = JSON.parse(window.sessionStorage.getItem("session"));
        if(!accessToken) {
            return;
        } else {
            accessToken = accessToken.accessToken;
        }
        Axios.get("https://graph.microsoft.com/v1.0/me/Photo/$value", {
            headers: {
                "Authorization": "Bearer " + accessToken,
            },
            responseType: 'blob'
        }).then(resp => {
            const url = window.URL || window.webkitURL;
            const blobUrl = url.createObjectURL(resp.data);
            setPhoto(blobUrl);
        }).catch(err => {
            console.error("Failed to get user photo");
            window.sessionStorage.removeItem("session");
            window.location.reload();
        })
    }, [user]);

    useEffect( () => {
        setRootClass(classes.root);
        setAppClass(classes.shown);
      Axios.get("/api/budgets/").then( res => {
        setValue(res.data);// convert to array
        setApp(true);
      }, err => {
        setValue("Error");
        setApp(true);
      })
    }, []);

    return (
        <div className={rootClass}>
            {!app && <div>
                <br />
                <br />
                <h3>One moment, please...</h3>
                <CircularProgress />
            </div>}
            {app && 
                <div className={appClass}>
                    <Router>
                        <MuiThemeProvider theme={theme}>
                            <SnackbarProvider maxSnack={1}>
                                <Header user={user} photo={photo} signIn={signIn}/>
                                {!user &&
                                    <Paper className={classes.loginPaper} elevation={3}>
                                        <img src={appLogo} style={{height: 40}} />
                                        <Typography variant="h6">Welcome to WPI Treasury!</Typography>
                                        <Typography align="left" variant="body1">Treasury provides access to detailed financials for student organizations on campus, and is restricted to active members of the WPI community. For aggregated statistics and visualizations on the student life fee and student organization budgets, visit <a href="https://sgaviz.cs.wpi.edu">sgaviz.cs.wpi.edu</a></Typography>
                                        <br />
                                        <Button variant="contained" color="primary" onClick={signIn}>Sign in with WPI Account</Button>
                                    </Paper>
                                }
                                {user && (
                                    <Paper className={classes.paper} elevation={3}>
                                        <Switch>
                                            <Route exact path="/">
                                              <h1>Hello, {user.given_name}</h1> 
                                              <DataTable fields={[
                                                            { name: 'Name of Club', dataKey: "Name of Club", width: 400 },
                                                            { name: 'Fiscal Year', dataKey: "Fiscal Year", width: 100},
                                                            ]} 
                                                        data={value}
                                                        centered
                                                        searchable
                                                />
                                            </Route>
                                        </Switch>
                                    </Paper>
                                )}
                            </SnackbarProvider>
                        </MuiThemeProvider>
                    </Router>
                </div>
            }
        </div>
    );
}

export default withStyles(styles)(App);