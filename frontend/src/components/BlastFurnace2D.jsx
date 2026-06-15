import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Flame, Factory, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export default function BlastFurnace2D({ equipmentId, isFaultMode }) {
  const [temp, setTemp] = useState(1200);
  const [pressure, setPressure] = useState(4.5);
  const [gasFlow, setGasFlow] = useState(85);
  const [coolantFlow, setCoolantFlow] = useState(60);
  const [healthStatus, setHealthStatus] = useState('normal');

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
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse' 
    },
  };
  const colors = statusColors[healthStatus];

  return (
    <div className={`rounded-2xl p-6 border relative overflow-hidden ${
      colors.bg
    } ${colors.border}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', 
        backgroundSize: '20px 20px' 
      }} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-600 to-red-700 rounded-xl">
              <Factory className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">2D Blast Furnace: {equipmentId}</h3>
              <p className="text-xs text-slate-400">Real-time Operation Visualization</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-bold text-slate-300">
              LIVE
            </span>
            {healthStatus === 'normal' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className={`w-5 h-5 ${colors.text} ${healthStatus === 'critical' ? 'animate-bounce' : ''}`} />
            )}
          </div>
        </div>

        {/* 2D Visualization */}
        <div className="relative mb-6">
          <svg viewBox="0 0 300 400" className="w-full max-w-md mx-auto">
            {/* Furnace Body */}
            <rect x="75" y="50" width="150" height="280" rx="8"
              fill="url(#furnaceGradient)"
              stroke={healthStatus === 'critical' ? '#ef4444' : healthStatus === 'warning' ? '#f97316' : '#3b82f6'}
              strokeWidth="2"
            />
            {/* Furnace Top (Charging Area) */}
            <path d="M75,50 L150,10 L225,50"
              fill="url(#topGradient)"
              stroke={healthStatus === 'critical' ? '#ef4444' : healthStatus === 'warning' ? '#f97316' : '#3b82f6'}
              strokeWidth="2"
            />
            {/* Tuyeres (Bottom Air Inlets) */}
            {[85, 120, 155, 190].map((x, i) => (
              <circle key={i} cx={x} cy="310" r="6" 
                fill={i === 2 && isFaultMode ? '#ef4444' : '#22c55e'} 
                className={i === 2 && isFaultMode ? 'animate-pulse' : ''}
              />
            ))}
            {/* Hot Gas Outlet */}
            <rect x="135" y="20" width="30" height="30" rx="4"
              fill="#64748b"
              stroke="#475569"
            />
            {/* Molten Iron Tap */}
            <rect x="95" y="315" width="110" height="20" rx="4"
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
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <radialGradient id="flameGradient" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#f97316" />
              </radialGradient>
            </defs>
            {/* Internal Flame/Heat Zone Animation */}
            <motion.ellipse cx="150" cy="220" rx="45" ry="60"
              fill="url(#flameGradient)"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.6, 0.8, 0.6]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
            />
            {/* Gas Flow Lines */}
            {[0, 1, 2].map((i) => (
              <motion.path key={i}
                d={`M${110 + i*20},280 Q${120 + i*20},150 ${150},60`}
                stroke="#60a5fa"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                animate={{ 
                  strokeDashoffset: [0, -10] 
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "linear"
                }}
              />
            ))}
          </svg>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Temperature */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hot Blast Temp</span>
            </div>
            <div className="text-2xl font-black text-white">{Math.round(temp)}°C</div>
            <div className="w-full h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  temp > 1500 ? 'bg-red-500' : temp > 1300 ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((temp / 1800) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Pressure */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Internal Pressure</span>
            </div>
            <div className="text-2xl font-black text-white">{pressure.toFixed(1)} bar</div>
            <div className="w-full h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  pressure > 6 ? 'bg-red-500' : pressure > 5 ? 'bg-orange-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min((pressure / 8) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Gas Flow */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gas Flow</span>
            </div>
            <div className="text-2xl font-black text-white">{Math.round(gasFlow)}%</div>
            <div className="w-full h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  gasFlow < 60 ? 'bg-red-500' : gasFlow < 75 ? 'bg-orange-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${gasFlow}%` }}
              />
            </div>
          </div>

          {/* Coolant Flow */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coolant Flow</span>
            </div>
            <div className="text-2xl font-black text-white">{Math.round(coolantFlow)}%</div>
            <div className="w-full h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  coolantFlow < 40 ? 'bg-red-500' : coolantFlow < 55 ? 'bg-orange-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${coolantFlow}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}