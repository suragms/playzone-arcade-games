import { motion } from "framer-motion";
import { Play, Gamepad2, Trophy, Zap, ArrowRight, Star, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const featuredGames = [
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
];

const categories = [
  { name: "Action", icon: <Zap className="w-5 h-5" />, color: "bg-red-500", count: 24 },
  { name: "Casual", icon: <Gamepad2 className="w-5 h-5" />, color: "bg-emerald-500", count: 42 },
  { name: "Puzzle", icon: <Star className="w-5 h-5" />, color: "bg-amber-500", count: 31 },
  { name: "Racing", icon: <Trophy className="w-5 h-5" />, color: "bg-violet-500", count: 18 },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50"
    >
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/70 border-b border-violet-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">PlayZone</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#games" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
              Games
            </a>
            <a href="#categories" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
              Categories
            </a>
            <a href="#leaderboard" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
              Leaderboard
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/games")}
              className="px-5 py-2.5 text-sm font-semibold text-white gradient-primary rounded-xl hover:opacity-90 transition-opacity"
            >
              Play Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full text-sm font-medium text-violet-700 mb-6">
                <Zap className="w-4 h-4" />
                Over 100+ Free Games
              </div>
            </motion.div>

            <motion.h1
              {...fadeUp}
              className="text-5xl md:text-7xl font-extrabold text-slate-800 leading-tight"
            >
              Play. Compete.{" "}
              <span className="text-gradient">Win.</span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              Your ultimate gaming destination. Play classic and modern games instantly in your browser.
              No downloads, no waiting—just pure fun!
            </motion.p>

            <motion.div {...fadeUp} className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => navigate("/games")}
                className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white gradient-primary rounded-2xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all"
              >
                <Play className="w-6 h-6" />
                Start Playing
              </button>
              <button
                onClick={() => navigate("/games")}
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-slate-700 bg-white rounded-2xl border-2 border-slate-200 hover:border-violet-300 transition-colors"
              >
                Browse Games
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fadeUp}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              {[
                { label: "Games", value: "100+" },
                { label: "Players", value: "5M+" },
                { label: "High Scores", value: "50M+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-extrabold text-gradient">{stat.value}</div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section id="games" className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-3">
              Featured Games
            </p>
            <h2 className="text-4xl font-extrabold text-slate-800">
              Popular Right Now
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredGames.map((game) => (
              <motion.div
                key={game.id}
                variants={fadeUp}
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

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/games")}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-violet-600 bg-violet-100 rounded-xl hover:bg-violet-200 transition-colors"
            >
              View All Games
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wider mb-3">
              Explore
            </p>
            <h2 className="text-4xl font-extrabold text-slate-800">
              Game Categories
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((cat) => (
              <motion.div
                key={cat.name}
                variants={fadeUp}
                className="game-card cursor-pointer group"
                onClick={() => navigate("/games")}
              >
                <div className="p-8 text-center">
                  <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mx-auto text-white group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mt-5">{cat.name}</h3>
                  <p className="text-sm text-slate-500 mt-2">{cat.count} games</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Leaderboard Teaser */}
      <section id="leaderboard" className="py-20 px-6 bg-gradient-to-br from-violet-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Trophy className="w-16 h-16 mx-auto mb-6 text-amber-300" />
            <h2 className="text-4xl font-extrabold mb-6">
              Climb the Leaderboard
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Compete with players worldwide. Set high scores, earn achievements, and become a legend!
            </p>
            <button
              onClick={() => navigate("/games")}
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-violet-600 bg-white rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <Trophy className="w-6 h-6" />
              Join the Competition
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold text-slate-800 mb-6">
              Ready to Play?
            </h2>
            <p className="text-lg text-slate-600 mb-10">
              Join millions of players and start your gaming adventure today.
            </p>
            <button
              onClick={() => navigate("/games")}
              className="inline-flex items-center gap-3 px-10 py-5 text-xl font-bold text-white gradient-fun rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <Play className="w-7 h-7" />
              Get Started Free
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PlayZone</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your ultimate destination for free online games.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Games</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Action</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Casual</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Puzzle</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Classic</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Leaderboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Achievements</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Forums</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-8 text-center text-sm text-slate-500">
            © 2026 PlayZone. All rights reserved.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
