import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBriefcase, FiMapPin, FiCheckCircle, FiExternalLink, FiSearch } from 'react-icons/fi'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const JobMatcher = ({ skills }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [skills])

  const fetchMatches = async () => {
    try {
      const resp = await axios.post(`${API_BASE_URL}/jobs/match`, {
        skills: skills || []
      })
      setData(resp.data)
    } catch (err) {
      console.error('Job matching failed:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-[#00f3ff]/10 flex items-center justify-center text-lg text-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                <FiSearch />
             </div>
             <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Live AI Job-Matching</h3>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{data?.total_matches || 0} Critical Matches Found</p>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
             {(data?.jobs || []).map((job, idx) => (
               <motion.div 
                 key={job.title + job.company}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className="glass-card p-6 border-none bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between group overflow-hidden relative"
               >
                  <div className="flex items-center gap-6 relative z-10">
                     <div className="w-16 h-16 rounded-2xl bg-white/5 flex flex-col items-center justify-center text-center p-2 border border-white/10 shrink-0">
                        <span className="text-[14px] font-black text-[#00f3ff]">{job.match_percentage}%</span>
                        <span className="text-[7px] font-bold text-gray-600 uppercase">Match</span>
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h4 className="text-sm font-black text-white uppercase tracking-tight">{job.title}</h4>
                           <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase ${job.tag === 'URGENT' ? 'bg-red-500/20 text-red-400' : 'bg-[#bc13fe]/20 text-[#bc13fe]'}`}>
                              {job.tag}
                           </span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                           <span className="flex items-center gap-1"><FiBriefcase className="text-[#bc13fe]" /> {job.company}</span>
                           <span className="flex items-center gap-1"><FiMapPin /> {job.location}</span>
                           <span className="text-[#34d399]">{job.salary}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                           {job.match_skills.map(s => (
                             <span key={s} className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${job.matched_skills.includes(s) ? 'border-[#34d399]/30 bg-[#34d399]/5 text-[#34d399]' : 'border-white/5 bg-white/5 text-gray-600'}`}>
                                {s}
                             </span>
                           ))}
                        </div>
                     </div>
                  </div>

                  <button className="relative z-10 p-4 rounded-xl bg-[#00f3ff]/10 text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black transition-all group-hover:scale-110">
                     <FiExternalLink />
                  </button>

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
               </motion.div>
             ))}
          </AnimatePresence>
       </div>
    </div>
  )
}

export default JobMatcher
