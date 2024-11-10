import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import SyncIcon from '@mui/icons-material/Sync';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import logo from './../assets/logo.svg'

function Menu() {
  const location = useLocation(); // Pega a rota atual

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: '#121212', color: '#FFD700' },
      }}
    >
      {/* Espaço para a logo */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100, // Altura do espaço da logo
          backgroundColor: '#1C1C1C', // Cor de fundo para a área da logo
          borderBottom: '1px solid #FFD700', // Linha divisória
        }}
      >
        <img src={logo} alt="Logo" style={{ maxHeight: '70%', maxWidth: '80%' }} />
      </Box>

      <List>
        <ListItemButton component={Link} to="/profile" selected={location.pathname === '/profile'}>
          <ListItemIcon>
            <PersonIcon sx={{ color: '#FFD700' }} />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>

        <ListItemButton component={Link} to="/search-history" selected={location.pathname === '/search-history'}>
          <ListItemIcon>
            <HistoryIcon sx={{ color: '#FFD700' }} />
          </ListItemIcon>
          <ListItemText primary="Search History" />
        </ListItemButton>

        <ListItemButton component={Link} to="/sync" selected={location.pathname === '/sync'}>
          <ListItemIcon>
            <SyncIcon sx={{ color: '#FFD700' }} />
          </ListItemIcon>
          <ListItemText primary="Sync" />
        </ListItemButton>

        <ListItemButton component={Link} to="/sneaker-list" selected={location.pathname === '/sneaker-list'}>
          <ListItemIcon>
            <ListIcon sx={{ color: '#FFD700' }} />
          </ListItemIcon>
          <ListItemText primary="Sneaker List" />
        </ListItemButton>

        <ListItemButton component={Link} to="/search-form" selected={location.pathname === '/search-form'}>
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
  );
}

export default Menu;
