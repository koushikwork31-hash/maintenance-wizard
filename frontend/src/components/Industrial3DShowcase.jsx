import React from 'react';
import { motion } from 'framer-motion';
import { Factory, Cog, Zap, Truck, Shield } from 'lucide-react';

export default function Industrial3DShowcase({ isDark }) {
  const equipment = [
    {
      id: 1,
      title: 'Blast Furnace',
      icon: Factory,
      color: 'from-orange-500 to-red-600',
      animationType: 'rotate'
    },
    {
      id: 2,
      title: 'Conveyor System',
      icon: Cog,
      color: 'from-blue-500 to-cyan-600',
      animationType: 'pulse'
    },
    {
      id: 3,
      title: 'Power Generator',
      icon: Zap,
      color: 'from-yellow-500 to-amber-600',
      animationType: 'bounce'
    },
    {
      id: 4,
      title: 'Heavy Transport',
      icon: Truck,
      color: 'from-green-500 to-emerald-600',
      animationType: 'float'
    },
    {
      id: 5,
      title: 'Safety Systems',
      icon: Shield,
      color: 'from-purple-500 to-pink-600',
      animationType: 'glow'
    }
  ];

  const renderAnimation = (type, Icon, color) => {
    switch (type) {
      case 'rotate':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className={`p-6 rounded-3xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>
        );
      case 'pulse':
        return (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`p-6 rounded-3xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>
        );
      case 'bounce':
        return (
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`p-6 rounded-3xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>
        );
      case 'float':
        return (
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`p-6 rounded-3xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>
        );
      case 'glow':
        return (
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.5)',
                '0 0 40px rgba(168, 85, 247, 0.8)',
                '0 0 20px rgba(168, 85, 247, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`p-6 rounded-3xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-2xl p-8 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-white mb-3"
        >
          Industrial Equipment Showcase
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-400"
        >
          Interactive 3D-style visualization of your plant assets
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {equipment.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-500 transition-all hover:scale-105"
          >
            {renderAnimation(item.animationType, item.icon, item.color)}
            <h3 className="text-xl font-bold text-white text-center">
              {item.title}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Decorative background */}
      <div className="relative mt-12 h-64 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-slate-900/80 to-slate-800/50" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500 rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: '100%',
                opacity: 0
              }}
              animate={{
                y: '-100%',
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            animate={{
              rotateY: 360,
              rotateX: 10
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            className="text-center"
          >
            <Factory className="w-32 h-32 text-blue-400 mx-auto mb-6" />
            <p className="text-2xl font-black text-white">
              Real-time Monitoring System
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
