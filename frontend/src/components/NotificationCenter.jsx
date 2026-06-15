import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const NotificationCenter = ({ notifications, onClearNotification, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIconForType = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgForType = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-950/50 border-green-800';
      case 'warning':
        return 'bg-orange-950/50 border-orange-800';
      case 'error':
        return 'bg-red-950/50 border-red-800';
      default:
        return 'bg-blue-950/50 border-blue-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
      >
        <Bell className="w-5 h-5 text-slate-300" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-xs font-bold text-white">{unreadCount}</span>
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-14 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-white">Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 ${getBgForType(notification.type)} ${!notification.read ? 'border-l-4 border-l-current' : ''}`}
                      >
                        <div className="flex gap-3">
                          {getIconForType(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{notification.title}</p>
                            <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-slate-500 mt-2">{notification.time}</p>
                          </div>
                          <button
                            onClick={() => onClearNotification(notification.id)}
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
