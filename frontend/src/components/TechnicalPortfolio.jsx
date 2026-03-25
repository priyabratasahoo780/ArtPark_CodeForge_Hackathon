import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAward, FiCode, FiZap, FiExternalLink, FiDownload, FiShield, FiTrendingUp } from 'react-icons/fi'
import axios from 'axios'

const API_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:8000' : 'https://artpark-codeforge-hackathon.onrender.com'

const TechnicalPortfolio = ({ user_name, mastered_skills, target_role }) => {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPortfolio()
  }, [mastered_skills])

  const fetchPortfolio = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/portfolio/generate`, {
        user_name,
        mastered_skills,
        target_role
      })
      setPortfolio(response.data)
    } catch (err) {
      console.error('Portfolio error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="h-96 flex items-center justify-center font-black uppercase italic tracking-tighter text-2xl animate-pulse">Forging Neural Portfolio...</div>

  if (!portfolio) return (
     <div className="glass-card p-12 text-center grayscale opacity-30 border-dashed border-2 border-white/10">
        <FiAward className="text-6xl mx-auto mb-6" />
        <p className="text-[10px] font-black uppercase tracking-widest text-white">Master more skills to generate your Verified Technical Portfolio</p>
     </div>
  )

  return (
    <div className="space-y-12">
      {/* Portfolio Header */}
      <div className="relative group">
         <div className="absolute inset-0 bg-gradient-to-r from-[#bc13fe]/20 to-[#00f3ff]/20 blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
         <div className="glass-card p-12 border-none bg-black/60 rounded-[3rem] relative z-10 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
               <div>
                  <div className="flex items-center gap-3 mb-4">
                     <span className="px-3 py-1 bg-[#34d399]/10 border border-[#34d399]/20 rounded-full text-[8px] font-black text-[#34d399] uppercase tracking-widest">
                        {portfolio.verification_status}
                     </span>
                     <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-widest">
                        Ref: CF-2026-X9
                     </span>
                  </div>
                  <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">{portfolio.candidate_name}</h2>
                  <p className="text-xl font-bold text-[#00f3ff] mt-2 uppercase tracking-wide">{portfolio.role}</p>
               </div>
               
               <div className="flex gap-4">
                  <button className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2">
                     <FiDownload /> Download JSON
                  </button>
                  <button className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                     <FiExternalLink /> Live Link
                  </button>
               </div>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/5">
               <div className="space-y-1">
                  <span className="text-[9px] font-black text-gray-600 uppercase">Growth Velocity</span>
                  <p className="text-lg font-black text-white">{portfolio.learning_velocity}</p>
               </div>
               <div className="space-y-1">
                  <span className="text-[9px] font-black text-gray-600 uppercase">Skills Verified</span>
                  <p className="text-lg font-black text-white">{mastered_skills.length}</p>
               </div>
               <div className="space-y-1">
                  <span className="text-[9px] font-black text-gray-600 uppercase">Project Accuracy</span>
                  <p className="text-lg font-black text-white">99.4%</p>
               </div>
               <div className="space-y-1">
                  <span className="text-[9px] font-black text-gray-600 uppercase">Neural Load Avg</span>
                  <p className="text-lg font-black text-[#bc13fe]">Optimal</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Badges Panel */}
         <div className="lg:col-span-1 space-y-6">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Verified Mastery Badges</h3>
            {portfolio.mastery_badges.map((badge, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 border-none bg-white/[0.02] hover:bg-white/5 transition-all flex items-center gap-6 group"
              >
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-2xl transition-all group-hover:rotate-12 ${badge.level === 'Platinum' ? 'bg-[#00f3ff] text-black' : badge.level === 'Gold' ? 'bg-amber-500 text-black' : 'bg-gray-700 text-white'}`}>
                    <FiShield />
                 </div>
                 <div>
                    <h4 className="text-xs font-black text-white uppercase">{badge.name}</h4>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${badge.level === 'Platinum' ? 'text-[#00f3ff]' : badge.level === 'Gold' ? 'text-amber-500' : 'text-gray-500'}`}>{badge.level} GRADE</span>
                 </div>
              </motion.div>
            ))}
         </div>

         {/* Featured Implementation */}
         <div className="lg:col-span-2 space-y-8">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">AI-Generated Case Studies</h3>
            <div className="space-y-6">
               {portfolio.featured_projects.map((proj, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 + (idx * 0.1) }}
                   className="glass-card p-10 border-none bg-gradient-to-br from-white/[0.03] to-transparent rounded-[2.5rem] relative overflow-hidden group"
                 >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-all text-6xl">
                       <FiCode />
                    </div>
                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">{proj.name}</h4>
                    <p className="text-sm text-gray-400 font-bold leading-loose mb-8 max-w-xl">{proj.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                       {proj.tech_stack.map((tech, tIdx) => (
                         <span key={tIdx} className="px-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest">{tech}</span>
                       ))}
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}

export default TechnicalPortfolio
