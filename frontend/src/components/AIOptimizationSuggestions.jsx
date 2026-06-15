import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Play, Sparkles, ChevronRight, Zap } from 'lucide-react';

export default function AIOptimizationSuggestions({ isDark, selectedEq }) {
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const suggestions = [
    {
      id: 1,
      title: `Optimize ${selectedEq} Cooling Flow`,
      priority: 'HIGH',
      category: 'Energy',
      description: `Increase cooling flow to ${selectedEq} by 12% to reduce temperature spikes and save ~500 kWh/day`,
      impact: 'High',
      savings: '₹12,500/day',
      timeToImplement: '5 mins',
      icon: <Zap className="w-8 h-8 text-amber-400" />
    },
    {
      id: 2,
      title: `Adjust ${selectedEq} Pressure Setpoint`,
      priority: 'MEDIUM',
      category: 'Efficiency',
      description: `Fine-tune pressure control to reduce wear and tear on ${selectedEq}'s components`,
      impact: 'Medium',
      savings: '₹5,200/day',
      timeToImplement: '10 mins',
      icon: <Sparkles className="w-8 h-8 text-purple-400" />
    }
  ];

  return (
    <div className={`rounded-3xl p-8 border-2 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-slate-700' 
        : 'bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200'
    }`}>
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{ 
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ 
          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
          backgroundSize: '400% 400%',
          filter: 'blur(60px)',
          opacity: 0.1
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Optimization Suggestions
              </h2>
            </div>
            <p className="text-xl text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-sm font-bold text-blue-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Live
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 40, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setSelectedSuggestion(selectedSuggestion === suggestion.id ? null : suggestion.id)}
              className={`rounded-3xl p-8 border-2 cursor-pointer transition-all relative overflow-hidden group ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700 hover:border-emerald-500/50' 
                  : 'bg-gradient-to-br from-white/80 to-slate-100/80 border-slate-200 hover:border-emerald-500/50'
              } ${selectedSuggestion === suggestion.id ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : ''}`}
            >
              {/* Decorative gradient */}
              <motion.div 
                className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      {suggestion.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2">{suggestion.title}</h3>
                      <div className="flex items-center gap-4">
                        <motion.span 
                          className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                            suggestion.priority === 'HIGH' 
                              ? 'bg-gradient-to-r from-red-900/50 to-rose-900/50 text-red-400 border border-red-500/30' 
                              : 'bg-gradient-to-r from-amber-900/50 to-yellow-900/50 text-amber-400 border border-amber-500/30'
                          }`}
                          animate={{ 
                            boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 20px rgba(248,113,113,0.3)', '0 0 0 rgba(0,0,0,0)'] 
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {suggestion.priority}
                        </motion.span>
                        <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-slate-700/50 to-slate-800/50 text-slate-300 border border-slate-600/30">
                          {suggestion.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: selectedSuggestion === suggestion.id ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-slate-400 group-hover:text-emerald-400"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </motion.div>
                </div>

                <p className="text-lg text-slate-400 mb-8 leading-relaxed">{suggestion.description}</p>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-700/50">
                  <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-wider text-slate-500 mb-2">Impact</p>
                    <motion.p 
                      className="text-3xl font-black"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      style={{ 
                        color: suggestion.priority === 'HIGH' ? '#f87171' : '#fbbf24'
                      }}
                    >
                      {suggestion.impact}
                    </motion.p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-wider text-slate-500 mb-2">Est. Savings</p>
                    <motion.p 
                      className="text-3xl font-black text-emerald-400"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 + 0.2 }}
                    >
                      {suggestion.savings}
                    </motion.p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-wider text-slate-500 mb-2">Time to Implement</p>
                    <motion.p 
                      className="text-3xl font-black text-blue-400"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 + 0.4 }}
                    >
                      {suggestion.timeToImplement}
                    </motion.p>
                  </div>
                </div>

                <motion.div 
                  className="flex justify-end mt-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.4 }}
                >
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-10 py-4 rounded-2xl font-black text-xl flex items-center gap-3 transition-all ${
                      isDark 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/40' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40'
                    }`}
                  >
                    <Play className="w-6 h-6 fill-current" />
                    Implement Now
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
