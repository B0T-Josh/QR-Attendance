import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

interface AttendanceRow {
  id?: number
  student_id: string
  name: string
  subject: string
  date: string
  time_in: string
  time_out: string
}

export default function BasicTable() {
  const [rows, setRows] = useState<AttendanceRow[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch data function
  const fetchData = async () => {
    const { data, error } = await supabase.from('attendance').select('*')
    if (error) {
      console.error(error)
      setError('Failed to fetch data')
    } else {
      setRows(data as AttendanceRow[])
    }
  }

  useEffect(() => {
    fetchData()

    // Subscribe to changes in the 'attendance' table
    const channel = supabase
      .channel('attendance-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance' },
        () => {
          fetchData()
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <TableContainer component={Paper}>
      {error && <div style={{ color: 'red', padding: 16 }}>{error}</div>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time In</TableCell>
            <TableCell>Time Out</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 && !error ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No data found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id ?? row.student_id}>
                <TableCell>{row.student_id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.subject}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.time_in}</TableCell>
                <TableCell>{row.time_out}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
