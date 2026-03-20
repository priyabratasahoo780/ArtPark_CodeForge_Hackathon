import React, { useState } from 'react'
import { FiChevronDown, FiCheckCircle, FiAlertTriangle, FiXCircle, FiActivity, FiZap } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const STATUS = {
  known:   { color: '#00f3ff', dot: 'bg-[#00f3ff] shadow-[0_0_8px_#00f3ff]', label: 'Core Strengths',  Icon: FiCheckCircle },
  partial: { color: '#bc13fe', dot: 'bg-[#bc13fe] shadow-[0_0_8px_#bc13fe]', label: 'Growth Areas',    Icon: FiAlertTriangle },
  missing: { color: '#ff00e5', dot: 'bg-[#ff00e5] shadow-[0_0_8px_#ff00e5]', label: 'Critical Gaps',   Icon: FiXCircle },
}

function SkillCard({ skill, status, i, expanded, onToggle }) {
  const cfg = STATUS[status]
  const isOpen = expanded === skill.name

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04 }}
      className="rounded-xl border border-white/10 overflow-hidden transition-colors duration-200 hover:border-white/20"
      style={{ borderLeftWidth: 3, borderLeftColor: cfg.color, background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Click header */}
      <button
        type="button"
        onClick={() => onToggle(skill.name)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <cfg.Icon className="shrink-0 text-sm" style={{ color: cfg.color }} />
          <div className="min-w-0">
            <p className="text-sm font-black uppercase tracking-wider text-white break-words leading-tight">
              {skill.name}
            </p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 break-words">
              {skill.category}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {skill.gap_score != null && skill.gap_score > 0 && (
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded border whitespace-nowrap"
              style={{ color: cfg.color, borderColor: `${cfg.color}55` }}
            >
              {skill.gap_score}/3
            </span>
          )}
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <FiChevronDown className="text-gray-500 text-sm" />
          </motion.span>
        </div>
      </button>

      {/* Expanded body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-3">
              {skill.reason && (
                <p className="text-xs text-gray-400 leading-relaxed">
                  <span className="text-[#00f3ff] font-bold">Analysis: </span>
                  {skill.reason}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Your Level</p>
                  <p className="text-sm font-bold text-[#00f3ff]">{skill.resume_level || 'Not Found'}</p>
                </div>
                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Required</p>
                  <p className="text-sm font-bold text-[#bc13fe]">{skill.required_level || 'Expert'}</p>
                </div>
              </div>
              {skill.prerequisites?.length > 0 && (
                <div>
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Prerequisites</p>
                  <div className="flex flex-wrap gap-1">
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

function Column({ skills, status }) {
  const cfg = STATUS[status]
  const [expanded, setExpanded] = useState(null)
  const toggle = (name) => setExpanded(expanded === name ? null : name)

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 sticky top-0 z-10 bg-[#0a0a0c] py-1">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
        <h3 className="text-xs font-black text-white uppercase tracking-widest">
          {cfg.label} <span className="text-gray-500 ml-1">({skills.length})</span>
        </h3>
      </div>

      <div className="space-y-2">
        {skills.length === 0 ? (
          <div className="py-6 text-center rounded-xl border border-dashed border-white/10 bg-white/[0.015]">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">None Detected</p>
            {status === 'known' && (
              <p className="text-[9px] text-gray-700 mt-1">Run analysis to detect strengths</p>
            )}
          </div>
        ) : (
          skills.map((skill, i) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              status={status}
              i={i}
              expanded={expanded}
              onToggle={toggle}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default function GapAnalysis({ data }) {
  const knownSkills   = data?.known_skills   || []
  const partialSkills = data?.partial_skills || []
  const missingSkills = data?.missing_skills || []
  const stats = data?.statistics || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Gap <span className="text-[#bc13fe]">Matrix</span>
          </h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">
            Syllabus-aligned capability analysis
          </p>
        </div>
        <div className="glass-card py-2 px-4 flex items-center gap-2 shrink-0">
          <FiActivity className="text-[#00f3ff]" />
          <span className="text-sm font-black text-white">{stats.readiness_score || 0}%</span>
        </div>
      </div>

      {/* Progress */}
      <div className="card bg-gradient-to-br from-[#bc13fe]/5 to-transparent border-white/10">
        <div className="flex flex-wrap justify-between items-end gap-3 mb-4">
          <div>
            <p className="text-xs font-black text-[#bc13fe] uppercase tracking-widest mb-2">Overall Coverage</p>
            <p className="text-5xl font-black text-white">{stats.coverage_percentage || 0}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Path Status</p>
            <p className="text-base font-black text-[#00f3ff] uppercase tracking-wider italic flex items-center gap-2 justify-end">
              <FiZap className="text-lg" />
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
        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Critical Gaps', value: stats.missing_count ?? 0, color: '#ff00e5' },
            { label: 'Growth Areas',  value: stats.partial_count  ?? 0, color: '#bc13fe' },
            { label: 'Strengths',     value: stats.known_count    ?? 0, color: '#00f3ff' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center py-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest mt-2" style={{ color }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Three columns — items-start is CRITICAL so empty columns don't expand */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <Column skills={missingSkills} status="missing" />
        <Column skills={partialSkills} status="partial" />
        <Column skills={knownSkills}   status="known"   />
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-white/10 bg-white/[0.02]"
      >
        <h3 className="text-xs font-black text-[#00f3ff] uppercase tracking-[0.25em] mb-4">Strategic Assessment Intelligence</h3>
        <p className="text-sm text-gray-300 leading-relaxed font-medium">
          Detection analysis identifies{' '}
          <span className="text-[#00f3ff] font-black">{stats.known_count ?? 0}</span> verified competencies.
          To achieve 100% readiness, focus on{' '}
          <span className="text-[#ff00e5] font-black">{stats.missing_count ?? 0}</span> critical gaps and{' '}
          <span className="text-[#bc13fe] font-black">{stats.partial_count ?? 0}</span> growth areas.
        </p>
      </motion.div>
    </div>
  )
}
