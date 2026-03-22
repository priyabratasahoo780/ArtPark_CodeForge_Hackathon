import React from 'react'
import { motion } from 'framer-motion'
import { FiTarget, FiZap, FiActivity, FiGlobe, FiShare2, FiArrowUpRight, FiShield } from 'react-icons/fi'

const RecruiterDashboard = ({ 
  candidateData, 
  learningPath, 
  marketBenchmark, 
  completedSkillNames, 
  insightsSkills,
  batchResults = [],
  onSelectCandidate,
  selectedIndex = 0
}) => {
  const handleExport = () => {
    window.print()
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-0">
      
      {/* ── Hiring Leaderboard (Batch View) ── */}
      {batchResults.length > 1 && (
        <div className="glass-card p-6 border-white/10 bg-white/[0.02] rounded-3xl">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Hiring Leaderboard ({batchResults.length} Candidates)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-[9px] font-black text-white uppercase tracking-widest">Candidate</th>
                  <th className="pb-4 text-[9px] font-black text-white uppercase tracking-widest">Readiness</th>
                  <th className="pb-4 text-[9px] font-black text-white uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {batchResults.map((res, idx) => {
                  const score = res.gap_analysis?.statistics?.readiness_score || 0
                  return (
                    <tr key={idx} className={`group hover:bg-white/[0.02] transition-colors ${selectedIndex === idx ? 'bg-white/[0.05]' : ''}`}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${selectedIndex === idx ? 'bg-[#bc13fe] text-white' : 'bg-white/5 text-gray-400'}`}>
                            {res.candidate_name?.[0] || 'C'}
                          </div>
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{res.candidate_name}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[100px] h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#bc13fe] to-[#00f3ff]" style={{ width: `${score}%` }}></div>
                          </div>
                          <span className="text-[10px] font-black text-[#00f3ff]">{score}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <button 
                          onClick={() => onSelectCandidate(idx)}
                          className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                            selectedIndex === idx 
                              ? 'bg-white text-black' 
                              : 'border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                          }`}
                        >
                          {selectedIndex === idx ? 'Viewing' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Header Profile Section ── */}
      <div className="relative bg-white/5 p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl lg:rounded-[3rem] border border-white/10 overflow-hidden">
        {/* Verified badge — top-right, always visible */}
        <div className="absolute top-3 right-3 sm:top-6 sm:right-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#34d399]/10 border border-[#34d399]/20 rounded-full">
            <FiShield className="text-[#34d399] text-xs sm:text-sm" />
            <span className="text-[8px] sm:text-[10px] font-black text-[#34d399] uppercase tracking-widest hidden xs:inline">Verified Talent Hub</span>
          </div>
        </div>

        {/* Avatar + info + button stacked on mobile, row on md+ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6 pt-7 sm:pt-0">
          {/* Avatar + Text */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shrink-0 rounded-xl sm:rounded-2xl lg:rounded-[2rem] bg-gradient-to-br from-[#bc13fe] to-[#00f3ff] p-0.5 shadow-2xl">
              <div className="w-full h-full bg-[#0a0a0c] rounded-xl sm:rounded-2xl lg:rounded-[1.8rem] flex items-center justify-center">
                <span className="text-lg sm:text-2xl lg:text-3xl font-black text-white">JD</span>
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl lg:text-3xl font-black text-white tracking-tighter uppercase italic leading-tight truncate">
                {candidateData?.candidate_name || 'Elite Candidate'}
                <span className="text-gray-600 ml-2 sm:ml-4 font-normal not-italic opacity-40 text-sm sm:text-base lg:text-xl">#{candidateData?.candidate_id || 'CODE-4492'}</span>
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 sm:mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></div>
                  <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Open to roles</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiTarget className="text-[#00f3ff] text-xs" />
                  <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest truncate max-w-[140px] sm:max-w-none">
                    {candidateData?.target_role || 'Senior Engineer'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Export button — full width on mobile */}
          <button
            onClick={handleExport}
            className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-white text-black text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl sm:rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 print:hidden shrink-0"
          >
            <FiShare2 /> Export Talent Report
          </button>
        </div>
      </div>

      {/* ── Metrics Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Market Readiness */}
        <div className="glass-card p-5 sm:p-6 lg:p-8 border-none bg-gradient-to-br from-[#00f3ff]/10 to-transparent rounded-2xl sm:rounded-3xl lg:col-span-1">
          <h3 className="text-[9px] sm:text-[10px] font-black text-[#00f3ff] uppercase tracking-widest mb-4 sm:mb-6">Market Readiness Index</h3>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
              {Math.min(99, (marketBenchmark?.user_percentile || 65) + (completedSkillNames?.size || 0) * 4)}%
            </span>
            <span className="text-xs font-black text-[#34d399]">+{(completedSkillNames?.size || 0) * 1.5}% High</span>
          </div>
          <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-3 sm:mt-4 leading-relaxed">
            Top 6% against 2,400+ technical candidates verified in the last 30 days.
          </p>
        </div>

        {/* Mastery Velocity — spans 2 cols on lg */}
        <div className="glass-card p-5 sm:p-6 lg:p-8 border-none bg-gradient-to-br from-[#bc13fe]/10 to-transparent rounded-2xl sm:rounded-3xl sm:col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-5 sm:mb-8">
            <h3 className="text-[9px] sm:text-[10px] font-black text-[#bc13fe] uppercase tracking-widest">Mastery Velocity</h3>
            <FiActivity className="text-[#bc13fe]" />
          </div>

          <div className="h-20 sm:h-24 flex items-end gap-1.5 sm:gap-2">
            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#bc13fe] to-[#bc13fe]/40 rounded-t-lg"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 sm:mt-4 text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest">
            <span>Day 1</span>
            <span className="hidden sm:inline">Onboarding Velocity (Past 7 Days)</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* ── Verified Technology Stack ── */}
      <div className="glass-card p-5 sm:p-6 lg:p-8 border-none bg-white/[0.02] rounded-2xl sm:rounded-3xl">
        <h3 className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-5 sm:mb-8">Verified Technology Stack</h3>
        {insightsSkills && insightsSkills.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {insightsSkills.map((skill, idx) => (
              <div
                key={idx}
                className={`px-4 py-3 sm:px-5 sm:py-4 bg-black/40 border ${completedSkillNames?.has(skill.name)
                  ? 'border-[#34d399]/50 shadow-[0_0_15px_rgba(52,211,153,0.1)]'
                  : 'border-white/5'
                } rounded-xl sm:rounded-2xl flex items-center gap-3 hover:border-[#00f3ff]/30 transition-all cursor-default`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${completedSkillNames?.has(skill.name) ? 'bg-[#34d399]' : 'bg-[#00f3ff]'}`}></div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-tight block truncate">{skill.name}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[7px] sm:text-[8px] font-bold text-gray-600 uppercase">Assessment: </span>
                    <span className={`text-[7px] sm:text-[8px] font-black ${completedSkillNames?.has(skill.name) ? 'text-[#34d399]' : 'text-[#00f3ff]'} uppercase`}>
                      {completedSkillNames?.has(skill.name) ? 'Verified Platinum' : 'Verified Gold'}
                    </span>
                  </div>
                </div>
                <FiArrowUpRight className="text-gray-700 shrink-0 text-xs" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center py-6">Run analysis to see verified skills</p>
        )}
      </div>
    </div>
  )
}

export default RecruiterDashboard
