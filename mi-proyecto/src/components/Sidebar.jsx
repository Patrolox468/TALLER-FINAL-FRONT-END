import React from 'react';

function Sidebar({ favorites, onRemoveFavorite, blocked, onUnblock }) {
  return (
    <div className="space-y-6">
      {/* Sección Favoritos */}
      <div>
        <h2 className="text-lg font-bold border-b pb-2 mb-3 text-amber-600">⭐ Mis Favoritos ({favorites.length})</h2>
        {favorites.length === 0 ? (
          <p className="text-sm text-gray-400">No hay favoritos seleccionados.</p>
        ) : (
          <ul className="space-y-2">
            {favorites.map(fav => (
              <li key={fav.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border">
                <span className="text-sm font-medium truncate max-w-[150px]">{fav.name}</span>
                <button 
                  onClick={() => onRemoveFavorite(fav)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sección Bloqueados */}
      <div>
        <h2 className="text-lg font-bold border-b pb-2 mb-3 text-red-600">🚫 Bloqueados ({blocked.length})</h2>
        {blocked.length === 0 ? (
          <p className="text-sm text-gray-400">No hay elementos bloqueados.</p>
        ) : (
          <ul className="space-y-2">
            {blocked.map(b => (
              <li key={b.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border">
                <span className="text-sm font-medium truncate max-w-[150px]">{b.name}</span>
                <button 
                  onClick={() => onUnblock(b.id)}
                  className="text-xs text-green-600 hover:underline"
                >
                  Desbloquear
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;