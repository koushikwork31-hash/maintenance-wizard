import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle, Calendar, AlertTriangle, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

const timelineEvents = [
  {
    id: 1,
    date: '2026-06-14',
    type: 'urgent',
    title: 'Emergency Descaling',
    description: 'Critical cooling system maintenance performed',
    status: 'completed'
  },
  {
    id: 2,
    date: '2026-06-10',
    type: 'scheduled',
    title: 'Monthly Inspection',
    description: 'Routine check - all systems normal',
    status: 'completed'
  },
  {
    id: 3,
    date: '2026-06-05',
    type: 'warning',
    title: 'Temperature Spike',
    description: 'Anomaly detected and resolved',
    status: 'completed'
  },
  {
    id: 4,
    date: '2026-06-21',
    type: 'predictive',
    title: 'Predictive Maintenance',
    description: 'Scheduled based on AI predictions',
    status: 'upcoming'
  }
];

export default function MaintenanceTimeline() {
  const [expandedId, setExpandedId] = useState(null);

  const getEventColor = (type) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-500';
      case 'warning':
        return 'bg-amber-500';
      case 'scheduled':
        return 'bg-blue-500';
      case 'predictive':
        return 'bg-purple-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (status === 'upcoming') return <Clock className="w-4 h-4 text-slate-400" />;
    return <AlertTriangle className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          Maintenance Timeline
        </h3>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {timelineEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Timeline line */}
            {index < timelineEvents.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-700" />
            )}

            <div className="relative flex gap-4">
              {/* Timeline dot */}
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-full ${getEventColor(event.type)} bg-opacity-20 flex items-center justify-center`}>
                  <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`} />
                </div>
              </div>

              {/* Event card */}
              <div 
                className={`flex-1 bg-slate-800/50 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-blue-500/50 transition-all ${
                  event.status === 'upcoming' ? 'opacity-70' : ''
                }`}
                onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-400">{event.date}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        event.type === 'urgent' ? 'bg-red-900/50 text-red-400' :
                        event.type === 'warning' ? 'bg-amber-900/50 text-amber-400' :
                        event.type === 'predictive' ? 'bg-purple-900/50 text-purple-400' :
                        'bg-blue-900/50 text-blue-400'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-200">{event.title}</h4>
                    {expandedId === event.id && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 text-sm text-slate-400"
                      >
                        {event.description}
                      </motion.p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(event.status)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
