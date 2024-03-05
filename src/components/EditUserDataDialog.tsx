import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Box, Button, DialogContentText, Snackbar, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import UserInfoInputComponents from './UserInfoInputComponents'
import axios from 'axios'
import { DEBUG_SERVER, User } from '../utils/interfaces'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'

interface Props {
    openDialog: boolean;
    setOpenDialog: (isOpen: boolean) => void
    loggedUser: User|null
    setLoggedUser: (user: User|null) => void
  }

const EditUserDataDialog = ({
    openDialog,
    setOpenDialog,
    loggedUser,
    setLoggedUser
  }: Props) => {
    const [username, setUsername] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [cognome, setCognome] = useState<string>('');
    const [instagram, setInstagram] = useState<string>('');
    const [cellulare, setCellulare] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (loggedUser) {
          setUsername(loggedUser.username)
          setNome(loggedUser.nome || '')
          setCognome(loggedUser.cognome || '')
          setInstagram(loggedUser.instagram || '')
          setCellulare(loggedUser.cellulare || '')
          setEmail(loggedUser.mail || '')
        }
    }, [openDialog, loggedUser]);

    const editUser = async () => {
      if (currentPassword === '') {
        setErrorMessage("Password attuale non inserita")
        setShowError(true)
        return
      }
      if (password !== '' && password.length < 8) {
        setShowError(true)
        setErrorMessage("La nupva password deve contenere almeno 8 caratteri.")
        return
      }
      const nomeECognomeInseriti = nome !== '' && cognome !== ''
      if (instagram === '' && cellulare === ''  && email === ''  && !nomeECognomeInseriti) {
        setErrorMessage("Errore nella compilazione. Ti ricordo che devi inserire username, passowrd e almeno un contatto.")
        setShowError(true) 
        return
      }
      try {
        const body = {
          userName: username,
          password: currentPassword,
          nuova_password: password,
          nome: nome,
          cognome: cognome,
          instagram: instagram,
          cellulare: cellulare,
          email: email,
        }
        let response = null
        if (!DEBUG_SERVER) response = await axios.post('https://www.iunticket.it/api/editUser', body);
        else response = await axios.post('http://localhost:31491/api/editUser', body);
        setLoggedUser(response.data[0])
        if (response.data && response.data.length > 0) setLoggedUser(response.data[0])
        setOpenDialog(false)
      }
      catch (e) {
        setErrorMessage("Username già esistente, provane un altro.")
        setShowError(true)
      }
    };

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setShowError(false);
    };

    const handleCloseDialog = () => {
      setOpenDialog(false);
    };

  return (
    <Box>
 <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>{'Modifica dati'}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{marginBottom:'15px'}}>
            {'Modifica qui i tuoi dati. Sarà necessario inserire la password attuale (e la nuova password se desideri modificarla), e almeno un contatto tra Instagram, Facebook (nome e cognome), email o cellulare.'}
          </DialogContentText>
        
          <Box>
          <TextField
            margin="dense"
            id="password"
            name="password"
            label={<Box display="flex" alignItems="center"> <PermIdentityIcon color="primary" style={{marginRight:"5px"}}></PermIdentityIcon>{"Password attuale*"}</Box>}
            value={currentPassword}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCurrentPassword(event.target.value);
                }}
            type="password"
            style={{marginBottom:'20px'}}
            variant="standard"
              />
            <UserInfoInputComponents showPassword={true} disableUsername={true}
              username={username} setUsername={setUsername}
              password={password} setPassword={setPassword}
              nome={nome} setNome={setNome}
              cognome={cognome} setCognome={setCognome}
              instagram={instagram} setInstagram={setInstagram}
              cellulare={cellulare} setCellulare={setCellulare}
              email={email} setEmail={setEmail}
            ></UserInfoInputComponents>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={editUser} type="submit">{'Save'}</Button>
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

export default EditUserDataDialog;