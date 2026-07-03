import { useState, useEffect } from 'react';
import { useFetch } from './hooks/useFetch';
import CharacterList from './components/CharacterList';
import Sidebar from './components/Sidebar';

function App() {
  // 1. LLAMADA A LA API: Consumo asíncrono usando el hook personalizado
  const { data: characters, loading, error } = useFetch('https://rickandmortyapi.com/api/character');
  
  // 2. ESTADOS GLOBALES CON LOCALSTORAGE
  const [search, setSearch] = useState('');
  
  // Inicialización de estados leyendo el almacenamiento local
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  const [blocked, setBlocked] = useState(() => {
    const savedBlocked = localStorage.getItem('blocked');
    return savedBlocked ? JSON.parse(savedBlocked) : [];
  });

  // 3. PERSISTENCIA EN LOCALSTORAGE (COMMIT 6)
  // Monitoreamos los cambios en los arreglos para guardarlos automáticamente en el navegador
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('blocked', JSON.stringify(blocked));
  }, [blocked]);

  // 4. FUNCIONES DE INTERACTIVIDAD
  const toggleFavorite = (character) => {
    if (favorites.some(fav => fav.id === character.id)) {
      setFavorites(favorites.filter(fav => fav.id !== character.id));
    } else {
      setFavorites([...favorites, character]);
    }
  };

  const clearAllFavorites = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todos tus favoritos?')) {
      setFavorites([]);
    }
  };

  const blockCharacter = (character) => {
    if (!blocked.some(b => b.id === character.id)) {
      setBlocked([...blocked, character]);
      setFavorites(favorites.filter(fav => fav.id !== character.id)); // Regla de exclusión mutua
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
    // CONTENEDOR OPTIMIZADO PARA DISEÑO RESPONSIVO (COMMIT 7)
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 flex flex-col justify-between w-full max-w-7xl mx-auto antialiased">
      <div>
        {/* ENCABEZADO RESPONSIVO */}
        <header className="mb-6 p-4 bg-white shadow rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Taller React API - Rick & Morty</h1>
            <p className="text-sm text-gray-500">Desarrollado por: Patricio Alex Lagos Veliz</p> 
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm font-semibold items-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Resultados: {filteredCharacters.length}</span>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded">⭐ Panel Favoritos: {favorites.length}</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded">🚫 Lista Bloqueados: {blocked.length}</span>
            
            {favorites.length > 0 && (
              <button 
                onClick={clearAllFavorites}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2 py-1 rounded transition-colors shadow-sm font-bold"
              >
                Vaciar ⭐
              </button>
            )}
          </div>
        </header>

        {/* BARRA DE BÚSQUEDA */}
        <div className="mb-6 max-w-md mx-auto flex gap-2 w-full px-1">
          <input
            type="text"
            placeholder="Buscar personaje por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 rounded-lg transition-colors text-sm"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* CONTENIDO PRINCIPAL: SISTEMA DE REJILLA RESPONSIVO (1 columna en móvil, 4 en desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
          <div className="order-2 lg:order-1 lg:col-span-3 w-full">
            {loading && <p className="text-center text-lg font-semibold text-gray-600">Cargando personajes desde la API...</p>}
            {error && <p className="text-center text-red-500 font-semibold">Hubo un error al conectar con la API: {error}</p>}
            
            {!loading && !error && (
              filteredCharacters.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow p-6">
                  <p className="text-base sm:text-xl font-semibold text-gray-500">🚫 No se encontraron personajes con ese nombre.</p>
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

          {/* ASIDE RESPONSIVO: Se posiciona arriba en móviles para mejor UX */}
          <aside className="order-1 lg:order-2 lg:col-span-1 bg-white p-4 rounded-lg shadow-md h-fit w-full">
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
      <footer className="mt-12 p-4 bg-white shadow rounded-lg text-center text-xs sm:text-sm text-gray-500 w-full">
        <p>© 2026 Taller de Desarrollo de Aplicaciones Front-End. INACAP.</p>
        <p className="text-xs text-gray-400 mt-1">Evaluación de integración de APIs y manejo de estados en React con Mobile-First.</p>
      </footer>
    </div>
  );
}

export default App;