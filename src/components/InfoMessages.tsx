import { Alert, Box } from '@mui/material'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'

const InfoMessages = () => {

  return (
    <Box>
      <Alert icon={false} variant="outlined" severity="info" style={{marginBottom:"5px", fontSize:"18px"}}>
        <Box>
          <Box display="flex" alignItems={"center"} style={{marginBottom:"15px"}}>
            <SportsSoccerIcon fontSize="inherit" color="primary" style={{marginRight:"10px"}} />
            <Box>Stai cercando un biglietto per una partita dell'Inter? iUnTicket ti permette di visualizzare tutti i biglietti resi disponibili da altri utenti, scegliere 
                  quello più adatto a te e contattare direttamente il venditore!
            </Box>
          </Box>
          <Box display="flex" alignItems={"center"}>
            <ConfirmationNumberIcon fontSize="inherit" color="primary" style={{marginRight:"10px"}} />
            <Box>Devi cedere un biglietto per una partita dell'Inter? iUnTicket ti permette di inserire il tuo biglietto tra quelli disponibili cosi da farti contattare da chi è interessato! 
              Per inserire i tuoi biglietti sarà necessaria la registrazione.
            </Box>
          </Box>
        </Box>
      </Alert>
    </Box>
  );
};

export default InfoMessages;