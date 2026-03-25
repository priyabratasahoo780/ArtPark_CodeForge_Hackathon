import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBriefcase, FiMapPin, FiExternalLink, FiSearch, FiCheckCircle, FiXCircle } from 'react-icons/fi'
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

  if (loading) return (
    <div className="space-y-3 animate-pulse">
      {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/[0.03] border border-white/5" />)}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-[#00f3ff]/20 bg-gradient-to-br from-[#00f3ff]/5 via-black/60 to-transparent backdrop-blur-xl overflow-hidden"
    >
      <div className="p-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00f3ff]/15 border border-[#00f3ff]/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.2)]">
              <FiSearch className="text-[#00f3ff] text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Live AI Job Matching</h3>
              <p className="text-[9px] font-bold text-[#00f3ff]/60 uppercase tracking-[0.2em] mt-0.5">
                {data?.total_matches || 0} Critical Matches Found
              </p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-full bg-[#34d399]/10 border border-[#34d399]/20">
            <span className="text-[9px] font-black text-[#34d399] uppercase tracking-widest">
              {data?.total_matches || 0} Open Roles
            </span>
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {(data?.jobs || []).map((job, idx) => {
              const matchPct = job.match_percentage
              const matchColor = matchPct >= 80 ? '#34d399' : matchPct >= 60 ? '#00f3ff' : '#f59e0b'

              return (
                <motion.div
                  key={job.title + job.company + idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="group relative rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all p-5 cursor-pointer overflow-hidden"
                >
                  {/* Hover shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.015] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />

                  <div className="flex items-center justify-between gap-4 relative z-10">
                    {/* Match percentage circle */}
                    <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${matchColor}10`,
                        borderColor: `${matchColor}30`,
                        boxShadow: `0 0 20px ${matchColor}20`
                      }}>
                      <span className="text-base font-black" style={{ color: matchColor }}>{matchPct}%</span>
                      <span className="text-[6px] font-bold text-gray-500 uppercase">Match</span>
                    </div>

                    {/* Job info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">{job.title}</h4>
                        {job.tag && (
                          <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase shrink-0 ${
                            job.tag === 'URGENT' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 
                            'bg-[#bc13fe]/15 text-[#bc13fe] border border-[#bc13fe]/20'
                          }`}>{job.tag}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[9px] font-bold text-gray-500 uppercase tracking-widest flex-wrap mb-3">
                        <span className="flex items-center gap-1"><FiBriefcase className="text-[#bc13fe]" /> {job.company}</span>
                        <span className="flex items-center gap-1"><FiMapPin /> {job.location}</span>
                        <span className="text-[#34d399] font-black">{job.salary}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {(job.match_skills || []).slice(0, 5).map(s => (
                          <span key={s} className="flex items-center gap-1 text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border"
                            style={
                              (job.matched_skills || []).includes(s)
                                ? { borderColor: '#34d39940', backgroundColor: '#34d39910', color: '#34d399' }
                                : { borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.03)', color: '#6b7280' }
                            }>
                            {(job.matched_skills || []).includes(s)
                              ? <FiCheckCircle className="text-[8px]" />
                              : <FiXCircle className="text-[8px]" />
                            }
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Apply button */}
                    <button className="p-3 rounded-xl border border-[#00f3ff]/20 bg-[#00f3ff]/5 text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black hover:scale-110 transition-all shrink-0">
                      <FiExternalLink />
                    </button>
                  </div>

                  {/* Match bar at bottom */}
                  <div className="mt-4 h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${matchPct}%` }}
                      transition={{ duration: 1.2, delay: idx * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: matchColor }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {(!data?.jobs || data.jobs.length === 0) && (
            <div className="text-center py-12 opacity-30">
              <FiBriefcase className="text-4xl mx-auto mb-3 text-gray-500" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Run analysis to discover matching roles</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default JobMatcher
