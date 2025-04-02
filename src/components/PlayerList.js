
import React, { useContext } from 'react';
import { TournamentContext } from '../context/TournamentContext';

const PlayerList = ({ tournamentId }) => {
  const { players } = useContext(TournamentContext);
  
  // Filtrar jugadores por torneo si se especifica un ID
  const filteredPlayers = tournamentId
    ? players.filter(player => player.tournamentId === tournamentId)
    : players;

  return (
    <div className="overflow-x-auto">
      {filteredPlayers.length === 0 ? (
        <p className="text-white text-center my-4">No hay participantes registrados.</p>
      ) : (
        <table className="min-w-full bg-black/30 text-white rounded-lg overflow-hidden">
          <thead className="bg-black/50">
            <tr>
              <th className="py-2 px-4 text-left">Imagen</th>
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Torneo</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.id} className="border-t border-gray-700 hover:bg-black/50">
                <td className="py-3 px-4">
                  {player.image ? (
                    <img 
                      src={player.image} 
                      alt={player.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-smash-blue flex items-center justify-center">
                      {player.name.charAt(0)}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">{player.name}</td>
                <td className="py-3 px-4">{player.tournamentName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlayerList;
