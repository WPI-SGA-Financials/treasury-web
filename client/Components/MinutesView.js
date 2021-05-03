import Axios from "axios";
import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import DataTable from './DataTable';


const styles = theme => ({});

const MinutesView = (props) => {

    let [minutes, setMinutes] = useState([]);

    useEffect( () => {
        let rp = Axios.get(`/api/minutes`).then( res => {
          setMinutes(res.data);// convert to array
        }, err => {
          setMinutes("Error");
        })
    }, []);

    return (
        <div>
            <p style={{maxWidth: 600, marginLeft: 'auto', marginRight: 'auto'}}>
                <b>Note:</b>
                <i> This screen only displays minutes from the SGA Database, which does not include minutes for all requests catalogued in the database. If you need minutes for a particular request that is not listed here, please reach out to an SGA representative.</i>
            </p>
            <DataTable fields={[
                { name: 'Agenda Number', dataKey: "Agenda Number", label: "Agenda Number", width: 200 },
                // { name: 'FR_ID', dataKey: "FR_ID", label: "FR_ID", width: 100 },
                // { name: 'RR_ID', dataKey: "RR_ID", label: "RR_ID", width: 100 },
                { name: 'Dot Number', dataKey: "Dot Number", label: "Dot Number", width: 200 },
                { name: 'Minutes Link', dataKey: "Minutes Link", label: "Minutes Link", width: 500 },
            ]} 
            maxWidth={'80vw'}
            data={minutes}
            height={600}
            onRowClick={(row) => window.open(row.rowData['Minutes Link'], "_blank")}
            centered
            searchable
            />
        </div>
    );
}

export default withStyles(styles)(MinutesView);