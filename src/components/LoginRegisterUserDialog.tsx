import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Box, Button, DialogContentText, Snackbar, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import UserInfoInputComponents from './UserInfoInputComponents'
import axios from 'axios'
import { UserContext } from '../utils/userContext'
import { User } from '../utils/interfaces'

interface Props {
    openDialog: boolean;
    setOpenDialog: (isOpen: boolean) => void
    setMainView: (view: 'LOGGED'|'NOT_LOGGED') => void
    setLoggedUser: (user: User) => void
  }

const LoginRegisterUserDialog = ({
    openDialog,
    setOpenDialog,
    setMainView,
    setLoggedUser
  }: Props) => {
    const [view, setView] = useState<'LOGIN'|'REGISTER'>('LOGIN');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [cognome, setCognome] = useState<string>('');
    const [instagram, setInstagram] = useState<string>('');
    const [cellulare, setCellulare] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
      setUsername('')
      setPassword('')
      setNome('')
      setCognome('')
      setInstagram('')
      setCellulare('')
      setEmail('')
    }, [openDialog]);

    const loginOrRegister = async () => {
      if (view === 'LOGIN') {
        try {
          const response = await axios.get('http://localhost:3001/api/login?userName='+username+'&password='+password);
          if (response.data && response.data.length > 0) setLoggedUser(response.data[0])
          setMainView('LOGGED')
          setLoggedUser(response.data[0])
          setOpenDialog(false)
        }
        catch (e) {
          setErrorMessage("Username o password sbagliati.")
          setShowError(true)
        }
      }
      else { // REGISTER
        if (username === '' || password === '') {
          setShowError(true)
          return
        }
        const nomeECognomeInseriti = nome !== '' && cognome !== ''
        if (instagram === '' && cellulare === ''  && email === ''  && !nomeECognomeInseriti) {
          setErrorMessage("Errore nella compilazione. Ti ricordo che devi inserire username, passowrd e almeno un contatto.")
          setShowError(true) 
          return
        }

        const today: Date = new Date();
        const created: string = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

        try {
          const body = {
            userName: username,
            password: password,
            nome: nome,
            cognome: cognome,
            instagram: instagram,
            cellulare: cellulare,
            email: email,
            created: created
          }
          const response = await axios.post('http://localhost:3001/api/register', body);

          if (response.data && response.data.length > 0) setLoggedUser(response.data[0])
          setMainView('LOGGED')
          setOpenDialog(false)
        }
        catch (e) {
          setErrorMessage("Username già esistente, provane un altro.")
          setShowError(true)
        }
      }
    };

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setShowError(false);
    };

    const handleCloseDialog = () => {
      setView('LOGIN')
      setOpenDialog(false);
    };

  return (
    <Box>
 <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>{view === 'LOGIN' ? 'Login' : 'Register'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {view === 'LOGIN' && 'Inserisci il tuo username e la tua password per effettuare il login.'}
            {view === 'REGISTER' && 'Inserisci i tuoi dati per effettuare la registrazione. Sarà necessario almeno un contatto tra Instagram, Facebook (nome e cognome), email o cellulare.'}
          </DialogContentText>
          {view === "LOGIN" && 
          <Box>
             <TextField
            autoFocus
            required
            margin="dense"
            id="username"
            name="username"
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(event.target.value);
            }}
            label="Username"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="password"
            name="password"
            label="Password"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
          }}
            type="password"
            fullWidth
            variant="standard"
          />
          </Box>}
         
          {view === "REGISTER" &&
          <Box>
            <UserInfoInputComponents showPassword={true} 
              username={username} setUsername={setUsername}
              password={password} setPassword={setPassword}
              nome={nome} setNome={setNome}
              cognome={cognome} setCognome={setCognome}
              instagram={instagram} setInstagram={setInstagram}
              cellulare={cellulare} setCellulare={setCellulare}
              email={email} setEmail={setEmail}
            ></UserInfoInputComponents>
          </Box>}

          {view === 'LOGIN' && <Box style={{marginTop:'10px'}} display={"flex"} alignItems="center">
            <div>Se non hai ancora un account, per favore</div>
            <Button style={{marginTop:'2px'}} onClick={() => setView('REGISTER')}>Registrati</Button>
            <div>qui.</div>
          </Box>}
         
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={loginOrRegister} type="submit">{view === 'LOGIN' ? 'Login' : 'Register'}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
          open={showError}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={errorMessage}
        />
    </Box>
      /* nota sulla privacy TODO --> specifica che i dati non verranno usati in alcun modo --> chiedi a chatGPT di creare un testo adatto. */
  );
};

export default LoginRegisterUserDialog;