import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Clock, Wrench, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function KPIDashboard() {
  const kpiData = [
    { month: 'Jan', mttr: 4.2, mtbf: 180, compliance: 92, cost: 45000 },
    { month: 'Feb', mttr: 3.8, mtbf: 195, compliance: 94, cost: 42000 },
    { month: 'Mar', mttr: 3.5, mtbf: 210, compliance: 96, cost: 38000 },
    { month: 'Apr', mttr: 3.2, mtbf: 225, compliance: 97, cost: 35000 },
    { month: 'May', mttr: 2.8, mtbf: 240, compliance: 98, cost: 32000 },
    { month: 'Jun', mttr: 2.5, mtbf: 260, compliance: 99, cost: 30000 },
  ];

  const kpis = [
    {
      name: 'MTTR (Mean Time To Repair)',
      value: '2.5 hrs',
      trend: 'decreasing',
      trendValue: '-12%',
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
    },
    {
      name: 'MTBF (Mean Time Between Failures)',
      value: '260 hrs',
      trend: 'increasing',
      trendValue: '+8.3%',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
    },
    {
      name: 'Maintenance Cost',
      value: '$30,000',
      trend: 'decreasing',
      trendValue: '-6.7%',
      icon: DollarSign,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
    },
    {
      name: 'Safety Compliance',
      value: '99%',
      trend: 'increasing',
      trendValue: '+1%',
      icon: CheckCircle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-900/20',
    },
  ];

  const maintenanceStats = [
    { label: 'Total Work Orders', value: '142', trend: '+12%', color: 'text-blue-400' },
    { label: 'Completed', value: '135', trend: '+15%', color: 'text-green-400' },
    { label: 'In Progress', value: '7', trend: '-5%', color: 'text-amber-400' },
    { label: 'Preventive', value: '89', trend: '+18%', color: 'text-purple-400' },
    { label: 'Corrective', value: '48', trend: '-8%', color: 'text-red-400' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-yellow-400" />
            Maintenance KPI Dashboard
          </h3>
          <p className="text-sm text-slate-400">Key performance indicators and maintenance metrics</p>
        </div>
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm">
          <option>Last 6 Months</option>
          <option>Last Year</option>
          <option>Last Quarter</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-xl border ${kpi.bgColor} border-slate-700`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${
                  kpi.trend === 'increasing' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {kpi.trend === 'increasing' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {kpi.trendValue}
                </div>
              </div>
              <div className={`text-2xl font-black mb-1 ${kpi.color}`}>{kpi.value}</div>
              <div className="text-sm text-slate-400">{kpi.name}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-slate-800/30 rounded-xl p-4 border border-slate-700">
          <h4 className="text-sm font-bold text-slate-300 mb-4">MTTR & MTBF Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpiData}>
                <defs>
                  <linearGradient id="colorMttr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMtbf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="mttr" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMttr)" name="MTTR (hrs)" />
                <Area type="monotone" dataKey="mtbf" stroke="#22c55e" fillOpacity={1} fill="url(#colorMtbf)" name="MTBF (hrs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Stats */}
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
          <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-purple-400" />
            Maintenance Statistics
          </h4>
          <div className="space-y-3">
            {maintenanceStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="text-sm text-slate-300">{stat.label}</div>
                <div className="flex items-center gap-3">
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-slate-700 ${stat.color}`}>
                    {stat.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
