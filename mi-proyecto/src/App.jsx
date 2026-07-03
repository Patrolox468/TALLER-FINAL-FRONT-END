import { useState, useEffect } from 'react';
import { useFetch } from './hooks/useFetch';
import CharacterList from './components/CharacterList';
import Sidebar from './components/Sidebar';

function App() {
  // 1. LLAMADA A LA API
  const { data: characters, loading, error } = useFetch('https://rickandmortyapi.com/api/character');
  
  // 2. ESTADOS GLOBALES CON LOCALSTORAGE
  const [search, setSearch] = useState('');
  
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  const [blocked, setBlocked] = useState(() => {
    const savedBlocked = localStorage.getItem('blocked');
    return savedBlocked ? JSON.parse(savedBlocked) : [];
  });

  // 3. EFECTOS (useEffect)
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('blocked', JSON.stringify(blocked));
  }, [blocked]);

  // 4. FUNCIONES DE INTERACTIVIDAD
  // REQUERIMIENTO DEL TALLER: Controla la inclusión/exclusión de favoritos
  const toggleFavorite = (character) => {
    if (favorites.some(fav => fav.id === character.id)) {
      setFavorites(favorites.filter(fav => fav.id !== character.id));
    } else {
      setFavorites([...favorites, character]);
    }
  };

  // REQUERIMIENTO DEL TALLER: Bloquea personajes y los remueve de favoritos automáticamente
  const blockCharacter = (character) => {
    if (!blocked.some(b => b.id === character.id)) {
      setBlocked([...blocked, character]);
      setFavorites(favorites.filter(fav => fav.id !== character.id));
    }
  };

  const unblockCharacter = (id) => {
    setBlocked(blocked.filter(b => b.id !== id));
  };

  // 5. LÓGICA DE FILTRADO
  const filteredCharacters = characters.filter(char => {
    const matchesSearch = char.name.toLowerCase().includes(search.toLowerCase());
    const isBlocked = blocked.some(b => b.id === char.id);
    return matchesSearch && !isBlocked;
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 flex flex-col justify-between">
      <div>
        {/* ENCABEZADO CON TEXTOS OPTIMIZADOS PARA PRESENTACIÓN */}
        <header className="mb-6 p-4 bg-white shadow rounded-lg flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Taller React API - Rick & Morty</h1>
            <p className="text-sm text-gray-500">Desarrollado por: Patricio Alex Lagos Veliz</p> 
          </div>
          
          {/* Etiquetas optimizadas para reflejar mejor los estados exigidos */}
          <div className="flex gap-4 text-sm font-semibold">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Resultados: {filteredCharacters.length}</span>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded">⭐ Panel Favoritos: {favorites.length}</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded">🚫 Lista Bloqueados: {blocked.length}</span>
          </div>
        </header>

        {/* BARRA DE BÚSQUEDA CON BOTÓN DE LIMPIEZA */}
        <div className="mb-6 max-w-md mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Buscar personaje por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 rounded-lg transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {loading && <p className="text-center text-lg font-semibold text-gray-600">Cargando personajes desde la API...</p>}
            {error && <p className="text-center text-red-500 font-semibold">Hubo un error al conectar con la API: {error}</p>}
            
            {!loading && !error && (
              filteredCharacters.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow p-6">
                  <p className="text-xl font-semibold text-gray-500">🚫 No se encontraron personajes con ese nombre.</p>
                </div>
              ) : (
                <CharacterList 
                  characters={filteredCharacters} 
                  onToggleFavorite={toggleFavorite}
                  onBlock={blockCharacter}
                  favorites={favorites}
                />
              )
            )}
          </div>

          <aside className="lg:col-span-1 bg-white p-4 rounded-lg shadow-md h-fit">
            <Sidebar 
              favorites={favorites} 
              onRemoveFavorite={toggleFavorite}
              blocked={blocked}
              onUnblock={unblockCharacter}
            />
          </aside>
        </div>
      </div>

      {/* COMPONENTE FOOTER */}
      <footer className="mt-12 p-4 bg-white shadow rounded-lg text-center text-sm text-gray-500">
        <p>© 2026 Taller de Desarrollo de Aplicaciones Front-End. INACAP.</p>
        <p className="text-xs text-gray-400 mt-1">Evaluación de integración de APIs y manejo de estados en React.</p>
      </footer>
    </div>
  );
}

export default App;