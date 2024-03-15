import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import { DEBUG_SERVER, Match, Ticket } from '../utils/interfaces'
import { Button } from '@mui/material'
import { Box } from '@mui/material'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import axios from 'axios'

interface Props {
    open: boolean;
    setOpen: (isOpen: boolean) => void
    ticketToDelete: Ticket|undefined
    tickets: Ticket[]
    setTickets: (tickets: Ticket[]) => void
    matches: Match[]
    setMatches: (matches: Match[]) => void
    currentMatch: Match | undefined
  }

const DeleteTicketsDialog = ({
  open,
  setOpen,
  ticketToDelete,
  tickets,
  setTickets,
  matches,
  setMatches,
  currentMatch
  }: Props) => {

    const handleClose = () => {
      setOpen(false);
    };

    const handleDeleteickets = async () => {
      try {
        const body = {
          ticketID: ticketToDelete?.ID
        }
        if (!DEBUG_SERVER) await axios.post('https://www.iunticket.it/api/deleteTickets', body);
        else await axios.post('http://localhost:31491/api/deleteTickets', body);
        const newTickets = tickets.filter(el => el.ID !== ticketToDelete?.ID)
        setTickets(newTickets)

        const newMatches = [...matches]
          for (let match of newMatches) {
            if (match.ID === currentMatch?.ID) {
              match.bigliettiDisponibili = match.bigliettiDisponibili - 1

              if (ticketToDelete && ticketToDelete.prezzo !== undefined && match.prezzoMin === ticketToDelete.prezzo) {
                let prezzoMin = undefined
                for (let ticket of newTickets) {
                  if (prezzoMin === undefined) prezzoMin = ticket.prezzo
                  else if (ticket.prezzo && ticket.prezzo < prezzoMin) prezzoMin = ticket.prezzo
                }
                match.prezzoMin = prezzoMin
              }
            }
          }
          setMatches(newMatches)
      }
      catch (e) {}
      setOpen(false);
    };

    return (
      <Dialog
      open={open}
      onClose={handleClose}
    >
    <DialogTitle>
      <Box display="flex" alignItems={"center"} style={{color: "black"}}>
        <ConfirmationNumberIcon style={{marginRight:"10px"}} color="primary"></ConfirmationNumberIcon>
        {'Sei sicuro di voler eliminare questi biglietti?'}
      </Box>
    </DialogTitle>      
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleDeleteickets} type="submit">Conferma</Button>
    </DialogActions>
  </Dialog>
  );
};

export default DeleteTicketsDialog;