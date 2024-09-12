import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useStyles } from "./PrizeListTable.styles";

interface Prize {
  name: string;
  time: string;
}

interface PrizeListTableProps {
  prizeList: Prize[];
}

const PrizeListTable: React.FC<PrizeListTableProps> = ({ prizeList }) => {
  const classes = useStyles();
  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table
        aria-label="prize list table"
        stickyHeader
        className={classes.table}
      >
        <TableHead>
          <TableRow className={classes.head}>
            <TableCell className={classes.cell}>Tên Phần Thưởng</TableCell>
            <TableCell align="right" className={classes.cell}>
              Thời Gian Trúng
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prizeList.map((prize, index) => (
            <TableRow key={index} className={classes.row}>
              <TableCell component="th" scope="row" className={classes.cell}>
                {prize.name}
              </TableCell>
              <TableCell align="right" className={classes.cell}>
                {prize.time}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PrizeListTable;
