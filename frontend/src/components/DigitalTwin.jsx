import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

const DigitalTwin = ({ equipmentId, isFaultMode, sensorData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredComponent, setHoveredComponent] = useState(null);

  const components = [
    { id: 'stave1', name: 'Stave 1', temp: 3.2, flow: 58, status: 'normal', position: { x: 0, y: 0 } },
    { id: 'stave2', name: 'Stave 2', temp: 4.1, flow: 56, status: 'normal', position: { x: 25, y: 0 } },
    { id: 'stave3', name: 'Stave 3', temp: 4.5, flow: 54, status: 'warning', position: { x: 50, y: 0 } },
    { id: 'stave4', name: 'Stave 4', temp: isFaultMode ? 18.3 : 12.4, flow: isFaultMode ? 28 : 38, status: isFaultMode ? 'critical' : 'warning', position: { x: 75, y: 0 } },
  ];

  const statusColors = {
    normal: { bg: 'bg-green-900/30', border: 'border-green-600', text: 'text-green-400', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]' },
    warning: { bg: 'bg-orange-900/30', border: 'border-orange-500', text: 'text-orange-400', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]' },
    critical: { bg: 'bg-red-900/30', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse' },
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-slate-950/50 to-purple-950/20" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Digital Twin: {equipmentId}</h3>
              <p className="text-xs text-slate-400">Real-time Equipment Visualization</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-900/30 border border-blue-700 rounded-full text-xs font-bold text-blue-400">
              LIVE
            </span>
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-bold text-slate-300">
              V4.2
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-2">
          {['overview', 'sensors', 'maintenance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${
                activeTab === tab
                  ? 'bg-blue-900/40 text-blue-400 border border-blue-700'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Visualization Area */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-6 mb-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 3D-like Visualization */}
              <div className="relative h-64 flex items-center justify-center">
                <div className="relative w-full max-w-2xl">
                  {/* Equipment Body */}
                  <div className="relative h-48 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
                    {/* Heat Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-900/10 to-transparent rounded-2xl" />
                    
                    {/* Component Grid */}
                    <div className="absolute inset-0 flex items-center justify-around px-8">
                      {components.map((comp) => {
                        const colors = statusColors[comp.status];
                        return (
                          <motion.div
                            key={comp.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            onMouseEnter={() => setHoveredComponent(comp)}
                            onMouseLeave={() => setHoveredComponent(null)}
                            className={`relative cursor-pointer transition-all duration-300 ${colors.glow}`}
                          >
                            {/* Component Card */}
                            <div className={`w-16 h-28 rounded-lg border-2 ${colors.bg} ${colors.border} flex flex-col items-center justify-center gap-2 backdrop-blur-sm`}>
                              <div className={`w-3 h-3 rounded-full ${colors.text.replace('text-', 'bg-')} ${comp.status === 'critical' ? 'animate-ping' : ''}`} />
                              <span className="text-[10px] font-black text-slate-400">{comp.id.toUpperCase()}</span>
                            </div>
                            
                            {/* Status Indicator */}
                            {comp.status !== 'normal' && (
                              <div className="absolute -top-2 -right-2">
                                {comp.status === 'critical' ? (
                                  <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                                )}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: '50%', left: '0', transform: 'translateY(-50%)' }}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                    <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
              </div>

              {/* Hover Info */}
              {hoveredComponent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-white">{hoveredComponent.name}</span>
                    <span className={`text-xs font-black uppercase px-2 py-1 rounded ${statusColors[hoveredComponent.status].text} ${statusColors[hoveredComponent.status].bg}`}>
                      {hoveredComponent.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      <div>
                        <div className="text-xs text-slate-500">Temperature</div>
                        <div className="font-bold text-white">{hoveredComponent.temp}°C</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-xs text-slate-500">Flow Rate</div>
                        <div className="font-bold text-white">{hoveredComponent.flow} m³/h</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'sensors' && (
            <div className="grid grid-cols-2 gap-4">
              {components.map((comp) => {
                const colors = statusColors[comp.status];
                return (
                  <div key={comp.id} className={`p-4 rounded-xl border ${colors.bg} ${colors.border}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-white">{comp.name}</span>
                      {comp.status === 'normal' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className={`w-4 h-4 ${colors.text}`} />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Temperature</span>
                        <span className="text-sm font-bold text-white">{comp.temp}°C</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${comp.status === 'critical' ? 'bg-red-500' : comp.status === 'warning' ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${(comp.temp / 20) * 100}%` }} />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-400">Flow Rate</span>
                        <span className="text-sm font-bold text-white">{comp.flow} m³/h</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${(comp.flow / 60) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div>
                  <div className="font-bold text-white">Last Inspection</div>
                  <div className="text-sm text-slate-400">2 weeks ago</div>
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-950/30 rounded-xl border border-orange-800">
                <div>
                  <div className="font-bold text-orange-400">Next Maintenance</div>
                  <div className="text-sm text-slate-300">In 3 days - Descaling</div>
                </div>
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div>
                  <div className="font-bold text-white">Total Runtime</div>
                  <div className="text-sm text-slate-400">8,452 hours</div>
                </div>
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="text-2xl font-black text-blue-400">{components.filter(c => c.status === 'normal').length}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Healthy</div>
          </div>
          <div className="text-center p-3 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="text-2xl font-black text-orange-400">{components.filter(c => c.status === 'warning').length}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Warning</div>
          </div>
          <div className="text-center p-3 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="text-2xl font-black text-red-400">{components.filter(c => c.status === 'critical').length}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Critical</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;
