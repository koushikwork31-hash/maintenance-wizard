import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

export default function HealthScore({ score = 85, status = 'Good' }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getCircleColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          Predictive Health Score
        </h3>
        {score >= 80 ? (
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        ) : score >= 60 ? (
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-red-400" />
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#1e293b"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              stroke={getCircleColor(score)}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className={`text-3xl font-black ${getScoreColor(score)}`}
            >
              {score}
            </motion.div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Status</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                score >= 80 ? 'bg-emerald-900/50 text-emerald-400' :
                score >= 60 ? 'bg-amber-900/50 text-amber-400' :
                'bg-red-900/50 text-red-400'
              }`}>
                {status}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Prediction</span>
              <span className={`text-xs font-bold flex items-center gap-1 ${
                score >= 80 ? 'text-emerald-400' :
                score >= 60 ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {score >= 80 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {score >= 80 ? 'Stable' : score >= 60 ? 'Monitoring' : 'Critical'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700">
            <p className="text-xs text-slate-400">
              {score >= 80 
                ? 'Equipment operating at optimal performance. No immediate action needed.'
                : score >= 60
                ? 'Schedule preventive maintenance within 2 weeks to avoid potential issues.'
                : 'Urgent attention required. Risk of failure within 72 hours.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
