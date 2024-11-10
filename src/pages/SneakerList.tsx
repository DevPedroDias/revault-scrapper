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
} from '@mui/material';
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
    const sneakersPageData = await window.electronAPI.listSneakers({page}) as SneakerPageData;
    console.log(sneakersPageData)
    setSneakers(sneakersPageData.data as Sneaker[]);
    setTotalPages(sneakersPageData.totalPages); // Atualiza o total de páginas com base no retorno
  };

  useEffect(() => {
    fetchSneakers(currentPage); // Busca dados ao carregar a página ou mudar de página
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
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold', backgroundColor: '#1C1C1C' }}>Price</TableCell>
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
                    <TableCell sx={{ color: '#FFF' }}>{sneaker.price}</TableCell>
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
            count={totalPages} // Total de páginas
            page={currentPage} // Página atual
            onChange={handlePageChange} // Handler para mudança de página
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
