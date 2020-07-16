//
// Copyright 2020 DXOS.org
//

import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SwapVertIcon from '@material-ui/icons/SwapVert';

const useStyles = makeStyles(theme => ({
    table: {},
    container: {
        maxHeight: 440,
        width: 250
    },
    blackRow: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    primaryRow: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white
    },
    swapIcon: {
        color: '#fff'
    }
}));

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 12
    }
}))(TableCell);

const MovesTable = ({ history, nextPlayerColor, setOrientation }) => {
    const classes = useStyles();

    return (
        <>
            <TableContainer component={Paper} className={classes.container}>
                <Table stickyHeader className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>
                                <SwapVertIcon className={classes.swapIcon} onClick={setOrientation} />
                            </StyledTableCell>
                            <StyledTableCell align="center">From</StyledTableCell>
                            <StyledTableCell align="center">To</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.map((move, index) => (
                            <TableRow key={index}>
                                <StyledTableCell className={classes.primaryRow}>
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell
                                    component="th"
                                    scope="row"
                                    align='center'
                                    className={move.color === 'b' && classes.blackRow}
                                >
                                    {move.from}
                                </StyledTableCell>
                                <StyledTableCell
                                    align='center'
                                    className={move.color === 'b' && classes.blackRow}
                                >
                                    {move.to}
                                </StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {nextPlayerColor &&
                <div style={{ marginTop: 30 }}>
                    <Typography variant='h6'>
                        {nextPlayerColor === 'w' ? 'White player\'s turn' : 'Black player\'s turn'}
                    </Typography>
                </div>
            }
        </>
    );
};

MovesTable.propTypes = {
  history: PropTypes.array.isRequired
};

export default MovesTable;
