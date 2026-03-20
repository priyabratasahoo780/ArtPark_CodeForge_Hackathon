import React, { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBookOpen, FiZap, FiTarget, FiRefreshCcw, FiCheckCircle, FiInfo, FiActivity, FiAward } from 'react-icons/fi'
import LearningPath from './LearningPath'
import GapAnalysis from './GapAnalysis'
import ResumeFeedback from './ResumeFeedback'

const API_BASE_URL = 'http://localhost:8000'

const UserDashboard = ({ auth, analysisResults, onUpdateResults }) => {
  const [loading, setLoading] = useState(false)
  const [completedSkillNames, setCompletedSkillNames] = useState(new Set())
  const [message, setMessage] = useState(null)

  const handleToggleSkill = (skillName) => {
    const newCompleted = new Set(completedSkillNames)
    if (newCompleted.has(skillName)) {
      newCompleted.delete(skillName)
    } else {
      newCompleted.add(skillName)
    }
    setCompletedSkillNames(newCompleted)
  }

  const handleReevaluate = async () => {
    if (completedSkillNames.size === 0) {
      setMessage({ type: 'info', text: 'Select at least one skill to re-evaluate!' })
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const payload = {
        resume_text: analysisResults.skills_analysis.resume_skills.original_text || "", 
        job_description_text: analysisResults.skills_analysis.job_requirements.original_text || "",
        completed_skills: Array.from(completedSkillNames)
      }
      
      const resp = await axios.post(`${API_BASE_URL}/update-progress`, payload, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })

      onUpdateResults({
        ...analysisResults,
        gap_analysis: resp.data.updated_gap_analysis,
        learning_path: resp.data.updated_learning_path
      })
      
      setMessage({ type: 'success', text: resp.data.progress_summary.message })
      setCompletedSkillNames(new Set())
    } catch (err) {
      console.error('Error re-evaluating:', err)
      setMessage({ type: 'error', text: 'Recalculation failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (!analysisResults) return null;

  const stats = [
    { label: 'Neural Readiness', value: `${analysisResults.gap_analysis.statistics.readiness_score}%`, color: '#00f3ff', icon: FiActivity, delay: 0 },
    { label: 'Remaining Path',  value: analysisResults.learning_path.modules.length, color: '#bc13fe', icon: FiZap, delay: 0.1 },
    { label: 'Verified Nodes',  value: analysisResults.gap_analysis.statistics.known_count, color: '#ff00e5', icon: FiAward, delay: 0.2 },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            User <span className="text-[#00f3ff]">Command</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">Adaptive Talent Architecture</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReevaluate}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#bc13fe] to-[#8a11ea] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(188,19,254,0.2)] disabled:opacity-50 transition-all sm:self-center"
        >
          <FiRefreshCcw className={loading ? 'animate-spin' : ''} />
          {loading ? 'Processing...' : 'Recalculate Roadmap'}
        </motion.button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
              message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
              'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}
          >
            {message.type === 'success' ? <FiCheckCircle className="text-base" /> : <FiInfo className="text-base" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <stat.icon className="text-6xl" />
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="text-3xl font-black text-white">{stat.value}</div>
            <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: i === 0 ? `${analysisResults.gap_analysis.statistics.readiness_score}%` : '100%' }}
                 className="h-full"
                 style={{ background: stat.color }}
               />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid - No redundant .card wrappers */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        <div className="xl:col-span-8 flex flex-col gap-10 min-w-0">
          <div className="space-y-4">
             <div className="flex items-center gap-2 px-1">
                <FiZap className="text-[#00f3ff]" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Adaptive Neural Path</h3>
             </div>
             <LearningPath 
               data={analysisResults.learning_path} 
               onToggleSkill={handleToggleSkill}
               completedSkillNames={completedSkillNames}
             />
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-10 min-w-0">
          <div className="space-y-4">
             <div className="flex items-center gap-2 px-1">
                <FiTarget className="text-[#bc13fe]" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Critical Gap Nodes</h3>
             </div>
             <GapAnalysis data={analysisResults.gap_analysis} />
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2 px-1">
                <FiMessageSquare className="text-[#ff00e5]" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Strategic Advice</h3>
             </div>
             <ResumeFeedback feedback={analysisResults.resume_feedback} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
