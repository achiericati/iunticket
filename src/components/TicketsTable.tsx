import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { DEBUG_SERVER, MAIN_COLOR, Match, Ticket, User } from '../utils/interfaces'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import { Box, FormControlLabel, IconButton, Switch, TableContainer, TextField, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import UserInfoDialog from './UserInfoDialog'
import AddTicketsDialog from './AddTicketsDialog'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete'
import DeleteTicketsDialog from './DeleteTicketsDialog'

interface Props {
    tickets: Ticket[]
    setTickets: (tickets: Ticket[]) => void
    matches: Match[]
    setMatches: (matches: Match[]) => void
    currentMatch?: Match
    loggedUser: User | null
  }

const TicketsTable = ({
    tickets,
    currentMatch,
    setTickets,
    matches,
    setMatches,
    loggedUser
  }: Props) => {
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);
    const [searchTxt, setSearchText] = useState<string>('');
    const [mostraSoloTDT, setMostraSoloTDT] = useState<boolean>(false);
    const [infoUtenteDialogOpened, setInfoUtenteDialogOpened] = useState<boolean>(false);
    const [infoUtente, setInfoUtente] = useState<User>();
    const [addTicketDialogOpened, setAddTicketDialogOpened] = useState<boolean>(false);
    const [deleteTicketDialogOpened, setDeleteTicketDialogOpened] = useState<boolean>(false);
    const [ticketToDelete, setTicketToDelete] = useState<Ticket>();

    useEffect(() => {
      setFilteredTickets(tickets)
    }, [tickets]);
  
    const StyledTable = styled(Table)({
      minWidth: 650,
      border: '1px solid ' + MAIN_COLOR
    });

    const handleChangeSearchTxt = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const text = event.target.value
      setSearchText(text)
      if (text === '') {
        setFilteredTickets(tickets)
        return
      }
      const filTickets = tickets.filter(el => el.user.toLowerCase().includes(text) || el.anello.toLowerCase().includes(text) || el.settore.toLowerCase().includes(text.toLowerCase()) || el.colore.toLowerCase().includes(text.toLowerCase()))
      setFilteredTickets(filTickets)
    }

    const handleMostraSoloTDT = (event: React.ChangeEvent<HTMLInputElement>) => {
      setMostraSoloTDT(event.target.checked);
      if (event.target.checked) {
        const filTickets = tickets.filter(el => !el.necessariaTdt)
        setFilteredTickets(filTickets)
      }
      else setFilteredTickets(tickets)
    };
  
    const handleShowInfoUtente = async (userName: string) => {
      try {
        let response = null
        if (!DEBUG_SERVER) response = await axios.get('https://www.iunticket.it/api/infoUser?userName='+userName);
        else response = await axios.get('http://localhost:31491/api/infoUser?userName='+userName);
        if (response.data && response.data.length > 0) setInfoUtente(response.data[0]);
        setInfoUtenteDialogOpened(true);
      } catch (error) {
        console.error('Errore nel recupero delle informazioni utente:', error);
      }
    }

    const handleDeleteTicket = (ticket: Ticket) => {
      setTicketToDelete(ticket)
      setDeleteTicketDialogOpened(true)
    }

  return (
    <Box>
      <Box sx={{ display: { xs: 'block', md: 'flex' }, justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <Box sx={{ marginBottom: { xs: '10px', md: 0 } }}>
        <FormControlLabel
            control={<Switch checked={mostraSoloTDT} onChange={handleMostraSoloTDT} />}
            label="Mostra solo senza tessera del tifoso"
            sx={{ marginLeft: { xs: '0' }, marginBottom:'10px' }}
          />
          <TextField
            label={'Cerca per user, anello o settore'}
            value={searchTxt}
            placeholder={'Cerca per anello o settore'}
            onChange={handleChangeSearchTxt}
            variant='outlined'
            size='small'
            sx={{ marginRight: { xs: 0, md: '30px' } }}
          />
          
        </Box>
        <IconButton onClick={() => setAddTicketDialogOpened(true)} sx={{ marginLeft: { xs: '0', md: 'auto' } }}>
          <ConfirmationNumberIcon color="primary" sx={{ marginRight: '5px' }} />
          <Box fontWeight="bold" fontSize="18px" sx={{ color: 'black' }}>Aggiungi i tuoi biglietti!</Box>
        </IconButton>
      </Box>

      {tickets.length > 0 ? (
        <TableContainer sx={{ width: '100%' }}>
          <StyledTable>
            <TableHead>
              <TableRow>
              <TableCell style={{ fontWeight: "bold" }} align="center"></TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Utente</TableCell>
                <TableCell style={{ fontWeight: "bold" }} align="center">Anello</TableCell>
                <TableCell style={{ fontWeight: "bold" }} align="center">Colore</TableCell>
                <TableCell style={{ fontWeight: "bold" }} align="center">Settore</TableCell>
                <TableCell style={{ fontWeight: "bold" }} align="center">Fila</TableCell>
                <TableCell style={{ fontWeight: "bold" }} align="center">Posti</TableCell>
                <TableCell style={{ fontWeight: "bold" }} align="center">Necessaria tdt</TableCell>
                <TableCell style={{ fontWeight: "bold" }} align="center">Prezzo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.ID}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">
                    {loggedUser?.username === ticket.user ?
                      <IconButton onClick={() => handleDeleteTicket(ticket)} color="primary" aria-label="Delete"><DeleteIcon /></IconButton>
                      :
                      <IconButton onClick={() => handleShowInfoUtente(ticket.user)} color="primary" aria-label="Delete"><PermIdentityIcon /></IconButton>}
                  </TableCell>
                  <TableCell>{ticket.user}</TableCell>
                  <TableCell align="center">{ticket.anello}</TableCell>
                  <TableCell align="center">{ticket.colore}</TableCell>
                  <TableCell align="center">{ticket.settore}</TableCell>
                  <TableCell align="center">{ticket.fila}</TableCell>
                  <TableCell align="center">{ticket.posti.toString()}</TableCell>
                  <TableCell align="center">{ticket.necessariaTdt ? "SI" : "NO"}</TableCell>
                  <TableCell align="center">{ticket.prezzo ? ticket.prezzo + '€' : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      ) : (
        <Box marginTop="25px" sx={{ fontSize: "20px", fontWeight: "bold", textAlign: 'center' }}>Ancora nessun biglietto disponibile!</Box>
      )}
      <UserInfoDialog open={infoUtenteDialogOpened} setOpen={setInfoUtenteDialogOpened} infoUtente={infoUtente}></UserInfoDialog>
      <AddTicketsDialog open={addTicketDialogOpened} setOpen={setAddTicketDialogOpened} currentMatch={currentMatch} tickets={tickets} setTickets={setTickets} 
      matches={matches} setMatches={setMatches} loggedUser={loggedUser} ></AddTicketsDialog>
      <DeleteTicketsDialog open={deleteTicketDialogOpened} setOpen={setDeleteTicketDialogOpened} ticketToDelete={ticketToDelete} tickets={tickets} setTickets={setTickets}
      matches={matches} setMatches={setMatches} currentMatch={currentMatch} ></DeleteTicketsDialog>
    </Box>
  );
};

export default TicketsTable;