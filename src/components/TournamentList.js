
import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const TournamentList = ({ tournaments }) => {
  // Ordenar torneos por fecha de creación (más reciente primero)
  const sortedTournaments = [...tournaments].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  const handleRowHover = () => {
    window.playSoundEffect('select');
  };

  // Función para mostrar el estado del torneo con colores
  const renderStatus = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-400/20 text-yellow-400 border border-yellow-400/40">
            Pendiente
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/40">
            Activo
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-400/20 text-blue-400 border border-blue-400/40">
            Completado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-400/20 text-gray-400 border border-gray-400/40">
            Desconocido
          </span>
        );
    }
  };

  return (
    <Card className="bg-black/80 border-2 border-smash-purple/60 text-white overflow-hidden shadow-glow">
      <CardHeader className="bg-gradient-to-r from-smash-blue to-smash-purple py-3">
        <CardTitle className="font-game text-white text-center">Torneos</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-black/70">
              <TableRow>
                <TableHead className="text-white">Nombre</TableHead>
                <TableHead className="text-white">Fecha</TableHead>
                <TableHead className="text-white">Estado</TableHead>
                <TableHead className="text-center text-white">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTournaments.map((tournament) => (
                <TableRow 
                  key={tournament.id} 
                  className="border-t border-gray-700 hover:bg-black/50 transition-all duration-300"
                  onMouseEnter={handleRowHover}
                >
                  <TableCell className="py-3 px-4 font-bold">{tournament.name}</TableCell>
                  <TableCell className="py-3 px-4">
                    {new Date(tournament.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {renderStatus(tournament.status)}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <Link 
                      to={`/admin/tournaments/${tournament.id}`}
                      className="inline-flex items-center px-4 py-2 rounded-md font-bold text-white bg-smash-blue hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                      onClick={() => window.playSoundEffect('start')}
                    >
                      Ver Detalles
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentList;
