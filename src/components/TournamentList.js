
import React from 'react';
import { Link } from 'react-router-dom';

const TournamentList = ({ tournaments }) => {
  // Ordenar torneos por fecha de creación (más reciente primero)
  const sortedTournaments = [...tournaments].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Función para mostrar el estado del torneo con colores
  const renderStatus = (status) => {
    switch (status) {
      case 'pending':
        return <span className="text-yellow-400">Pendiente</span>;
      case 'active':
        return <span className="text-green-500">Activo</span>;
      case 'completed':
        return <span className="text-blue-400">Completado</span>;
      default:
        return <span className="text-gray-400">Desconocido</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-black/30 text-white rounded-lg overflow-hidden">
        <thead className="bg-black/50">
          <tr>
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Fecha</th>
            <th className="py-2 px-4 text-left">Estado</th>
            <th className="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedTournaments.map((tournament) => (
            <tr key={tournament.id} className="border-t border-gray-700 hover:bg-black/50">
              <td className="py-3 px-4">{tournament.name}</td>
              <td className="py-3 px-4">
                {new Date(tournament.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 font-bold">
                {renderStatus(tournament.status)}
              </td>
              <td className="py-3 px-4 text-center">
                <Link 
                  to={`/admin/tournaments/${tournament.id}`}
                  className="btn btn-primary py-1 px-3 text-sm"
                >
                  Ver Detalles
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TournamentList;
