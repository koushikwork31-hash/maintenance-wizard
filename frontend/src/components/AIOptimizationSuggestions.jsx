import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Play } from 'lucide-react';

export default function AIOptimizationSuggestions({ isDark, selectedEq }) {
  const suggestions = [
    {
      id: 1,
      title: `Optimize ${selectedEq} Cooling Flow`,
      priority: 'HIGH',
      category: 'Energy',
      description: `Increase cooling flow to ${selectedEq} by 12% to reduce temperature spikes and save ~500 kWh/day`,
      impact: 'High',
      savings: '₹12,500/day',
      timeToImplement: '5 mins'
    }
  ];

  return (
    <div className={`rounded-2xl p-8 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">AI Optimization Suggestions</h2>
          <p className="text-xl text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="space-y-6">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-3xl p-8 border relative overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700' 
                : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'
            }`}
          >
            {/* Decorative gradient */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/20 to-red-500/20 border border-rose-500/30">
                    <Lightbulb className="w-8 h-8 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">{suggestion.title}</h3>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${
                        suggestion.priority === 'HIGH' 
                          ? 'bg-red-900/50 text-red-400 border border-red-500/30' 
                          : 'bg-amber-900/50 text-amber-400 border border-amber-500/30'
                      }`}>
                        {suggestion.priority}
                      </span>
                      <span className="px-4 py-1 rounded-full text-sm font-bold bg-slate-700/50 text-slate-300 border border-slate-600/30">
                        {suggestion.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg text-slate-400 mb-8">{suggestion.description}</p>

              <div className="grid grid-cols-3 gap-8 pt-6 border-t border-slate-700/50">
                <div className="text-center">
                  <p className="text-sm font-black uppercase tracking-wider text-slate-500 mb-2">Impact</p>
                  <p className="text-3xl font-black text-red-400">{suggestion.impact}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black uppercase tracking-wider text-slate-500 mb-2">Est. Savings</p>
                  <p className="text-3xl font-black text-white">{suggestion.savings}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black uppercase tracking-wider text-slate-500 mb-2">Time to Implement</p>
                  <p className="text-3xl font-black text-white">{suggestion.timeToImplement}</p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button className={`px-10 py-4 rounded-2xl font-black text-xl flex items-center gap-3 transition-all hover:scale-105 ${
                  isDark 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                }`}>
                  <Play className="w-6 h-6 fill-current" />
                  Implement Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
