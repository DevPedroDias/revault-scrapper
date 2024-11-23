import { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile>({
    name: 'John Doe', // Valores iniciais simulados
    email: 'john.doe@example.com',
    isLoggedIn: false,
  });

  useEffect(() => {
    // Simula a chamada de API para buscar os dados do usuário
    setTimeout(() => {
      setUser({
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        isLoggedIn: true, // Simula o estado de conexão
      });
    }, 1000); // Simula um atraso de 1 segundo para carregamento
  }, []);

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
        User Profile
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
        {/* Nome e Email na mesma linha */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="body1" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
            Name:
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFF' }}>
            {user.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="body1" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
            Email:
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFF' }}>
            {user.email}
          </Typography>
        </Box>

        {/* Mensagem de conexão */}
        {user.isLoggedIn ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
            <CheckCircleIcon sx={{ color: '#A4DE02', fontSize: 30 }} />
            <Typography variant="body1" sx={{ color: '#A4DE02', fontWeight: 'bold' }}>
              Connected to the server
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
            <ErrorIcon sx={{ color: '#FF6F61', fontSize: 30 }} />
            <Typography variant="body1" sx={{ color: '#FF6F61', fontWeight: 'bold' }}>
              Not connected to the server
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage;
