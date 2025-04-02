
import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TournamentContext } from '../context/TournamentContext';
import Navbar from '../components/Navbar';
import Clock from '../components/Clock';
import TournamentBracket from '../components/TournamentBracket';
import PlayerList from '../components/PlayerList';
import AddPlayerForm from '../components/AddPlayerForm';
import MatchAnnouncement from '../components/MatchAnnouncement';
import WinnerAnnouncement from '../components/WinnerAnnouncement';

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    tournaments, 
    startTournament, 
    players, 
    matches,
    activeTournament
  } = useContext(TournamentContext);
  
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [announcementMatch, setAnnouncementMatch] = useState(null);
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false);
  const [winnerPlayer, setWinnerPlayer] = useState(null);
  
  const tournament = tournaments.find(t => t.id === id);
  const tournamentPlayers = players.filter(p => p.tournamentId === id);
  const tournamentMatches = matches.filter(m => m.tournamentId === id);
  
  // Detectar cambios en los partidos para mostrar anuncios
  useEffect(() => {
    const pendingMatches = tournamentMatches.filter(m => m.status === 'pending');
    if (pendingMatches.length > 0 && !announcementMatch) {
      setAnnouncementMatch(pendingMatches[0]);
      setShowAnnouncement(true);
    }
    
    const completedMatches = tournamentMatches.filter(m => m.status === 'completed');
    const lastCompletedMatch = completedMatches.length > 0 
      ? completedMatches[completedMatches.length - 1]
      : null;
      
    if (lastCompletedMatch && lastCompletedMatch.winnerId) {
      const winner = players.find(p => p.id === lastCompletedMatch.winnerId);
      if (winner) {
        setWinnerPlayer(winner);
        setShowWinnerAnnouncement(true);
      }
    }
  }, [tournamentMatches, players]); // eslint-disable-line react-hooks/exhaustive-deps
  
  if (!tournament) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto p-4 text-center">
          <div className="bg-black/80 rounded-xl p-8 shadow-lg border-2 border-red-500">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Torneo no encontrado</h1>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/admin/tournaments')}
            >
              Volver a Torneos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartTournament = () => {
    if (tournamentPlayers.length < 2) {
      alert('Se necesitan al menos 2 jugadores para iniciar el torneo.');
      return;
    }
    
    startTournament(id);
    setRefreshKey(prev => prev + 1);
  };
  
  const handlePlayerAdded = () => {
    setRefreshKey(prev => prev + 1);
    setShowAddPlayer(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Clock />
      
      {showAnnouncement && (
        <MatchAnnouncement 
          match={announcementMatch} 
          players={players}
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
      
      <div className="container mx-auto p-4">
        <div className="bg-black/80 rounded-xl p-6 shadow-lg border-2 border-smash-yellow mb-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white font-game">{tournament.name}</h1>
            
            <div className="flex space-x-3">
              <button 
                className="btn bg-smash-blue hover:bg-blue-700"
                onClick={() => navigate('/admin/tournaments')}
              >
                Volver
              </button>
              
              {tournament.status === 'pending' && (
                <button 
                  className="btn btn-success"
                  onClick={handleStartTournament}
                  disabled={tournamentPlayers.length < 2}
                >
                  Iniciar Torneo
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-black/50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white">
                  Estado: 
                  <span className={`ml-2 font-bold ${
                    tournament.status === 'pending' ? 'text-yellow-400' :
                    tournament.status === 'active' ? 'text-green-500' : 'text-blue-400'
                  }`}>
                    {tournament.status === 'pending' ? 'Pendiente' :
                     tournament.status === 'active' ? 'En progreso' : 'Completado'}
                  </span>
                </p>
                <p className="text-white">
                  Participantes: <span className="font-bold">{tournamentPlayers.length}</span>
                </p>
              </div>
              
              {tournament.status === 'pending' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddPlayer(true)}
                >
                  Agregar Participante
                </button>
              )}
            </div>
            
            {tournament.description && (
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                <p className="text-gray-300">{tournament.description}</p>
              </div>
            )}
          </div>
          
          {/* Bracket del torneo */}
          {tournament.status !== 'pending' && (
            <div className="mb-8 overflow-x-auto">
              <h2 className="text-2xl text-white font-bold mb-4 font-game">Bracket del Torneo</h2>
              <div className="bg-black/50 p-4 rounded-lg">
                <TournamentBracket tournamentId={id} key={refreshKey} />
              </div>
            </div>
          )}
          
          {/* Lista de participantes */}
          <div>
            <h2 className="text-2xl text-white font-bold mb-4 font-game">Participantes</h2>
            <div className="bg-black/50 p-4 rounded-lg">
              <PlayerList tournamentId={id} key={refreshKey} />
            </div>
          </div>
          
          {/* Modal para agregar participante */}
          {showAddPlayer && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 p-4">
              <div className="bg-black/90 rounded-xl border-2 border-smash-blue p-6 w-full max-w-md">
                <h2 className="text-2xl text-white font-bold mb-6 font-game">Agregar Participante</h2>
                <AddPlayerForm 
                  onComplete={handlePlayerAdded}
                  tournamentId={id}
                  tournamentName={tournament.name}
                />
                <button 
                  className="mt-4 btn btn-danger w-full"
                  onClick={() => setShowAddPlayer(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;
