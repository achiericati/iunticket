import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Box, Button, DialogContentText, Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import UserInfoInputComponents from './UserInfoInputComponents'
import axios from 'axios'
import { DEBUG, User } from '../utils/interfaces'

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
          setPassword(loggedUser.password)
          setNome(loggedUser.nome || '')
          setCognome(loggedUser.cognome || '')
          setInstagram(loggedUser.instagram || '')
          setCellulare(loggedUser.cellulare || '')
          setEmail(loggedUser.mail || '')
        }
    }, [openDialog, loggedUser]);

    const editUser = async () => {
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
      try {
        const body = {
          userName: username,
          password: password,
          nome: nome,
          cognome: cognome,
          instagram: instagram,
          cellulare: cellulare,
          email: email,
        }
        let response = null
        if (!DEBUG) response = await axios.post('https://www.iunticket.it/api/editUser', body);
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
          <DialogContentText>
            {'Modifica qui i tuoi dati. Ti ricordo che sarà necessario almeno un contatto tra Instagram, Facebook (nome e cognome), email o cellulare.'}
          </DialogContentText>
        
          <Box>
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