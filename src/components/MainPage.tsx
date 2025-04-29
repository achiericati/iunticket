import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import EventCard from './EventCard';
import { Match, User } from '../utils/interfaces';
import { UserContext } from '../utils/userContext';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const userContext = new UserContext();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loggedUser, setLoggedUser] = useState<User | null>(userContext.getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedUser(loggedUser);
    userContext.setCurrentUser(loggedUser);
  }, [loggedUser]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const mockMatches = [
          { ID: 1, partita: "Inter - Cagliari", data: "23/08/2025", bigliettiDisponibili: 89, prezzoMin: 25 },
          { ID: 2, partita: "Concerto Ligabue - Milano", data: "02/09/2025", bigliettiDisponibili: 71, prezzoMin: 39 },
        ];
        setMatches(mockMatches);
      } catch (error) {
        console.error('Errore nel recupero degli eventi:', error);
      }
    };
    fetchMatches();
  }, []);

  const handleGoToTickets = (matchID: number) => {
    navigate(`/tickets/${matchID}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-sky-200 text-gray-800">
      <TopBar loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
      <div className="w-full px-6 py-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-sky-600 tracking-tight">
            Trova o vendi il tuo biglietto su iUnTicket!
          </h1>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
            Partite, concerti, eventi: mettiamo in contatto persone reali per scambiarsi biglietti in modo semplice e sicuro.
            Zero commissioni, solo passione condivisa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => (
            <EventCard
              key={match.ID}
              match={match}
              onClick={() => handleGoToTickets(match.ID)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;