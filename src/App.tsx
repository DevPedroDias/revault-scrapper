import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent, Chip } from '@mui/material';
import logo from './assets/logo.svg';

// Enum com os status
enum StatusScrap {
  starting = 'STARTING',
  started = 'STARTED',
  inProgess = 'IN_PROGRESS',
  searchFinished = 'SEARCH_FINISHED',
  savingFile = 'SAVING_FILE',
  finished = 'FINISHED',
  error = 'ERROR',
  startingDataCompilation = 'IN_DATA_COMPILATION',
  finishedDataCompilation = 'FINISHED_DATA_COMPILATION',
}

interface ProcessStatus {
  id?: number;
  type: StatusScrap;
  message?: string;
}

interface LogEntry {
  id: number;
  status: string;
  input: string;
  search_quantity: number;
  message: string;
  filename: string;
  created_at: string;
}

function App() {
  const [name, setName] = useState<string>('');
  const [maxResults, setMaxResults] = useState<number>(48);
  const [processes, setProcesses] = useState<ProcessStatus[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false); // Estado para controlar o erro do campo de nome

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    if (event.target.value !== '') {
      setNameError(false); // Remove o erro ao corrigir o campo
    }
  };

  const handleMaxResultsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setMaxResults(isNaN(value) ? 10 : value);
  };

  const fetchLogs = async () => {
    const logsFromDb = await window.electronAPI.listLogs();
    console.log(logsFromDb)
    setLogs(logsFromDb as LogEntry[]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name === '') {
      setNameError(true); // Define o estado de erro se o nome estiver vazio
      return;
    }

    setIsSubmitting(true);

    const newProcess: ProcessStatus = { id: undefined, type: StatusScrap.starting };
    setProcesses([...processes, newProcess]);

    await window.electronAPI.scrapDroper({
      keyword: name,
      maxResults,
    });
  };

  useEffect(() => {
    const handleStatusUpdate = (newStatus: { type: string; message?: string; logId?: number }) => {
      setProcesses((currentProcesses) =>
        currentProcesses
          .map((process) => {
            if (process.id === newStatus.logId) {
              return { ...process, type: newStatus.type as StatusScrap, message: newStatus.message };
            } else if (!process.id && newStatus.type === StatusScrap.inProgess) {
              return { ...process, id: newStatus.logId, type: newStatus.type as StatusScrap, message: newStatus.message };
            }
            return process;
          })
          .filter(() => {
            if (newStatus.type === StatusScrap.finished || newStatus.type === StatusScrap.error) {
              window.electronAPI.removeStatusListener();
              return false;
            }
            return true;
          })
      );

      if (newStatus.type === StatusScrap.finished || newStatus.type === StatusScrap.finishedDataCompilation || newStatus.type === StatusScrap.error) {
        fetchLogs();
      }

      if (newStatus.type === StatusScrap.inProgess) {
        setIsSubmitting(false);
      }
    };

    window.electronAPI.onStatusUpdate(handleStatusUpdate);

    return () => {
      window.electronAPI.removeStatusListener();
    };
  }, [processes]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const getStatusColor = (status: StatusScrap) => {
    switch (status) {
      case StatusScrap.finished:
      case StatusScrap.finishedDataCompilation:
        return '#A4DE02'; // Cor verde suave
      case StatusScrap.inProgess:
        return '#2AA3E0'; // Azul suave
      case StatusScrap.error:
        return '#FF6F61'; // Vermelho pastel
      default:
        return '#CCCCCC'; // Cinza suave
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        backgroundColor: '#1C1C1C',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        overflow: 'hidden',
        p: 0,
        m: 0,
        width: '100vw',
      }}
    >
      {/* Coluna da esquerda: Processos em andamento */}
      <Box
        sx={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          backgroundColor: '#2E2E2E',
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
          p: 2,
          maxHeight: '100vh',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: '#fff', textAlign: 'center' }}>
          On going searchs
        </Typography>
        {processes.map((process) => (
          <Card key={process.id} sx={{ mb: 2, backgroundColor: '#3E3E3E', borderRadius: 1 }}>
            <CardContent>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>
                Search #{process.id}
              </Typography>
              <Chip label={process.type} sx={{ mb: 1, backgroundColor: getStatusColor(process.type), color: '#fff' }} />
              {process.message && (
                <Typography variant="body2" color="textSecondary" sx={{ color: '#aaa' }}>
                  {process.message}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Formulário de busca centralizado */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          p: 4,
          backgroundColor: '#2E2E2E',
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <img src={logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
        </Box>
        <Typography variant="h6" gutterBottom sx={{ color: '#fff', textAlign: 'center' }}>
          Search Panel
        </Typography>
        <TextField
          label="Name"
          value={name}
          onChange={handleNameChange}
          fullWidth
          required
          variant="outlined"
          error={nameError} // Define o erro no campo
          helperText={nameError ? 'Name is required' : ''} // Mensagem de erro
          sx={{
            backgroundColor: '#fafafa',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: nameError ? '#FF6F61' : 'inherit', // Cor da borda quando houver erro
              },
            },
          }}
        />
        <TextField
          label="Max Results"
          type="number"
          value={maxResults}
          onChange={handleMaxResultsChange}
          fullWidth
          required
          InputProps={{ inputProps: { min: 1 } }}
          variant="outlined"
          sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
          InputLabelProps={{
            style: { color: '#000', fontWeight: 'bold' },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ py: 1, backgroundColor: '#FFDD57', color: '#000', '&:hover': { backgroundColor: '#FFCC00' } }}
          disabled={isSubmitting}
        >
          Buscar
        </Button>
      </Box>

      {/* Coluna da direita: Logs */}
      <Box
        sx={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          backgroundColor: '#2E2E2E',
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
          p: 2,
          maxHeight: '100vh',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: '#fff', textAlign: 'center' }}>
          History
        </Typography>
        {logs.map((log) => (
          <Card key={log.id} sx={{ mb: 2, backgroundColor: '#3E3E3E', borderRadius: 1 }}>
            <CardContent>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>
              Search #{log.id}
              </Typography>
              <Chip label={log.status} sx={{ mb: 1, backgroundColor: getStatusColor(log.status as StatusScrap), color: '#fff' }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="textSecondary" sx={{ color: '#aaa' }}>
                  <strong>Input:</strong> {log.input}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ color: '#aaa' }}>
                  <strong>Quantity:</strong> {log.search_quantity}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ color: '#aaa' }}>
                  <b>Filename:</b> {log.filename}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ color: '#aaa' }}>
                  <strong>Created at:</strong> {log.created_at}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default App;