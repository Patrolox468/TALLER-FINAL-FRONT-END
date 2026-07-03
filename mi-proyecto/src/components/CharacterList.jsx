import React from 'react';

function CharacterList({ characters, onToggleFavorite, onBlock, favorites }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Personajes ({characters.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {characters.map(char => (
          <div key={char.id} className="border p-3 rounded flex flex-col justify-between">
            <div>
              <img src={char.image} alt={char.name} className="w-full h-48 object-cover rounded mb-2" />
              <h3 className="font-semibold text-lg">{char.name}</h3>
              <p className="text-sm text-gray-500">Especie: {char.species}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => onToggleFavorite(char)}
                className={`flex-1 p-2 rounded text-sm font-medium ${favorites.some(f => f.id === char.id) ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'}`}
              >
                {favorites.some(f => f.id === char.id) ? '⭐ Favorito' : '☆ Favorito'}
              </button>
              <button 
                onClick={() => onBlock(char)}
                className="flex-1 bg-red-100 text-red-700 p-2 rounded text-sm font-medium hover:bg-red-200"
              >
                🚫 Bloquear
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterList;