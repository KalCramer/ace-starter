import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'

interface Column {
  id: 'color' | 'missionId' | 'streamId' | 'location' | 'size' | 'density';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'color', label: 'Color', minWidth: 30 },
  { id: 'missionId', label: 'Mission ID', minWidth: 170 },
  { id: 'streamId', label: 'Stream ID', minWidth: 100 },
  {
    id: 'location',
    label: 'Location (Lat, Lon, Alt)',
    minWidth: 170,
    format: (value: number) => value.toLocaleString(),
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: 170,
    format: (value: number) => value.toLocaleString(),
  },
  {
    id: 'density',
    label: 'Density',
    minWidth: 170,
    format: (value: number) => value.toFixed(2),
  },
]

interface Data {
  color: string;
  missionId: string;
  streamId: string;
  location: String;
  size: number;
  density: number;
}

function createData(
  color: string,
  missionId: string,
  streamId: string,
  location: string,
  size: number
): Data {
  const density = 14
  return { color, missionId, streamId, location, size, density }
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '100%',
  },
})

export default function StickyHeadTable(props) {
  function addRow(route) {
    console.log(this.status)
    return createData(
      route['color'],
      route['missionId'],
      route['streamId'],
      '(' +
        route['latitude'] +
        ', ' +
        route['longitude'] +
        ', ' +
        route['altitude'] +
        ')',
      Math.random()
    )
  }

  var rows = []
  var routes = props.routes
  var status = props.status
  if (routes != undefined) {
    rows = routes.map(addRow, { status })
    console.log(rows)
  }

  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map(column => {
                      const value = row[column.id]
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <div
                            style={{
                              width: '30px',
                              height: '30px',
                              backgroundColor: row[column.id],
                            }}
                          />

                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
