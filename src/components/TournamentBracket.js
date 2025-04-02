
import React, { useContext, useEffect } from 'react';
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
    window.playSoundEffect('win');
    setMatchWinner(matchId, playerId);
  };
  
  // Efecto para sonido inicial
  useEffect(() => {
    if (tournamentMatches.length > 0) {
      setTimeout(() => window.playSoundEffect('start'), 500);
    }
  }, []);
  
  // Renderizar jugador
  const renderPlayer = (playerId, match, isWinner) => {
    const player = getPlayerById(playerId);
    
    if (!player) return (
      <div className="text-gray-500 bg-black/30 py-2 px-3 rounded-lg italic">Bye</div>
    );
    
    return (
      <div 
        className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
          isWinner 
            ? 'bg-gradient-to-r from-green-900/60 to-green-700/30 border-l-2 border-green-400' 
            : match.status === 'completed' 
              ? 'bg-gradient-to-r from-red-900/40 to-red-800/20 border-l-2 border-red-500/50 opacity-75' 
              : 'bg-black/40 hover:bg-black/60'
        }`}
        onMouseEnter={() => {
          if (match.status === 'pending') window.playSoundEffect('select');
        }}
      >
        <div className="w-10 h-10 overflow-hidden rounded-full flex-shrink-0 border-2 border-white/30">
          {player.image ? (
            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-smash-blue to-smash-purple flex items-center justify-center text-white">
              {player.name.charAt(0)}
            </div>
          )}
        </div>
        <span className={`text-sm ${isWinner ? 'text-green-300 font-bold' : 'text-white'}`}>
          {player.name}
        </span>
        
        {match.status === 'pending' && (
          <button
            onClick={() => handleSelectWinner(match.id, player.id)}
            className="ml-auto text-xs bg-smash-yellow/70 hover:bg-smash-yellow text-black px-3 py-1 rounded-full transform transition-transform hover:scale-105"
          >
            Ganador
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto pb-10">
      <div className="flex space-x-12 p-4 min-w-max">
        {matchesByRound.map((roundMatches, roundIndex) => (
          <div key={roundIndex} className="flex flex-col space-y-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-smash-blue/5 to-transparent rounded-xl -z-10"></div>
            
            <h3 className="text-white font-bold text-center mb-3 font-game bg-black/40 py-2 px-4 rounded-lg shadow-lg border-b-2 border-smash-blue/30">
              {roundIndex === maxRound - 1 
                ? 'FINAL' 
                : roundIndex === maxRound - 2 && maxRound > 2
                ? 'SEMIFINALES'
                : `RONDA ${roundIndex + 1}`
              }
            </h3>
            
            <div className="flex flex-col space-y-12">
              {roundMatches.map(match => (
                <div 
                  key={match.id} 
                  className={`bracket-card w-64 transition-all duration-500 ${match.status === 'completed' ? 'border-smash-yellow' : 'border-smash-blue/60'}`}
                  style={{
                    marginTop: `${roundIndex > 0 ? 2**(roundIndex) * 20 : 0}px`,
                    animation: match.status === 'pending' ? 'flashBorder 2s infinite' : 'none'
                  }}
                >
                  <div className="w-full">
                    {match.player1Id && renderPlayer(
                      match.player1Id, 
                      match, 
                      match.winnerId === match.player1Id
                    )}
                    
                    <div className="my-2 border-b border-gray-600 relative">
                      <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-smash-red text-white text-xs px-3 py-0.5 rounded-full">
                        VS
                      </span>
                    </div>
                    
                    {match.player2Id 
                      ? renderPlayer(match.player2Id, match, match.winnerId === match.player2Id)
                      : <div className="text-gray-500 bg-black/30 py-2 px-3 rounded-lg italic text-center">Bye</div>
                    }
                  </div>
                  
                  {match.status === 'completed' ? (
                    <div className="mt-3 text-xs text-smash-green font-bold bg-green-900/20 py-1 px-2 rounded-full inline-block">
                      Completado
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-yellow-400 font-bold bg-yellow-900/20 py-1 px-2 rounded-full inline-block animate-pulse">
                      Pendiente
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
