
import React, { createContext, useState, useEffect } from 'react';

export const TournamentContext = createContext();

const TournamentProvider = ({ children }) => {
  const [tournaments, setTournaments] = useState([]);
  const [activeTournament, setActiveTournament] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [publicViewWindow, setPublicViewWindow] = useState(null);

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const savedTournaments = localStorage.getItem('tournaments');
    const savedPlayers = localStorage.getItem('players');
    const savedActiveTournament = localStorage.getItem('activeTournament');
    const savedMatches = localStorage.getItem('matches');

    if (savedTournaments) setTournaments(JSON.parse(savedTournaments));
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedActiveTournament) setActiveTournament(JSON.parse(savedActiveTournament));
    if (savedMatches) setMatches(JSON.parse(savedMatches));
  }, []);

  // Guardar datos cuando cambien
  useEffect(() => {
    localStorage.setItem('tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('activeTournament', JSON.stringify(activeTournament));
  }, [activeTournament]);

  useEffect(() => {
    localStorage.setItem('matches', JSON.stringify(matches));
    
    // Actualizar la vista pública si está abierta
    if (publicViewWindow && !publicViewWindow.closed) {
      updatePublicView();
    }
  }, [matches]);

  // Función para abrir la vista pública
  const openPublicView = () => {
    const newWindow = window.open("/public", "SmashTournament", "width=1200,height=800");
    setPublicViewWindow(newWindow);
    
    if (newWindow) {
      newWindow.onload = () => {
        updatePublicView();
      };
    }
    
    return newWindow;
  };

  // Actualizar la vista pública
  const updatePublicView = () => {
    if (publicViewWindow && !publicViewWindow.closed) {
      // Enviar mensaje a la ventana pública con los datos actualizados
      publicViewWindow.postMessage({
        type: 'UPDATE_DATA',
        data: {
          tournament: activeTournament,
          matches: matches,
          players: players
        }
      }, '*');
    }
  };

  // Añadir un nuevo torneo
  const addTournament = (tournament) => {
    const newTournament = {
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'pending',
      ...tournament
    };
    
    setTournaments([...tournaments, newTournament]);
    return newTournament;
  };

  // Iniciar un torneo
  const startTournament = (tournamentId) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) return false;
    
    // Actualizar estado del torneo
    const updatedTournaments = tournaments.map(t => 
      t.id === tournamentId ? { ...t, status: 'active' } : t
    );
    
    setTournaments(updatedTournaments);
    setActiveTournament({ ...tournament, status: 'active' });
    
    // Generar los enfrentamientos iniciales
    const initialMatches = generateInitialMatches(tournamentId);
    setMatches([...matches, ...initialMatches]);
    
    return true;
  };

  // Finalizar un torneo
  const endTournament = (tournamentId) => {
    const updatedTournaments = tournaments.map(t => 
      t.id === tournamentId ? { ...t, status: 'completed' } : t
    );
    
    setTournaments(updatedTournaments);
    
    if (activeTournament && activeTournament.id === tournamentId) {
      setActiveTournament({ ...activeTournament, status: 'completed' });
    }
  };

  // Añadir un jugador
  const addPlayer = (player) => {
    const newPlayer = {
      id: Date.now().toString(),
      ...player
    };
    
    setPlayers([...players, newPlayer]);
    return newPlayer;
  };

  // Generar enfrentamientos iniciales para un torneo
  const generateInitialMatches = (tournamentId) => {
    // Obtener jugadores para este torneo
    const tournamentPlayers = players.filter(p => p.tournamentId === tournamentId);
    
    // Mezclar jugadores aleatoriamente
    const shuffledPlayers = [...tournamentPlayers].sort(() => 0.5 - Math.random());
    
    const initialMatches = [];
    
    // Crear pares de enfrentamientos
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      // Si hay un número impar de jugadores, el último jugador avanza automáticamente
      if (i + 1 >= shuffledPlayers.length) {
        initialMatches.push({
          id: `match-${Date.now()}-${i}`,
          tournamentId,
          round: 1,
          player1Id: shuffledPlayers[i].id,
          player2Id: null, // Bye (jugador avanza automáticamente)
          winnerId: shuffledPlayers[i].id,
          status: 'completed',
          isBye: true
        });
      } else {
        initialMatches.push({
          id: `match-${Date.now()}-${i}`,
          tournamentId,
          round: 1,
          player1Id: shuffledPlayers[i].id,
          player2Id: shuffledPlayers[i+1].id,
          winnerId: null,
          status: 'pending'
        });
      }
    }
    
    return initialMatches;
  };

  // Registrar el ganador de un encuentro y generar el siguiente enfrentamiento si corresponde
  const setMatchWinner = (matchId, winnerId) => {
    // Buscar el encuentro actual
    const currentMatch = matches.find(m => m.id === matchId);
    
    if (!currentMatch || currentMatch.status === 'completed') return false;
    
    // Actualizar el encuentro con el ganador
    const updatedMatches = matches.map(m => 
      m.id === matchId ? { ...m, winnerId, status: 'completed' } : m
    );
    
    // Verificar si todos los encuentros de esta ronda están completos
    const tournamentMatches = updatedMatches.filter(m => m.tournamentId === currentMatch.tournamentId);
    const currentRoundMatches = tournamentMatches.filter(m => m.round === currentMatch.round);
    const allCompleted = currentRoundMatches.every(m => m.status === 'completed');
    
    // Si todos están completos, generar la siguiente ronda
    if (allCompleted) {
      const nextRound = currentMatch.round + 1;
      const winners = currentRoundMatches.map(m => ({ id: m.winnerId, matchId: m.id }));
      
      // Crear enfrentamientos para la siguiente ronda
      const nextRoundMatches = [];
      
      for (let i = 0; i < winners.length; i += 2) {
        // Si llegamos a la final (solo hay un ganador)
        if (i + 1 >= winners.length) {
          // Si solo hay un jugador, es el ganador del torneo
          if (winners.length === 1) {
            // Finalizar el torneo
            endTournament(currentMatch.tournamentId);
          } else {
            // Caso de número impar de ganadores, el último avanza automáticamente
            nextRoundMatches.push({
              id: `match-${Date.now()}-${i}`,
              tournamentId: currentMatch.tournamentId,
              round: nextRound,
              player1Id: winners[i].id,
              player2Id: null,
              previousMatch1: winners[i].matchId,
              previousMatch2: null,
              winnerId: winners[i].id,
              status: 'completed',
              isBye: true
            });
          }
        } else {
          nextRoundMatches.push({
            id: `match-${Date.now()}-${i}`,
            tournamentId: currentMatch.tournamentId,
            round: nextRound,
            player1Id: winners[i].id,
            player2Id: winners[i+1].id,
            previousMatch1: winners[i].matchId,
            previousMatch2: winners[i+1].matchId,
            winnerId: null,
            status: 'pending'
          });
        }
      }
      
      // Si la siguiente ronda solo tiene un partido (la final) y ya se jugó, el torneo ha terminado
      if (nextRoundMatches.length === 1 && nextRoundMatches[0].status === 'completed') {
        endTournament(currentMatch.tournamentId);
      }
      
      setMatches([...updatedMatches, ...nextRoundMatches]);
    } else {
      setMatches(updatedMatches);
    }
    
    return true;
  };

  return (
    <TournamentContext.Provider 
      value={{ 
        tournaments,
        activeTournament,
        players,
        matches,
        addTournament,
        startTournament,
        endTournament,
        addPlayer,
        setMatchWinner,
        openPublicView,
        updatePublicView
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export default TournamentProvider;
