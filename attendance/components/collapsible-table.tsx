import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface Data {
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): Data {
  return { name, calories, fat, carbs, protein };
}

const rows: Data[] = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function BasicTable() {
  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom fontWeight={700}>
        Dessert Nutrition Table
      </Typography>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="nutrition table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>
                Dessert (100g serving)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Calories
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Fat&nbsp;(g)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Carbs&nbsp;(g)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Protein&nbsp;(g)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow
                key={row.name}
                sx={{
                  backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff",
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background 0.2s",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography fontWeight={500}>{row.name}</Typography>
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}