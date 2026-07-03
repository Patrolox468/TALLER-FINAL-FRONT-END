import { useState, useEffect } from 'react';
import { useFetch } from './hooks/useFetch';
import CharacterList from './components/CharacterList';
import Sidebar from './components/Sidebar';

function App() {
  // 1. LLAMADA A LA API: Traemos los personajes usando nuestro hook personalizado [cite: 42, 47]
  const { data: characters, loading, error } = useFetch('https://rickandmortyapi.com/api/character');
  
  // 2. ESTADOS GLOBALES CON LOCALSTORAGE: 
  // Intentamos leer lo que ya está guardado en el navegador; si no hay nada, empezamos con un arreglo vacío.
  const [search, setSearch] = useState('');
  
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  const [blocked, setBlocked] = useState(() => {
    const savedBlocked = localStorage.getItem('blocked');
    return savedBlocked ? JSON.parse(savedBlocked) : [];
  });

  // 3. EFECTOS (useEffect): Cada vez que cambien los favoritos o bloqueados, 
  // los guardamos automáticamente en el localStorage.
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('blocked', JSON.stringify(blocked));
  }, [blocked]);


  // 4. FUNCIONES DE INTERACTIVIDAD

  // Agregar o quitar un personaje de la lista de favoritos [cite: 33]
  const toggleFavorite = (character) => {
    if (favorites.some(fav => fav.id === character.id)) {
      // Si ya es favorito, lo quitamos de la lista
      setFavorites(favorites.filter(fav => fav.id !== character.id));
    } else {
      // Si no es favorito, lo agregamos manteniendo los que ya estaban
      setFavorites([...favorites, character]);
    }
  };

  // Bloquear un personaje [cite: 34]
  const blockCharacter = (character) => {
    if (!blocked.some(b => b.id === character.id)) {
      setBlocked([...blocked, character]);
      // REQUERIMIENTO ESTRICTO: Si está en favoritos y se bloquea, se retira automáticamente [cite: 35]
      setFavorites(favorites.filter(fav => fav.id !== character.id));
    }
  };

  // Desbloquear un personaje para que pueda volver a aparecer [cite: 34]
  const unblockCharacter = (id) => {
    setBlocked(blocked.filter(b => b.id !== id));
  };


  // 5. LÓGICA DE FILTRADO [cite: 32, 34]
  const filteredCharacters = characters.filter(char => {
    // Filtrado por la barra de búsqueda (convertimos a minúsculas para evitar problemas) [cite: 32]
    const matchesSearch = char.name.toLowerCase().includes(search.toLowerCase());
    // Regla: Si el personaje está bloqueado, NO debe aparecer en los resultados [cite: 34]
    const isBlocked = blocked.some(b => b.id === char.id);
    
    return matchesSearch && !isBlocked;
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      
      {/* ENCABEZADO CON IDENTIFICACIÓN Y ESTADÍSTICAS [cite: 36, 40] */}
      <header className="mb-6 p-4 bg-white shadow rounded-lg flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Taller React API - Rick & Morty</h1>
          <p className="text-sm text-gray-500">Desarrollado por: Patricio Alex Lagos Veliz</p> 
        </div>
        
        {/* Despliegue de estadísticas requeridas [cite: 36] */}
        <div className="flex gap-4 text-sm font-semibold">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Visibles: {filteredCharacters.length}</span>
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded">⭐ Favoritos: {favorites.length}</span>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded">🚫 Bloqueados: {blocked.length}</span>
        </div>
      </header>

      {/* BARRA DE BÚSQUEDA [cite: 32] */}
      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Buscar personaje por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* CONTENIDO PRINCIPAL (DISEÑO RESPONSIVO) [cite: 39] */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Listado de Tarjetas */}
        <div className="lg:col-span-3">
          {/* 1. Estado de Carga [cite: 37] */}
          {loading && <p className="text-center text-lg font-semibold text-gray-600">Cargando personajes desde la API...</p>}
          
          {/* 2. Estado de Error [cite: 37] */}
          {error && <p className="text-center text-red-500 font-semibold">Hubo un error al conectar con la API: {error}</p>}
          
          {/* 3. Renderizado de Datos o Mensaje Vacío */}
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

        {/* PANEL LATERAL DERECHO [cite: 33] */}
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
  );
}

export default App;