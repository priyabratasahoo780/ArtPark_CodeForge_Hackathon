import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGlobe, FiTrendingUp, FiMapPin, FiActivity, FiUsers } from 'react-icons/fi'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

const GlobalTrendMap = () => {
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTrends()
  }, [])

  const fetchTrends = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/ecosystem/trends`)
      setTrends(response.data)
    } catch (err) {
      console.error('Trends error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Market Hotspots */}
        <div className="glass-card p-8 border-none bg-black/40 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_#bc13fe_0%,_transparent_70%)]"></div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <FiGlobe className="text-[#bc13fe]" /> Global Ecosystem Heatmap
              </h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Real-time developer hotspots</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#bc13fe]/10 border border-[#bc13fe]/20 rounded-full">
              <FiActivity className="text-[10px] text-[#bc13fe]" />
              <span className="text-[8px] font-black text-[#bc13fe] uppercase tracking-widest animate-pulse">Live</span>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            {trends?.hotspots.map((spot, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-crosshair"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center">
                    <FiMapPin className="text-[#00f3ff]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase">{spot.city}</h4>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{spot.top_skill}</span>
                  </div>
                </div>
                <div className="text-right">
                   <div className="flex items-center gap-1.5 justify-end">
                      <FiUsers className="text-[10px] text-gray-500" />
                      <span className="text-xs font-black text-white">{spot.active_users}</span>
                   </div>
                   <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">Active Candidates</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trending Skill Index */}
        <div className="glass-card p-8 border-none bg-gradient-to-br from-[#00f3ff]/5 to-transparent rounded-3xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <FiTrendingUp className="text-[#00f3ff]" /> Macro Skill Trends
              </h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">24h growth index</p>
            </div>
          </div>

          <div className="space-y-8">
            {trends?.trending_skills.map((skill, idx) => (
              <div key={idx} className="space-y-2">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white">{skill}</span>
                    <span className="text-[#34d399]">+24.{idx} %</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${80 - idx * 10}%` }}
                      className="h-full bg-gradient-to-r from-[#00f3ff] to-transparent"
                    />
                 </div>
              </div>
            ))}
            
            <div className="pt-6 border-t border-white/5 mt-8">
               <div className="flex items-center justify-between p-4 bg-[#00f3ff]/10 rounded-2xl border border-[#00f3ff]/20">
                  <div className="flex items-center gap-3">
                     <FiTrendingUp className="text-[#00f3ff]" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#00f3ff]">Global Readiness Avg</span>
                  </div>
                  <span className="text-xl font-black text-white">{trends?.global_readiness_avg || 68}%</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalTrendMap
