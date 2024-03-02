import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import { DEBUG, Ticket } from '../utils/interfaces'
import { Button } from '@mui/material'
import { Box } from '@mui/material'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import axios from 'axios'

interface Props {
    open: boolean;
    setOpen: (isOpen: boolean) => void
    ticketID: number|undefined
    tickets: Ticket[]
    setTickets: (tickets: Ticket[]) => void
  }

const DeleteTicketsDialog = ({
  open,
  setOpen,
  ticketID,
  tickets,
  setTickets
  }: Props) => {

    const handleClose = () => {
      setOpen(false);
    };

    const handleDeleteickets = async () => {
      try {
        const body = {
          ticketID: ticketID
        }
        if (!DEBUG) await axios.post('https://iunticket-fdba432ee24a.herokuapp.com/api/deleteTickets', body);
        else await axios.post('http://localhost:31491/api/deleteTickets', body);
        const newTickets = tickets.filter(el => el.ID !== ticketID)
        setTickets(newTickets)
      }
      catch (e) {}
      setOpen(false);
    };

    return (
      <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
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