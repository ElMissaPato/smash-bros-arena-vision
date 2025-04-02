
import React, { useContext } from 'react';
import { TournamentContext } from '../context/TournamentContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table';

const PlayerList = ({ tournamentId }) => {
  const { players } = useContext(TournamentContext);
  
  // Filtrar jugadores por torneo si se especifica un ID
  const filteredPlayers = tournamentId
    ? players.filter(player => player.tournamentId === tournamentId)
    : players;
  
  const handlePlayerHover = () => {
    window.playSoundEffect('select');
  };

  return (
    <Card className="bg-black/80 border-2 border-smash-yellow/60 text-white overflow-hidden shadow-neon">
      <CardHeader className="bg-gradient-to-r from-smash-yellow to-smash-orange py-3">
        <CardTitle className="font-game text-black text-center">Participantes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {filteredPlayers.length === 0 ? (
          <p className="text-white text-center my-8 italic">No hay participantes registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/70">
                <TableRow>
                  <TableHead className="text-white">Imagen</TableHead>
                  <TableHead className="text-white">Nombre</TableHead>
                  <TableHead className="text-white">Torneo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player, index) => (
                  <TableRow 
                    key={player.id} 
                    className="border-t border-gray-700 hover:bg-black/50 transition-all duration-300"
                    onMouseEnter={handlePlayerHover}
                  >
                    <TableCell className="py-3 px-4">
                      <div className="relative group">
                        {player.image ? (
                          <img 
                            src={player.image} 
                            alt={player.name}
                            className="h-12 w-12 rounded-full object-cover border-2 border-smash-blue/70 group-hover:border-smash-blue transition-all"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-smash-blue to-smash-purple flex items-center justify-center text-white border-2 border-smash-blue/70 group-hover:border-smash-blue transition-all">
                            {player.name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-black border border-white flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 font-bold">{player.name}</TableCell>
                    <TableCell className="py-3 px-4 text-smash-yellow">{player.tournamentName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerList;
