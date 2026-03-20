import React from 'react'
import { motion } from 'framer-motion'
import { FiTarget, FiZap, FiCpu } from 'react-icons/fi'

export default function SkillsAnalysis({ data }) {
  const resumeSkills = data?.resume_skills?.skills || []
  const jobSkills = data?.job_requirements?.required_skills || []
  
  const resumeCategories = data?.resume_skills?.skill_categories || {}
  const jobCategories = data?.job_requirements?.skill_categories || {}

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resume Skills */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border-[#bc13fe]/20 bg-[#bc13fe]/5"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiCpu className="text-xl text-[#bc13fe]" />
            <h2 className="text-lg font-black text-white uppercase italic tracking-wider">Detected <span className="text-[#bc13fe]">Competencies</span></h2>
          </div>
          
          <div className="space-y-6">
            {Object.entries(resumeCategories).map(([category, skills], idx) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-[10px] font-black text-gray-500 mb-3 uppercase tracking-[0.2em] border-b border-white/5 pb-1">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => {
                    const skillData = resumeSkills.find(s => s.name === skill)
                    return (
                      <span key={skill} className="skill-badge known border-[#00f3ff]/30 text-[10px]">
                        {skill}
                        {skillData?.level && <span className="ml-1 opacity-60">[{skillData.level}]</span>}
                      </span>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Job Required Skills */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card border-[#00f3ff]/20 bg-[#00f3ff]/5"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiTarget className="text-xl text-[#00f3ff]" />
            <h2 className="text-lg font-black text-white uppercase italic tracking-wider">Required <span className="text-[#00f3ff]">Matrix</span></h2>
          </div>

          <div className="space-y-6">
            {Object.entries(jobCategories).map(([category, skills], idx) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-[10px] font-black text-gray-500 mb-3 uppercase tracking-[0.2em] border-b border-white/5 pb-1">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="skill-badge border-white/10 text-gray-400 text-[10px]">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detailed Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card border-white/10 overflow-hidden p-0"
      >
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <FiZap className="text-[#ff00e5]" />
          <h2 className="text-lg font-black text-white uppercase italic tracking-widest">Neural Breakdown</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Skill Index</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Classification</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Confidence Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {resumeSkills.map((skill, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-white uppercase tracking-tight group-hover:glow-text-cyan transition-all">{skill.name}</div>
                    <div className="text-[9px] font-bold text-[#bc13fe] uppercase tracking-widest mt-1 opacity-60">Level: {skill.level}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full border border-white/10">
                        {skill.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(skill.confidence || 0.9) * 100}%` }}
                          className="bg-gradient-to-r from-[#bc13fe] to-[#00f3ff] h-full"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#00f3ff] mono">
                        {Math.round((skill.confidence || 0.9) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
