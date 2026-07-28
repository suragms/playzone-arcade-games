import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Trophy, Gamepad2, Clock, Star, TrendingUp, Flame } from "lucide-react";

const recentGames = [
  { title: "Snake Classic", icon: "🐍", score: 1240, time: "2 min ago" },
  { title: "Whack-a-Mole", icon: "🔨", score: 890, time: "15 min ago" },
  { title: "Memory Match", icon: "🧠", score: 2100, time: "1 hour ago" },
];

const favoriteGames = [
  { title: "Snake Classic", icon: "🐍", color: "from-emerald-400 to-cyan-500" },
  { title: "Block Stacker", icon: "🧱", color: "from-pink-400 to-rose-500" },
  { title: "Flappy Bird", icon: "🐤", color: "from-yellow-400 to-amber-500" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
      {/* Header */}
      <nav className="backdrop-blur-md bg-white/70 border-b border-violet-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">PlayZone</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/games")}
              className="px-4 py-2 text-sm font-semibold text-white gradient-primary rounded-xl hover:opacity-90 transition-opacity"
            >
              Browse Games
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-slate-800"
          >
            Welcome, Player! 👋
          </motion.h1>
          <p className="text-slate-500 mt-2">Ready to play some games?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Games", value: "42", icon: <Gamepad2 className="w-5 h-5" />, color: "bg-violet-100 text-violet-600" },
            { label: "Total Score", value: "12,450", icon: <TrendingUp className="w-5 h-5" />, color: "bg-cyan-100 text-cyan-600" },
            { label: "High Scores", value: "8", icon: <Trophy className="w-5 h-5" />, color: "bg-amber-100 text-amber-600" },
            { label: "Play Time", value: "5.2h", icon: <Clock className="w-5 h-5" />, color: "bg-emerald-100 text-emerald-600" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-extrabold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Games */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Recent Games
              </h2>
              <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentGames.map((game, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => navigate("/games")}
                >
                  <div className="text-3xl">{game.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{game.title}</h3>
                    <p className="text-sm text-slate-500">{game.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-violet-600">{game.score.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">points</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Favorite Games */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
          >
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-amber-500" />
              Favorites
            </h2>
            <div className="space-y-4">
              {favoriteGames.map((game, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => navigate("/games")}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${game.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {game.icon}
                  </div>
                  <h3 className="font-semibold text-slate-800">{game.title}</h3>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/games")}
              className="w-full mt-4 py-3 text-sm font-semibold text-violet-600 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors"
            >
              Browse More Games
            </button>
          </motion.div>
        </div>

        {/* Quick Play Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-2xl p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to Play?</h2>
              <p className="text-white/80">Jump into a quick game and beat your high score!</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/play/snake")}
                className="px-6 py-3 bg-white text-violet-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                🐍 Play Snake
              </button>
              <button
                onClick={() => navigate("/play/whack-a-mole")}
                className="px-6 py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-colors"
              >
                🔨 Whack-a-Mole
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
