import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent, Chip } from '@mui/material';

// Enum com os status
enum StatusScrap {
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
  id: number;
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Controle para bloquear o botão

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleMaxResultsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setMaxResults(isNaN(value) ? 10 : value);
  };

  // Função para buscar logs do banco de dados
  const fetchLogs = async () => {
    const logsFromDb = await window.electronAPI.listLogs();
    setLogs((logsFromDb as LogEntry[]));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newProcessId = processes.length + 1;
    setIsSubmitting(true); // Bloqueia o botão de envio

    // Criar um novo processo com ID único
    setProcesses([...processes, { id: newProcessId, type: StatusScrap.started }]);

    // Iniciar o scrapDroper com o ID associado
    await window.electronAPI.scrapDroper({
      keyword: name,
      maxResults,
      logId: newProcessId, // Passando o ID do processo para o backend
    });
  };

  // Atualizar os status dos processos em andamento
  useEffect(() => {
    window.electronAPI.onStatusUpdate((status: { type: string, message?: string, logId?: number }) => {
      console.log(status);

      // Atualiza o processo específico pelo ID e remove o processo se o status for 'finishedDataCompilation'
      setProcesses((prevProcesses) =>
        prevProcesses
          .map((process) =>
            process.id === status.logId
              ? { ...process, type: status.type as StatusScrap, message: status.message }
              : process
          )
          // Remove o processo da lista quando o status for 'finishedDataCompilation'
          .filter((process) => {
            if (process.type === StatusScrap.finishedDataCompilation) {
              fetchLogs(); // Chama o fetchLogs quando o processo é removido
              return false; // Remove o processo
            }
            return true;
          })
      );

      // Desbloqueia o botão quando o status chegar em 'IN_PROGRESS'
      if (status.type === StatusScrap.inProgess) {
        setIsSubmitting(false); // Desbloqueia o botão
      }
    });

    return () => {
    };
  }, []);

  // Buscar logs ao iniciar
  useEffect(() => {
    fetchLogs();
  }, []);

  // Função auxiliar para aplicar cores aos status
  const getStatusColor = (status: StatusScrap) => {
    switch (status) {
      case StatusScrap.finished:
      case StatusScrap.finishedDataCompilation:
        return 'success';
      case StatusScrap.inProgess:
        return 'primary';
      case StatusScrap.error:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh', // A altura total deve ocupar a janela inteira
        backgroundColor: '#f4f6f8', // Cor de fundo suave
        justifyContent: 'space-between', // Grudar nas extremidades
        alignItems: 'center', // Centraliza o conteúdo verticalmente
        gap: 2,
        overflow: 'hidden', // Impede que a tela principal role
        p: 0,
        m: 0,
        width: '100vw',
      }}
    >
      {/* Coluna da esquerda: Processos em andamento */}
      <Box
        sx={{
          flex: 1,
          height: '100%', // Ocupa toda a altura disponível
          overflowY: 'auto', // Ativa o scroll vertical
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Sombra leve para card moderno
          p: 2,
          maxHeight: '100vh', // Limita a altura ao tamanho da tela
        }}
      >
        <Typography variant="h6" gutterBottom>
          Processos em andamento
        </Typography>
        {processes.map((process) => (
          <Card key={process.id} sx={{ mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <CardContent>
              <Typography variant="body1" fontWeight="bold">
                Processo #{process.id}
              </Typography>
              <Chip
                label={process.type}
                color={getStatusColor(process.type)}
                sx={{ mb: 1 }}
              />
              {process.message && (
                <Typography variant="body2" color="textSecondary">
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
          width: '400px', // Tamanho padrão do formulário
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          p: 4,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Sombra leve para card moderno
        }}
      >
        <Typography variant="h6" gutterBottom>
          Formulário de Busca
        </Typography>
        <TextField
          label="Nome"
          value={name}
          onChange={handleNameChange}
          fullWidth
          required
          variant="outlined"
          sx={{ backgroundColor: '#fafafa', borderRadius: 1 }} // Cor de fundo suave
        />
        <TextField
          label="Máximo de Resultados"
          type="number"
          value={maxResults}
          onChange={handleMaxResultsChange}
          fullWidth
          required
          InputProps={{ inputProps: { min: 1 } }}
          variant="outlined"
          sx={{ backgroundColor: '#fafafa', borderRadius: 1 }} // Cor de fundo suave
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ py: 1.5 }}
          disabled={isSubmitting} // Bloqueia o botão se estiver enviando
        >
          Buscar
        </Button>
      </Box>

      {/* Coluna da direita: Logs */}
      <Box
        sx={{
          flex: 1,
          height: '100%', // Ocupa toda a altura disponível
          overflowY: 'auto', // Ativa o scroll vertical
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Sombra leve para card moderno
          p: 2,
          maxHeight: '100vh', // Limita a altura ao tamanho da tela
        }}
      >
        <Typography variant="h6" gutterBottom>
          Logs de Buscas
        </Typography>
        {logs.map((log) => (
          <Card key={log.id} sx={{ mb: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <CardContent>
              <Typography variant="body1" fontWeight="bold">
                Log #{log.id}
              </Typography>
              <Chip
                label={log.status}
                color={getStatusColor(log.status as StatusScrap)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Input:</strong> {log.input}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Quantidade:</strong> {log.search_quantity}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Arquivo:</strong> {log.filename}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Criado em:</strong> {log.created_at}
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
