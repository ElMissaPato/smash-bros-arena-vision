
import React, { useContext } from 'react';
import { TournamentContext } from '../context/TournamentContext';

const TournamentBracket = ({ tournamentId }) => {
  const { matches, players, setMatchWinner } = useContext(TournamentContext);
  
  // Filtrar partidos por torneo
  const tournamentMatches = matches.filter(m => m.tournamentId === tournamentId);
  
  // Obtener el número máximo de rondas
  const maxRound = tournamentMatches.length > 0
    ? Math.max(...tournamentMatches.map(m => m.round))
    : 0;
  
  // Agrupar partidos por ronda
  const matchesByRound = [];
  for (let i = 1; i <= maxRound; i++) {
    matchesByRound.push(
      tournamentMatches.filter(m => m.round === i)
    );
  }
  
  // Obtener información de jugador por ID
  const getPlayerById = (playerId) => {
    return playerId ? players.find(p => p.id === playerId) : null;
  };
  
  // Manejar selección de ganador
  const handleSelectWinner = (matchId, playerId) => {
    setMatchWinner(matchId, playerId);
  };
  
  // Renderizar jugador
  const renderPlayer = (playerId, match, isWinner) => {
    const player = getPlayerById(playerId);
    
    if (!player) return <div className="text-gray-500">Bye</div>;
    
    return (
      <div className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
        isWinner ? 'bg-green-900/50' : match.status === 'completed' ? 'bg-red-900/30' : ''
      }`}>
        <div className="w-8 h-8 overflow-hidden rounded-full flex-shrink-0">
          {player.image ? (
            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-smash-blue flex items-center justify-center text-white">
              {player.name.charAt(0)}
            </div>
          )}
        </div>
        <span className="text-sm">{player.name}</span>
        
        {match.status === 'pending' && (
          <button
            onClick={() => handleSelectWinner(match.id, player.id)}
            className="ml-auto text-xs bg-smash-yellow/70 hover:bg-smash-yellow text-black px-2 py-1 rounded-full"
          >
            Ganador
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-8 p-4 min-w-max">
        {matchesByRound.map((roundMatches, roundIndex) => (
          <div key={roundIndex} className="flex flex-col space-y-4">
            <h3 className="text-white font-bold text-center mb-2">
              {roundIndex === maxRound - 1 ? 'Final' : `Ronda ${roundIndex + 1}`}
            </h3>
            
            <div className="flex flex-col space-y-8">
              {roundMatches.map(match => (
                <div 
                  key={match.id} 
                  className="bracket-card w-48"
                  style={{marginTop: `${roundIndex > 0 ? 2**(roundIndex) * 20 : 0}px`}}
                >
                  <div className="w-full">
                    {match.player1Id && renderPlayer(
                      match.player1Id, 
                      match, 
                      match.winnerId === match.player1Id
                    )}
                    
                    <div className="my-1 border-b border-gray-600"></div>
                    
                    {match.player2Id 
                      ? renderPlayer(match.player2Id, match, match.winnerId === match.player2Id)
                      : <div className="text-gray-500 p-2">Bye</div>
                    }
                  </div>
                  
                  {match.status === 'completed' && (
                    <div className="mt-2 text-xs text-smash-green font-bold">
                      Completado
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentBracket;
