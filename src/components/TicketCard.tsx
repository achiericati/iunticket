import React from 'react';
import { Box, Button } from '@mui/material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import DeleteIcon from '@mui/icons-material/Delete';
import { Ticket, User } from '../utils/interfaces';

interface TicketCardProps {
  ticket: Ticket;
  loggedUser: User | null;
  onViewUser: (userName: string) => void;
  onDeleteTicket: (ticket: Ticket) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, loggedUser, onViewUser, onDeleteTicket }) => {
  return (
    <Box
      className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all flex flex-col gap-3"
      sx={{ border: '2px solid #38bdf8' }}
    >
      <Box fontWeight="bold" fontSize="18px" color="gray.800">
        🎟️ {ticket.anello} – {ticket.settore} ({ticket.colore})
      </Box>

      <Box fontSize="14px" color="gray.600">
        {ticket.posti} posti – Fila {ticket.fila}
      </Box>

      <Box fontSize="14px" color={ticket.necessariaTdt ? 'red' : 'green'} fontWeight="bold">
        {ticket.necessariaTdt ? 'Tessera Tifoso Necessaria' : 'Senza Tessera Tifoso'}
      </Box>

      <Box fontWeight="bold" fontSize="20px" color="green">
        {ticket.prezzo} €
      </Box>

      <Box display="flex" gap={1} mt={2}>
        {loggedUser?.username === ticket.user ? (
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDeleteTicket(ticket)}
            fullWidth
          >
            Elimina
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<PermIdentityIcon />}
            onClick={() => onViewUser(ticket.user)}
            fullWidth
          >
            Contatta
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TicketCard;