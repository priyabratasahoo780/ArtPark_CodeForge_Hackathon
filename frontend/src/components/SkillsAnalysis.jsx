import React from 'react'
import { motion } from 'framer-motion'
import { FiTarget, FiZap, FiCpu, FiBarChart2 } from 'react-icons/fi'

export default function SkillsAnalysis({ data }) {
  const resumeSkills = data?.resume_skills?.skills || []
  const jobSkills = data?.job_requirements?.required_skills || []
  
  const resumeCategories = data?.resume_skills?.skill_categories || {}
  const jobCategories = data?.job_requirements?.skill_categories || {}

  const SkillSection = ({ title, categories, color, icon: Icon, alignment }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, x: alignment === 'left' ? -20 : 20 }}
      whileInView={{ opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex-1"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <div className="flex items-center gap-3 mb-8">
        <Icon className="text-2xl" style={{ color }} />
        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
          {title.split(' ')[0]} <span style={{ color }}>{title.split(' ')[1]}</span>
        </h2>
      </div>
      
      <div className="space-y-8">
        {Object.entries(categories).map(([category, skills], idx) => (
          <div key={category} className="group">
            <h3 className="text-xs font-black text-gray-500 mb-4 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }}></span>
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const skillData = resumeSkills.find(s => s.name === skill)
                return (
                  <span 
                    key={skill} 
                    className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all"
                    style={{ 
                      background: `${color}05`, 
                      borderColor: `${color}20`,
                      color: '#fff'
                    }}
                  >
                    {skill}
                    {skillData?.level && (
                      <span className="ml-2 font-bold opacity-30 text-[10px] border-l border-white/10 pl-2">
                        {skillData.level}
                      </span>
                    )}
                  </span>
                )
              })}
            </div>
          </div>
        ))}

        {Object.keys(categories).length === 0 && (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">No detailed categories found</p>
          </div>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-stretch">
        <SkillSection 
          title="Detected Competencies" 
          categories={resumeCategories} 
          color="#bc13fe" 
          icon={FiCpu} 
          alignment="left"
        />
        <SkillSection 
          title="Required Matrix" 
          categories={jobCategories} 
          color="#00f3ff" 
          icon={FiTarget} 
          alignment="right"
        />
      </div>

      {/* Detailed Table Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-white/10 bg-white/[0.01] overflow-hidden"
      >
        <div className="p-6 sm:p-8 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiBarChart2 className="text-2xl text-[#ff00e5]" />
            <h2 className="text-lg font-black text-white uppercase italic tracking-widest">Neural Breakdown <span className="text-[#ff00e5] ml-2 text-sm opacity-50">Analysis Grid</span></h2>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-500">
            Total Nodes: {resumeSkills.length}
          </div>
        </div>
        
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-white/5">Skill Identifier</th>
                <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-white/5 hidden sm:table-cell">Classification</th>
                <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-white/5">Confidence Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {resumeSkills.map((skill, idx) => (
                <tr key={idx} className="hover:bg-white/[0.03] transition-all group">
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#00f3ff] transition-colors">{skill.name}</div>
                    <div className="flex items-center gap-2 mt-1.5 sm:hidden">
                       <span className="text-[8px] font-bold text-[#bc13fe] uppercase tracking-widest px-2 py-0.5 bg-[#bc13fe]/10 rounded border border-[#bc13fe]/20">{skill.category}</span>
                       <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Level: {skill.level}</span>
                    </div>
                    <div className="text-[9px] font-bold text-[#bc13fe] uppercase tracking-widest mt-1 hidden sm:block opacity-60">Level Index: {skill.level}</div>
                  </td>
                  <td className="px-8 py-6 hidden sm:table-cell">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-white/5 py-1.5 px-4 rounded-xl border border-white/10 group-hover:border-[#bc13fe]/30 transition-all">
                        {skill.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-[100px] max-w-[200px] bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(skill.confidence || 0.9) * 100}%` }}
                          transition={{ duration: 1, delay: idx * 0.05 }}
                          className="bg-gradient-to-r from-[#bc13fe] via-[#00f3ff] to-[#ff00e5] h-full"
                        />
                      </div>
                      <span className="text-[10px] font-black text-[#00f3ff] mono whitespace-nowrap">
                        {Math.round((skill.confidence || 0.9) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {resumeSkills.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.3em]">No skill data indexed</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
