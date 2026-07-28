import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Home, Gamepad2 } from "lucide-react";

export default function NotFound() {
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
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">PlayZone</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-8xl mb-6"
          >
            🎮
          </motion.div>
          <h1 className="text-6xl font-extrabold text-gradient mb-4">404</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Game Not Found
          </h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Looks like this game hasn't been unlocked yet. Let's get you back to the action!
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white gradient-primary rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl transition-all"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
            <button
              onClick={() => navigate("/games")}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-violet-600 bg-white border-2 border-violet-200 rounded-xl hover:border-violet-400 transition-colors"
            >
              <Gamepad2 className="w-5 h-5" />
              Browse Games
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-violet-100 bg-white/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-400">
            © 2026 PlayZone. All rights reserved.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
