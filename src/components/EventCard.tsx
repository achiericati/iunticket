import React from 'react';
import { Match } from '../utils/interfaces';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

interface EventCardProps {
  match: Match;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ match, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex flex-col gap-4"
      style={{
        background: 'linear-gradient(to bottom right, #e0f2fe, #f8fafc)',
        border: '2px solid #3b82f6', // blu più deciso
      }}
    >
      <div className="flex items-center gap-3">
        <EventAvailableIcon className="text-sky-600" />
        <h2 className="text-lg font-bold text-gray-800">{match.partita}</h2>
      </div>

      <div className="text-sm text-gray-600 flex items-center gap-1">
        📅 {match.data}
      </div>

      <div className="text-sm text-gray-700 flex items-center gap-1">
        🎫 {match.bigliettiDisponibili} biglietti disponibili
      </div>

      <div className="text-sm text-green-600 font-semibold">
        Prezzo da €{match.prezzoMin}
      </div>
    </div>
  );
};

export default EventCard;