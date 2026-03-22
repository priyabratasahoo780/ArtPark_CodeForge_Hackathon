import React, { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBookOpen, FiZap, FiTarget, FiRefreshCcw, FiCheckCircle, FiInfo, FiActivity, FiAward, FiDownload, FiTrendingUp, FiMessageSquare } from 'react-icons/fi'
import LearningPath from './LearningPath'
import GapAnalysis from './GapAnalysis'
import ResumeFeedback from './ResumeFeedback'
import CareerPredictor from './CareerPredictor'
import MarketInsights from './MarketInsights'
import SkillHeatmap from './SkillHeatmap'


const API_BASE_URL = 'https://artpark-codeforge-hackathon.onrender.com'

const UserDashboard = ({ auth, analysisResults, onUpdateResults }) => {
  const [loading, setLoading] = useState(false)
  const [completedSkillNames, setCompletedSkillNames] = useState(new Set())
  const [message, setMessage] = useState(null)
  const [interactions, setInteractions] = useState({})
  const [engagementMetrics, setEngagementMetrics] = useState({
    force_burnout: false,
    recent_quiz_scores: [],
    modules_completed_today: 0,
    last_active_days: 0
  })

  const handleResourceClick = (type) => {
    if (!type) return;
    setInteractions(prev => ({
      ...prev,
      [type.toLowerCase()]: (prev[type.toLowerCase()] || 0) + 1
    }))
  }

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
        completed_skills: Array.from(completedSkillNames),
        interactions: interactions,
        engagement_metrics: engagementMetrics
      }
      
      const resp = await axios.post(`${API_BASE_URL}/update-progress`, payload, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })

      onUpdateResults({
        ...analysisResults,
        gap_analysis: resp.data.updated_gap_analysis,
        learning_path: resp.data.updated_learning_path,
        learning_style: resp.data.learning_style,
        burnout_status: resp.data.burnout_status
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

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadResume = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('https://artpark-codeforge-hackathon.onrender.com/resume/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_resume: analysisResults.resume_text || "Professional Talent Profile",
          completed_skills: analysisResults.gap_analysis.statistics.known_skills || [],
          goal: analysisResults.goal
        }),
      });
      
      const data = await response.json();
      if (data.enhanced_resume) {
        const blob = new Blob([data.enhanced_resume], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Enhanced_Professional_Resume.md';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const stats = [
    { label: 'Neural Readiness', value: `${analysisResults.gap_analysis.statistics.readiness_score}%`, color: '#00f3ff', icon: FiActivity, delay: 0 },
    { label: 'Learning Efficiency', value: `${analysisResults.efficiency_score || 0}%`, color: '#34d399', icon: FiTrendingUp, delay: 0.1 },
    { label: 'Remaining Path',  value: analysisResults.learning_path.modules.length, color: '#bc13fe', icon: FiZap, delay: 0.2 },
    { label: 'Verified Nodes',  value: analysisResults.gap_analysis.statistics.known_count, color: '#ff00e5', icon: FiAward, delay: 0.3 },
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
        <div className="flex gap-3 items-center sm:self-center flex-wrap justify-end">
          <button
            onClick={() => setEngagementMetrics(prev => ({ 
              ...prev, 
              force_struggle: !prev.force_struggle,
              quiz_scores: prev.force_struggle ? [75, 80] : [40, 45],
              days_inactive: prev.force_struggle ? 0 : 4
            }))}
            className={`px-3 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${engagementMetrics.force_struggle ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
            title="Toggle simulated user struggle"
          >
            {engagementMetrics.force_struggle ? 'Struggle On' : 'Simulate Struggle'}
          </button>
          
          <button
            onClick={() => setEngagementMetrics(prev => ({ 
              ...prev, 
              force_decay: !prev.force_decay
            }))}
            className={`px-3 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${engagementMetrics.force_decay ? 'bg-[#ff00e5]/20 border-[#ff00e5]/50 text-[#ff00e5]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
            title="Toggle simulated skill decay"
          >
            {engagementMetrics.force_decay ? 'Decay On' : 'Simulate Decay'}
          </button>

          <button
            onClick={() => setEngagementMetrics(prev => ({ ...prev, force_burnout: !prev.force_burnout }))}
            className={`px-3 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${engagementMetrics.force_burnout ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
            title="Toggle simulated user fatigue"
          >
            {engagementMetrics.force_burnout ? 'Burnout On' : 'Simulate Burnout'}
          </button>

          <button
            onClick={handleDownloadResume}
            disabled={isDownloading}
            className={`px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FiDownload />
            {isDownloading ? 'Generating...' : 'Download Enhanced Resume'}
          </button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReevaluate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#bc13fe] to-[#8a11ea] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(188,19,254,0.2)] disabled:opacity-50 transition-all"
          >
            <FiRefreshCcw className={loading ? 'animate-spin' : ''} />
            {loading ? 'Processing...' : 'Recalculate Roadmap'}
          </motion.button>
        </div>
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

      <AnimatePresence>
        {analysisResults.burnout_status?.burnout && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-[0_0_20px_rgba(255,165,0,0.1)]"
          >
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <FiInfo className="text-2xl" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-1">Fatigue Detected</h3>
              <p className="text-xs text-orange-200/70">{analysisResults.burnout_status.suggestion || "Take a break or switch topic"}</p>
              <div className="text-[10px] font-bold text-orange-400/50 mt-1">
                Roadmap nodes have been simplified to Beginner/Easy.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {analysisResults.doubt_status?.help_triggered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-[0_0_20px_rgba(79,70,229,0.1)]"
          >
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <FiInfo className="text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black uppercase tracking-widest mb-1">AI Tutor Alert: Concept Blockage Detected</h3>
              <p className="text-xs text-indigo-200/70">{analysisResults.doubt_status.suggestion || "Would you like some help with this concept?"}</p>
              <div className="text-[10px] font-bold text-indigo-400/50 mt-1">
                Triggered by: {analysisResults.doubt_status.reason}
              </div>
            </div>
            <button
               className="mt-2 sm:mt-0 px-4 py-2 bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-colors"
               onClick={() => alert("Initiating AI Tutor chat interface...")}
            >
               Get Help
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {analysisResults.decayed_skills && analysisResults.decayed_skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl border border-[#ff00e5]/30 bg-[#ff00e5]/10 text-[#ff00e5] shadow-[0_0_20px_rgba(255,0,229,0.1)] mb-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <FiZap className="text-xl" />
              <h3 className="text-sm font-black uppercase tracking-widest">Skill Decay Warning</h3>
            </div>
            <div className="flex gap-4 flex-wrap">
              {analysisResults.decayed_skills.map((skill, index) => (
                <div key={index} className="flex-1 min-w-[200px] border border-[#ff00e5]/20 bg-[#0a0a0c]/50 rounded-xl p-3 flex flex-col gap-1">
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-white">{skill?.skill}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 uppercase tracking-widest">{skill.status}</span>
                   </div>
                   <span className="text-[10px] text-gray-400 font-medium">Inactive for {skill.last_used_days} days. Confidence level dropped.</span>
                   <span className="text-[10px] text-[#ff00e5]/70 italic font-medium">{skill.suggestion}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
             <SkillHeatmap data={analysisResults.gap_analysis} />
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2 px-1">
                <FiZap className="text-[#00f3ff]" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Adaptive Neural Path</h3>
             </div>
             <LearningPath 
               data={analysisResults.learning_path} 
               onToggleSkill={handleToggleSkill}
               completedSkillNames={completedSkillNames}
               onResourceClick={handleResourceClick}
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
             <CareerPredictor 
               roadmapData={analysisResults.learning_path} 
               targetRole={analysisResults.target_role || "Software Engineer"} 
               auth={auth} 
             />
          </div>

          <div className="space-y-4">
             <MarketInsights insights={analysisResults.market_insights} />
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
