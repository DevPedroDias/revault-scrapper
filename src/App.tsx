import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent, Chip, Tooltip, Snackbar, Alert } from '@mui/material';
import logo from './assets/logo.svg';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import LeakAddIcon from '@mui/icons-material/LeakAdd';
import LeakRemoveIcon from '@mui/icons-material/LeakRemove';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';

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
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); // Estado do Snackbar
  const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento para Scan and Repair ou Synchronize

  const checkConnection = async () => {
    const isConnected = await window.electronAPI.checkInternet(); // Chama a função do processo principal
    setIsOnline(isConnected);
  };

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

  const handleScanAndRepair = async () => {
    setLoading(true); // Define o estado de carregamento
    setSnackbarOpen(true); // Exibe o Snackbar

    try {
      const result = await window.electronAPI.scanFileStructure();
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (result) {
        console.log("Estrutura de arquivos verificada e corrigida com sucesso.");
      }
    } catch (error) {
      console.error("Erro ao verificar a estrutura de arquivos", error);
    } finally {
      setLoading(false); // Remove o estado de carregamento
      setIsSubmitting(false); // Habilita o botão Buscar após o término
    }
  };

  const handleSynchronize = async () => {
    setLoading(true); // Define o estado de carregamento
    setSnackbarOpen(true); // Exibe o Snackbar

    try {
      const result = await window.electronAPI.syncFiles();
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (result) {
        console.log("Sincronização concluída com sucesso.");
      }
    } catch (error) {
      console.error("Erro durante a sincronização", error);
    } finally {
      setLoading(false); // Remove o estado de carregamento
      setIsSubmitting(false); // Habilita o botão Buscar após o término
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    // Verificar a conexão inicial
    checkConnection();

    // Listeners para os eventos de "online" e "offline" do navegador
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    // Verificações periódicas para garantir a conexão real
    const intervalId = setInterval(() => {
      checkConnection();
    }, 10000); // Verifica a cada 10 segundos

    return () => {
      // Limpa o intervalo e os event listeners ao desmontar o componente
      clearInterval(intervalId);
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

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
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#1C1C1C',
      }}
    >
      {/* Menu superior */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2E2E2E',
          padding: '10px 20px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Exibir status de conexão */}
        {isOnline ? (
          <Typography
            variant="body1"
            sx={{
              color: '#A4DE02',
              fontWeight: 'bold',
            }}
          >
            <LeakAddIcon /> Internet connection
          </Typography>
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: '#FF6F61',
              fontWeight: 'bold',
            }}
          >
            <LeakRemoveIcon /> Internet connection
          </Typography>
        )}

        {/* Botões com Tooltips */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#2E2E2E',
            padding: '10px 20px',
          }}
        >
          <Tooltip title="Scan and repair issues">
            <Button
              onClick={handleScanAndRepair} // Conecta ao método
              startIcon={<BuildCircleIcon />} // Adiciona o ícone à esquerda do texto
              disabled={loading || isSubmitting} // Desabilita o botão enquanto o scan está em execução ou o form está submetendo
              sx={{
                color: '#FFDD57',
                backgroundColor: '#2E2E2E', // Cor de fundo
                fontWeight: 'bold',
                mx: 2,
                px: 3,
                py: 1,
                border: '1px solid #FFDD57', // Borda para dar aparência de botão de menu
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#FFDD57', // Cor de fundo ao passar o mouse
                  color: '#000', // Texto preto ao passar o mouse
                },
                '&.Mui-disabled': {
                  color: '#888888', // Cor do texto quando desabilitado
                  backgroundColor: '#555555', // Cor de fundo quando desabilitado
                  border: '1px solid #555555', // Cor da borda quando desabilitado
                },
              }}
            >
              {loading ? 'Loading...' : 'Scan and repair'} {/* Exibe o texto de carregamento */}
            </Button>
          </Tooltip>

          <Tooltip title="Synchronize data">
            <Button
              onClick={handleSynchronize} // Conecta ao método de sincronização
              startIcon={<CloudSyncIcon />} // Adiciona o ícone à esquerda do texto
              disabled={!isOnline || loading || isSubmitting} // Desabilita o botão se estiver offline ou enquanto o sync/scan está em execução
              sx={{
                color: '#FFDD57',
                backgroundColor: '#2E2E2E', // Cor de fundo
                fontWeight: 'bold',
                mx: 2,
                px: 3,
                py: 1,
                border: '1px solid #FFDD57', // Borda para dar aparência de botão de menu
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#FFDD57', // Cor de fundo ao passar o mouse
                  color: '#000', // Texto preto ao passar o mouse
                },
                '&.Mui-disabled': {
                  color: '#888888', // Cor do texto quando desabilitado
                  backgroundColor: '#555555', // Cor de fundo quando desabilitado
                  border: '1px solid #555555', // Cor da borda quando desabilitado
                },
              }}
            >
              {loading ? 'Loading...' : 'Synchronize'}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Corpo do aplicativo */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: 'calc(100% - 70px)', // Ajuste para respeitar o topbar
          backgroundColor: '#1C1C1C',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          overflow: 'hidden',
          p: 0,
          m: 0,
          marginTop: 5,
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
            On going searches
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
            disabled={isSubmitting || loading} // Desabilita enquanto o formulário está sendo submetido ou o sync/scan está em execução
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

      {/* Snackbar para mostrar o status de Scan and Repair */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // 3 segundos
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={loading ? "info" : "success"} sx={{ width: '100%' }}>
          {loading ? 'Scan and Repair is running...' : 'Process completed!'}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
