import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Paper, List, ListItem, ListItemText } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Search, { SearchStatus } from '../domain/entity/Search';

const statusColors: { [key: string]: string } = {
  'STARTED': '#2AA3E0',
  'IN_PROGRESS': '#2AA3E0',
  'Queued': '#FFD700',
  'SEARCH_FINISHED': '#A4DE02',
  'FINISHED': '#A4DE02',
  'ERROR': '#FF6F61',
};

const FloatingWidgetList = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [searches, setSearches] = useState<Search[]>([]);

  useEffect(() => {
    const handleStatusUpdate = (newSearch: Search) => {
      setSearches((currentProcesses) => {
        const existingProcess = currentProcesses.find((process) => process.id === newSearch.id);

        if (!existingProcess) {
          return [...currentProcesses, newSearch];
        }

        const updatedProcesses = currentProcesses.map((process) =>
          process.id === newSearch.id ? newSearch : process
        );

        if (newSearch.status !== SearchStatus.finished && newSearch.status !== SearchStatus.error) {
          return updatedProcesses;
        }

        return updatedProcesses.filter((process) => process.id !== newSearch.id);
      });
    };

    window.electronAPI.onStatusUpdate(handleStatusUpdate);

    return () => {
      window.electronAPI.removeStatusListener();
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: isMinimized ? 300 : 400,
        backgroundColor: '#2E2E2E',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Paper
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFD700',
          color: '#000',
          p: 1,
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Ongoing Searches
        </Typography>
        <IconButton
          onClick={() => setIsMinimized(!isMinimized)}
          size="small"
          sx={{ color: '#000' }}
        >
          {isMinimized ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Paper>

      {!isMinimized && (
        <List
          sx={{
            maxHeight: 200,
            overflowY: 'auto',
            backgroundColor: '#1C1C1C',
          }}
        >
          {searches.length > 0 ? (
            searches.map((search) => (
              <ListItem key={search.id} divider>
                <ListItemText
                  primary={`#${search.id} - ${search.keyword}`}
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        sx={{ color: statusColors[search.status] || '#FFF' }}
                      >
                        Status: {search.status}
                      </Typography>
                      {search.message && (
                        <Typography
                          variant="body2"
                          sx={{ color: '#FFF', mt: 0.5 }}
                        >
                          Message: {search.message}
                        </Typography>
                      )}
                    </>
                  }
                  sx={{ color: '#FFF' }}
                />
              </ListItem>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                p: 2,
                color: '#FFF',
              }}
            >
              No ongoing searches.
            </Typography>
          )}
        </List>
      )}
    </Box>
  );
};

export default FloatingWidgetList;
