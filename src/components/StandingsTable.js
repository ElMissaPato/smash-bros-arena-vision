
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const StandingsTable = ({ tournamentId, players, matches }) => {
  const [standings, setStandings] = useState([]);
  const [activeRow, setActiveRow] = useState(null);

  useEffect(() => {
    if (!players || !matches) return;
    
    // Filtrar jugadores y partidos por torneo
    const tournamentPlayers = tournamentId ? 
      players.filter(p => p.tournamentId === tournamentId) : 
      players;
    
    const tournamentMatches = tournamentId ? 
      matches.filter(m => m.tournamentId === tournamentId) : 
      matches;
      
    // Calcular estadísticas
    const playerStats = tournamentPlayers.map(player => {
      const playerMatches = tournamentMatches.filter(
        m => m.player1Id === player.id || m.player2Id === player.id
      );
      
      const wins = tournamentMatches.filter(m => m.winnerId === player.id).length;
      const totalMatches = playerMatches.length;
      const losses = totalMatches - wins;
      
      // Calcular puntos (2 por victoria, 0 por derrota)
      const points = wins * 2;
      
      return {
        ...player,
        wins,
        losses,
        totalMatches,
        points,
        winRate: totalMatches > 0 ? (wins / totalMatches) * 100 : 0
      };
    });
    
    // Ordenar por puntos y luego por porcentaje de victorias
    const sortedPlayers = [...playerStats].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.winRate - a.winRate;
    });
    
    setStandings(sortedPlayers);
  }, [players, matches, tournamentId]);
  
  const handleRowHover = (index) => {
    setActiveRow(index);
    window.playSoundEffect('select');
  };

  return (
    <Card className="overflow-hidden border-2 border-smash-blue/60 bg-black/80 text-white shadow-glow animate-fadeIn">
      <CardHeader className="bg-smash-gradient py-3">
        <CardTitle className="font-game text-center text-white text-xl">Tabla de Posiciones</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-black/70">
              <TableRow>
                <TableHead className="text-white font-bold text-center">Pos</TableHead>
                <TableHead className="text-white font-bold">Jugador</TableHead>
                <TableHead className="text-white font-bold text-center">P</TableHead>
                <TableHead className="text-white font-bold text-center">V</TableHead>
                <TableHead className="text-white font-bold text-center">D</TableHead>
                <TableHead className="text-white font-bold text-center">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.length > 0 ? (
                standings.map((player, index) => (
                  <TableRow 
                    key={player.id}
                    className={`transition-all duration-300 ${
                      activeRow === index ? 'bg-smash-blue/30 scale-[1.01]' : 'bg-black/40 hover:bg-black/60'
                    }`}
                    onMouseEnter={() => handleRowHover(index)}
                    onMouseLeave={() => setActiveRow(null)}
                  >
                    <TableCell className="text-center font-bold">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-smash-yellow">
                          {player.image ? (
                            <img src={player.image} alt={player.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-smash-blue to-smash-purple text-white">
                              {player.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="font-bold">{player.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-smash-yellow font-bold">{player.points}</TableCell>
                    <TableCell className="text-center text-green-500">{player.wins}</TableCell>
                    <TableCell className="text-center text-red-500">{player.losses}</TableCell>
                    <TableCell className="text-center font-mono">
                      {player.winRate.toFixed(0)}%
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-400">
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StandingsTable;
