import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, X, Maximize2, Search, TrendingUp, Clock } from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState(gamesData);

  useEffect(() => {
    const filtered = gamesData.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [searchQuery]);

  const openGame = (game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeGame = () => {
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setSelectedGame(null)}>
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Gamepad2 className="text-black w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase italic">Nexus Games</span>
          </div>

          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-96 focus-within:border-emerald-500/50 transition-colors">
            <Search className="w-4 h-4 text-zinc-500 mr-2" />
            <input
              type="text"
              placeholder="Search unblocked games..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Popular</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">New</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Categories</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold italic uppercase tracking-tight">{selectedGame.title}</h2>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase rounded border border-emerald-500/20">Live</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={closeGame}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-zinc-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/5">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="absolute inset-0 w-full h-full border-none"
                  allowFullScreen
                  title={selectedGame.title}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold">About {selectedGame.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Play {selectedGame.title} unblocked on Nexus Games. This classic web game is fully optimized for browser play. No downloads, no plugins, just instant gaming.
                  </p>
                </div>
                <div className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5 h-fit">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Game Stats</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Players</span>
                      <span className="font-mono text-emerald-400">1.2k+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-sm flex items-center gap-2"><Clock className="w-4 h-4" /> Avg Session</span>
                      <span className="font-mono text-emerald-400">12m</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <section className="relative h-64 rounded-3xl overflow-hidden border border-white/10 group">
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2000" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                  alt="Hero"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">Level Up Your Break</h1>
                  <p className="text-zinc-400 max-w-lg">The ultimate collection of unblocked games for school or work. Instant access, zero restrictions.</p>
                </div>
              </section>

              {/* Games Grid */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold italic uppercase tracking-tight flex items-center gap-3">
                    <span className="w-2 h-8 bg-emerald-500 rounded-full" />
                    All Games
                  </h2>
                  <div className="flex gap-2">
                    {['Action', 'Puzzle', 'Retro', 'Sports'].map(cat => (
                      <button key={cat} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-black transition-all">
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      whileHover={{ y: -8 }}
                      onClick={() => openGame(game)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-lg group-hover:shadow-emerald-500/10 transition-all">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                           <span className="text-xs font-bold uppercase tracking-widest bg-emerald-500 text-black px-2 py-1 rounded">Play Now</span>
                        </div>
                      </div>
                      <h3 className="mt-3 font-bold text-zinc-300 group-hover:text-emerald-400 transition-colors truncate">{game.title}</h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Unblocked • Web</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tighter uppercase italic">Nexus Games</span>
          </div>
          <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold">
            © 2026 Nexus Games • No AI • Pure Gaming
          </p>
          <div className="flex gap-6 text-zinc-500 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
