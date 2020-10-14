import Axios from "axios";
import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import { CircularProgress } from '@material-ui/core';
import Paper from "@material-ui/core/Paper";

import Header from './Header';

import { ArrowUpwardSharp } from '@material-ui/icons';



const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        type: 'dark',
        primary: {
            main: '#00796B',
        },
        secondary: {
            main: '#009688',
        },
    },
});


const styles = theme => ({
    root: {
        textAlign: 'center',
        backgroundColor: '#303030',
        color: '#EEE',
        opacity: 1.0,
        visibility: 'visible',
        transition: 'opacity 100ms 0ms'
    },
    rootHidden: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        backgroundColor: '#303030',
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
    shown: {
        opacity: 1.0,
        visibility: 'visible',
        transition: 'opacity 500ms 0ms'
    },
    hidden: {
        opacity: 0.0,
        visibility: 'hidden',
        transition: 'opacity 500ms 0ms',
    }
});


const App = (props) => {
    const classes = props.classes;
    
    const [rootClass, setRootClass] = useState(classes.rootHidden);
    const [appClass, setAppClass] = useState(classes.rootHidden);
    const [app, setApp] = useState(classes.hidden);
    const [user, setUser] = useState(undefined);
    const [value, setValue] = useState("Loading...");

    useEffect( () => {
      Axios.get("/api/helloworld/example").then( res => {
        console.log(res.data);
        setValue(new Date(res.data.time).toString());
        setRootClass(classes.root);
        setAppClass(classes.shown);
        setApp(true);
      }, err => {
        setValue("Error");
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
                                <Header user={user} />
                                {!user &&
                                    <h3 style={{marginLeft: 10, textAlign: 'left'}}>
                                        <ArrowUpwardSharp/><ArrowUpwardSharp/><ArrowUpwardSharp/>
                                        <br/>
                                        Please sign in to continue
                                    </h3>
                                }
                                {user &&
                                    <Paper className={classes.paper} elevation={3}>
                                        <Switch>
                                            <Route exact path="/">
                                              <h1>Hello! {value}</h1>  
                                            </Route>
                                        </Switch>
                                    </Paper>
                                }
                            </SnackbarProvider>
                        </MuiThemeProvider>
                    </Router>
                </div>
            }
        </div>
    );
}

export default withStyles(styles)(App);