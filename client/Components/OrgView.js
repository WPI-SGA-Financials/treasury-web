import Axios from "axios";
import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
} from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import { Button, Checkbox, FormControlLabel, FormGroup, Paper, Tab, Tabs } from "@material-ui/core";
import { ArrowLeftSharp } from "@material-ui/icons";
import DataTable from "./DataTable";


const styles = theme => ({});

const OrgView = (props) => {
    const history = useHistory();
    const { org } = props.match.params;
    const budgets = props.budgets.filter(b => b["Name of Club"] === org);
    const [years, setYears] = useState({});
    const [tab, setTab] = useState(0);
    const [realloc, setRealloc] = useState([]);


    useEffect( () => {
      Axios.get(`/api/reallocations/?Name of Club=${org}`).then( res => {
        setRealloc(res.data);// convert to array
      }, err => {
        setRealloc("Error");
      })
    }, []);

    const selectedYears = Object.keys(years).filter(x => !!years[x]);
    console.log(selectedYears);

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
            <FormGroup row>
                {budgets.map(b => {
                    const fy = b["Fiscal Year"];
                    return (
                        <FormControlLabel
                            key={fy}
                            control={<Checkbox checked={years[fy]} 
                                                onChange={(evt) => {
                                                    let y = years;
                                                    y[fy] = !y[fy];
                                                    setYears(y);
                                                }} 
                                                name={fy} />}
                                                label={fy}
                        />
                    );
                })}
            </FormGroup>
            <Paper square>
                <FormGroup row>
                    <Button variant="outlined" onClick={() => history.push(`${props.match.url}/requests`)}>
                        Funding Requests
                    </Button>
                    <Button variant="outlined" onClick={() => history.push(`${props.match.url}/budget`)} >
                        Budget Categories
                    </Button>
                </FormGroup>
                <Route exact path={`/org/${org}/requests`}>
                    <h4>Requests</h4>
                    <DataTable 
                        fields={[
                            // { name: 'Fiscal Year', dataKey: "Fiscal Year", label: "Year", width: 80 },
                            { name: 'Dot Number', dataKey: "Dot Number", label: "Dot#", width: 100 },
                            { name: 'Description', dataKey: "Description", label: "Description", width: 200 },
                            { name: 'Allocated From', dataKey: "Allocated From", label: "From", width: 200 },
                            { name: 'Allocated To', dataKey: "Allocated To", label: "To", width: 200 },
                            { name: 'Allocation Amount', dataKey: "Allocation Amount", label: "$Req", width: 100 },
                            { name: 'Decision', dataKey: "Decision", label: "Decision", width: 100 },
                            { name: 'Amount Approved', dataKey: "Amount Approved", label: "$Appr", width: 100 },
                        ]} 
                        data={realloc.filter(row => selectedYears.includes(row["Fiscal Year"]))}
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
    );
}

export default withStyles(styles)(OrgView);