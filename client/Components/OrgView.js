import Axios from "axios";
import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
} from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import { Button, ButtonGroup, Checkbox, CircularProgress, FormControlLabel, FormGroup, FormLabel, Paper, Tab, Tabs } from "@material-ui/core";
import { ArrowLeftSharp, VisibilityOffRounded, VisibilityRounded } from "@material-ui/icons";
import DataTable from "./DataTable";


const styles = theme => ({});

const OrgView = (props) => {
    const history = useHistory();
    const { org } = props.match.params;
    const budgets = props.budgets.filter(b => b["Name of Club"] === org);
    const [years, setYears] = useState({});
    const [tab, setTab] = useState(0);
    const [realloc, setRealloc] = useState([]);
    const [fr, setFr] = useState([]);
    const [bs, setBs] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect( () => {
      let rp = Axios.get(`/api/reallocations/?Name of Club=${encodeURIComponent(org)}`).then( res => {
        setRealloc(res.data);// convert to array
      }, err => {
        setRealloc("Error");
      })
      let fp = Axios.get(`/api/fundingrequests/?Name of Club=${encodeURIComponent(org)}`).then( res => {
        setFr(res.data);// convert to array
      }, err => {
        setFr("Error");
      })
      let bsp = Axios.get(`/api/budgetsections/?Name of Club=${encodeURIComponent(org)}`).then( res => {
        setBs(res.data);// convert to array
      }, err => {
        setBs("Error");
      })
      Promise.all([rp, fp, bsp]).then( () => {
        setLoading(false);
      });
    }, []);

    const hiddenYears = Object.keys(years).filter(x => !!years[x]);
    console.log(hiddenYears);

    return (
        <div>
            <Button onClick={() => history.push("/")} 
                    align="left"
                    variant="contained"
                    color="primary"
                    startIcon={<ArrowLeftSharp />}>
                        All Organizations
            </Button>
            <h4 align="left">Student Organization View</h4>
            <h2 align="left">{org}</h2>
            <br />
            {loading && 
                <div>
                    <label>Loading...</label><br/>
                    <CircularProgress />
                </div>
            }
            {!loading && 
                <div>
                    <FormGroup row>
                        <FormLabel>Hide Years:</FormLabel>
                        {budgets.map(b => {
                            const fy = b["Fiscal Year"];
                            return (
                                <FormControlLabel
                                    key={fy}
                                    control={
                                    <Checkbox checked={years[fy]}
                                            icon={<VisibilityRounded />}
                                            checkedIcon={<VisibilityOffRounded />}
                                            onChange={(evt) => {
                                                            try {

                                                                let y = {...years};
                                                                y[fy] = evt.target.checked;
                                                                setYears(y);
                                                                console.log("Set");
                                                            } catch(e) {
                                                                console.log(e);
                                                            }
                                                        }} 
                                                        key={fy}
                                                        name={fy} />
                                                    }
                                                        label={fy}
                                />
                            );
                        })}
                    </FormGroup>
                    <Paper square>
                        <br />
                        <ButtonGroup variant="outlined">
                            <Button variant={window.location.href.includes('/fundingrequests') ? "contained" : "outlined"} 
                                    color={window.location.href.includes('/fundingrequests') ? "primary" : undefined} 
                                    onClick={() => history.push(`${props.match.url}/fundingrequests`)}>
                                Funding Requests
                            </Button>
                            <Button variant={window.location.href.includes('/reallocations') ? "contained" : "outlined"} 
                                    color={window.location.href.includes('/reallocations') ? "primary" : undefined} 
                                    onClick={() => history.push(`${props.match.url}/reallocations`)}>
                                Reallocations
                            </Button>
                            <Button variant={window.location.href.includes('/budgets') ? "contained" : "outlined"} 
                                    color={window.location.href.includes('/budgets') ? "primary" : undefined} 
                                    onClick={() => history.push(`${props.match.url}/budgets`)}>
                                Budget Totals
                            </Button>
                            <Button variant={window.location.href.includes('/sections') ? "contained" : "outlined"} 
                                    color={window.location.href.includes('/sections') ? "primary" : undefined} 
                                    onClick={() => history.push(`${props.match.url}/sections`)} >
                                Budget Sections
                            </Button>
                        </ButtonGroup>
                        <Route exact path={`/org/${org}/budgets`}>
                            <DataTable 
                                fields={[
                                    // { name: 'Fiscal Year', dataKey: "Fiscal Year", label: "Year", width: 80 },
                                    { name: 'Fiscal Year', dataKey: "Fiscal Year", label: "FY", width: 100 },
                                    { name: 'Amount Requested', dataKey: "Amount Requested", label: "Requested", width: 200 },
                                    { name: 'Amount Proposed', dataKey: "Amount Proposed", label: "Proposed", width: 200 },
                                    { name: 'Amount Approved', dataKey: "Amount Approved", label: "Approved", width: 200 },
                                ]} 
                                data={budgets.filter(row => !hiddenYears.includes(row["Fiscal Year"]))}
                                height={600}
                                onRowClick={() => {}}
                                centered
                                searchable
                                />                
                        </Route>
                        <Route exact path={`/org/${org}/fundingrequests`}>
                            <DataTable 
                                fields={[
                                    { name: 'Fiscal Year', dataKey: "Fiscal Year", label: "FY", width: 80 },
                                    { name: 'Dot Number', dataKey: "Dot Number", label: "Dot#", width: 80 },
                                    { name: 'Funding Date', dataKey: "Funding Date", label: "Date", width: 100 },
                                    { name: 'Description', dataKey: "Description", label: "Description", width: 200 },
                                    { name: 'Amount Requested', dataKey: "Amount Requested", label: "$Req", width: 100 },
                                    { name: 'Amount Approved', dataKey: "Amount Approved", label: "$Appr", width: 100 },
                                    { name: 'Decision', dataKey: "Decision", label: "Decision", width: 100 },
                                    { name: 'Notes', dataKey: "Notes", label: "Notes", width: 200 },
                                ]} 
                                data={fr.filter(row => !hiddenYears.includes(row["Fiscal Year"]))}
                                height={600}
                                onRowClick={() => {}}
                                centered
                                searchable
                                />                
                        </Route>
                        <Route exact path={`/org/${org}/reallocations`}>
                            <DataTable 
                                fields={[
                                    { name: 'Fiscal Year', dataKey: "Fiscal Year", label: "FY", width: 80 },
                                    { name: 'Dot Number', dataKey: "Dot Number", label: "Dot#", width: 100 },
                                    { name: 'Description', dataKey: "Description", label: "Description", width: 200 },
                                    { name: 'Allocated From', dataKey: "Allocated From", label: "From", width: 200 },
                                    { name: 'Allocated To', dataKey: "Allocated To", label: "To", width: 200 },
                                    { name: 'Allocation Amount', dataKey: "Allocation Amount", label: "$Req", width: 100 },
                                    { name: 'Decision', dataKey: "Decision", label: "Decision", width: 100 },
                                    { name: 'Amount Approved', dataKey: "Amount Approved", label: "$Appr", width: 100 },
                                ]} 
                                data={realloc.filter(row => !hiddenYears.includes(row["Fiscal Year"]))}
                                height={600}
                                onRowClick={() => {}}
                                centered
                                searchable
                                />                
                        </Route>
                        <Route exact path={`/org/${org}/sections`}>
                            <DataTable 
                                fields={[
                                    { name: 'Fiscal Year', dataKey: "Fiscal Year", label: "FY", width: 80 },
                                    { name: 'Section Name', dataKey: "Section Name", label: "Section Name", width: 200 },
                                    { name: 'Amount Requested', dataKey: "Amount Requested", label: "$Req", width: 120 },
                                    { name: 'Amount Proposed', dataKey: "Amount Proposed", label: "$Prop", width: 120 },
                                    { name: 'Approved Appeal', dataKey: "Approved Appeal", label: "$Appeal", width: 120 },
                                ]} 
                                data={bs.filter(row => !hiddenYears.includes(row["Fiscal Year"]))}
                                height={600}
                                onRowClick={() => {}}
                                centered
                                searchable
                                />                
                        </Route>
                        <Route exact path={`/org/${org}/budget`}>
                            <h4>Budget View</h4>
                        </Route>
                    </Paper>
                </div>
            }
        </div>
    );
}

export default withStyles(styles)(OrgView);