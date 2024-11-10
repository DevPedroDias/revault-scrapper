import { Box, Typography, Button } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

function UnderConstructionPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1C1C1C',
        color: '#FFD700',
        textAlign: 'center',
        width: '100vw',
        p: 3,
      }}
    >
      <ConstructionIcon sx={{ fontSize: 100, mb: 2, color: '#FFD700' }} />
      <Typography variant="h4" sx={{ mb: 2 }}>
        Under Construction
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: '#FFFFFF' }}>
        This page is currently under construction. Please check back later.
      </Typography>
      <Button
        variant="contained"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/')}
        sx={{
          backgroundColor: '#FFD700',
          color: '#000',
          '&:hover': { backgroundColor: '#FFC107' },
        }}
      >
        Back to Home
      </Button>
    </Box>
  );
}

export default UnderConstructionPage;
