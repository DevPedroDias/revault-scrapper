import { Box, Button, TextField, Typography } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';

function SearchFormPage() {
  const [name, setName] = useState<string>('');
  const [maxResults, setMaxResults] = useState<number>(48);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    if (event.target.value !== '') {
      setNameError(false);
    }
  };

  const handleMaxResultsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setMaxResults(isNaN(value) ? 10 : value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name === '') {
      setNameError(true); // Define o estado de erro se o nome estiver vazio
      return;
    }

    setIsSubmitting(true);

    await window.electronAPI.scrapDroper({
      keyword: name,
      maxResults,
    });

    setIsSubmitting(false);
  };

  return (
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
        onSubmit={handleSubmit} // Vincula o submit ao handler
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          width: '100%',
          backgroundColor: '#2E2E2E',
          p: 3,
          borderRadius: 2,
        }}
      >
        <TextField
          label="Keyword"
          value={name} // Vincula o valor ao estado
          onChange={handleNameChange} // Handler para atualização
          variant="outlined"
          fullWidth
          required
          error={nameError} // Exibe erro visual se o nome estiver vazio
          helperText={nameError ? 'Keyword is required' : ''}
          InputLabelProps={{ style: { color: '#FFD700' } }}
          InputProps={{
            style: { color: '#FFF', backgroundColor: '#333' },
          }}
        />
        <TextField
          label="Quantity"
          value={maxResults} // Vincula o valor ao estado
          onChange={handleMaxResultsChange} // Handler para atualização
          type="number"
          variant="outlined"
          fullWidth
          required
          InputLabelProps={{ style: { color: '#FFD700' } }}
          InputProps={{
            style: { color: '#FFF', backgroundColor: '#333' },
            inputProps: { min: 1 }, // Define o valor mínimo
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting} // Desativa o botão durante o envio
          sx={{
            backgroundColor: isSubmitting ? '#555' : '#FFD700',
            color: isSubmitting ? '#999' : '#000',
            '&:hover': {
              backgroundColor: isSubmitting ? '#555' : '#FFC107',
            },
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Search'}
        </Button>
      </Box>
    </Box>
  );
}

export default SearchFormPage;
