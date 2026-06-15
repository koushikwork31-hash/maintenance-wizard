import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Flame, Factory, Activity, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

export default function BlastFurnace2D({ equipmentId, isFaultMode }) {
  const [temp, setTemp] = useState(1200);
  const [pressure, setPressure] = useState(4.5);
  const [gasFlow, setGasFlow] = useState(85);
  const [coolantFlow, setCoolantFlow] = useState(60);
  const [healthStatus, setHealthStatus] = useState('normal');
  const [particles, setParticles] = useState([]);

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTemp(isFaultMode ? 1650 + Math.random() * 100 : 1150 + Math.random() * 100);
      setPressure(isFaultMode ? 7 + Math.random() * 1 : 4 + Math.random() * 1);
      setGasFlow(isFaultMode ? 50 + Math.random() * 20 : 80 + Math.random() * 10);
      setCoolantFlow(isFaultMode ? 30 + Math.random() * 10 : 55 + Math.random() * 10);
    }, 2000);
    return () => clearInterval(interval);
  }, [isFaultMode]);

  // Generate particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: 100 + Math.random() * 100,
      y: 100 + Math.random() * 150,
      size: 3 + Math.random() * 5,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (isFaultMode || temp > 1500 || pressure > 6) {
      setHealthStatus('critical');
    } else if (temp > 1300 || pressure > 5) {
      setHealthStatus('warning');
    } else {
      setHealthStatus('normal');
    }
  }, [temp, pressure, isFaultMode]);

  const statusColors = {
    normal: { 
      bg: 'bg-green-900/30', 
      border: 'border-green-600', 
      text: 'text-green-400', 
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
    },
    warning: { 
      bg: 'bg-orange-900/30', 
      border: 'border-orange-500', 
      text: 'text-orange-400', 
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]' 
    },
    critical: { 
      bg: 'bg-red-900/30', 
      border: 'border-red-500', 
      text: 'text-red-400', 
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse' 
    },
  };
  const colors = statusColors[healthStatus];

  return (
    <div className={`rounded-3xl p-8 border-2 relative overflow-hidden ${
      colors.bg
    } ${colors.border}`}>
      {/* Animated background */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', 
        backgroundSize: '24px 24px',
        opacity: 0.15
      }} />
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{ 
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ 
          background: `linear-gradient(45deg, ${
            healthStatus === 'critical' 
              ? '#ef4444, #dc2626, #b91c1c, #ef4444' 
              : healthStatus === 'warning' 
                ? '#f97316, #ea580c, #c2410c, #f97316' 
                : '#3b82f6, #8b5cf6, #22c55e, #3b82f6'
          })`,
          backgroundSize: '400% 400%',
          filter: 'blur(80px)',
          opacity: 0.1
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.div 
              className="p-4 rounded-2xl bg-gradient-to-br from-orange-600 to-red-700"
              animate={{ rotate: [0, 2, 0, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Factory className="text-white w-8 h-8" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                2D Blast Furnace: {equipmentId}
              </h3>
              <p className="text-sm text-slate-400">Real-time Operation Visualization</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-black text-slate-300 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
              LIVE
            </motion.div>
            {healthStatus === 'normal' ? (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle className="w-7 h-7 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <AlertTriangle className={`w-7 h-7 ${colors.text} ${healthStatus === 'critical' ? 'animate-bounce' : ''}`} />
              </motion.div>
            )}
          </div>
        </div>

        {/* 2D Visualization */}
        <div className="relative mb-6">
          <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
            {/* Particles */}
            {particles.map((particle) => (
              <motion.circle
                key={particle.id}
                cx={particle.x}
                cy={particle.y - 50}
                r={particle.size}
                fill={healthStatus === 'critical' ? '#fca5a5' : healthStatus === 'warning' ? '#fed7aa' : '#bbf7d0'}
                opacity="0.6"
                animate={{ 
                  y: [particle.y - 50, particle.y - 100],
                  opacity: [0.4, 0.8, 0],
                  scale: [1, 1.2, 0.5]
                }}
                transition={{ 
                  duration: particle.duration, 
                  delay: particle.delay, 
                  repeat: Infinity, 
                  ease: 'linear'
                }}
              />
            ))}

            {/* Furnace Body */}
            <rect x="70" y="50" width="160" height="200" rx="12"
              fill="url(#furnaceGradient)"
              stroke={healthStatus === 'critical' ? '#ef4444' : healthStatus === 'warning' ? '#f97316' : '#3b82f6'}
              strokeWidth="3"
            />
            {/* Furnace Top (Charging Area) */}
            <path d="M70,50 L150,10 L230,50"
              fill="url(#topGradient)"
              stroke={healthStatus === 'critical' ? '#ef4444' : healthStatus === 'warning' ? '#f97316' : '#3b82f6'}
              strokeWidth="3"
            />
            {/* Tuyeres (Bottom Air Inlets) */}
            {[85, 120, 155, 190].map((x, i) => (
              <motion.circle 
                key={i} 
                cx={x} 
                cy="240" 
                r="6" 
                fill={i === 2 && isFaultMode ? '#ef4444' : '#22c55e'} 
                animate={i === 2 && isFaultMode ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
                transition={i === 2 && isFaultMode ? { duration: 0.5, repeat: Infinity } : {}}
              />
            ))}
            {/* Hot Gas Outlet */}
            <rect x="130" y="15" width="40" height="30" rx="6"
              fill="#64748b"
              stroke="#475569"
              strokeWidth="2"
            />
            {/* Molten Iron Tap */}
            <rect x="90" y="245" width="120" height="18" rx="6"
              fill="url(#ironGradient)"
            />
            {/* Heat Indicator Gradient */}
            <defs>
              <linearGradient id="furnaceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="40%" stopColor="#1e293b" />
                <stop offset="70%" stopColor={temp > 1400 ? '#7f1d1d' : '#451a03'} />
                <stop offset="100%" stopColor={temp > 1400 ? '#450a0a' : '#1c1917'} />
              </linearGradient>
              <linearGradient id="topGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="ironGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <radialGradient id="flameGradient" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </radialGradient>
            </defs>
            {/* Internal Flame/Heat Zone Animation */}
            <motion.ellipse cx="150" cy="160" rx="40" ry="55"
              fill="url(#flameGradient)"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.85, 0.5],
                rotate: [0, 1, 0, -1, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
            />
            {/* Gas Flow Lines */}
            {[0, 1, 2].map((i) => (
              <motion.path key={i}
                d={`M${105 + i*25},220 Q${120 + i*20},130 ${150},60`}
                stroke="#60a5fa"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8,6"
                animate={{ 
                  strokeDashoffset: [0, -14] 
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity, 
                  ease: "linear"
                }}
              />
            ))}
          </svg>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Temperature */}
          <motion.div 
            className="p-3 rounded-xl bg-slate-800/70 border border-slate-700"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hot Blast Temp</span>
            </div>
            <motion.div 
              className="text-2xl font-black text-white mb-1"
              key={temp}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {Math.round(temp)}°C
            </motion.div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full transition-all duration-700 ${
                  temp > 1500 ? 'bg-gradient-to-r from-red-500 to-rose-500' : temp > 1300 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
                animate={{ width: `${Math.min((temp / 1800) * 100, 100)}%` }}
                transition={{ duration: 0.7 }}
              />
            </div>
          </motion.div>

          {/* Pressure */}
          <motion.div 
            className="p-3 rounded-xl bg-slate-800/70 border border-slate-700"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Internal Pressure</span>
            </div>
            <motion.div 
              className="text-2xl font-black text-white mb-1"
              key={pressure}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {pressure.toFixed(1)} bar
            </motion.div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full transition-all duration-700 ${
                  pressure > 6 ? 'bg-gradient-to-r from-red-500 to-rose-500' : pressure > 5 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}
                animate={{ width: `${Math.min((pressure / 8) * 100, 100)}%` }}
                transition={{ duration: 0.7 }}
              />
            </div>
          </motion.div>

          {/* Gas Flow */}
          <motion.div 
            className="p-3 rounded-xl bg-slate-800/70 border border-slate-700"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Flame className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gas Flow</span>
            </div>
            <motion.div 
              className="text-2xl font-black text-white mb-1"
              key={gasFlow}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {Math.round(gasFlow)}%
            </motion.div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full transition-all duration-700 ${
                  gasFlow < 60 ? 'bg-gradient-to-r from-red-500 to-rose-500' : gasFlow < 75 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                }`}
                animate={{ width: `${gasFlow}%` }}
                transition={{ duration: 0.7 }}
              />
            </div>
          </motion.div>

          {/* Coolant Flow */}
          <motion.div 
            className="p-3 rounded-xl bg-slate-800/70 border border-slate-700"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coolant Flow</span>
            </div>
            <motion.div 
              className="text-2xl font-black text-white mb-1"
              key={coolantFlow}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {Math.round(coolantFlow)}%
            </motion.div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full transition-all duration-700 ${
                  coolantFlow < 40 ? 'bg-gradient-to-r from-red-500 to-rose-500' : coolantFlow < 55 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
                animate={{ width: `${coolantFlow}%` }}
                transition={{ duration: 0.7 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}