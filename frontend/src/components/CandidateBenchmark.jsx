import React, { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUsers, FiPlus, FiTrash2, FiZap, FiAward, FiChevronDown, FiAlertCircle } from 'react-icons/fi'

const API_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:8000' : 'https://artpark-codeforge-hackathon.onrender.com'

const TIER_CONFIG = {
  'Strong Fit 🟢':      { color: '#00f3ff', label: 'Strong' },
  'Potential Fit 🟡':   { color: '#bc13fe', label: 'Potential' },
  'Moderate Gap 🟠':    { color: '#ff00e5', label: 'Gap' },
  'Significant Gap 🔴': { color: '#ff4b2b', label: 'Critical' },
}

const EMPTY_CANDIDATE = { name: '', resumeText: '' }

export default function CandidateBenchmark({ auth }) {
  const [jdText, setJdText] = useState('')
  const [candidates, setCandidates] = useState([
    { ...EMPTY_CANDIDATE, name: 'Candidate Alpha' },
    { ...EMPTY_CANDIDATE, name: 'Candidate Beta' },
  ])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSyncing, setIsSyncing] = useState(false)

  const addCandidate = () => {
    if (candidates.length >= 10) return
    setCandidates(prev => [...prev, { name: `Candidate ${String.fromCharCode(65 + prev.length)}`, resumeText: '' }])
  }

  const handleBenchmark = async () => {
    if (!jdText.trim()) { setError('Target architecture metrics required.'); return }
    const valid = candidates.filter(c => c.resumeText.trim().length >= 10)
    if (valid.length < 2) { setError('Minimum 2 neural profiles required for benchmarking.'); return }

    setLoading(true); setError(null); setResults(null)
    try {
      const resp = await axios.post(`${API_BASE_URL}/benchmark/candidates`, {
        job_description_text: jdText,
        candidates: valid.map(c => ({ name: c.name || 'Unknown Unit', resume_text: c.resumeText })),
      }, { timeout: 30000 })
      setResults(resp.data)
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach backend server. Please ensure it is running on port 8000.')
      } else {
        setError(err.response?.data?.detail || 'Benchmarking failed. Please try again.')
      }
    } finally {
      setLoading(false)
      setIsSyncing(false)
    }
  }

  // Live Auto-Benchmark
  React.useEffect(() => {
    const valid = candidates.filter(c => c.resumeText.trim().length >= 10)
    if (!jdText.trim() || valid.length < 2) return

    setIsSyncing(true)
    const timer = setTimeout(() => {
      handleBenchmark()
    }, 2500) // Slightly longer debounce for heavy benchmarking

    return () => clearTimeout(timer)
  }, [jdText, candidates])

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* JD Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FiZap className="text-[#00f3ff]" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Target Metrics</h3>
          </div>
          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Paste Job Description..."
            className="w-full h-48 p-4 bg-white/[0.02] border border-white/10 rounded-2xl focus:border-[#00f3ff] focus:outline-none text-xs text-gray-400 font-medium resize-none shadow-inner transition-all"
          />
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
            <FiAlertCircle /> {error}
          </div>}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,243,255,0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBenchmark}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#00f3ff] to-[#00a8ff] text-[#0a0a0c] font-black rounded-2xl uppercase tracking-[0.2em] text-xs shadow-lg disabled:opacity-30 transition-all flex items-center justify-center gap-2"
          >
            {loading || isSyncing ? <FiZap className="animate-spin" /> : <FiAward />}
            {loading || isSyncing ? 'Synchronizing Profiles...' : 'Execute Benchmark'}
          </motion.button>
        </motion.div>

        {/* Candidate List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FiUsers className="text-[#bc13fe]" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neural Profiles ({candidates.length})</h3>
            </div>
            <button onClick={addCandidate} className="text-[9px] font-black text-[#bc13fe] uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors">
              <FiPlus /> Add Unit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {candidates.map((c, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="glass-card border-white/5 bg-white/[0.01] hover:bg-white/[0.03] p-4 group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={c.name}
                      onChange={e => {
                        const newC = [...candidates]; newC[idx].name = e.target.value; setCandidates(newC);
                      }}
                      className="flex-1 bg-transparent border-none text-[10px] font-black text-white uppercase tracking-widest focus:ring-0 p-0 placeholder:text-gray-700"
                    />
                    {candidates.length > 2 && (
                      <button onClick={() => setCandidates(candidates.filter((_, i) => i !== idx))} className="text-gray-600 hover:text-red-500 transition-colors">
                        <FiTrash2 size={12} />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={c.resumeText}
                    onChange={e => {
                      const newC = [...candidates]; newC[idx].resumeText = e.target.value; setCandidates(newC);
                    }}
                    placeholder="Paste resume content..."
                    className="w-full h-24 bg-transparent border-none text-[10px] text-gray-500 font-medium resize-none focus:ring-0 p-0 scrollbar-hide"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Units', value: results.summary.total_candidates, color: '#bc13fe' },
                    { label: 'Strong Fits', value: results.summary.strong_fits, color: '#00f3ff' },
                    { label: 'Avg Grade', value: results.summary.avg_composite_score, color: '#ff00e5' },
                    { label: 'JD Indices', value: results.summary.total_required_skills, color: '#00f3ff' },
                ].map((s, i) => (
                    <div key={i} className="glass-card flex flex-col items-center py-6 border-b-2" style={{ borderBottomColor: s.color }}>
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{s.label}</span>
                        <span className="text-2xl font-black text-white">{s.value}</span>
                    </div>
                ))}
            </div>

            {/* Rankings */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-[#00f3ff] uppercase tracking-[0.3em] ml-1">Ranked Matrix</h3>
              <div className="grid grid-cols-1 gap-4">
                {results.ranked_candidates.map((c, i) => {
                  const config = TIER_CONFIG[c.recommendation] || { color: '#ffffff' }
                  return (
                    <motion.div 
                      key={c.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card group border-white/5 hover:border-white/20 p-5 flex flex-col md:flex-row md:items-center gap-6"
                    >
                      <div className="flex items-center gap-6 flex-1">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg italic shadow-lg ${
                           c.rank === 1 ? 'bg-gradient-to-br from-[#00f3ff] to-[#bc13fe] text-white' : 'bg-white/5 text-gray-500'
                        }`}>
                            {c.rank}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{c.name}</h4>
                            <span className="text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest" style={{ color: config.color, borderColor: `${config.color}44` }}>
                                {c.recommendation}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${c.composite_score}%` }}
                                    className="h-full" 
                                    style={{ backgroundColor: config.color }} 
                                />
                            </div>
                            <span className="text-[10px] font-black text-white mono w-12 text-right">{c.composite_score}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 border-l border-white/5 pl-6">
                        <div className="text-center">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Match</p>
                            <p className="text-xs font-black text-white">{c.skill_match_pct}%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Readiness</p>
                            <p className="text-xs font-black text-[#00f3ff]">{c.readiness_score}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
