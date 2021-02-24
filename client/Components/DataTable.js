import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { TextField } from '@material-ui/core';

const styles = (theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
      backgroundColor: "#303030",
    },
  },
  tableRow: {
    cursor: 'pointer',
    backgroundColor: "#303030",
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[600],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex}) => {
    const { headerHeight, columns, classes, ...tableProps } = this.props;
    const customHeaderChild = columns[columnIndex].customHeaderChild;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        {customHeaderChild || <b>{label}</b>}
      </TableCell>
    );
  };

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
      customHeaderChild: PropTypes.object,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

const DataTable = (props) => {
  let rows = props.data;

  const totalWidth = props.fields.reduce((f1, f2) => f1.width + f2.width, {width: 0});
  let [filter, setFilter ] = useState(props.fields.reduce((acc, f) => {
    acc[f.dataKey] = "";
    return acc;
  }, {}));

  let paperStyles = { height: 300, width: totalWidth };
  if(props.centered) {
    paperStyles['marginLeft'] = 'auto';
    paperStyles['marginRight'] = 'auto';
  }

  if(filter) {
    const columnKeys = props.fields.map(f => f.dataKey);
    rows = rows.filter(row => {
      let match = true;
      columnKeys.forEach(key => {
        filter[key].split(' ').forEach(searchToken => {
          if(!(""+row[key]).toLowerCase().includes(searchToken.toLowerCase())) {
            match = false;
          }
        });
      });
      return match;
    });
  }

  return (
    <div>
      <Paper style={paperStyles}>
        <VirtualizedTable
          rowCount={rows.length}
          rowGetter={({ index }) => rows[index]}
          onRowClick={(row) => props.onRowClick(row)}
          headerHeight={props.searchable ? 112 : 48}
          columns={props.fields.map(col => {
              return {
                ...col,
                customHeaderChild: props.searchable && <div>
                    <br />
                    <label>{col.label}</label>
                    <br />
                    <TextField variant="outlined"
                               style={{maxWidth: 0.8 * col.width, height: 56, margin: 0, padding: 0}}
                               placeholder={col.label}
                               value={filter[col.dataKey]}
                               onChange={evt => {
                                 let newFilter = {...filter};
                                 newFilter[col.dataKey] = evt.target.value;
                                 console.log(filter[col.dataKey]);
                                 console.log(newFilter);
                                 setFilter(newFilter);
                                }} />
                  </div>
              }
          })}
          />
      </Paper>
    </div>
  );
};

export default withStyles(styles)(DataTable);