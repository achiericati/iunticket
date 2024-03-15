import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Box, IconButton, Paper } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Match, Ticket, MAIN_COLOR, User, DEBUG_SERVER } from '../utils/interfaces'
import TopBar from './TopBar'
import InfoMessages from './InfoMessages'
import MatchesTable from './MatchesTable'
import TicketsTable from './TicketsTable'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import { UserContext } from '../utils/userContext';

const MainPage: React.FC = () => {
  const userContext = new UserContext();
  const [mainView, setMainView] = useState<'MATCHES'|'TICKETS'>('MATCHES');
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatchTickets, setCurrentMatchTickets] = useState<Ticket[]>([]);
  const [currentMatch, setCurrentMatch] = useState<Match>();
  const [loggedUser, setLoggedUser] = useState<User | null>(userContext.getCurrentUser());

  useEffect(() => {
    setLoggedUser(loggedUser)
    userContext.setCurrentUser(loggedUser)
  }, [loggedUser]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        let response = null
        if (!DEBUG_SERVER) response = await axios.get('https://www.iunticket.it/api/match');
        else response = await axios.get('http://localhost:31491/api/match');
        setMatches(response.data);
      } catch (error) {
        console.error('Errore nel recupero delle partite:', error);
      }
    };
    fetchMatches();
  }, []);

  const handleLoadTickets = async (matchID: number) => {
    try {
      let response = null
      if (!DEBUG_SERVER) response = await axios.get('https://www.iunticket.it/api/tickets?matchID='+matchID);
      else response = await axios.get('http://localhost:31491/api/tickets?matchID='+matchID);
      setCurrentMatchTickets(response.data);
      const currMatch = matches.filter(el=>el.ID === matchID)
      if (currMatch.length > 0) setCurrentMatch(currMatch[0])
      setMainView('TICKETS')
    } catch (error) {
      console.error('Errore nel recupero dei biglietti:', error);
    }
  }

  return (
    <Box>
      <TopBar loggedUser={loggedUser} setLoggedUser={setLoggedUser}/>
      <Paper style={{padding:"15px"}}>
        {mainView === 'TICKETS' && 
        <Box fontWeight="bold" style={{color:MAIN_COLOR}} display="flex" alignItems="center" marginBottom="20px">
          <IconButton onClick={() => {setMainView('MATCHES'); setCurrentMatch(undefined)}} style={{marginTop:"10px", color:MAIN_COLOR}} aria-label="Back">
            <ArrowBackIcon />
            <Box fontWeight="bold" fontSize="18px" style={{color: "black"}}>
              {'Torna alla lista partite'}
            </Box>
          </IconButton>
          </Box>
        }

        {currentMatch && 
          <Box fontWeight="bold" fontSize="25px" style={{color: "black", marginBottom:"20px"}} display="flex" alignItems="center" >
            <SportsSoccerIcon fontSize="inherit" color="primary" style={{marginRight:"10px"}} />
            {currentMatch.partita + ' - ' + currentMatch.data}
          </Box>
       }
       {mainView === 'MATCHES' ?
         <MatchesTable matches={matches} handleLoadTickets={handleLoadTickets}></MatchesTable>
         :
         <TicketsTable tickets={currentMatchTickets} setTickets={setCurrentMatchTickets} matches={matches} setMatches={setMatches} currentMatch={currentMatch} loggedUser={loggedUser}></TicketsTable>
       }
       {mainView === 'MATCHES' && 
       <Box style={{marginTop:'15px'}}>
          <InfoMessages/>
       </Box>}
      </Paper>
    </Box>
  );
};

export default MainPage;
