import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Shield, TrendingUp, Clock, CheckCircle, Star, Award } from 'lucide-react';

const achievements = [
  {
    id: 1,
    icon: Trophy,
    title: 'First Responder',
    description: 'Resolved your first emergency alert',
    unlocked: true,
    date: '2026-06-14',
    points: 100
  },
  {
    id: 2,
    icon: Zap,
    title: 'Quick Fix',
    description: 'Completed maintenance in under 1 hour',
    unlocked: true,
    date: '2026-06-10',
    points: 75
  },
  {
    id: 3,
    icon: Shield,
    title: 'Safety Champion',
    description: '100% safety compliance record',
    unlocked: true,
    date: '2026-06-05',
    points: 150
  },
  {
    id: 4,
    icon: TrendingUp,
    title: 'Predictive Master',
    description: 'Acted on 5+ AI predictions',
    unlocked: false,
    date: null,
    points: 200
  },
  {
    id: 5,
    icon: Clock,
    title: 'On Time',
    description: 'Completed 10 scheduled maintenance tasks',
    unlocked: false,
    date: null,
    points: 125
  },
  {
    id: 6,
    icon: Star,
    title: 'Perfect Week',
    description: 'No unexpected downtime for 7 days',
    unlocked: false,
    date: null,
    points: 250
  }
];

export default function Achievements() {
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-400" />
            Maintenance Achievements
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {unlockedCount}/{achievements.length} unlocked • {totalPoints} points
          </p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-900/30 to-amber-900/20 border-yellow-500/50 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20'
                  : 'bg-slate-800/30 border-slate-700 opacity-50 hover:opacity-70'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-500 to-amber-600'
                    : 'bg-slate-700'
                }`}>
                  <Icon className={`w-5 h-5 ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <div className="flex-1">
                  <div className={`text-xs font-bold ${achievement.unlocked ? 'text-yellow-400' : 'text-slate-500'}`}>
                    +{achievement.points} pts
                  </div>
                </div>
                {achievement.unlocked && (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <h4 className={`text-sm font-bold mb-1 ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`}>
                {achievement.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                {achievement.description}
              </p>
              {achievement.unlocked && achievement.date && (
                <p className="text-[10px] text-slate-500 mt-2 font-mono">
                  Unlocked: {achievement.date}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Next Reward</span>
          <span className="text-xs text-slate-400 font-mono">
            {totalPoints}/500
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalPoints / 500) * 100}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
