import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';
import TicketsList from './TicketsList';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Match, Ticket, User } from '../utils/interfaces';
import EventIcon from '@mui/icons-material/Event';
import { UserContext } from '../utils/userContext';

const TicketsPage: React.FC = () => {
  const userContext = new UserContext();
  const [matches, setMatches] = useState<Match[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentMatch, setCurrentMatch] = useState<Match>();
  const [loggedUser, setLoggedUser] = useState<User | null>(userContext.getCurrentUser());
  const navigate = useNavigate();
  const { matchID } = useParams();

  useEffect(() => {
    setLoggedUser(loggedUser);
    userContext.setCurrentUser(loggedUser);
  }, [loggedUser]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const mockMatches = [
          { ID: 1, partita: "Inter - Cagliari", data: "23/08/2025", bigliettiDisponibili: 89, prezzoMin: 25 },
          { ID: 2, partita: "Concerto Ligabue - Milano", data: "02/09/2025", bigliettiDisponibili: 71, prezzoMin: 39 },
        ];
        setMatches(mockMatches);

        const mockTickets: Ticket[] = [
          {
            partitaID: 1,
            ID: 1,
            user: 'mario123',
            anello: 'Secondo Anello',
            colore: 'Blu',
            settore: '206',
            fila: 8,
            posti: [2],
            necessariaTdt: false,
            prezzo: 45
          },
          {
            partitaID: 1,
            ID: 2,
            user: 'giulia_rossi',
            anello: 'Primo Anello',
            colore: 'Rosso',
            settore: '103',
            fila: 12,
            posti: [1],
            necessariaTdt: true,
            prezzo: 80
          }
        ];
        const current = mockMatches.find(m => m.ID === Number(matchID));
        setCurrentMatch(current);
        setTickets(mockTickets.filter(t => t.partitaID === Number(matchID)));
      } catch (error) {
        console.error('Errore nel recupero dei biglietti:', error);
      }
    };
    fetchTickets();
  }, [matchID]);

  const handleBackToEvents = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-sky-200 text-gray-800">
      <TopBar loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
      <div className="w-full px-6 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackToEvents}
            className="flex items-center gap-2 text-sky-600 hover:underline"
          >
            <ArrowLeft size={20} />
            <span>Torna alla lista eventi</span>
          </button>
        </div>

        {currentMatch && (
          <div className="text-2xl font-semibold flex items-center gap-2 mb-6 text-gray-800">
            <EventIcon className="text-sky-600" />
            <span>{currentMatch.partita} – {currentMatch.data}</span>
          </div>
        )}

        <TicketsList
          tickets={tickets}
          setTickets={setTickets}
          matches={matches}
          setMatches={setMatches}
          currentMatch={currentMatch}
          loggedUser={loggedUser}
        />
      </div>
    </div>
  );
};

export default TicketsPage;