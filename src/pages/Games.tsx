import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, Gamepad2, Star, Users, Filter } from "lucide-react";

const allGames = [
  {
    id: "snake",
    title: "Snake Classic",
    description: "Guide the snake to eat food and grow longer!",
    category: "Casual",
    color: "from-emerald-400 to-cyan-500",
    icon: "🐍",
    players: "1.2M",
    rating: 4.8,
  },
  {
    id: "whack-a-mole",
    title: "Whack-a-Mole",
    description: "Test your reflexes in this classic arcade game!",
    category: "Action",
    color: "from-violet-400 to-purple-600",
    icon: "🔨",
    players: "890K",
    rating: 4.7,
  },
  {
    id: "memory",
    title: "Memory Match",
    description: "Flip cards and find matching pairs!",
    category: "Puzzle",
    color: "from-amber-400 to-orange-500",
    icon: "🧠",
    players: "2.1M",
    rating: 4.9,
  },
  {
    id: "tetris",
    title: "Block Stacker",
    description: "Stack falling blocks to clear lines!",
    category: "Classic",
    color: "from-pink-400 to-rose-500",
    icon: "🧱",
    players: "3.4M",
    rating: 4.9,
  },
  {
    id: "pong",
    title: "Pong",
    description: "The original arcade classic!",
    category: "Action",
    color: "from-blue-400 to-indigo-500",
    icon: "🏓",
    players: "1.8M",
    rating: 4.6,
  },
  {
    id: "sudoku",
    title: "Sudoku",
    description: "Fill the grid with numbers!",
    category: "Puzzle",
    color: "from-teal-400 to-emerald-500",
    icon: "🔢",
    players: "2.5M",
    rating: 4.8,
  },
  {
    id: "flappy",
    title: "Flappy Bird",
    description: "Tap to fly through the pipes!",
    category: "Casual",
    color: "from-yellow-400 to-amber-500",
    icon: "🐤",
    players: "4.2M",
    rating: 4.5,
  },
  {
    id: "breakout",
    title: "Breakout",
    description: "Break all the bricks with the ball!",
    category: "Action",
    color: "from-red-400 to-pink-500",
    icon: "🧱",
    players: "1.5M",
    rating: 4.7,
  },
];

const categories = ["All", "Action", "Casual", "Puzzle", "Classic"];

export default function Games() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = allGames.filter((game) => {
    const matchesCategory =
      selectedCategory === "All" || game.category === selectedCategory;
    const matchesSearch = game.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
      {/* Header */}
      <nav className="backdrop-blur-md bg-white/70 border-b border-violet-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">All Games</span>
          </div>
          <div className="w-24" />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filters */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-slate-400 mr-2" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-violet-500 text-white shadow-md"
                      : "bg-white text-slate-600 hover:bg-violet-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredGames.length}</span> games
          </p>
        </div>

        {/* Games Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredGames.map((game) => (
            <motion.div
              key={game.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="game-card cursor-pointer group"
              onClick={() => navigate(`/play/${game.id}`)}
            >
              <div className={`h-40 bg-gradient-to-br ${game.color} flex items-center justify-center relative overflow-hidden`}>
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                  {game.icon}
                </span>
                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 rounded-full text-xs font-bold text-slate-700">
                  {game.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-violet-600 transition-colors">
                  {game.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                  {game.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1 text-sm text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{game.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <Users className="w-4 h-4" />
                    <span>{game.players}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No games found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
