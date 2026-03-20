import React, { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBookOpen, FiZap, FiTarget, FiRefreshCcw, FiCheckCircle, FiInfo } from 'react-icons/fi'
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
      setMessage({ type: 'info', text: 'Mark some skills as completed first!' })
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

      // Update the main app results with the new data
      onUpdateResults({
        ...analysisResults,
        gap_analysis: resp.data.updated_gap_analysis,
        learning_path: resp.data.updated_learning_path
      })
      
      setMessage({ type: 'success', text: resp.data.progress_summary.message })
      setCompletedSkillNames(new Set()) // Reset local checkmarks as they are now "known" in the new analysis
    } catch (err) {
      console.error('Error re-evaluating:', err)
      setMessage({ type: 'error', text: 'Failed to update progress. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (!analysisResults) return null;

  return (
    <div className="space-y-10">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-wider">
            ⚡ My <span className="text-[#00f3ff]">Learning Hub</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">Adaptive roadmap based on your profile</p>
        </div>
        
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReevaluate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-[#bc13fe] hover:bg-[#a311db] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(188,19,254,0.3)] transition-all disabled:opacity-50"
          >
            <FiRefreshCcw className={loading ? 'animate-spin' : ''} />
            {loading ? 'Recalculating...' : 'Re-evaluate Roadmap'}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border text-xs font-bold font-mono flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
              message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
              'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}
          >
            {message.type === 'success' ? <FiCheckCircle /> : <FiInfo />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Target Readiness', value: `${analysisResults.gap_analysis.statistics.readiness_score}%`, sub: '↑ Optimized', color: 'var(--secondary-glow)', delay: 0 },
          { label: 'Skills to Master', value: analysisResults.learning_path.modules.length, sub: 'Modules Left', color: 'var(--primary-glow)', delay: 0.1 },
          { label: 'Knowledge Density', value: analysisResults.gap_analysis.statistics.known_count, sub: `Out of ${analysisResults.gap_analysis.statistics.total_required_skills} requirements`, color: 'var(--accent-color)', delay: 0.2 },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: stat.delay, duration: 0.5 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="glass-card p-6 border-l-4"
            style={{ 
              borderColor: stat.color,
              boxShadow: `0 0 15px ${stat.color}10`
            }}
          >
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-white">{stat.value}</span>
              <span className="text-xs font-bold mb-1" style={{ color: stat.color }}>{stat.sub}</span>
            </div>
            {stat.label === 'Target Readiness' && (
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${analysisResults.gap_analysis.statistics.readiness_score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[var(--secondary-glow)] to-[var(--primary-glow)] shadow-[0_0_10px_var(--secondary-glow)]"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Roadmap & Progress */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <FiZap className="text-[#00f3ff]" /> Your Personalized Roadmap
              </h3>
              <div className="text-[10px] font-black text-gray-500 uppercase flex gap-4">
                <span>{completedSkillNames.size} Marked for Re-evaluation</span>
              </div>
            </div>
            
            {/* We'll pass a wrapped LearningPath or just the data */}
            {/* Note: In a real app we might pass handleToggleSkill down, 
                but for simplicity we'll assume the user checks them in the UI */}
            <LearningPath 
              data={analysisResults.learning_path} 
              onToggleSkill={handleToggleSkill}
              completedSkillNames={completedSkillNames}
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="card">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-6">
              <FiTarget className="text-[#bc13fe]" /> Critical Gap Insights
            </h3>
            <GapAnalysis data={analysisResults.gap_analysis} />
          </div>

          <div className="card">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-6">
              <FiBookOpen className="text-[#ff00e5]" /> Profile Feedback
            </h3>
            <ResumeFeedback feedback={analysisResults.resume_feedback} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
