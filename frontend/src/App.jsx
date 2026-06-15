import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  AlertTriangle, 
  Activity, 
  History, 
  Cpu, 
  LayoutDashboard, 
  MessageSquare,
  FileText,
  Settings,
  Sparkles,
  Zap,
  TrendingUp,
  TrendingDown,
  MapPin,
  ShieldCheck,
  Download,
  Sun,
  Moon,
  Calendar as CalendarIcon,
  BarChart3,
  FileCheck,
  GitCompare
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import DigitalTwin from './components/DigitalTwin';
import AIChat from './components/AIChat';
import ReportGenerator from './components/ReportGenerator';
import NotificationCenter from './components/NotificationCenter';
import HealthScore from './components/HealthScore';
import MaintenanceTimeline from './components/MaintenanceTimeline';
import BlastFurnace2D from './components/BlastFurnace2D';
import AIOptimizationSuggestions from './components/AIOptimizationSuggestions';
import Industrial3DShowcase from './components/Industrial3DShowcase';
import MaintenanceCalendar from './components/MaintenanceCalendar';
import WorkOrderGenerator from './components/WorkOrderGenerator';
import EquipmentComparison from './components/EquipmentComparison';
import KPIDashboard from './components/KPIDashboard';
import { ThemeProvider, useTheme } from './components/ThemeContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const EQUIPMENT_LIST = ['BF-01', 'BF-02', 'BF-03', 'BF-04', 'BF-05'];

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function AppContent() {
  const { isDark, toggleTheme } = useTheme();
  const [selectedEq, setSelectedEq] = useState('BF-01');
  const [isFaultMode, setIsFaultMode] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', title: 'Temperature Alert', message: 'BF-01 showing critical temperature rise', time: '2 min ago', read: false },
    { id: 2, type: 'info', title: 'System Update', message: 'System health check completed successfully', time: '10 min ago', read: true },
    { id: 3, type: 'success', title: 'Maintenance Done', message: 'Scheduled maintenance completed on BF-03', time: '1 hour ago', read: true },
  ]);

  const fleetData = {
    'BF-01': isFaultMode ? {
      flow: 32.1, temp: 18.3, status: 'EMERGENCY', flowTrend: '▼ 48%', tempTrend: '▲ 140%', location: 'East Plant', efficiency: 65, risk: 'HIGH', healthScore: 52
    } : {
      flow: 38.2, temp: 12.4, status: 'CRITICAL', flowTrend: '▼ 31%', tempTrend: '▲ 85%', location: 'East Plant', efficiency: 72, risk: 'MEDIUM', healthScore: 68
    },
    'BF-02': { flow: 59.8, temp: 4.7, status: 'NORMAL', flowTrend: '▼ 0.5%', tempTrend: '▲ 4%', location: 'West Plant', efficiency: 98, risk: 'LOW', healthScore: 95 },
    'BF-03': { flow: 55.2, temp: 5.4, status: 'NORMAL', flowTrend: '▼ 5.6%', tempTrend: '▲ 3.8%', location: 'North Plant', efficiency: 95, risk: 'LOW', healthScore: 92 },
    'BF-04': { flow: 45.0, temp: 11.2, status: 'CRITICAL', flowTrend: '▼ 27.8%', tempTrend: '▲ 133%', location: 'South Plant', efficiency: 75, risk: 'HIGH', healthScore: 71 },
    'BF-05': { flow: 57.5, temp: 4.9, status: 'NORMAL', flowTrend: '▼ 2.7%', tempTrend: '▲ 0.0%', location: 'Central Plant', efficiency: 96, risk: 'LOW', healthScore: 94 },
  };

  const chartData = [
    { time: '08:00', flow: 55, temp: 6.5 },
    { time: '09:00', flow: 54, temp: 7.1 },
    { time: '10:00', flow: 42, temp: 9.8 },
    { time: '11:00', flow: 38, temp: 12.4 },
    { time: '12:00', flow: isFaultMode ? 32 : 35, temp: isFaultMode ? 18.3 : 14.2 },
  ];

  const maintenanceSummary = [
    { name: 'Jan', count: 12 },
    { name: 'Feb', count: 19 },
    { name: 'Mar', count: 15 },
    { name: 'Apr', count: 8 },
    { name: 'May', count: 22 },
    { name: 'Jun', count: 10 },
  ];

  const statusDistribution = [
    { name: 'Normal', value: 3 },
    { name: 'Warning', value: 1 },
    { name: 'Critical', value: isFaultMode ? 2 : 1 },
  ];

  const toggleFault = () => {
    setIsFaultMode(!isFaultMode);
    if (!isFaultMode) {
      addNotification({
        type: 'error',
        title: 'EMERGENCY ALERT',
        message: 'Massive pressure drop detected on BF-01 Circuit 4!',
        time: 'Just now',
      });
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [{
      id: Date.now(),
      ...notification,
      read: false,
    }, ...prev]);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleSendMessage = async (message) => {
    const userMessage = { role: 'user', content: message, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/analyze`, { 
        query: message, 
        equipment_id: selectedEq 
      });
      
      setAnalysis(response.data);
      
      const aiMessage = { 
        role: 'assistant', 
        content: response.data.analysis || 'Analysis complete! Check the dashboard for details.', 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, aiMessage]);
      
      addNotification({
        type: 'success',
        title: 'Analysis Complete',
        message: `AI analysis for ${selectedEq} is ready`,
        time: 'Just now',
      });
    } catch (error) {
      const aiMessage = { 
        role: 'assistant', 
        content: `I've received your query about "${message}". Based on my analysis of ${selectedEq}:\n\n• Temperature: ${fleetData[selectedEq].temp}°C (${fleetData[selectedEq].tempTrend})\n• Flow Rate: ${fleetData[selectedEq].flow} m³/h (${fleetData[selectedEq].flowTrend})\n• Status: ${fleetData[selectedEq].status}\n\nRecommendation: ${fleetData[selectedEq].status !== 'NORMAL' ? 'Schedule immediate maintenance and follow safety protocols.' : 'Continue normal operation.'}`, 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NORMAL': return 'bg-green-900/30 text-green-400 border-green-700';
      case 'WARNING': return 'bg-amber-900/30 text-amber-400 border-amber-700';
      case 'CRITICAL': return 'bg-red-900/30 text-red-400 border-red-700';
      case 'EMERGENCY': return 'bg-red-950 text-red-300 border-red-500 animate-pulse';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'digital-twin', label: 'Digital Twin', icon: Cpu },
    { id: 'ai-chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'work-orders', label: 'Work Orders', icon: FileCheck },
    { id: 'comparison', label: 'Comparison', icon: GitCompare },
    { id: 'kpi', label: 'KPIs', icon: BarChart3 },
    { id: 'timeline', label: 'Timeline', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header */}
      <header className={`border-b backdrop-blur-xl sticky top-0 z-40 transition-colors duration-300 ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-2 rounded-xl shadow-lg shadow-purple-500/30">
                <Wrench className="text-white" size={24} />
              </div>
              <div>
                <h1 className={`text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2`}>
                  Maintenance Wizard
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </h1>
                <p className={`text-xs uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Industrial AI Maintenance Platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all hover:scale-105 ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' 
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Equipment Selector */}
              <div className={`flex items-center gap-2 p-1 rounded-xl border ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}>
                {EQUIPMENT_LIST.map(eq => (
                  <button
                    key={eq}
                    onClick={() => setSelectedEq(eq)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      selectedEq === eq 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : isDark 
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {eq}
                  </button>
                ))}
              </div>

              {/* Fault Simulator */}
              <button
                onClick={toggleFault}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border ${
                  isFaultMode 
                    ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-lg shadow-red-500/30' 
                    : isDark 
                      ? 'bg-slate-800 text-slate-400 border-slate-700 hover:border-red-500/50 hover:text-red-400' 
                      : 'bg-slate-200 text-slate-600 border-slate-300 hover:border-red-500/50 hover:text-red-500'
                }`}
              >
                <AlertTriangle size={14} />
                {isFaultMode ? 'FAULT ACTIVE' : 'SIMULATE FAULT'}
              </button>

              {/* Notifications */}
              <NotificationCenter
                notifications={notifications}
                onClearNotification={clearNotification}
                onClearAll={clearAllNotifications}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex items-center gap-1 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeView === item.id
                      ? isDark 
                        ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-400 border border-blue-700/50' 
                        : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-300'
                      : isDark 
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Fleet Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {EQUIPMENT_LIST.map(eqId => {
                  const eq = fleetData[eqId];
                  return (
                    <motion.div
                      key={eqId}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => setSelectedEq(eqId)}
                      className={`rounded-2xl p-5 cursor-pointer transition-all border ${
                        selectedEq === eqId 
                          ? (isDark ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-slate-900' : 'border-blue-400 shadow-lg shadow-blue-400/20 bg-white')
                          : (isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white')
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            eq.status === 'NORMAL' ? 'bg-green-500' :
                            eq.status === 'WARNING' ? 'bg-amber-500' :
                            eq.status === 'CRITICAL' ? 'bg-red-500 animate-pulse' :
                            'bg-red-600 animate-ping'
                          }`} />
                          <span className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{eqId}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(eq.status)}`}>
                          {eq.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs mb-3" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                        <MapPin size={12} />
                        {eq.location}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Flow Rate</div>
                          <div className={`text-lg font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {eq.flow} <span className="text-xs" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>m³/h</span>
                          </div>
                          <div className={`text-xs flex items-center gap-1 ${
                            eq.flowTrend.startsWith('▼') ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {eq.flowTrend.startsWith('▼') ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                            {eq.flowTrend}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Temp (ΔT)</div>
                          <div className={`text-lg font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {eq.temp} <span className="text-xs" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>°C</span>
                          </div>
                          <div className={`text-xs flex items-center gap-1 ${
                            eq.tempTrend.startsWith('▼') ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {eq.tempTrend.startsWith('▼') ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                            {eq.tempTrend}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Efficiency</span>
                          <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{eq.efficiency}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: isDark ? '#334155' : '#e2e8f0' }}>
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              eq.efficiency >= 90 ? 'bg-green-500' :
                              eq.efficiency >= 70 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${eq.efficiency}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Health Score and 2D Blast Furnace Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <HealthScore score={fleetData[selectedEq].healthScore} status={
                    fleetData[selectedEq].healthScore >= 80 ? 'Excellent' :
                    fleetData[selectedEq].healthScore >= 60 ? 'Good' : 'Critical'
                  } />
                </div>
                <BlastFurnace2D equipmentId={selectedEq} isFaultMode={isFaultMode} />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Maintenance Trend */}
                <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <TrendingUp size={16} className="text-blue-500" />
                      Maintenance Trends
                    </h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={maintenanceSummary}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} vertical={false} />
                        <XAxis dataKey="name" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`, borderRadius: '8px' }}
                          itemStyle={{ fontWeight: 'bold', color: '#60a5fa' }}
                        />
                        <Bar dataKey="count" fill="url(#colorBar)" radius={[4, 4, 0, 0]} />
                        <defs>
                          <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status Distribution */}
                <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <PieChart size={16} className="text-purple-500" />
                      Fleet Health
                    </h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`, borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Sensor Data Chart */}
              <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <Activity size={16} className="text-blue-500" />
                    {selectedEq} - Real-time Monitoring
                  </h3>
                  <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tighter">
                    <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-2 bg-blue-500 rounded-full"/> Flow</span>
                    <span className="flex items-center gap-1 text-amber-500"><div className="w-2 h-2 bg-amber-500 rounded-full"/> Temp</span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} vertical={false} />
                      <XAxis dataKey="time" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`, borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="flow" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFlow)" />
                      <Area type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Optimization Suggestions */}
              <AIOptimizationSuggestions isDark={isDark} selectedEq={selectedEq} />

              {/* Industrial 3D Showcase */}
              <Industrial3DShowcase isDark={isDark} />
            </motion.div>
          )}

          {/* Digital Twin View */}
          {activeView === 'digital-twin' && (
            <motion.div
              key="digital-twin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DigitalTwin 
                equipmentId={selectedEq} 
                isFaultMode={isFaultMode}
              />
            </motion.div>
          )}

          {/* AI Chat View */}
          {activeView === 'ai-chat' && (
            <motion.div
              key="ai-chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AIChat 
                    messages={chatMessages}
                    isLoading={chatLoading}
                    onSendMessage={handleSendMessage}
                  />
                </div>
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className={`rounded-2xl p-5 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                      <Zap className="text-yellow-400" />
                      Quick Stats - {selectedEq}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(226,232,240,0.5)' }}>
                        <span className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Status</span>
                        <span className={`text-sm font-black ${
                          fleetData[selectedEq].status === 'NORMAL' ? 'text-green-400' :
                          fleetData[selectedEq].status === 'WARNING' ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {fleetData[selectedEq].status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(226,232,240,0.5)' }}>
                        <span className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Temperature</span>
                        <span className="text-sm font-bold text-amber-400">{fleetData[selectedEq].temp}°C</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(226,232,240,0.5)' }}>
                        <span className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Flow Rate</span>
                        <span className="text-sm font-bold text-blue-400">{fleetData[selectedEq].flow} m³/h</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(226,232,240,0.5)' }}>
                        <span className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Efficiency</span>
                        <span className="text-sm font-bold text-green-400">{fleetData[selectedEq].efficiency}%</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Agents Info */}
                  <div className={`rounded-2xl p-5 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                      <Cpu className="text-purple-400" />
                      Active AI Agents
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Lead Orchestrator', status: 'Active', color: 'text-blue-400' },
                        { name: 'Telemetry Analyst', status: 'Monitoring', color: 'text-green-400' },
                        { name: 'Reliability Engineer', status: 'Synced', color: 'text-amber-400' },
                        { name: 'SOP Specialist', status: 'Ready', color: 'text-purple-400' },
                        { name: 'Safety Validator', status: 'Standby', color: 'text-pink-400' },
                      ].map((agent, i) => (
                        <div key={i} className="flex items-center justify-between group p-2 rounded-lg transition-colors hover:bg-slate-800/50">
                          <span className={`text-sm font-bold ${isDark ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600 group-hover:text-slate-900'}`}>{agent.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase ${agent.color}`}>{agent.status}</span>
                            <div className={`w-1.5 h-1.5 rounded-full bg-current ${agent.color}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Calendar View */}
          {activeView === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MaintenanceCalendar />
            </motion.div>
          )}

          {/* Work Orders View */}
          {activeView === 'work-orders' && (
            <motion.div
              key="work-orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WorkOrderGenerator selectedEq={selectedEq} />
            </motion.div>
          )}

          {/* Comparison View */}
          {activeView === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EquipmentComparison />
            </motion.div>
          )}

          {/* KPI View */}
          {activeView === 'kpi' && (
            <motion.div
              key="kpi"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <KPIDashboard />
            </motion.div>
          )}

          {/* Timeline View */}
          {activeView === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MaintenanceTimeline />
            </motion.div>
          )}



          {/* Reports View */}
          {activeView === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReportGenerator 
                  equipmentId={selectedEq}
                  analysisData={analysis}
                />
                <div className="space-y-6">
                  <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <FileText size={16} className="text-green-500" />
                      Recent Reports
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Monthly Maintenance Report', date: '2026-06-01', status: 'Completed' },
                        { name: 'Safety Audit Report', date: '2026-05-28', status: 'Completed' },
                        { name: 'BF-01 Failure Analysis', date: '2026-05-15', status: 'Completed' },
                      ].map((report, index) => (
                        <div key={index} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:border-blue-500/50 ${
                          isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div>
                            <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.name}</div>
                            <div className="text-xs" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>{report.date}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-400 font-bold bg-green-900/50 px-2 py-0.5 rounded-full">{report.status}</span>
                            <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}>
                              <Download className="w-4 h-4" style={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
