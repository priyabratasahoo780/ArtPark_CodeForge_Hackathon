import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUsers, FiCheckCircle, FiTarget, FiArrowRight, FiAward, FiBookOpen, FiUser, FiZap, FiTrash2 } from 'react-icons/fi'
import NeuralRoadmap from './NeuralRoadmap'

const TalentPool = ({ batchResults = [], onRemoveCandidate }) => {
  const [selectedIdx, setSelectedIdx] = useState(batchResults.length > 0 ? 0 : null)

  const selectedCandidate = selectedIdx !== null ? batchResults[selectedIdx] : null

  if (batchResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10">
          <FiUsers className="text-4xl text-gray-600" />
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">No Talent Data Found</h2>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest max-w-xs">Upload multiple resumes in the upload section to populate your talent pool.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* ── Left Sidebar: Personnel List ── */}
      <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto no-scrollbar max-h-[80vh]">
        <div className="flex items-center justify-between mb-2">
           <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Hiring Pipeline ({batchResults.length})</h3>
        </div>
        
        {batchResults.map((candidate, idx) => (
          <motion.div
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            whileHover={{ x: 4 }}
            className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 group ${
              selectedIdx === idx 
                ? 'bg-white text-black border-white' 
                : 'bg-white/[0.02] border-white/10 text-white hover:bg-white/[0.05] hover:border-white/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedIdx === idx ? 'bg-black text-white' : 'bg-white/5 text-[#bc13fe]'}`}>
                  {candidate.candidate_name?.[0] || 'C'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black uppercase truncate tracking-tight">{candidate.candidate_name}</h4>
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${selectedIdx === idx ? 'text-black/60' : 'text-gray-500'}`}>
                    Match: {candidate.gap_analysis?.statistics?.readiness_score || 0}%
                  </p>
                </div>
              </div>
              <FiArrowRight className={`transition-transform duration-300 ${selectedIdx === idx ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Right Content: Deep Insight & Roadmap ── */}
      <div className="lg:col-span-8 space-y-8">
        <AnimatePresence mode="wait">
          {selectedCandidate ? (
            <motion.div
              key={selectedIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Profile Bar */}
              <div className="glass-card p-6 border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#bc13fe] to-[#8a2be2] flex items-center justify-center shadow-lg shadow-[#bc13fe]/20">
                    <FiUser className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase italic tracking-wider">{selectedCandidate.candidate_name}</h2>
                    <p className="text-[10px] font-bold text-[#bc13fe] uppercase tracking-widest">Employee Profile • ID #{Math.floor(Math.random() * 9000) + 1000}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                   <div className="text-right">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Target Role</p>
                      <p className="text-xs font-black text-white uppercase truncate max-w-[150px]">{selectedCandidate.target_role || "Product Growth"}</p>
                   </div>
                </div>
              </div>

              {/* Skill Matrix: Known vs Unknown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="glass-card p-6 border-none bg-green-500/5 rounded-3xl group">
                    <div className="flex items-center gap-2 mb-4">
                       <FiCheckCircle className="text-green-500" />
                       <h3 className="text-[10px] font-black text-green-500 uppercase tracking-widest">Mastered Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {selectedCandidate.gap_analysis?.identified_skills?.length > 0 ? (
                         selectedCandidate.gap_analysis.identified_skills.map((skill, i) => {
                           const label = typeof skill === 'string' ? skill : (skill?.name || JSON.stringify(skill))
                           return (
                             <span key={i} className="px-3 py-1.5 bg-green-500/10 text-green-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-green-500/20">
                               {label}
                             </span>
                           )
                         })
                       ) : (
                         <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic">No clear identification</span>
                       )}
                    </div>
                 </div>

                 <div className="glass-card p-6 border-none bg-red-500/5 rounded-3xl">
                    <div className="flex items-center gap-2 mb-4">
                       <FiTarget className="text-red-400" />
                       <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest">Required Skills (Gaps)</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {selectedCandidate.gap_analysis?.missing_skills?.length > 0 ? (
                         selectedCandidate.gap_analysis.missing_skills.map((skill, i) => {
                           const label = typeof skill === 'string' ? skill : (skill?.name || JSON.stringify(skill))
                           return (
                             <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-red-500/20">
                               {label}
                             </span>
                           )
                         })
                       ) : (
                         <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic">No gaps detected</span>
                       )}
                    </div>
                 </div>
              </div>

              {/* Roadmap Preview */}
              <div className="glass-card p-8 border-white/5 bg-white/[0.01]">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 italic">
                        <FiZap className="text-[#bc13fe]" /> Adaptation Roadmap
                      </h3>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1 ml-6">Personalized learning path for internal career transition</p>
                    </div>
                 </div>
                 
                 <div className="bg-black/40 rounded-3xl border border-white/10 p-4 min-h-[400px]">
                    {selectedCandidate.learning_path ? (
                      <NeuralRoadmap data={selectedCandidate.learning_path} />
                    ) : (
                      <div className="flex items-center justify-center min-h-[400px] text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">Roadmap unavailable for this entry</div>
                    )}
                 </div>
              </div>

            </motion.div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Select a candidate from the list to synchronize talent telemetry</p>
             </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TalentPool
