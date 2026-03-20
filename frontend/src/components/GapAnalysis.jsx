import React, { useState } from 'react'
import { FiChevronDown, FiCheckCircle, FiAlertTriangle, FiXCircle, FiActivity } from 'react-icons/fi'
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

  const statusConfig = {
    known:   { color: '#00f3ff', icon: <FiCheckCircle />,   label: 'Core Strengths',  dot: 'bg-[#00f3ff] shadow-[0_0_8px_#00f3ff]' },
    partial: { color: '#bc13fe', icon: <FiAlertTriangle />, label: 'Growth Areas',     dot: 'bg-[#bc13fe] shadow-[0_0_8px_#bc13fe]' },
    missing: { color: '#ff00e5', icon: <FiXCircle />,       label: 'Critical Gaps',    dot: 'bg-[#ff00e5] shadow-[0_0_8px_#ff00e5]' },
  }

  const SkillCard = ({ skill, status, i }) => {
    const isExpanded = expandedSkill === skill.name
    const cfg = statusConfig[status]

    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.04 }}
        className="rounded-xl border border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-200"
        style={{ borderLeftWidth: 3, borderLeftColor: cfg.color, backgroundColor: 'rgba(255,255,255,0.02)' }}
      >
        {/* Header row — tight and never clips */}
        <div
          onClick={() => toggleExpand(skill.name)}
          className="cursor-pointer flex items-center justify-between gap-3 px-4 py-3 select-none"
        >
          {/* Icon + Name block  — min-w-0 prevents overflow */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="shrink-0 text-base" style={{ color: cfg.color }}>{cfg.icon}</div>
            <div className="min-w-0">
              <h4 className="font-black text-xs uppercase tracking-wider text-white truncate leading-tight">
                {skill.name}
              </h4>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest truncate mt-0.5">
                {skill.category}
              </p>
            </div>
          </div>

          {/* Right side: gap score + chevron */}
          <div className="flex items-center gap-2 shrink-0">
            {skill.gap_score ? (
              <span
                className="text-[9px] font-black uppercase px-2 py-0.5 rounded border whitespace-nowrap"
                style={{ borderColor: `${cfg.color}44`, color: cfg.color }}
              >
                {skill.gap_score}/3
              </span>
            ) : null}
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <FiChevronDown className="text-gray-500 text-sm" />
            </motion.div>
          </div>
        </div>

        {/* Expanded detail */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-3">
                {skill.reason && (
                  <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-400 italic leading-relaxed">
                      <span className="text-[#00f3ff] not-italic font-bold mr-1">Analysis:</span>
                      {skill.reason}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0a0a0c] p-3 rounded-lg border border-white/5">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Your Level</p>
                    <p className="text-sm font-bold text-[#00f3ff] truncate">{skill.resume_level || 'Not Found'}</p>
                  </div>
                  <div className="bg-[#0a0a0c] p-3 rounded-lg border border-white/5">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Required</p>
                    <p className="text-sm font-bold text-[#bc13fe] truncate">{skill.required_level || 'Expert'}</p>
                  </div>
                </div>

                {skill.prerequisites?.length > 0 && (
                  <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Prerequisites</p>
                    <div className="flex flex-wrap gap-1.5">
                      {skill.prerequisites.map((p) => (
                        <span key={p} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[9px] font-bold text-gray-300">
                          {p}
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

  const Section = ({ skills, status, count }) => {
    const cfg = statusConfig[status]
    return (
      <div className="flex flex-col min-w-0">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest truncate">
            {cfg.label} ({count})
          </h3>
        </div>

        {/* Skill cards */}
        <div className="space-y-2 flex-1">
          {skills.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} status={status} i={i} />
          ))}
          {skills.length === 0 && (
            <div className="text-[10px] text-gray-500 italic uppercase font-bold tracking-wider text-center py-8 bg-white/[0.02] rounded-xl border border-dashed border-white/10">
              None detected
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Gap <span className="text-[#bc13fe]">Matrix</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            Syllabus-aligned capability analysis
          </p>
        </div>
        <div className="glass-card py-2 px-4 flex items-center gap-2 shrink-0">
          <FiActivity className="text-[#00f3ff]" />
          <span className="text-sm font-black text-white">{stats.readiness_score || 0}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card bg-gradient-to-br from-[#bc13fe]/5 to-transparent border-white/10">
        <div className="flex flex-wrap justify-between items-end gap-2 mb-4">
          <div>
            <h3 className="text-xs font-black text-[#bc13fe] uppercase tracking-widest mb-1">Overall Coverage</h3>
            <p className="text-3xl font-black text-white">{stats.coverage_percentage || 0}%</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
            <p className="text-sm font-black text-[#00f3ff] uppercase tracking-wider italic">
              {stats.readiness_score > 70 ? 'Accelerated Path' : 'Standard Path'}
            </p>
          </div>
        </div>
        <div className="h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.coverage_percentage || 0}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#bc13fe] via-[#00f3ff] to-[#ff00e5] rounded-full"
          />
        </div>
      </div>

      {/* Three columns — responsive: 1 col on mobile, 3 on xl */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
        <Section skills={missingSkills} status="missing" count={missingSkills.length} />
        <Section skills={partialSkills} status="partial" count={partialSkills.length} />
        <Section skills={knownSkills}   status="known"   count={knownSkills.length} />
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-white/10 bg-white/[0.02]"
      >
        <h3 className="text-xs font-black text-[#00f3ff] uppercase tracking-[0.2em] mb-3">Strategic Assessment</h3>
        <p className="text-sm text-gray-300 leading-relaxed font-medium">
          Detection analysis identifies{' '}
          <span className="text-[#00f3ff] font-black">{stats.known_count}</span> verified competencies.
          To achieve 100% readiness, focus must be prioritized on the{' '}
          <span className="text-[#ff00e5] font-black">{stats.missing_count}</span> critical gaps and{' '}
          <span className="text-[#bc13fe] font-black">{stats.partial_count}</span> optimization points.
        </p>
      </motion.div>
    </div>
  )
}
