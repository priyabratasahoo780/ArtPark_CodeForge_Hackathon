import React, { useState } from 'react'
import { FiChevronDown, FiCheck, FiClock, FiBookOpen, FiZap, FiTarget, FiStar, FiMap, FiAward } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import DoubtModal from './DoubtModal'

export default function LearningPath({ data, onToggleSkill, completedSkillNames, onResourceClick, onExportLMS }) {
  const [expandedModule, setExpandedModule] = useState(null)
  const [internalCompleted, setInternalCompleted] = useState(new Set())

  const modules = data?.modules || []
  const timeline = data?.timeline || {}
  const strategies = data?.strategies || []

  const [activeDoubtSkill, setActiveDoubtSkill] = useState(null)

  // Use external state if provided, otherwise fallback to internal
  const isSkillCompleted = (module) => {
    if (completedSkillNames) return completedSkillNames.has(module.skill_name)
    return internalCompleted.has(module.id)
  }

  const toggleComplete = (module) => {
    if (onToggleSkill) {
      onToggleSkill(module.skill_name)
    } else {
      const newCompleted = new Set(internalCompleted)
      if (newCompleted.has(module.id)) {
        newCompleted.delete(module.id)
      } else {
        newCompleted.add(module.id)
      }
      setInternalCompleted(newCompleted)
    }
  }

  const completionCount = modules.filter(m => isSkillCompleted(m)).length
  const completionPercentage = modules.length > 0 ? Math.round((completionCount / modules.length) * 100) : 0

  return (
    <div className="space-y-8 pb-10">
      {/* Export Controls */}
      {onExportLMS && (
        <div className="flex justify-end">
          <button 
            onClick={onExportLMS}
            className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-[#00f3ff]/20 hover:border-[#00f3ff]/50 transition-all flex items-center gap-2"
          >
            <FiAward className="text-lg" /> Export to LMS (SCORM)
          </button>
        </div>
      )}

      {/* Header Info - Responsive grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Duration', value: `${timeline.estimated_weeks || 0}w`, icon: <FiClock />, color: '#00f3ff' },
          { label: 'Modules', value: modules.length, icon: <FiBookOpen />, color: '#bc13fe' },
          { label: 'Progress', value: `${completionPercentage}%`, icon: <FiZap />, color: '#ff00e5' },
          { label: 'Pace', value: timeline.pace || 'Self', icon: <FiTarget />, color: '#00f3ff' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card flex flex-col items-center justify-center p-3 sm:p-4 border border-white/5 text-center"
          >
            <div className="text-lg sm:text-xl mb-1.5" style={{ color: stat.color }}>{stat.icon}</div>
            <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{stat.label}</div>
            <div className="text-base sm:text-xl font-black text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Strategies Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-[#00f3ff] uppercase tracking-[0.25em] flex items-center gap-2">
          <FiStar className="shrink-0" /> Strategy Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategies.map((strategy, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 border-l-4"
              style={{ borderLeftColor: idx % 2 === 0 ? '#bc13fe' : '#00f3ff' }}
            >
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2">{strategy.name}</h4>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-3">{strategy.description}</p>
              <div className="text-[9px] font-black uppercase tracking-widest bg-white/5 py-1 px-2 rounded inline-block border border-white/5">
                <span className="opacity-50 mr-1">Vector:</span> {strategy.implementation}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pt-4">
        <h3 className="text-[10px] font-black text-[#bc13fe] uppercase tracking-[0.25em] mb-8 flex items-center gap-2">
          <FiMap className="text-[#bc13fe] shrink-0" /> Neural Roadmap 2026
        </h3>
        
        {/* Progress Line */}
        <div className="absolute left-[1.1rem] top-20 bottom-0 w-px bg-gradient-to-b from-[#bc13fe] via-[#00f3ff] to-transparent opacity-10 hidden sm:block"></div>

        <div className="space-y-6">
          {modules.map((module, i) => {
            const isCompleted = isSkillCompleted(module)
            const isExpanded = expandedModule === module.id
            
            return (
              <motion.div 
                key={module.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative sm:pl-12 group ${isCompleted ? 'opacity-50' : ''}`}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-0 top-3 w-4 h-4 rounded-full border-2 z-10 transition-all duration-500 hidden sm:block ${
                  isCompleted ? 'bg-[#00f3ff] border-[#00f3ff] shadow-[0_0_15px_#00f3ff]' : 'bg-[#0a0a0c] border-[#bc13fe] group-hover:border-[#00f3ff]'
                }`}></div>

                <div className={`rounded-2xl border border-white/10 bg-black/40 overflow-hidden transition-all duration-300 ${isExpanded ? 'border-[#bc13fe]/40' : 'hover:border-white/20'}`}>
                  <button 
                    type="button"
                    onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                    className="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative"
                  >
                    {/* Index background */}
                    <div className="text-4xl font-black text-white/[0.02] absolute top-1 right-1 sm:bottom-0 sm:right-4 select-none uppercase italic leading-none pointer-events-none">{module.order}</div>
                    
                    <div className="flex items-center gap-4 relative z-10 min-w-0">
                      <div 
                        onClick={(e) => { e.stopPropagation(); toggleComplete(module); }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-all cursor-pointer ${
                          isCompleted ? 'bg-[#00f3ff] border-[#00f3ff] text-[#0a0a0c]' : 'bg-white/5 border-white/10 text-gray-500 hover:border-[#00f3ff]'
                        }`}
                      >
                        {isCompleted ? <FiCheck className="text-lg font-bold" /> : <span className="text-xs font-black">{module.order}</span>}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-black text-white uppercase tracking-widest break-words leading-tight">{module.skill_name}</h4>
                        <div className="flex flex-wrap gap-2 mt-2 items-center">
                          <span className="text-[10px] font-black text-[#bc13fe] uppercase tracking-wider">{module.category}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{module.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 relative z-10 shrink-0">
                      <div className="text-left sm:text-right">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Estimated</p>
                        <p className="text-xs font-black text-[#00f3ff] flex items-center gap-1">
                          <FiClock className="text-[10px]" /> {module.time_estimate_hours}H
                        </p>
                      </div>
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                        <FiChevronDown className="text-gray-500" />
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white/[0.01]"
                      >
                        <div className="px-5 pb-6 pt-0 space-y-5 border-t border-white/5 mt-0">
                          {module.reason && (
                            <div className="bg-[#bc13fe]/5 border-l-2 border-[#bc13fe] p-4 rounded-r-xl mt-4">
                              <h5 className="text-[10px] font-black text-[#bc13fe] uppercase tracking-widest flex items-center gap-2 mb-2">
                                <FiAward className="text-sm" /> Rationale
                              </h5>
                              <p className="text-sm text-gray-300 font-medium leading-relaxed italic opacity-85">{module.reason}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <p className="text-[9px] font-black text-[#00f3ff] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[#00f3ff]"></span> Objectives
                              </p>
                              <ul className="space-y-2">
                                {module.learning_objectives?.map((obj, idx) => (
                                  <li key={idx} className="text-xs text-gray-400 font-medium flex gap-2 leading-relaxed">
                                    <span className="text-[#00f3ff] shrink-0">▹</span> {obj}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-4">
                              <p className="text-[9px] font-black text-[#bc13fe] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[#bc13fe]"></span> Resources
                              </p>
                              <div className="space-y-2.5">
                                {module.resources?.map((res, idx) => (
                                  <div 
                                    key={idx} 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onResourceClick) onResourceClick(res.type || 'article');
                                    }}
                                    className="bg-white/[0.03] border border-white/5 p-4 rounded-xl hover:border-white/20 transition-all cursor-pointer group/res"
                                  >
                                    <p className="text-xs font-black text-white uppercase group-hover/res:text-[#00f3ff] transition-colors tracking-wide">{res.title || res.name}</p>
                                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2">
                                      <span className="flex items-center gap-1.5"><FiBookOpen className="text-xs" /> {res.platform}</span>
                                      <span className="text-[#00f3ff] px-2.5 py-1 bg-[#00f3ff]/5 rounded-md border border-[#00f3ff]/10">{res.duration}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveDoubtSkill(module.skill_name)
                              }}
                              className="px-6 py-3 rounded-2xl bg-[#00f3ff]/10 border border-[#00f3ff]/20 text-[#00f3ff] text-[10px] font-black uppercase tracking-widest hover:bg-[#00f3ff]/20 transition-all flex items-center gap-2 shadow-lg shadow-[#00f3ff]/5"
                            >
                              <FiZap className="text-sm" /> Ask AI Doubt Solver
                            </button>
                            
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contextual Assistance Available</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      {/* Doubt Solver Modal */}
      <DoubtModal 
        skillName={activeDoubtSkill}
        isOpen={!!activeDoubtSkill}
        onClose={() => setActiveDoubtSkill(null)}
      />
    </div>
  )
}
