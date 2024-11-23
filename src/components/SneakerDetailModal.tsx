import { Modal, Box, Typography, Button, Divider } from '@mui/material';

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

const SneakerDetailsModal = ({
  open,
  sneaker,
  onClose,
}: {
  open: boolean;
  sneaker: Sneaker;
  onClose: () => void;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          backgroundColor: '#2E2E2E',
          color: '#FFF',
          p: 4,
          borderRadius: 3,
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Título centralizado */}
        <Typography variant="h5" sx={{ color: '#FFD700', mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
          Sneaker Details
        </Typography>

        <Divider sx={{ width: '100%', mb: 2, backgroundColor: '#FFD700' }} />

        {/* Conteúdo do card */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: '100%',
          }}
        >
          <Typography variant="body2"><strong>SKU:</strong> {sneaker.sku}</Typography>
          <Typography variant="body2"><strong>Name:</strong> {sneaker.name}</Typography>
          <Typography variant="body2"><strong>Price:</strong> {sneaker.price}</Typography>
          <Typography variant="body2"><strong>Description:</strong> {sneaker.description}</Typography>
          <Typography variant="body2"><strong>Release Date:</strong> {sneaker.releaseDate}</Typography>
          <Typography variant="body2"><strong>Brand:</strong> {sneaker.brand}</Typography>
          <Typography variant="body2"><strong>Silhouette:</strong> {sneaker.silhouette}</Typography>
          <Typography variant="body2"><strong>Release Price:</strong> {sneaker.releasePrice}</Typography>
          <Typography variant="body2"><strong>Color:</strong> {sneaker.color}</Typography>

          {/* Links de imagens */}
          <Typography variant="body2"><strong>Images:</strong></Typography>
          {sneaker.imageLinks.map((link, index) => (
            <Typography key={index} variant="body2">
              <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700' }}>
                Image {index + 1}
              </a>
            </Typography>
          ))}
        </Box>

        <Divider sx={{ width: '100%', mt: 2, backgroundColor: '#FFD700' }} />

        {/* Botão de fechamento */}
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            mt: 2,
            backgroundColor: '#FFD700',
            color: '#000',
            '&:hover': { backgroundColor: '#FFC107' },
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default SneakerDetailsModal;
