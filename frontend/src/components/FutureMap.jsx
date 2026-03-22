import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrendingUp, FiActivity, FiArrowRight, FiZap, FiTarget, FiInfo } from 'react-icons/fi'
import axios from 'axios'

const API_BASE_URL = 'https://artpark-codeforge-hackathon.onrender.com'

const FutureMap = ({ activeRole }) => {
  const [data, setData] = useState(null)
  const [year, setYear] = useState(2026)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProjections()
  }, [activeRole])

  const fetchProjections = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/projections/2030?role=${activeRole || 'Software Engineer'}`)
      setData(response.data)
    } catch (err) {
      console.error('Projection error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 p-8 rounded-3xl border border-white/10">
         <div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
               <FiTrendingUp className="text-[#bc13fe]" /> Neural Time-Traveler
            </h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Projecting skill volatility and demand for <span className="text-white">{activeRole || 'General Roles'}</span></p>
         </div>
         
         <div className="flex-1 max-w-md w-full px-8">
            <div className="relative h-2 w-full bg-white/10 rounded-full">
               <motion.div 
                 className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#bc13fe] to-[#00f3ff] rounded-full"
                 animate={{ width: `${((year - 2026) / 4) * 100}%` }}
               />
               <input 
                 type="range" 
                 min="2026" 
                 max="2030" 
                 value={year}
                 onChange={(e) => setYear(parseInt(e.target.value))}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
            </div>
            <div className="flex justify-between mt-4">
               <span className={`text-[10px] font-black uppercase ${year === 2026 ? 'text-[#bc13fe]' : 'text-gray-700'}`}>Now (2026)</span>
               <span className={`text-[10px] font-black uppercase ${year === 2030 ? 'text-[#00f3ff]' : 'text-gray-700'}`}>Future (2030)</span>
            </div>
         </div>
         
         <div className="text-center md:text-right">
            <span className="text-5xl font-black font-mono text-white opacity-20">{year}</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* High Demand */}
         <div className="glass-card p-10 border-none bg-gradient-to-br from-[#00f3ff]/10 to-transparent rounded-[2.5rem] relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
               <FiZap className="text-[#00f3ff]" />
               <h3 className="text-sm font-black text-white uppercase tracking-widest">High-Demand Neural Clusters</h3>
            </div>
            
            <div className="space-y-4">
               {data?.high_demand.map((skill, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: idx * 0.1 }}
                   className={`p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group cursor-help transition-all ${year === 2030 ? 'border-[#00f3ff]/40 shadow-[0_0_20px_rgba(0,243,255,0.1)]' : ''}`}
                 >
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse"></div>
                       <span className="text-xs font-black text-white uppercase tracking-tight">{skill}</span>
                    </div>
                    {year === 2030 && <span className="text-[10px] font-black text-[#34d399] uppercase tracking-widest">+ 420% Growth</span>}
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Deprecated */}
         <div className="glass-card p-10 border-none bg-gradient-to-br from-red-500/10 to-transparent rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-8">
               <FiActivity className="text-red-500" />
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Deprecated / Low Volatility</h3>
            </div>
            
            <div className="space-y-4">
               {data?.deprecated.map((skill, idx) => (
                 <div key={idx} className={`p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between opacity-50 ${year === 2030 ? 'grayscale line-through text-gray-700 border-red-500/10' : ''}`}>
                    <div className="flex items-center gap-4">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500/40"></div>
                       <span className="text-xs font-black uppercase tracking-tight">{skill}</span>
                    </div>
                    {year === 2030 && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Obsolete</span>}
                 </div>
               ))}
            </div>
            
            <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/5 flex items-start gap-4">
               <FiInfo className="text-[#bc13fe] shrink-0 mt-1" />
               <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed">By 2030, skills in the "Deprecated" section will require <span className="text-white">AI Sovereignty shielding</span> to remain relevant in automated deployment pipelines.</p>
            </div>
         </div>
      </div>
    </div>
  )
}

export default FutureMap
