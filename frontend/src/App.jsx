import React, { useState, useEffect } from 'react'
import { 
  FiUpload, FiZap, FiTarget, FiActivity, FiAlertCircle, 
  FiMap, FiMessageSquare, FiDownload, FiLogOut, FiAward,
  FiRefreshCw, FiClock
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

// Components
import UploadSection from './components/UploadSection'
import GapAnalysis from './components/GapAnalysis'
import LearningPath from './components/LearningPath'
import SkillsAnalysis from './components/SkillsAnalysis'
import ResumeFeedback from './components/ResumeFeedback'
import VoiceExplain from './components/VoiceExplain'
import TimeSavedAnalytics from './components/TimeSavedAnalytics'
import HRDashboard from './components/HRDashboard'
import BenchmarkingUI from './components/CandidateBenchmark'
import Login from './components/Login'

// Protected Route Component
const ProtectedRoute = ({ children, auth, role }) => {
  if (!auth.token) return <Login onLogin={() => {}} />
  if (role && auth.role !== role) return <div className="p-10 text-center">Unauthorized</div>
  return children
}

const API_BASE_URL = 'http://localhost:8000'

const NavTab = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 whitespace-nowrap ${
      active 
        ? 'bg-gradient-to-r from-[#bc13fe] to-[#00f3ff] text-white shadow-[0_0_20px_rgba(0,243,255,0.4)] scale-105' 
        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
    }`}
  >
    <span className="text-base">{icon}</span>
    <span className="hidden md:block">{label}</span>
  </button>
)

function App() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescriptionText, setJobDescriptionText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Results
  const [analysisResults, setAnalysisResults] = useState(null)
  const [skillsAnalysis, setSkillsAnalysis] = useState(null)
  const [gapAnalysis, setGapAnalysis] = useState(null)
  const [learningPath, setLearningPath] = useState(null)
  const [reasoningTrace, setReasoningTrace] = useState(null)
  const [timeSavedData, setTimeSavedData] = useState(null)
  const [resumeFeedback, setResumeFeedback] = useState(null)
  
  const [activeTab, setActiveTab] = useState('upload')
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role') || 'USER'
  })
  const [syncStatus, setSyncStatus] = useState('idle') // idle, waiting, syncing

  // Persistence
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem('token', auth.token)
      localStorage.setItem('role', auth.role)
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
  }, [auth])

  // Debounced Auto-Trigger
  useEffect(() => {
    if (!resumeText || !jobDescriptionText || activeTab !== 'upload') return

    setSyncStatus('waiting')
    const timer = setTimeout(() => {
      setSyncStatus('syncing')
      handleAnalyze()
    }, 2000)

    return () => {
      clearTimeout(timer)
      setSyncStatus('idle')
    }
  }, [resumeText, jobDescriptionText])

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescriptionText) {
      setError('Please provide both resume and job description.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const config = {
        headers: { Authorization: `Bearer ${auth.token}` }
      }

      const response = await axios.post(`${API_BASE_URL}/onboarding/complete`, {
        resume_text: resumeText,
        job_description_text: jobDescriptionText,
      }, config)

      const data = response.data
      setAnalysisResults(data)
      setSkillsAnalysis({
        resume_skills: data.skills_analysis?.resume_skills,
        job_requirements: data.skills_analysis?.job_requirements
      })
      setGapAnalysis(data.gap_analysis)
      setLearningPath(data.learning_path)
      setReasoningTrace(data.reasoning_trace)
      setTimeSavedData(data.efficiency_metrics)
      setResumeFeedback(data.resume_feedback)
      
      setActiveTab('results')
    } catch (err) {
      console.error('Analysis error:', err)
      if (!err.response) {
        setError('Cannot reach backend server. Please ensure the backend is running on port 8000.')
      } else if (err.response.status === 401 || err.response.status === 403) {
        setError('Session expired. Please log out and log back in.')
      } else {
        setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
      }
    } finally {
      setLoading(false)
      setSyncStatus('idle')
    }
  }

  const handleReset = () => {
    setAnalysisResults(null)
    setSkillsAnalysis(null)
    setGapAnalysis(null)
    setLearningPath(null)
    setReasoningTrace(null)
    setTimeSavedData(null)
    setResumeFeedback(null)
    setError(null)
    setActiveTab('upload')
  }

  const handleDownloadResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      skills_analysis: skillsAnalysis,
      gap_analysis: gapAnalysis,
      learning_path: learningPath,
      reasoning_trace: reasoningTrace
    }
    const dataBlob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analysis-${new Date().getTime()}.json`
    link.click()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setAuth({ token: null, role: null })
    handleReset()
  }

  if (!auth.token) {
    return <Login onLogin={setAuth} />
  }

  return (
    <div className={`min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden relative ${auth.role === 'HR' ? 'role-hr' : 'role-user'}`}>
      {/* Background Decorative Blurs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#bc13fe]/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00f3ff]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/[0.02] backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveTab('upload')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#bc13fe] to-[#00f3ff] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(188,19,254,0.3)]">
                <FiZap className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-black text-white uppercase italic tracking-tighter shrink-0">
                CodeForge <span className="text-[#00f3ff]">Onboarding</span>
              </h1>
              {syncStatus !== 'idle' && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 ml-2">
                  <FiRefreshCw className={`text-[10px] text-[#00f3ff] ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                    {syncStatus === 'syncing' ? 'Syncing...' : 'Pending...'}
                  </span>
                </div>
              )}
            </motion.div>

            <div className="flex items-center gap-4 overflow-x-auto pb-1 sm:pb-0 no-scrollbar max-w-full">
              <div className="flex items-center gap-1.5 shrink-0">
                {auth.role === 'HR' && (
                  <>
                    <NavTab active={activeTab === 'hr_dashboard'} onClick={() => setActiveTab('hr_dashboard')} icon={<FiTarget />} label="HR Portal" />
                    <NavTab active={activeTab === 'benchmark'} onClick={() => setActiveTab('benchmark')} icon={<FiAward />} label="Benchmarker" />
                  </>
                )}
                
                {analysisResults && (
                  <>
                    <NavTab active={activeTab === 'results'} onClick={() => setActiveTab('results')} icon={<FiZap />} label="Results" />
                    <NavTab active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} icon={<FiActivity />} label="Skills" />
                    <NavTab active={activeTab === 'gaps'} onClick={() => setActiveTab('gaps')} icon={<FiAlertCircle />} label="Gaps" />
                    <NavTab active={activeTab === 'path'} onClick={() => setActiveTab('path')} icon={<FiMap />} label="Path" />
                    <NavTab active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} icon={<FiMessageSquare />} label="Advice" />
                  </>
                )}
                
                <NavTab active={activeTab === 'upload'} onClick={() => handleReset()} icon={<FiUpload />} label={analysisResults ? "New" : "Analyze"} />
              </div>

              <div className="h-6 w-px bg-white/15 mx-1 hidden sm:block"></div>
              
              <div className="flex gap-2">
                {analysisResults && (
                   <button onClick={handleDownloadResults} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#00f3ff] hover:bg-[#00f3ff]/10 hover:border-[#00f3ff]/20 transition-all shrink-0">
                     <FiDownload />
                   </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all shrink-0"
                  title="Logout"
                >
                  <FiLogOut />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative pb-20 overflow-y-auto">
          {error && (
            <div className="max-w-7xl mx-auto px-4 mt-8">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3"
              >
                <FiAlertCircle className="text-red-500 shrink-0 text-base" />
                <p className="text-sm text-red-100 font-medium">{error}</p>
                <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-400 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">Dismiss</button>
              </motion.div>
            </div>
          )}

          {auth.token && (
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${activeTab === 'upload' ? 'pt-12 sm:pt-20' : 'pt-8'}`}>
              <AnimatePresence mode="wait">
                {activeTab === 'hr_dashboard' && auth.role === 'HR' && (
                  <ProtectedRoute auth={auth} role="HR">
                    <motion.div key="hr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <HRDashboard auth={auth} />
                    </motion.div>
                  </ProtectedRoute>
                )}

                {activeTab === 'benchmark' && auth.role === 'HR' && (
                  <ProtectedRoute auth={auth} role="HR">
                    <motion.div key="bench" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <BenchmarkingUI auth={auth} />
                    </motion.div>
                  </ProtectedRoute>
                )}

                {(activeTab === 'upload' || (!analysisResults && activeTab !== 'benchmark' && activeTab !== 'hr_dashboard')) && (
                  <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <UploadSection
                      resumeText={resumeText}
                      jobDescriptionText={jobDescriptionText}
                      onResumeChange={setResumeText}
                      onJobDescriptionChange={setJobDescriptionText}
                      onAnalyze={handleAnalyze}
                      loading={loading}
                    />
                  </motion.div>
                )}

                {activeTab === 'results' && analysisResults && (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <VoiceExplain reasoningTrace={reasoningTrace} gapStats={gapAnalysis?.statistics} auth={auth} />
                      {timeSavedData && <TimeSavedAnalytics data={timeSavedData} />}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Known', value: gapAnalysis?.statistics?.known_count, color: '#00f3ff' },
                        { label: 'Partial', value: gapAnalysis?.statistics?.partial_count, color: '#bc13fe' },
                        { label: 'Missing', value: gapAnalysis?.statistics?.missing_count, color: '#ff00e5' },
                        { label: 'Readiness', value: `${gapAnalysis?.statistics?.readiness_score}%`, color: '#34d399' },
                      ].map((stat, i) => (
                        <div key={i} className="glass-card flex flex-col items-center py-8 border-b-2" style={{ borderColor: stat.color }}>
                          <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-2" style={{ color: stat.color }}>{stat.label}</span>
                          <span className="text-4xl font-black text-white">{stat.value || 0}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
                        <h3 className="text-sm font-black text-[#00f3ff] mb-8 uppercase tracking-widest flex items-center gap-2">
                           <FiActivity className="text-lg" /> Methodology & Detection Steps
                        </h3>
                        <div className="space-y-5">
                          {reasoningTrace?.steps?.map((step, idx) => (
                            <div key={idx} className="flex gap-4 items-start group">
                              <span className="text-[#bc13fe] text-xs font-black italic mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                              <p className="text-sm text-gray-400 font-medium leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#bc13fe]/10 to-transparent p-6 sm:p-8">
                        <h3 className="text-sm font-black text-[#bc13fe] mb-8 uppercase tracking-widest flex items-center gap-2">
                          <FiZap className="text-lg" /> Neural Insights
                        </h3>
                        <ul className="space-y-4">
                          {reasoningTrace?.key_insights?.map((insight, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex gap-3 leading-relaxed">
                              <span className="text-[#bc13fe] mt-1 shrink-0 font-bold">✦</span> {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'skills' && skillsAnalysis && (
                  <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SkillsAnalysis data={skillsAnalysis} />
                  </motion.div>
                )}
                {activeTab === 'gaps' && gapAnalysis && (
                  <motion.div key="gaps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <GapAnalysis data={gapAnalysis} />
                  </motion.div>
                )}
                {activeTab === 'path' && learningPath && (
                  <motion.div key="path" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <LearningPath data={learningPath} />
                  </motion.div>
                )}
                {activeTab === 'feedback' && resumeFeedback && (
                  <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ResumeFeedback feedback={resumeFeedback} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white/[0.02] border-t border-white/5 py-10 mt-auto shrink-0 relative z-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="w-12 h-1 bg-gradient-to-r from-[#bc13fe] to-[#00f3ff] rounded-full mx-auto mb-6 opacity-30"></div>
            <p className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500">
              CodeForge <span className="text-white">Laboratories</span> 2026
            </p>
            <p className="text-[8px] text-gray-700 mt-3 font-bold uppercase tracking-widest">ADVANCED NEURAL ARCHITECTURE FOR ADAPTIVE ONBOARDING</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
