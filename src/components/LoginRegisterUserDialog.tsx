import React, { useEffect, useState } from 'react';
import {
  Box, Button, Checkbox, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Snackbar, TextField,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import axios from 'axios';
import UserInfoInputComponents from './UserInfoInputComponents';
import { DEBUG_SERVER, User } from '../utils/interfaces';

interface Props {
  openDialog: boolean;
  setOpenDialog: (isOpen: boolean) => void;
  setMainView: (view: 'LOGGED' | 'NOT_LOGGED') => void;
  setLoggedUser: (user: User) => void;
}

const LoginRegisterUserDialog = ({
  openDialog,
  setOpenDialog,
  setMainView,
  setLoggedUser
}: Props) => {
  const [view, setView] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [instagram, setInstagram] = useState('');
  const [cellulare, setCellulare] = useState('');
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  useEffect(() => {
    setView('LOGIN');
    setUsername('');
    setPassword('');
    setNome('');
    setCognome('');
    setInstagram('');
    setCellulare('');
    setEmail('');
    setPrivacyAccepted(false);
  }, [openDialog]);

  const loginOrRegister = async () => {
    if (view === 'LOGIN') {
      try {
        const response = await axios.get(
          DEBUG_SERVER
            ? `http://localhost:31491/api/login?userName=${username}&password=${password}`
            : `https://www.iunticket.it/api/login?userName=${username}&password=${password}`
        );
        if (response.data && response.data.length > 0) {
          setLoggedUser(response.data[0]);
          setMainView('LOGGED');
          setOpenDialog(false);
        }
      } catch (e) {
        setErrorMessage('Username o password errati.');
        setShowError(true);
      }
    } else {
      if (username === '' || password === '') {
        setErrorMessage('Inserisci username e password.');
        setShowError(true);
        return;
      }
      if (password.length < 8) {
        setErrorMessage('La password deve contenere almeno 8 caratteri.');
        setShowError(true);
        return;
      }
      const nomeECognomeInseriti = nome !== '' && cognome !== '';
      if (instagram === '' && cellulare === '' && email === '' && !nomeECognomeInseriti) {
        setErrorMessage('Devi inserire almeno un contatto valido.');
        setShowError(true);
        return;
      }

      const today = new Date();
      const created = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

      try {
        const body = { userName: username, password, nome, cognome, instagram, cellulare, email, created };
        const response = await axios.post(
          DEBUG_SERVER
            ? 'http://localhost:31491/api/register'
            : 'https://www.iunticket.it/api/register',
          body
        );
        if (response.data && response.data.length > 0) {
          setLoggedUser(response.data[0]);
          setMainView('LOGGED');
          setOpenDialog(false);
        }
      } catch (e) {
        setErrorMessage('Username già esistente. Scegline un altro.');
        setShowError(true);
      }
    }
  };

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowError(false);
  };

  const handleCloseDialog = () => {
    setView('LOGIN');
    setOpenDialog(false);
  };

  return (
    <Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            background: 'linear-gradient(to bottom right, #e0f2fe, #f8fafc)',
            padding: '10px',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <EventAvailableIcon className="text-sky-500" />
            {view === 'LOGIN' ? 'Login' : 'Registrazione'}
          </Box>
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {view === 'LOGIN'
              ? 'Accedi al tuo account inserendo username e password.'
              : 'Compila i campi per registrarti su iUnTicket. Serve almeno un contatto verificabile.'}
          </DialogContentText>

          {view === 'LOGIN' ? (
            <Box>
              <TextField
                required
                margin="dense"
                id="username"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                variant="standard"
              />
              <TextField
                required
                margin="dense"
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                variant="standard"
              />
            </Box>
          ) : (
            <UserInfoInputComponents
              showPassword
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              nome={nome}
              setNome={setNome}
              cognome={cognome}
              setCognome={setCognome}
              instagram={instagram}
              setInstagram={setInstagram}
              cellulare={cellulare}
              setCellulare={setCellulare}
              email={email}
              setEmail={setEmail}
            />
          )}

          {view === 'LOGIN' ? (
            <Box mt={4} textAlign="center">
              <Box>Non hai un account?</Box>
              <Button onClick={() => setView('REGISTER')}>Registrati</Button>
            </Box>
          ) : (
            <Accordion sx={{ mt: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={privacyAccepted}
                    onChange={() => setPrivacyAccepted(!privacyAccepted)}
                    sx={{ mr: 1 }}
                  />
                  Accetto la Privacy Policy
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box whiteSpace="pre-line" fontSize="14px">
                  {"Grazie per aver scelto iUnTicket.\n\n1. I tuoi dati verranno utilizzati solo per finalità di contatto.\n2. Non condivideremo i tuoi dati senza consenso.\n3. Puoi sempre chiedere la cancellazione dei dati scrivendo a andreachiericati93@gmail.com.\n\nContinuando, accetti i nostri termini e la nostra privacy policy."}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button
            onClick={loginOrRegister}
            disabled={view === 'REGISTER' && !privacyAccepted}
          >
            {view === 'LOGIN' ? 'Login' : 'Registrati'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={errorMessage}
      />
    </Box>
  );
};

export default LoginRegisterUserDialog;