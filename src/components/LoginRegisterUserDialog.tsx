import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Box, Button, Checkbox, DialogContentText, Snackbar, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import UserInfoInputComponents from './UserInfoInputComponents'
import axios from 'axios'
import { DEBUG, User } from '../utils/interfaces'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

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
    const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(false);

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
          let response = null
          if (!DEBUG) response = await axios.get('https://iunticket-fdba432ee24a.herokuapp.com/api/login?userName='+username+'&password='+password);
          else response = await axios.get('http://localhost:31491/api/login?userName='+username+'&password='+password);
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
          setErrorMessage("Username o password non specificati.")
          return
        }
        if (password.length < 8) {
          setShowError(true)
          setErrorMessage("La password deve contenere almeno 8 caratteri.")
          return
        }
        const nomeECognomeInseriti = nome !== '' && cognome !== ''
        if (instagram === '' && cellulare === ''  && email === ''  && !nomeECognomeInseriti) {
          setErrorMessage("Errore nella compilazione. Ti ricordo che devi inserire almeno un contatto.")
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
          let response = null
          if (!DEBUG) response = await axios.post('https://iunticket-fdba432ee24a.herokuapp.com/api/register', body);
          else response = await axios.post('http://localhost:31491/api/register', body);
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
          <DialogContentText style={{marginBottom:'10px'}}>
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

          {view === 'LOGIN' && 
          <Box style={{marginTop:'35px'}}>
            <Box>Se non hai ancora un account, per favore registrati qui.</Box>
            <Button style={{marginTop:'2px', marginLeft:'-8px'}} onClick={() => setView('REGISTER')}>Registrati</Button>
          </Box>}

          {view === 'REGISTER' &&
          <Accordion style={{marginTop:'20px'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            > 
              <Box display="flex" alignItems="center">
                <Checkbox
                  checked={privacyAccepted}
                  onChange={() => setPrivacyAccepted(!privacyAccepted)}
                  inputProps={{ 'aria-label': 'controlled' }}
                  style={{marginRight:'5px'}}
                />
                <Box>Accetto i termini legati alla privacy.</Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box> <span style={{ whiteSpace: 'pre-line' }}>
                  {"Grazie per aver scelto di registrarti su iUnTicket. La tua privacy è estremamente importante per noi e desideriamo informarti su come trattiamo i tuoi dati personali. \n\n1. Raccolta dei Dati: durante la registrazione, raccogliamo informazioni come il tuo nome, cognome, indirizzo email, nome Instagram e numero di cellulare. Questi dati sono necessari per fornirti i nostri servizi e far si che tu possa essere contattato nel momento in cui registri dei biglietti sulla piattaforma.\n\n2. Utilizzo dei Dati: i tuoi dati personali verranno utilizzati esclusivamente per scopi correlati ai servizi offerti da iUnTicket. Ci impegniamo a non condividere le tue informazioni con terze parti senza il tuo consenso esplicito, tranne nei casi previsti dalla legge.\n\n3. Sicurezza dei Dati: adottiamo misure di sicurezza adeguate per proteggere i tuoi dati personali da accessi non autorizzati, modifiche o divulgazioni. Utilizziamo protocolli di crittografia e altre tecnologie per garantire la sicurezza dei tuoi dati.\n\n4. Accesso e Modifica dei Dati: hai il diritto di accedere alle informazioni personali che abbiamo su di te e di richiederne la modifica o la cancellazione, se necessario. Per esercitare questi diritti o per qualsiasi altra domanda sulla privacy, ti preghiamo di contattarci tramite andreachiericati93@gmail.com.\n\n5. Cookie e Tracciamento: utilizziamo i cookie e altre tecnologie di tracciamento per migliorare l'esperienza degli utenti sul nostro sito. Puoi gestire le tue preferenze sui cookie attraverso le impostazioni del tuo browser.\n\nContinuando a utilizzare iUnTicket, accetti i nostri Termini di Servizio e la presente Informativa sulla Privacy. Ti preghiamo di leggerli attentamente.\nGrazie per la fiducia e la comprensione. Se hai domande o dubbi sulla nostra politica sulla privacy, non esitare a contattarci.\n\nCordiali saluti,\n\nteam di iUnTicket"}</span>
              </Box>
            </AccordionDetails>
          </Accordion>}
         
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={loginOrRegister} disabled={view === 'REGISTER' && !privacyAccepted} type="submit">{view === 'LOGIN' ? 'Login' : 'Register'}</Button>
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