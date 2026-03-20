import React from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiZap, FiTrendingUp, FiCheckCircle, FiLink } from 'react-icons/fi'

export default function TimeSavedAnalytics({ data }) {
  if (!data) return null

  const {
    time_saved_label,
    optimized_days,
    days_saved,
    breakdown,
    efficiency_gain,
    known_skills_skipped
  } = data

  const savedPct = parseFloat(data.time_saved_percent) || 0
  const optimizedPct = 100 - savedPct

  return (
    <div className="space-y-10">
      {/* Header & Main Badge */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Efficiency <span className="text-[#00f3ff]">Metrics</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">Adaptive Acceleration Analysis</p>
        </div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card bg-gradient-to-br from-[#00f3ff]/20 to-[#bc13fe]/10 border-[#00f3ff]/30 py-4 px-8 text-center shadow-[0_0_30px_rgba(0,243,255,0.15)]"
        >
          <div className="text-4xl font-black text-white italic tracking-tighter leading-none">{time_saved_label}</div>
          <div className="text-[10px] font-black text-[#00f3ff] uppercase tracking-[0.4em] mt-2">Time Optimized</div>
        </motion.div>
      </div>

      {/* Visual Comparison Bar */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="text-[#bc13fe]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Efficiency Vector</span>
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Linear Scale (Days)</span>
        </div>
        
        <div className="relative h-10 rounded-2xl bg-white/5 border border-white/10 overflow-hidden group shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${optimizedPct}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#bc13fe] to-[#00f3ff] flex items-center justify-end pr-4 z-10"
          >
            <span className="text-[10px] font-black text-white uppercase tracking-tighter">{optimized_days}D PATH</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute top-0 h-full bg-white/[0.03] flex items-center justify-center border-l border-white/10"
            style={{ left: `${optimizedPct}%`, width: `${savedPct}%` }}
          >
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{days_saved}D SAVED</span>
          </motion.div>
        </div>
        
        <div className="flex gap-6 justify-center">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#bc13fe]"></div>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Adaptive Path</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10 border border-white/20"></div>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Optimized Out</span>
            </div>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <FiClock />, label: 'Traditional', value: `${data.traditional_days}D`, color: '#666' },
          { icon: <FiZap />, label: 'Adaptive', value: `${optimized_days}D`, color: '#bc13fe' },
          { icon: <FiCheckCircle />, label: 'Saved', value: `${days_saved}D`, color: '#00f3ff' },
          { icon: <FiTrendingUp />, label: 'Gain', value: efficiency_gain, color: '#ff00e5' },
        ].map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card border-white/5 bg-white/[0.01] flex flex-col items-center py-6 text-center group hover:bg-white/[0.03]"
          >
            <div className="text-xl mb-3 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: s.color }}>{s.icon}</div>
            <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{s.label}</div>
            <div className="text-xl font-black text-white italic tracking-tighter">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Logic Breakdown */}
      <div className="card border-white/5 bg-white/[0.02] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#bc13fe]/40"></div>
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
          <FiLink /> Neural Pruning Logic
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
                <p className="text-2xl font-black text-white italic">{known_skills_skipped}</p>
                <p className="text-[9px] font-black text-[#bc13fe] uppercase tracking-widest">Known Skills Bypassed</p>
                <p className="text-[10px] text-gray-500 font-medium">Saved: {breakdown?.known_skills_hours_skipped ?? 0}H</p>
            </div>
            <div className="space-y-1 border-l border-white/5 pl-8">
                <p className="text-2xl font-black text-white italic">{data.prerequisites_deduped}</p>
                <p className="text-[9px] font-black text-[#00f3ff] uppercase tracking-widest">Prereqs De-duplicated</p>
                <p className="text-[10px] text-gray-500 font-medium">Saved: {breakdown?.prerequisite_dedup_saving_hours ?? 0}H</p>
            </div>
            <div className="space-y-1 border-l border-white/5 pl-8">
                <p className="text-2xl font-black text-white italic">Low</p>
                <p className="text-[9px] font-black text-[#ff00e5] uppercase tracking-widest">Cognitive Overhead</p>
                <p className="text-[10px] text-gray-500 font-medium">Saved: {breakdown?.overhead_hours_eliminated ?? 0}H</p>
            </div>
        </div>
      </div>
    </div>
  )
}
