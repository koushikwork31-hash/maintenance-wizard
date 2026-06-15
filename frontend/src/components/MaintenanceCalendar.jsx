import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle, Plus, Wrench } from 'lucide-react';

export default function MaintenanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const scheduleData = [
    { id: 1, date: '2026-06-15', equipment: 'BF-01', type: 'Preventive', title: 'Cooling System Check', priority: 'high', status: 'scheduled' },
    { id: 2, date: '2026-06-16', equipment: 'BF-02', type: 'Routine', title: 'Lubrication Service', priority: 'medium', status: 'scheduled' },
    { id: 3, date: '2026-06-18', equipment: 'BF-03', type: 'Predictive', title: 'Vibration Analysis', priority: 'medium', status: 'scheduled' },
    { id: 4, date: '2026-06-20', equipment: 'BF-04', type: 'Corrective', title: 'Temperature Sensor Replacement', priority: 'high', status: 'scheduled' },
    { id: 5, date: '2026-06-14', equipment: 'BF-05', type: 'Routine', title: 'Filter Change', priority: 'low', status: 'completed' },
  ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-slate-800/20 rounded-lg border border-slate-700/30" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = scheduleData.filter(e => e.date === dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelectedDate(dateStr)}
          className={`h-24 p-2 rounded-lg border transition-all cursor-pointer ${
            isToday 
              ? 'bg-blue-900/30 border-blue-500 shadow-lg shadow-blue-500/20' 
              : selectedDate === dateStr
                ? 'bg-purple-900/30 border-purple-500'
                : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className={`text-sm font-bold mb-1 ${isToday ? 'text-blue-400' : 'text-slate-300'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`text-xs px-1.5 py-0.5 rounded truncate ${
                  event.status === 'completed' 
                    ? 'bg-green-900/50 text-green-400'
                    : event.priority === 'high'
                      ? 'bg-red-900/50 text-red-400'
                      : event.priority === 'medium'
                        ? 'bg-amber-900/50 text-amber-400'
                        : 'bg-slate-800 text-slate-400'
                }`}
              >
                {event.equipment}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-slate-500">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </motion.div>
      );
    }
    return days;
  };

  const selectedDateEvents = selectedDate 
    ? scheduleData.filter(e => e.date === selectedDate)
    : [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Maintenance Schedule
          </h3>
          <p className="text-sm text-slate-400">Plan and track upcoming maintenance activities</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="text-lg font-bold text-slate-200 min-w-[150px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="ml-2 p-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all flex items-center gap-2">
            <Plus className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white">Add</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-bold text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {renderCalendarDays()}
      </div>

      {selectedDateEvents.length > 0 && (
        <div className="border-t border-slate-700 pt-4">
          <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Scheduled for {selectedDate}
          </h4>
          <div className="space-y-3">
            {selectedDateEvents.map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  event.status === 'completed'
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {event.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : event.priority === 'high' ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Wrench className="w-5 h-5 text-blue-400" />
                  )}
                  <div>
                    <div className="font-bold text-slate-200">{event.title}</div>
                    <div className="text-sm text-slate-400">
                      {event.equipment} • {event.type}
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  event.priority === 'high'
                    ? 'bg-red-900/50 text-red-400'
                    : event.priority === 'medium'
                      ? 'bg-amber-900/50 text-amber-400'
                      : 'bg-slate-700 text-slate-300'
                }`}>
                  {event.priority.toUpperCase()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
