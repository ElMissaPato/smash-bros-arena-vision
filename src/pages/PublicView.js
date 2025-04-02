
import React, { useEffect, useState } from 'react';
import Clock from '../components/Clock';
import TournamentBracket from '../components/TournamentBracket';
import WinnerAnnouncement from '../components/WinnerAnnouncement';
import MatchAnnouncement from '../components/MatchAnnouncement';
import tecnmLogo from '../assets/tecnm-logo.png';
import iscLogo from '../assets/isc-logo.png';
import smashLogo from '../assets/smash-logo.png';

const PublicView = () => {
  const [tournamentData, setTournamentData] = useState({
    tournament: null,
    matches: [],
    players: []
  });
  
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [announcementMatch, setAnnouncementMatch] = useState(null);
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false);
  const [winnerPlayer, setWinnerPlayer] = useState(null);
  const [previousMatches, setPreviousMatches] = useState([]);
  
  // Recibir actualizaciones del administrador
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'UPDATE_DATA') {
        setTournamentData(event.data.data);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Intentar cargar datos iniciales del localStorage
    const savedTournament = localStorage.getItem('activeTournament');
    const savedMatches = localStorage.getItem('matches');
    const savedPlayers = localStorage.getItem('players');
    
    if (savedTournament && savedMatches && savedPlayers) {
      setTournamentData({
        tournament: JSON.parse(savedTournament),
        matches: JSON.parse(savedMatches),
        players: JSON.parse(savedPlayers)
      });
    }
    
    // Informamos a la ventana padre que estamos listos
    if (window.opener) {
      window.opener.postMessage({ type: 'PUBLIC_VIEW_READY' }, '*');
    }
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  // Detectar cambios en los partidos para mostrar anuncios
  useEffect(() => {
    const { matches, players } = tournamentData;
    if (!matches || matches.length === 0) return;
    
    // Verificar nuevos partidos pendientes
    const pendingMatches = matches.filter(m => m.status === 'pending');
    
    if (pendingMatches.length > 0) {
      // Mostrar solo los nuevos partidos que no se han mostrado antes
      const newPendingMatches = pendingMatches.filter(
        m => !previousMatches.some(pm => pm.id === m.id)
      );
      
      if (newPendingMatches.length > 0) {
        setAnnouncementMatch(newPendingMatches[0]);
        setShowAnnouncement(true);
      }
    }
    
    // Verificar partidos completados para mostrar ganadores
    const completedMatches = matches.filter(m => m.status === 'completed');
    
    if (completedMatches.length > 0) {
      // Obtener el último partido completado
      const lastCompletedMatch = completedMatches[completedMatches.length - 1];
      
      // Verificar si ya lo hemos mostrado antes
      const isNew = !previousMatches.some(m => 
        m.id === lastCompletedMatch.id && 
        m.status === 'completed' &&
        m.winnerId === lastCompletedMatch.winnerId
      );
      
      if (isNew && lastCompletedMatch.winnerId) {
        const winner = players.find(p => p.id === lastCompletedMatch.winnerId);
        if (winner) {
          setWinnerPlayer(winner);
          setShowWinnerAnnouncement(true);
        }
      }
    }
    
    // Actualizar lista de partidos previos
    setPreviousMatches(matches);
  }, [tournamentData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen p-4">
      <Clock />
      
      {showAnnouncement && (
        <MatchAnnouncement 
          match={announcementMatch} 
          players={tournamentData.players}
          onClose={() => {
            setShowAnnouncement(false);
            setAnnouncementMatch(null);
          }} 
        />
      )}
      
      {showWinnerAnnouncement && (
        <WinnerAnnouncement 
          player={winnerPlayer}
          onClose={() => {
            setShowWinnerAnnouncement(false);
            setWinnerPlayer(null);
          }}
        />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <img src={smashLogo} alt="Super Smash Bros Logo" className="h-16" />
          <h1 className="text-4xl font-bold text-white font-game">
            {tournamentData.tournament?.name || "Vista del Torneo"}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <img src={tecnmLogo} alt="TECNM Logo" className="h-12" />
          <img src={iscLogo} alt="ISC Logo" className="h-12" />
        </div>
      </div>
      
      {tournamentData.tournament ? (
        <div className="bg-black/80 rounded-xl p-6 shadow-lg border-2 border-smash-yellow animate-fadeIn">
          <div className="mb-8 overflow-x-auto">
            <h2 className="text-2xl text-white font-bold mb-4 font-game">Bracket del Torneo</h2>
            <div className="bg-black/50 p-4 rounded-lg">
              <TournamentBracket 
                tournamentId={tournamentData.tournament.id} 
                matches={tournamentData.matches}
                players={tournamentData.players}
                isPublicView={true}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-2xl text-white font-bold mb-4 font-game">Próximos Combates</h2>
              <div className="bg-black/50 p-4 rounded-lg">
                {tournamentData.matches && tournamentData.matches.filter(m => m.status === 'pending').length > 0 ? (
                  <div className="space-y-4">
                    {tournamentData.matches.filter(m => m.status === 'pending').map(match => {
                      const player1 = tournamentData.players.find(p => p.id === match.player1Id);
                      const player2 = tournamentData.players.find(p => p.id === match.player2Id);
                      
                      return (
                        <div key={match.id} className="match-card flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 overflow-hidden rounded-full">
                              {player1?.image ? (
                                <img src={player1.image} alt={player1.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-smash-blue flex items-center justify-center text-white">
                                  {player1?.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <span className="text-white font-bold">{player1?.name}</span>
                          </div>
                          
                          <span className="text-smash-yellow text-2xl font-bold mx-4">VS</span>
                          
                          <div className="flex items-center space-x-3">
                            <span className="text-white font-bold">{player2?.name}</span>
                            <div className="w-12 h-12 overflow-hidden rounded-full">
                              {player2?.image ? (
                                <img src={player2.image} alt={player2.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-smash-red flex items-center justify-center text-white">
                                  {player2?.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-white text-center py-4">No hay combates pendientes.</p>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl text-white font-bold mb-4 font-game">Últimos Resultados</h2>
              <div className="bg-black/50 p-4 rounded-lg">
                {tournamentData.matches && tournamentData.matches.filter(m => m.status === 'completed').length > 0 ? (
                  <div className="space-y-4">
                    {tournamentData.matches
                      .filter(m => m.status === 'completed')
                      .slice(-5)
                      .reverse()
                      .map(match => {
                        const winner = tournamentData.players.find(p => p.id === match.winnerId);
                        const loser = tournamentData.players.find(
                          p => (p.id === match.player1Id || p.id === match.player2Id) && p.id !== match.winnerId
                        );
                        
                        if (!winner) return null;
                        
                        return (
                          <div key={match.id} className="match-card">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-green-500">
                                  {winner?.image ? (
                                    <img src={winner.image} alt={winner.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-green-700 flex items-center justify-center text-white">
                                      {winner?.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <span className="text-green-400 font-bold">{winner?.name}</span>
                              </div>
                              
                              <span className="text-smash-yellow">Ganador</span>
                            </div>
                            
                            {loser && (
                              <div className="mt-2 flex items-center space-x-2 opacity-70">
                                <div className="w-8 h-8 overflow-hidden rounded-full border border-red-500">
                                  {loser?.image ? (
                                    <img src={loser.image} alt={loser.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-red-700 flex items-center justify-center text-white text-xs">
                                      {loser?.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <span className="text-gray-400">{loser?.name}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-white text-center py-4">No hay resultados disponibles.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-black/80 rounded-xl p-8 shadow-lg border-2 border-smash-yellow flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-pulse">
            <h2 className="text-3xl text-white font-bold mb-6 font-game text-center">
              Esperando datos del torneo...
            </h2>
            <p className="text-gray-300 text-center">
              Esta pantalla se actualizará automáticamente cuando el administrador inicie un torneo.
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-white text-sm">
          INGENIERÍA EN SISTEMAS COMPUTACIONALES - TECNM
        </p>
      </div>
    </div>
  );
};

export default PublicView;
