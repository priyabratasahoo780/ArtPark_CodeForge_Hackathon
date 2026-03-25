import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUsers, FiBarChart2, FiClock, FiCheckCircle, FiPlus, FiTrash2, FiSearch } from 'react-icons/fi'
import AnalyticsPanel from './AnalyticsPanel'

const API_BASE_URL = 'http://127.0.0.1:8000'

const HRDashboard = ({ auth }) => {
  const [metrics, setMetrics] = useState(null)
  const [resumes, setResumes] = useState([{ id: 1, text: '', name: '' }])
  const [jobDescription, setJobDescription] = useState('')
  const [analysisResults, setAnalysisResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    fetchMetrics()
    
    // Live Polling every 30 seconds
    const interval = setInterval(() => {
      setIsSyncing(true)
      fetchMetrics()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/hr/metrics`, {
        headers: { 'Authorization': `Bearer ${auth?.token}` }
      })
      setMetrics(resp.data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching metrics:', err)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleAddResume = () => {
    setResumes([...resumes, { id: Date.now(), text: '', name: '' }])
  }

  const handleRemoveResume = (id) => {
    if (resumes.length > 1) {
      setResumes(resumes.filter(r => r.id !== id))
    }
  }

  const handleResumeChange = (id, field, value) => {
    setResumes(resumes.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const handleAnalyzeAll = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description')
      return
    }
    const validResumes = resumes.filter(r => r.text.trim())
    if (validResumes.length === 0) {
      setError('Please provide at least one resume')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const payload = {
        resumes: validResumes.map(r => r.text),
        candidate_names: validResumes.map(r => r.name || `Candidate ${r.id}`),
        job_description_text: jobDescription
      }
      const resp = await axios.post(`${API_BASE_URL}/hr/analyze-multiple`, payload, {
        headers: { 'Authorization': `Bearer ${auth?.token}` }
      })
      setAnalysisResults(resp.data)
      // Refresh metrics after analysis
      fetchMetrics()
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach backend. Please ensure the server is running.')
      } else {
        setError(err.response?.data?.detail || err.message || 'Error analyzing resumes')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-wider">
            🏢 HR <span className="text-[#bc13fe]">Command Center</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">Multi-candidate analysis & recruitment metrics</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <FiClock className={`text-[10px] ${isSyncing ? 'text-[#bc13fe] animate-spin' : 'text-gray-500'}`} />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">
              Live Sync: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setShowAnalytics(false)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!showAnalytics ? 'bg-[#bc13fe] text-white shadow-lg shadow-[#bc13fe]/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Pipeline
            </button>
            <button 
              onClick={() => setShowAnalytics(true)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${showAnalytics ? 'bg-[#ff00e5] text-white shadow-lg shadow-[#ff00e5]/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Analytics
            </button>
          </div>
          <p className="text-[10px] font-black uppercase text-[#bc13fe] tracking-tighter glow-text-purple">Security Level: HR Admin</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showAnalytics ? (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AnalyticsPanel auth={auth} />
          </motion.div>
        ) : (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Candidates', value: metrics?.total_candidates || '0', icon: <FiUsers />, color: 'var(--secondary-glow)' },
          { label: 'Avg Readiness', value: `${metrics?.avg_readiness_score || '0'}%`, icon: <FiBarChart2 />, color: 'var(--primary-glow)' },
          { label: 'Time Saved (hrs)', value: metrics?.total_time_saved_hours || '0', icon: <FiClock />, color: 'var(--secondary-glow)' },
          { label: 'Active Pipelines', value: '12', icon: <FiCheckCircle />, color: 'var(--accent-color)' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="glass-card p-6 border-l-4"
            style={{ borderColor: stat.color }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-white/5" style={{ color: stat.color }}>{stat.icon}</div>
              <span className="text-2xl font-black text-white tracking-tight">{stat.value}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="card space-y-6">
          <h3 className="text-sm font-black text-[#00f3ff] uppercase tracking-widest flex items-center gap-2">
            <FiPlus /> Bulk Analysis Pipeline
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Job Description</label>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste JD requirements here..."
                className="w-full h-32 bg-[#0a0a0c]/50 border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-300 focus:border-[#00f3ff] transition-all resize-none"
              />
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate Resumes</label>
              {resumes.map((resume, idx) => (
                <div key={resume.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 relative group">
                  <button 
                    onClick={() => handleRemoveResume(resume.id)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <FiTrash2 />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Candidate Name"
                    value={resume.name}
                    onChange={(e) => handleResumeChange(resume.id, 'name', e.target.value)}
                    className="w-full bg-transparent border-b border-white/5 py-1 text-xs font-bold text-white focus:border-[#bc13fe] outline-none"
                  />
                  <textarea 
                    placeholder="Paste resume text..."
                    value={resume.text}
                    onChange={(e) => handleResumeChange(resume.id, 'text', e.target.value)}
                    className="w-full h-24 bg-[#0a0a0c]/30 border border-white/5 rounded-lg p-2 text-[10px] font-mono text-gray-400 focus:border-[#bc13fe] transition-all resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAddResume}
                className="flex-1 py-3 border border-dashed border-white/20 rounded-xl text-xs font-bold text-gray-400 hover:border-[#bc13fe] hover:text-[#bc13fe] transition-all flex items-center justify-center gap-2"
              >
                <FiPlus /> Add Candidate
              </button>
              <button 
                onClick={handleAnalyzeAll}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-[#00f3ff] to-[#00a3ff] rounded-xl text-xs font-black text-[#0a0a0c] uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,255,0.3)] disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Run Neural Ranker'}
              </button>
            </div>
            {error && <p className="text-red-500 text-[10px] text-center font-bold font-mono">{error}</p>}
          </div>
        </div>

        {/* Results / Ranking */}
        <div className="card flex flex-col">
          <h3 className="text-sm font-black text-[#bc13fe] uppercase tracking-widest flex items-center gap-2 mb-6">
            <FiSearch /> Candidate Ranking
          </h3>

          {!analysisResults ? (
            <div className="flex-grow flex flex-col items-center justify-center opacity-30 italic text-sm">
              <FiBarChart2 className="text-4xl mb-4" />
              Waiting for analysis input...
            </div>
          ) : (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Rank</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Name</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Readiness</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Key Gaps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResults.candidates.map((candidate, idx) => (
                      <tr key={idx} className="border-b border-white/5 group hover:bg-white/[0.01] transition-colors">
                        <td className="py-4">
                          <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black ${
                            idx === 0 ? 'bg-[#ff00e5] text-white' : 'bg-white/5 text-gray-500'
                          }`}>
                            #{idx + 1}
                          </span>
                        </td>
                        <td className="py-4">
                          <p className="text-xs font-black text-white mb-0.5">{candidate.name}</p>
                          <p className="text-[10px] text-[#00f3ff] font-bold">{candidate.skills_match} Skills Matched</p>
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10">
                            <span className="text-xs font-mono font-black text-white">{candidate.readiness_score}%</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-1 flex-wrap">
                            {candidate.missing_skills.map((skill, si) => (
                              <span key={si} className="text-[9px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-[#bc13fe]/5 rounded-2xl border border-[#bc13fe]/20">
                <h4 className="text-[10px] font-black text-[#bc13fe] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FiClock /> Recruitment Efficiency
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-medium">Total Predicted Training Time Saved</span>
                  <span className="text-2xl font-black text-white tracking-tight">{analysisResults.metrics.total_time_saved.toFixed(1)} <span className="text-xs font-bold text-gray-500 uppercase ml-1">Hours</span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HRDashboard
