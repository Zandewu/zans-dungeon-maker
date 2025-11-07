import React, { useState, useEffect } from 'react';
import Game from './Game.jsx';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dungeons, setDungeons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDungeons = () => {
      setLoading(true);
      const url = searchTerm
        ? `http://localhost:5000/api/dungeonsquery?q=${encodeURIComponent(searchTerm)}`
        : 'http://localhost:5000/api/dungeonsquery';

      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('Network error');
          return res.json();
        })
        .then(data => setDungeons(data))
        .catch(err => {
          console.error(err);
          setDungeons([]);
        })
        .finally(() => setLoading(false));
    };

    fetchDungeons();
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Search Bar */}
      <div className="w-full py-4 px-4">
        <div className="max-w-5xl mx-auto">
          <input
            type="text"
            placeholder="Cari game..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl mx-auto px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 text-sm"
          />
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 h-40 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl md:text-3xl font-bold">🎮 Temukan Game Terbaik!</h1>
          <p className="text-indigo-200 text-sm mt-2">
            {loading ? 'Memuat...' : `${dungeons.length} game ditemukan`}
          </p>
        </div>
      </div>

      {/* Daftar Game */}
      <div className="flex-grow max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : dungeons.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4">
            {dungeons.map(dungeon => {
  const short = dungeon.nama_dungeon.split(' ').slice(0, 2).join('+');
  const poster = `https://placehold.co/160x160/4a90e2/ffffff?text=${encodeURIComponent(short)}`;

  return (
    <div
      key={dungeon.id_dungeon}
      className="w-36 bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow group relative" // 🔹 tambahkan 'group' & 'relative'
    >
      {/* Thumbnail */}
      <div className="aspect-square relative">
        <img
          src={poster}
          alt={dungeon.nama_dungeon}
          className="w-full h-full object-cover"
        />
        {/* Tombol Play — muncul saat hover */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 pointer-events-none">
          <button
            className="bg-white text-indigo-700 rounded-full w-10 h-10 flex items-center justify-center pointer-events-auto hover:bg-indigo-100 transition-colors"
            aria-label={`Mainkan ${dungeon.nama_dungeon}`}
            onClick={() => {<Game />}}
            // 🔹 Nanti bisa tambahkan onClick untuk buka dungeon
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.548 6.351c1.294.727 1.294 2.579 0 3.306L7.279 19.014c-1.25.687-2.779-.216-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-2">
        <h2 className="font-semibold text-xs line-clamp-2 h-4">
          {dungeon.nama_dungeon}
        </h2>
        <p className="text-indigo-400 text-[10px] ">
          {dungeon.nama_pembuat}
        </p>
        <p className="text-gray-400 text-[9px] line-clamp-2 h-4">
          {new Date(dungeon.waktu_diubah).toLocaleDateString('id-ID')}
        </p>
      </div>
    </div>
  );
})}
          </div>
        ) : (
          <p className="text-center text-gray-400">Tidak ada game.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;