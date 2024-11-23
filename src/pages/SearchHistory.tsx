import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const statusColors: { [key: string]: string } = {
  'STARTED': '#2AA3E0',
  'IN_PROGRESS': '#2AA3E0',
  'Queued': '#FFD700',
  'SEARCH_FINISHED': '#A4DE02',
  'FINISHED': '#A4DE02',
  'ERROR': '#FF6F61',
};

type LogEntry = {
  id: number;
  status: string;
  keyword: string;
  quantity: number;
  message?: string;
  created_at?: string;
  updated_at?: string;
}

const SearchHistoryPage = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const fetchLogs = async () => {
    const logsFromDb = await window.electronAPI.listLogs();
    console.log(logsFromDb)
    setLogs(logsFromDb as LogEntry[]);
  };
  useEffect(() => {
    fetchLogs();
  }, []);
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: '#1C1C1C',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h4" sx={{ color: '#FFD700', mb: 3, textAlign: 'center' }}>
        Search History
      </Typography>

      <Paper
        sx={{
          p: 2,
          backgroundColor: '#2E2E2E',
          borderRadius: 2,
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 500, // Altura máxima com rolagem interna
            backgroundColor: '#1C1C1C',
          }}
        >
          <Table stickyHeader>
            <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: '#FFD700',
                      fontWeight: 'bold',
                      backgroundColor: '#1C1C1C', // Tom de preto para o cabeçalho
                      borderBottom: '1px solid #333', // Linha divisória mais suave
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#FFD700',
                      fontWeight: 'bold',
                      backgroundColor: '#1C1C1C',
                      borderBottom: '1px solid #333',
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#FFD700',
                      fontWeight: 'bold',
                      backgroundColor: '#1C1C1C',
                      borderBottom: '1px solid #333',
                    }}
                  >
                    Keyword Used
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#FFD700',
                      fontWeight: 'bold',
                      backgroundColor: '#1C1C1C',
                      borderBottom: '1px solid #333',
                    }}
                  >
                    Requested Quantity
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#FFD700',
                      fontWeight: 'bold',
                      backgroundColor: '#1C1C1C',
                      borderBottom: '1px solid #333',
                    }}
                  >
                    Search Message
                  </TableCell>
                </TableRow>
              </TableHead>

            <TableBody>
              {logs.length > 0 ? (
                logs.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ color: '#FFF' }}>{item.id}</TableCell>
                    <TableCell
                      sx={{ color: statusColors[item.status] || '#FFF', fontWeight: 'bold' }}
                    >
                      {item.status}
                    </TableCell>
                    <TableCell sx={{ color: '#FFF' }}>{item.keyword}</TableCell>
                    <TableCell sx={{ color: '#FFF' }}>{item.quantity}</TableCell>
                    <TableCell sx={{ color: '#FFF' }}>{item.message}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', color: '#FFF' }}>
                    No search history available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SearchHistoryPage;
