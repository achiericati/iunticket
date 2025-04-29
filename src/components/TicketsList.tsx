import React, { useEffect, useState } from 'react';
import {
  Box, Grid, IconButton, TextField
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { DEBUG_SERVER, Match, Ticket, User } from '../utils/interfaces';
import axios from 'axios';
import TicketCard from './TicketCard';
import UserInfoDialog from './UserInfoDialog';
import AddTicketsDialog from './AddTicketsDialog';
import DeleteTicketsDialog from './DeleteTicketsDialog';

interface Props {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  currentMatch?: Match;
  loggedUser: User | null;
}

const TicketsList = ({
  tickets,
  setTickets,
  matches,
  setMatches,
  currentMatch,
  loggedUser
}: Props) => {
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);
  const [searchTxt, setSearchText] = useState<string>('');
  const [infoUtenteDialogOpened, setInfoUtenteDialogOpened] = useState<boolean>(false);
  const [infoUtente, setInfoUtente] = useState<User>();
  const [addTicketDialogOpened, setAddTicketDialogOpened] = useState<boolean>(false);
  const [deleteTicketDialogOpened, setDeleteTicketDialogOpened] = useState<boolean>(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket>();

  useEffect(() => {
    setFilteredTickets(tickets);
  }, [tickets]);

  const handleChangeSearchTxt = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setSearchText(text);
    if (text === '') {
      setFilteredTickets(tickets);
      return;
    }
    const filTickets = tickets.filter(el =>
      el.user.toLowerCase().includes(text.toLowerCase()) ||
      el.anello.toLowerCase().includes(text.toLowerCase()) ||
      el.settore.toLowerCase().includes(text.toLowerCase()) ||
      el.colore.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredTickets(filTickets);
  };

  const handleShowInfoUtente = async (userName: string) => {
    try {
      const response = await axios.get(
        DEBUG_SERVER
          ? `http://localhost:31491/api/infoUser?userName=${userName}`
          : `https://www.iunticket.it/api/infoUser?userName=${userName}`
      );
      if (response.data && response.data.length > 0) setInfoUtente(response.data[0]);
      setInfoUtenteDialogOpened(true);
    } catch (error) {
      console.error('Errore nel recupero delle informazioni utente:', error);
    }
  };

  const handleDeleteTicket = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setDeleteTicketDialogOpened(true);
  };

  return (
    <Box>
      <Box sx={{ display: { xs: 'block', md: 'flex' }, justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <TextField
            label="Cerca user, anello o settore"
            value={searchTxt}
            onChange={handleChangeSearchTxt}
            variant="outlined"
            size="small"
            sx={{ ml: 2, mb: { xs: 2, md: 0 } }}
          />
        </Box>

        <IconButton
          onClick={() => setAddTicketDialogOpened(true)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: '#38bdf8',
            color: 'white',
            p: 1,
            borderRadius: 2,
            mt: { xs: 2, md: 0 }
          }}
        >
          <ConfirmationNumberIcon sx={{ mr: 1 }} />
          <Box fontWeight="bold" fontSize="16px">
            Aggiungi Biglietti
          </Box>
        </IconButton>
      </Box>

      {filteredTickets.length > 0 ? (
        <Grid container spacing={3}>
          {filteredTickets.map(ticket => (
            <Grid item xs={12} sm={6} md={4} key={ticket.ID}>
              <TicketCard
                ticket={ticket}
                loggedUser={loggedUser}
                onViewUser={handleShowInfoUtente}
                onDeleteTicket={handleDeleteTicket}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" fontSize="18px" fontWeight="bold" mt={5}>
          Ancora nessun biglietto disponibile!
        </Box>
      )}

      <UserInfoDialog open={infoUtenteDialogOpened} setOpen={setInfoUtenteDialogOpened} infoUtente={infoUtente} />
      <AddTicketsDialog open={addTicketDialogOpened} setOpen={setAddTicketDialogOpened} currentMatch={currentMatch} tickets={tickets} setTickets={setTickets} matches={matches} setMatches={setMatches} loggedUser={loggedUser} />
      <DeleteTicketsDialog open={deleteTicketDialogOpened} setOpen={setDeleteTicketDialogOpened} ticketToDelete={ticketToDelete} tickets={tickets} setTickets={setTickets} matches={matches} setMatches={setMatches} currentMatch={currentMatch} />
    </Box>
  );
};

export default TicketsList;