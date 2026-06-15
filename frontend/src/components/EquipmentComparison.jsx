import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, TrendingUp, Thermometer, Droplets, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

export default function EquipmentComparison() {
  const [selectedEquipments, setSelectedEquipments] = useState(['BF-01', 'BF-02', 'BF-03']);

  const comparisonData = [
    { id: 'BF-01', name: 'Blast Furnace 01', efficiency: 72, temp: 18.3, flow: 32.1, uptime: 85, status: 'Critical', location: 'East Plant' },
    { id: 'BF-02', name: 'Blast Furnace 02', efficiency: 98, temp: 4.7, flow: 59.8, uptime: 99, status: 'Normal', location: 'West Plant' },
    { id: 'BF-03', name: 'Blast Furnace 03', efficiency: 95, temp: 5.4, flow: 55.2, uptime: 97, status: 'Normal', location: 'North Plant' },
    { id: 'BF-04', name: 'Blast Furnace 04', efficiency: 75, temp: 11.2, flow: 45.0, uptime: 88, status: 'Critical', location: 'South Plant' },
    { id: 'BF-05', name: 'Blast Furnace 05', efficiency: 96, temp: 4.9, flow: 57.5, uptime: 98, status: 'Normal', location: 'Central Plant' },
  ];

  const radarData = [
    { metric: 'Efficiency', BF01: 72, BF02: 98, BF03: 95 },
    { metric: 'Flow Rate', BF01: 53, BF02: 100, BF03: 92 },
    { metric: 'Temp Stability', BF01: 40, BF02: 95, BF03: 90 },
    { metric: 'Uptime', BF01: 85, BF02: 99, BF03: 97 },
    { metric: 'Health', BF01: 68, BF02: 95, BF03: 92 },
  ];

  const COLORS = {
    BF01: '#ef4444',
    BF02: '#22c55e',
    BF03: '#3b82f6',
    BF04: '#f59e0b',
    BF05: '#8b5cf6',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Equipment Comparison Dashboard
          </h3>
          <p className="text-sm text-slate-400">Compare performance metrics across all equipment</p>
        </div>
      </div>

      {/* Equipment Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {comparisonData.map(eq => (
          <button
            key={eq.id}
            onClick={() => {
              setSelectedEquipments(prev => 
                prev.includes(eq.id) 
                  ? prev.filter(e => e !== eq.id)
                  : [...prev, eq.id]
              );
            }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
              selectedEquipments.includes(eq.id)
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {eq.id}
          </button>
        ))}
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {comparisonData.filter(eq => selectedEquipments.includes(eq.id)).map((eq, index) => (
          <motion.div
            key={eq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-xl border ${
              eq.status === 'Normal' ? 'bg-green-900/10 border-green-700' : 'bg-red-900/10 border-red-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-white">{eq.name}</h4>
              {eq.status === 'Normal' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="text-sm text-slate-400 mb-3">{eq.location}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <div>
                  <div className="text-xs text-slate-400">Efficiency</div>
                  <div className="text-lg font-bold text-white">{eq.efficiency}%</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-xs text-slate-400">Temp</div>
                  <div className="text-lg font-bold text-white">{eq.temp}°C</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-xs text-slate-400">Flow</div>
                  <div className="text-lg font-bold text-white">{eq.flow} m³/h</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-xs text-slate-400">Uptime</div>
                  <div className="text-lg font-bold text-white">{eq.uptime}%</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Efficiency Bar Chart */}
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
          <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Efficiency Comparison (%)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData.filter(eq => selectedEquipments.includes(eq.id))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="id" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ fontWeight: 'bold', color: '#22c55e' }}
                />
                <Bar 
                  dataKey="efficiency" 
                  radius={[4, 4, 0, 0]}
                  fill="url(#colorEff)"
                />
                <defs>
                  <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
          <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            Performance Radar
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                <PolarRadiusAxis stroke="#475569" />
                <Radar name="BF-01" dataKey="BF01" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Radar name="BF-02" dataKey="BF02" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                <Radar name="BF-03" dataKey="BF03" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
