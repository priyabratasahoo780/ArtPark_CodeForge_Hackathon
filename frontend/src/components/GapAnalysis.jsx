import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiCheckCircle, FiAlertTriangle, FiXCircle, FiActivity } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function GapAnalysis({ data }) {
  const [expandedSkill, setExpandedSkill] = useState(null)
  
  const knownSkills = data?.known_skills || []
  const partialSkills = data?.partial_skills || []
  const missingSkills = data?.missing_skills || []
  const stats = data?.statistics || {}

  const toggleExpand = (skillName) => {
    setExpandedSkill(expandedSkill === skillName ? null : skillName)
  }

  const SkillCard = ({ skill, status, i }) => {
    const isExpanded = expandedSkill === skill.name
    
    const statusConfig = {
      known: { color: '#00f3ff', bg: 'rgba(0, 243, 255, 0.05)', icon: <FiCheckCircle /> },
      partial: { color: '#bc13fe', bg: 'rgba(188, 19, 254, 0.05)', icon: <FiAlertTriangle /> },
      missing: { color: '#ff00e5', bg: 'rgba(255, 0, 229, 0.05)', icon: <FiXCircle /> }
    }

    const config = statusConfig[status]

    return (
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
        className="glass-card mb-4 border-l-4 overflow-hidden group hover:bg-white/[0.05]"
        style={{ borderLeftColor: config.color }}
      >
        <div
          onClick={() => toggleExpand(skill.name)}
          className="cursor-pointer flex items-center justify-between pointer-events-auto"
        >
          <div className="flex items-center gap-4">
            <div className="text-xl" style={{ color: config.color }}>{config.icon}</div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider text-white group-hover:glow-text-cyan transition-all">{skill.name}</h4>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{skill.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {skill.gap_score && (
              <span className="text-[10px] font-black uppercase px-2 py-1 rounded border" style={{ borderColor: `${config.color}44`, color: config.color }}>
                Gap: {skill.gap_score}/3
              </span>
            )}
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
              <FiChevronDown className="text-gray-500" />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                {skill.reason && (
                  <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-400 italic font-medium leading-relaxed">
                      <span className="text-[#00f3ff] not-italic mr-1">Analysis:</span> {skill.reason}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0a0a0c] p-3 rounded-lg border border-white/5">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Your Proficiency</p>
                    <p className="text-sm font-bold text-[#00f3ff]">{skill.resume_level || 'Not Found'}</p>
                  </div>
                  <div className="bg-[#0a0a0c] p-3 rounded-lg border border-white/5">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Requirement</p>
                    <p className="text-sm font-bold text-[#bc13fe]">{skill.required_level || 'Expert'}</p>
                  </div>
                </div>

                {skill.prerequisites && skill.prerequisites.length > 0 && (
                  <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Prerequisites</p>
                    <div className="flex flex-wrap gap-2">
                      {skill.prerequisites.map((prereq) => (
                        <span key={prereq} className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-gray-300">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Gap <span className="text-[#bc13fe]">Matrix</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Syllabus-aligned capability analysis</p>
        </div>
        <div className="flex gap-2">
          <div className="glass-card py-2 px-4 flex items-center gap-2">
            <FiActivity className="text-[#00f3ff]" />
            <span className="text-sm font-black text-white">{stats.readiness_score || 0}%</span>
          </div>
        </div>
      </div>

      {/* Hero Progress Section */}
      <div className="card bg-gradient-to-br from-[#bc13fe]/5 to-transparent border-white/10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-xs font-black text-[#bc13fe] uppercase tracking-widest mb-1">Overall Curriculum Coverage</h3>
            <p className="text-3xl font-black text-white">{stats.coverage_percentage || 0}%</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
            <p className="text-sm font-black text-[#00f3ff] uppercase tracking-wider italic">
              {stats.readiness_score > 70 ? 'Accelerated Path' : 'Standard Path'}
            </p>
          </div>
        </div>
        <div className="progress-bar-container h-3 bg-white/5 border border-white/10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${stats.coverage_percentage || 0}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="progress-bar-fill bg-gradient-to-r from-[#bc13fe] via-[#00f3ff] to-[#ff00e5]"
          />
        </div>
      </div>

      {/* Skill Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Missing Skills - High Priority */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#ff00e5] shadow-[0_0_8px_#ff00e5]"></div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Critical Gaps ({missingSkills.length})</h3>
          </div>
          {missingSkills.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} status="missing" i={i} />
          ))}
          {missingSkills.length === 0 && (
            <p className="text-xs text-gray-500 italic uppercase font-bold tracking-wider text-center py-10 bg-white/[0.02] rounded-xl border border-dashed border-white/10">No Critical Gaps Found</p>
          )}
        </div>

        {/* Partial Skills */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#bc13fe] shadow-[0_0_8px_#bc13fe]"></div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Growth Areas ({partialSkills.length})</h3>
          </div>
          {partialSkills.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} status="partial" i={i} />
          ))}
        </div>

        {/* Known Skills */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00f3ff] shadow-[0_0_8px_#00f3ff]"></div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Core Strengths ({knownSkills.length})</h3>
          </div>
          {knownSkills.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} status="known" i={i} />
          ))}
        </div>
      </div>

      {/* Tactical Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-white/10 bg-white/[0.02]"
      >
        <h3 className="text-xs font-black text-[#00f3ff] uppercase tracking-[0.2em] mb-4">Strategic Assessment</h3>
        <p className="text-sm text-gray-300 leading-relaxed font-medium">
          Detection analysis identifies <span className="text-[#00f3ff] font-black">{stats.known_count}</span> verified competencies. 
          To achieve 100% readiness, focus must be prioritized on the <span className="text-[#ff00e5] font-black">{stats.missing_count}</span> critical gaps 
          and <span className="text-[#bc13fe] font-black">{stats.partial_count}</span> optimization points.
        </p>
      </motion.div>
    </div>
  )
}
