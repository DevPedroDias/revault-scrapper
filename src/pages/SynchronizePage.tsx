import { useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';

interface SynchronizeStats {
  unsyncedCount: number;
  totalSyncs: number;
}

const SynchronizePage = () => {
  const [stats, setStats] = useState<SynchronizeStats>({
    unsyncedCount: 45, // Exemplo de valor inicial
    totalSyncs: 10,    // Exemplo de valor inicial
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSynchronize = async () => {
    setIsSyncing(true);

    // Simulação de sincronização (substitua por uma chamada real de API)
    setTimeout(() => {
      setStats({
        unsyncedCount: 0,
        totalSyncs: stats.totalSyncs + 1,
      });
      setIsSyncing(false);
    }, 2000); // Simula um tempo de espera de 2 segundos
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: '#1C1C1C',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
      }}
    >
      <Typography variant="h4" sx={{ color: '#FFD700', mb: 3, textAlign: 'center' }}>
        Synchronize Sneakers
      </Typography>

      <Paper
        sx={{
          p: 3,
          backgroundColor: '#2E2E2E',
          borderRadius: 2,
          width: '400px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: '#FFF', mb: 2 }}>
          Unsynced Sneakers
        </Typography>
        <Typography variant="h3" sx={{ color: stats.unsyncedCount > 0 ? '#FF6F61' : '#A4DE02' }}>
          {stats.unsyncedCount}
        </Typography>

        <Typography variant="h6" sx={{ color: '#FFF', mt: 4, mb: 2 }}>
          Total Synchronizations
        </Typography>
        <Typography variant="h3" sx={{ color: '#2AA3E0' }}>
          {stats.totalSyncs}
        </Typography>
      </Paper>

      <Button
        variant="contained"
        onClick={handleSynchronize}
        disabled={isSyncing || stats.unsyncedCount === 0}
        sx={{
          mt: 2,
          backgroundColor: isSyncing ? '#555' : '#FFD700',
          color: '#000',
          '&:hover': { backgroundColor: '#FFC107' },
        }}
        startIcon={isSyncing && <CircularProgress size={20} sx={{ color: '#FFF' }} />}
      >
        {isSyncing ? 'Synchronizing...' : 'Synchronize'}
      </Button>
    </Box>
  );
};

export default SynchronizePage;
