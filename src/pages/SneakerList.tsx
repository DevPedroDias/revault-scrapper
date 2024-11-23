import React, { useEffect, useState } from 'react';
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
  Button,
  Pagination,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SneakerDetailsModal from '../components/SneakerDetailModal';

interface Sneaker {
  id: number;
  sku: string;
  name: string;
  price: string;
  description: string;
  imageLinks: string[];
  releaseDate: string;
  brand: string;
  silhouette: string;
  releasePrice: string;
  color: string;
  synced: number;
}

export interface SneakerPageData {
  data: Sneaker[];
  total: number;
  totalPages: number;
}

const SneakerListPage = () => {
  const [selectedSneaker, setSelectedSneaker] = useState<Sneaker | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchSneakers = async (page: number) => {
    const sneakersPageData = await window.electronAPI.listSneakers({ page }) as SneakerPageData;
    setSneakers(sneakersPageData.data as Sneaker[]);
    setTotalPages(sneakersPageData.totalPages);
  };

  useEffect(() => {
    fetchSneakers(currentPage);
  }, [currentPage]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (sneaker: Sneaker) => {
    setSelectedSneaker(sneaker);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedSneaker(null);
    setOpenModal(false);
  };

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
        Sneaker List
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
            maxHeight: 500,
            backgroundColor: '#1C1C1C',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold', backgroundColor: '#1C1C1C' }}>SKU</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold', backgroundColor: '#1C1C1C' }}>Name</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold', backgroundColor: '#1C1C1C' }}>Is Sync</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold', backgroundColor: '#1C1C1C' }}>Brand</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold', backgroundColor: '#1C1C1C' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sneakers.length > 0 ? (
                sneakers.map((sneaker) => (
                  <TableRow key={sneaker.id} hover>
                    <TableCell sx={{ color: '#FFF' }}>{sneaker.sku}</TableCell>
                    <TableCell sx={{ color: '#FFF' }}>{sneaker.name}</TableCell>
                    <TableCell sx={{ color: '#FFF' }}>
                      {sneaker.synced ? (
                        <Chip
                          icon={<CheckCircleIcon sx={{ color: '#A4DE02' }} />}
                          label="Synced"
                          sx={{
                            backgroundColor: '#A4DE02',
                            color: '#000',
                            fontWeight: 'bold',
                          }}
                        />
                      ) : (
                        <Chip
                          icon={<CancelIcon sx={{ color: '#FF6F61' }} />}
                          label="Not Synced"
                          sx={{
                            backgroundColor: '#FF6F61',
                            color: '#FFF',
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#FFF' }}>{sneaker.brand}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#FFD700',
                          color: '#000',
                          '&:hover': { backgroundColor: '#FFC107' },
                        }}
                        onClick={() => handleOpenModal(sneaker)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', color: '#FFF' }}>
                    No sneaker data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Componente de Paginação */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Paper>

      {selectedSneaker && (
        <SneakerDetailsModal
          open={openModal}
          sneaker={selectedSneaker}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
};

export default SneakerListPage;
