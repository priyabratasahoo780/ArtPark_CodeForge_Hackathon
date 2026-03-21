import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUsers, FiZap, FiAward, FiMessageSquare } from 'react-icons/fi'

export default function ActivityFeed({ activities }) {
  return (
    <div className="glass-card h-full flex flex-col border-none bg-black/40 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <FiUsers className="text-[#00f3ff]" />
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Team Intelligence</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff]/20">
          <div className="w-1 h-1 rounded-full bg-[#00f3ff] animate-pulse"></div>
          <span className="text-[8px] font-black text-[#00f3ff] uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <AnimatePresence initial={false}>
          {activities.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-30">
              <FiZap size={32} className="mb-4 text-gray-500" />
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No recent neural activity</p>
            </div>
          ) : (
            activities.map((activity, i) => (
              <motion.div
                key={activity.id || i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-4 group cursor-default"
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg text-gray-400 group-hover:border-[#00f3ff]/50 transition-all">
                    {activity.type === 'achievement' ? <FiAward className="text-[#fbbf24]" /> : 
                     activity.type === 'progress' ? <FiZap className="text-[#00f3ff]" /> : 
                     <FiMessageSquare className="text-[#bc13fe]" />}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black border border-white/10 overflow-hidden flex items-center justify-center">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user || 'User'}`} 
                      alt="avatar" 
                      className="w-full h-full"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-white uppercase tracking-tight truncate">{activity.user || 'Anonymous'}</span>
                    <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest shrink-0">{activity.time || 'Just now'}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                    {activity?.text}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white/[0.01] border-t border-white/5">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-black/40 border border-white/5">
          <input 
            type="text" 
            placeholder="Broadcast neural update..." 
            className="flex-1 bg-transparent border-none outline-none text-[10px] text-white font-medium placeholder:text-gray-700 uppercase tracking-widest"
          />
          <FiZap className="text-gray-700 hover:text-[#00f3ff] cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  )
}
