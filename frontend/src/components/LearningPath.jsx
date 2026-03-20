import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiCheck, FiClock, FiBookOpen, FiZap, FiTarget, FiStar } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function LearningPath({ data }) {
  const [expandedModule, setExpandedModule] = useState(null)
  const [completedModules, setCompletedModules] = useState(new Set())

  const modules = data?.modules || []
  const timeline = data?.timeline || {}
  const milestones = data?.milestones || []
  const strategies = data?.strategies || []

  const toggleComplete = (moduleId) => {
    const newCompleted = new Set(completedModules)
    if (newCompleted.has(moduleId)) {
      newCompleted.delete(moduleId)
    } else {
      newCompleted.add(moduleId)
    }
    setCompletedModules(newCompleted)
  }

  const completionPercentage = Math.round((completedModules.size / modules.length) * 100)

  return (
    <div className="space-y-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Duration', value: `${timeline.estimated_weeks || 0}w`, icon: <FiClock />, color: '#00f3ff' },
            { label: 'Modules', value: modules.length, icon: <FiBookOpen />, color: '#bc13fe' },
            { label: 'Progress', value: `${completionPercentage}%`, icon: <FiZap />, color: '#ff00e5' },
            { label: 'Pace', value: timeline.pace || 'Self', icon: <FiTarget />, color: '#00f3ff' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card flex flex-col items-center justify-center p-4 border border-white/5"
            >
              <div className="text-xl mb-2" style={{ color: stat.color }}>{stat.icon}</div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{stat.label}</div>
              <div className="text-xl font-black text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Strategies Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-[#00f3ff] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <FiStar /> Learning Strategies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strategy, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="glass-card border-l-2 border-[#bc13fe] bg-[#bc13fe]/5"
            >
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-2">{strategy.name}</h4>
              <p className="text-xs text-gray-400 font-medium leading-relaxed mb-3">{strategy.description}</p>
              <div className="text-[10px] font-black text-[#bc13fe] uppercase tracking-widest bg-[#bc13fe]/10 py-1 px-2 rounded inline-block">
                Action: {strategy.implementation}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        <h3 className="text-xs font-black text-[#bc13fe] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
          <FiMap className="text-[#bc13fe]" /> Adaptive Roadmap
        </h3>
        
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-[#bc13fe] via-[#00f3ff] to-[#ff00e5] opacity-20 hidden md:block"></div>

        <div className="space-y-8">
          {modules.map((module, i) => {
            const isCompleted = completedModules.has(module.id)
            const isExpanded = expandedModule === module.id
            
            return (
              <motion.div 
                key={module.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative md:pl-16 group ${isCompleted ? 'opacity-60' : ''}`}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-4 md:left-[1.35rem] top-0 w-4 h-4 rounded-full border-2 z-10 transition-all duration-500 ${
                  isCompleted ? 'bg-[#00f3ff] border-[#00f3ff] shadow-[0_0_15px_#00f3ff]' : 'bg-[#0a0a0c] border-[#bc13fe] group-hover:border-[#00f3ff]'
                }`}></div>

                <div className={`glass-card transition-all duration-300 ${isExpanded ? 'border-[#bc13fe]/50' : 'hover:border-white/20'}`}>
                  <div 
                    onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-black text-white/5 absolute -top-4 -right-2 select-none group-hover:text-[#bc13fe]/10 transition-colors uppercase italic">{module.order}</div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleComplete(module.id); }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                          isCompleted ? 'bg-[#00f3ff] border-[#00f3ff] text-[#0a0a0c]' : 'bg-white/5 border-white/10 text-gray-400 group-hover:border-[#00f3ff]/50'
                        }`}
                      >
                        {isCompleted ? <FiCheck className="font-bold" /> : <span className="text-[10px] font-black">{module.order}</span>}
                      </button>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider group-hover:glow-text-cyan transition-all">{module.skill_name}</h4>
                        <p className="text-[10px] font-bold text-[#bc13fe] uppercase tracking-widest">{module.category} • {module.difficulty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Est. Effort</p>
                        <p className="text-xs font-black text-white">{module.time_estimate_hours}H</p>
                      </div>
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
                        <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
                          <div>
                            <p className="text-[9px] font-black text-[#bc13fe] uppercase tracking-widest mb-2">Learning Objectives</p>
                            <ul className="space-y-2">
                              {module.learning_objectives?.map((obj, idx) => (
                                <li key={idx} className="text-xs text-gray-400 font-medium flex gap-2">
                                  <span className="text-[#00f3ff]">▹</span> {obj}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {module.resources && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {module.resources.map((res, idx) => (
                                <div key={idx} className="bg-white/[0.02] border border-white/5 p-3 rounded-xl hover:bg-white/[0.04] transition-colors">
                                  <p className="text-[10px] font-black text-white uppercase mb-1">{res.name}</p>
                                  <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                    <span>{res.platform}</span>
                                    <span className="text-[#00f3ff] px-1.5 py-0.5 bg-[#00f3ff]/10 rounded">{res.duration}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
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
    </div>
  )
}
