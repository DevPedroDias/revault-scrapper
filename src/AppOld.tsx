// import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Drawer, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import SyncIcon from '@mui/icons-material/Sync';
import ListIcon from '@mui/icons-material/List';
import PersonIcon from '@mui/icons-material/Person';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
// import logo from './assets/logo.svg';

// // Enum com os status
// enum StatusScrap {
//   starting = 'STARTING',
//   started = 'STARTED',
//   inProgess = 'IN_PROGRESS',
//   searchFinished = 'SEARCH_FINISHED',
//   savingFile = 'SAVING_FILE',
//   finished = 'FINISHED',
//   error = 'ERROR',
//   startingDataCompilation = 'IN_DATA_COMPILATION',
//   finishedDataCompilation = 'FINISHED_DATA_COMPILATION',
// }

// interface ProcessStatus {
//   id?: number;
//   type: StatusScrap;
//   message?: string;
// }

// interface LogEntry {
//   id: number;
//   status: string;
//   input: string;
//   search_quantity: number;
//   message: string;
//   filename: string;
//   created_at: string;
// }

function App() {
  // const [name, setName] = useState<string>('');
  // const [maxResults, setMaxResults] = useState<number>(48);
  // const [processes, setProcesses] = useState<ProcessStatus[]>([]);
  // const [logs, setLogs] = useState<LogEntry[]>([]);
  // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // const [nameError, setNameError] = useState<boolean>(false); // Estado para controlar o erro do campo de nome
  // const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  // const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); // Estado do Snackbar
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento para Scan and Repair ou Synchronize

  // const checkConnection = async () => {
  //   const isConnected = await window.electronAPI.checkInternet(); // Chama a função do processo principal
  //   setIsOnline(isConnected);
  // };

  // const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setName(event.target.value);
  //   if (event.target.value !== '') {
  //     setNameError(false); // Remove o erro ao corrigir o campo
  //   }
  // };

  // const handleMaxResultsChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(event.target.value, 10);
  //   setMaxResults(isNaN(value) ? 10 : value);
  // };

  // const fetchLogs = async () => {
  //   const logsFromDb = await window.electronAPI.listLogs();
  //   setLogs(logsFromDb as LogEntry[]);
  // };

  // const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   if (name === '') {
  //     setNameError(true); // Define o estado de erro se o nome estiver vazio
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   const newProcess: ProcessStatus = { id: undefined, type: StatusScrap.starting };
  //   setProcesses([...processes, newProcess]);

  //   await window.electronAPI.scrapDroper({
  //     keyword: name,
  //     maxResults,
  //   });
  // };

  // const handleSnackbarClose = () => {
  //   setSnackbarOpen(false);
  // };

  // useEffect(() => {
  //   // Verificar a conexão inicial
  //   checkConnection();

  //   // Listeners para os eventos de "online" e "offline" do navegador
  //   window.addEventListener('online', checkConnection);
  //   window.addEventListener('offline', checkConnection);

  //   // Verificações periódicas para garantir a conexão real
  //   const intervalId = setInterval(() => {
  //     checkConnection();
  //   }, 10000); // Verifica a cada 10 segundos

  //   return () => {
  //     // Limpa o intervalo e os event listeners ao desmontar o componente
  //     clearInterval(intervalId);
  //     window.removeEventListener('online', checkConnection);
  //     window.removeEventListener('offline', checkConnection);
  //   };
  // }, []);

  // useEffect(() => {
  //   const handleStatusUpdate = (newStatus: { type: string; message?: string; logId?: number }) => {
  //     setProcesses((currentProcesses) =>
  //       currentProcesses
  //         .map((process) => {
  //           if (process.id === newStatus.logId) {
  //             return { ...process, type: newStatus.type as StatusScrap, message: newStatus.message };
  //           } else if (!process.id && newStatus.type === StatusScrap.inProgess) {
  //             return { ...process, id: newStatus.logId, type: newStatus.type as StatusScrap, message: newStatus.message };
  //           }
  //           return process;
  //         })
  //         .filter(() => {
  //           if (newStatus.type === StatusScrap.finished || newStatus.type === StatusScrap.error) {
  //             window.electronAPI.removeStatusListener();
  //             return false;
  //           }
  //           return true;
  //         })
  //     );

  //     if (newStatus.type === StatusScrap.finished || newStatus.type === StatusScrap.finishedDataCompilation || newStatus.type === StatusScrap.error) {
  //       fetchLogs();
  //     }

  //     if (newStatus.type === StatusScrap.inProgess) {
  //       setIsSubmitting(false);
  //     }
  //   };

  //   window.electronAPI.onStatusUpdate(handleStatusUpdate);

  //   return () => {
  //     window.electronAPI.removeStatusListener();
  //   };
  // }, [processes]);

  // useEffect(() => {
  //   fetchLogs();
  // }, []);

  // const getStatusColor = (status: StatusScrap) => {
  //   switch (status) {
  //     case StatusScrap.finished:
  //     case StatusScrap.finishedDataCompilation:
  //       return '#A4DE02'; // Cor verde suave
  //     case StatusScrap.inProgess:
  //       return '#2AA3E0'; // Azul suave
  //     case StatusScrap.error:
  //       return '#FF6F61'; // Vermelho pastel
  //     default:
  //       return '#CCCCCC'; // Cinza suave
  //   }
  // };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#1C1C1C' }}>
  {/* Sidebar */}
  <Drawer
    variant="permanent"
    sx={{
      width: 240,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: '#121212', color: '#FFD700' },
    }}
  >
    <List>
      <ListItemButton>
        <ListItemIcon>
          <PersonIcon sx={{ color: '#FFD700' }} />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
          <HistoryIcon sx={{ color: '#FFD700' }} />
        </ListItemIcon>
        <ListItemText primary="Search History" />
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
          <SyncIcon sx={{ color: '#FFD700' }} />
        </ListItemIcon>
        <ListItemText primary="Sync" />
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
          <ListIcon sx={{ color: '#FFD700' }} />
        </ListItemIcon>
        <ListItemText primary="Sneaker List" />
      </ListItemButton>

      <ListItemButton selected>
        <ListItemIcon>
          <SearchIcon sx={{ color: '#FFD700' }} />
        </ListItemIcon>
        <ListItemText primary="Search Form" />
      </ListItemButton>
    </List>

    <Box sx={{ mt: 'auto', p: 2 }}>
      <Button
        startIcon={<HeadsetMicIcon />}
        fullWidth
        sx={{ color: '#FFD700', border: '1px solid #FFD700', textTransform: 'none' }}
      >
        Contact Support
      </Button>
    </Box>
  </Drawer>

  {/* Main Content */}
  <Box
    sx={{
      flexGrow: 1,
      p: 3,
      backgroundColor: '#1C1C1C',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Typography
      variant="h4"
      sx={{
        color: '#FFD700',
        mb: 3,
        textAlign: 'center',
      }}
    >
      Sneaker Search
    </Typography>

    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        width: '100%',
        backgroundColor: '#2E2E2E',
        p: 3,
        borderRadius: 2,
        alignSelf: 'center',
      }}
    >
      <TextField
        label="Keyword"
        variant="outlined"
        fullWidth
        InputLabelProps={{ style: { color: '#FFD700' } }}
        InputProps={{
          style: { color: '#FFF', backgroundColor: '#333' },
        }}
      />
      <TextField
        label="Quantity"
        type="number"
        variant="outlined"
        fullWidth
        InputLabelProps={{ style: { color: '#FFD700' } }}
        InputProps={{
          style: { color: '#FFF', backgroundColor: '#333' },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: '#FFD700',
          color: '#000',
          '&:hover': { backgroundColor: '#FFC107' },
        }}
      >
        Search
      </Button>
    </Box>
  </Box>
</Box>

  );
}

export default App;
