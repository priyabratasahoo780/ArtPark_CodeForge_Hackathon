import React from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiActivity, FiGlobe, FiAlertCircle, FiZap } from 'react-icons/fi'

const EliteAnalytics = ({ decayData, loadStats, marketBenchmark }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Neural Load & Burnout Risk */}
        <div className="glass-card p-8 border-none bg-gradient-to-br from-[#bc13fe]/5 to-transparent rounded-3xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <FiActivity className="text-[#bc13fe]" /> Neural Load Profile
              </h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Biometric-style activity analysis</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              loadStats?.risk_level === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
              (loadStats?.risk_level === 'Moderate' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-[#34d399]/10 border-[#34d399]/20 text-[#34d399]')
            }`}>
              {loadStats?.risk_level || 'Optimal'} Status
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative h-24 flex items-end gap-1 overflow-hidden">
               {[...Array(20)].map((_, i) => (
                 <motion.div 
                    key={i}
                    animate={{ height: [20, 60 + Math.random() * 40, 20] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-[#bc13fe] to-[#bc13fe]/20 rounded-t-sm opacity-40"
                 />
               ))}
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-black text-white tabular-nums">{loadStats?.load_score || 0}%</span>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Efficiency Rate</span>
                <p className="text-lg font-black text-[#00f3ff]">{loadStats?.efficiency || 100}%</p>
              </div>
              <div>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Stability Index</span>
                <p className="text-lg font-black text-[#34d399]">9.4/10</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Market Benchmarking */}
        <div className="glass-card p-8 border-none bg-gradient-to-br from-[#00f3ff]/5 to-transparent rounded-3xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <FiGlobe className="text-[#00f3ff]" /> Global Benchmark
              </h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Real-time industry rank</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-[#00f3ff] uppercase tracking-widest block">Level</span>
              <span className="text-xl font-black text-white">{marketBenchmark?.status || 'Elite Candidate'}</span>
            </div>
          </div>

          <div className="relative pt-10 pb-4">
             <div className="h-2 w-full bg-white/5 rounded-full relative overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${marketBenchmark?.user_percentile || 50}%` }}
                  className="absolute h-full bg-gradient-to-r from-[#bc13fe] to-[#00f3ff]"
                />
             </div>
             <motion.div 
                animate={{ left: `${marketBenchmark?.user_percentile || 50}%` }}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
             >
                <div className="bg-white px-2 py-1 rounded-lg shadow-lg">
                   <span className="text-[10px] font-black text-black">TOP {100 - (marketBenchmark?.user_percentile || 50)}%</span>
                </div>
                <div className="w-0.5 h-10 bg-white/40 mt-1"></div>
             </motion.div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2">
            {[
               { label: 'Demand', value: marketBenchmark?.market_demand || 'High' },
               { label: 'Avg Readiness', value: `${marketBenchmark?.market_avg_readiness || 0}%` },
               { label: 'Trend', value: '+14% YoY', color: '#34d399' }
            ].map((s, i) => (
              <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[8px] font-black text-gray-500 uppercase block">{s.label}</span>
                <span className="text-xs font-black text-white" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Decay Map */}
      <div className="glass-card p-8 border-none bg-white/[0.02] rounded-3xl">
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-8">
          <FiAlertCircle className="text-amber-500" /> Knowledge Decay Heatmap
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {decayData?.map((skill, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 relative overflow-hidden ${
                skill.status === 'fading' ? 'border-amber-500/30 bg-amber-500/5' : 
                (skill.status === 'forgotten' ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 bg-white/5')
              }`}
            >
              <div className="absolute inset-0 pointer-events-none">
                 <div className={`w-full h-full opacity-10 blur-xl ${
                   skill.status === 'fading' ? 'bg-amber-500' : 
                   (skill.status === 'forgotten' ? 'bg-red-500' : 'bg-[#00f3ff]')
                 }`}></div>
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-tighter text-center line-clamp-1">{skill.name}</span>
              <span className="text-lg font-black">{skill.retention}%</span>
              <span className="text-[8px] font-bold text-gray-500 uppercase">Retention</span>
              {skill.status !== 'mastered' && (
                <div className="mt-2 flex items-center gap-1 text-[8px] font-black text-amber-500 uppercase cursor-pointer hover:underline">
                  <FiZap /> Refresher
                </div>
              )}
            </motion.div>
          ))}
          {(!decayData || decayData.length === 0) && (
            <div className="col-span-full py-10 text-center text-gray-600 italic text-xs uppercase font-bold tracking-widest">
              Master skills to start tracking retention
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EliteAnalytics
