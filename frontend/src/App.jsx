import React, { useState } from 'react'
import axios from 'axios'
import { FiUpload, FiRefreshCw, FiDownload, FiZap, FiTarget, FiAlertCircle, FiMessageSquare, FiMap, FiAward } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import UploadSection from './components/UploadSection'
import SkillsAnalysis from './components/SkillsAnalysis'
import GapAnalysis from './components/GapAnalysis'
import LearningPath from './components/LearningPath'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorAlert from './components/ErrorAlert'
import VoiceExplain from './components/VoiceExplain'
import TimeSavedAnalytics from './components/TimeSavedAnalytics'
import CandidateBenchmark from './components/CandidateBenchmark'
import ResumeFeedback from './components/ResumeFeedback'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import HRDashboard from './components/HRDashboard'
import UserDashboard from './components/UserDashboard'
import './index.css'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescriptionText, setJobDescriptionText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('upload')
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role')
  })
  
  // Analysis results
  const [analysisResults, setAnalysisResults] = useState(null)
  const [skillsAnalysis, setSkillsAnalysis] = useState(null)
  const [gapAnalysis, setGapAnalysis] = useState(null)
  const [learningPath, setLearningPath] = useState(null)
  const [reasoningTrace, setReasoningTrace] = useState(null)
  const [timeSavedData, setTimeSavedData] = useState(null)
  const [resumeFeedback, setResumeFeedback] = useState(null)

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) {
      setError('Please provide both resume and job description')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/onboarding/complete`, {
        resume_text: resumeText,
        job_description_text: jobDescriptionText
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      })

      setAnalysisResults(response.data)
      setSkillsAnalysis(response.data.skills_analysis)
      setGapAnalysis(response.data.gap_analysis)
      setLearningPath(response.data.learning_path)
      setReasoningTrace(response.data.reasoning_trace)
      setResumeFeedback(response.data.resume_feedback)
      
      if (auth.role === 'USER') {
        setActiveTab('user_dashboard')
      } else {
        setActiveTab('results')
      }

      try {
        const tsResp = await axios.post(`${API_BASE_URL}/analytics/time-saved`, {
          gap_analysis: response.data.gap_analysis,
          learning_path: response.data.learning_path,
        }, {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        })
        setTimeSavedData(tsResp.data)
      } catch (_) {}
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err.response?.data?.detail || err.message || 'Error analyzing documents.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResumeText('')
    setJobDescriptionText('')
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
    <div className="min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden relative">
      {/* Background Decorative Blurs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#bc13fe]/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00f3ff]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/[0.02] backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#bc13fe] to-[#00f3ff] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(188,19,254,0.4)]">
                <FiZap className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white uppercase italic leading-none">
                  CodeForge <span className="text-[#00f3ff]">Onboarding</span>
                </h1>
                <p className="text-[#bc13fe] text-[10px] font-bold uppercase tracking-[0.2em] glow-text-purple mt-1">AI-Adaptive Engine 2026</p>
              </div>
            </motion.div>

            {analysisResults && (
              <div className="flex gap-3">
                <button onClick={handleDownloadResults} className="btn-secondary py-2 px-4 text-xs">
                  <FiDownload className="inline mr-2" /> Export
                </button>
                <button onClick={handleReset} className="btn-secondary py-2 px-4 text-xs">
                  <FiRefreshCw className="inline mr-2" /> Reset
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-4 ml-auto lg:ml-6 pl-6 border-l border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00f3ff] bg-[#00f3ff]/10 px-2 py-1 rounded">
                Role: {auth.role}
              </span>
              <button onClick={handleLogout} className="text-xs font-bold text-gray-400 hover:text-white transition-colors">
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
          {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <LoadingSpinner />
              <p className="mt-4 text-[#00f3ff] font-bold animate-pulse uppercase tracking-widest text-xs">Analyzing Architecture...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Navigation Tabs */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 flex-wrap bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm self-start inline-flex"
              >
                {[
                  ...(auth.role === 'HR' ? [
                    { id: 'hr_dashboard', label: 'HR Dashboard', icon: <FiAward /> },
                    { id: 'benchmark', label: 'Candidate Rank', icon: <FiAward /> }
                  ] : []),
                  ...(auth.role === 'USER' && analysisResults ? [{ id: 'user_dashboard', label: 'My Roadmap', icon: <FiAward /> }] : []),
                  ...(analysisResults ? [
                    { id: 'upload', label: 'Input', icon: <FiUpload /> },
                    { id: 'results', label: 'Overview', icon: <FiZap /> },
                    { id: 'skills', label: 'Skills', icon: <FiTarget /> },
                    { id: 'gaps', label: 'Gaps', icon: <FiAlertCircle /> },
                    { id: 'feedback', label: 'Feedback', icon: <FiMessageSquare /> },
                    { id: 'path', label: 'Roadmap', icon: <FiMap /> },
                  ] : [])
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#bc13fe] to-[#8a2be2] text-white shadow-[0_0_15px_rgba(188,19,254,0.4)] scale-105'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </motion.div>

              {/* Dynamic Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'user_dashboard' && auth.role === 'USER' && analysisResults && (
                  <motion.div 
                    key="user_dashboard"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  >
                    <UserDashboard 
                      auth={auth} 
                      analysisResults={analysisResults} 
                      onUpdateResults={setAnalysisResults} 
                    />
                  </motion.div>
                )}

                {activeTab === 'hr_dashboard' && auth.role === 'HR' && (
                  <ProtectedRoute allowedRoles={['HR']} auth={auth}>
                    <motion.div 
                      key="hr_dashboard"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    >
                      <HRDashboard auth={auth} />
                    </motion.div>
                  </ProtectedRoute>
                )}

                {activeTab === 'benchmark' && (
                  <ProtectedRoute allowedRoles={['HR']} auth={auth}>
                    <motion.div 
                      key="benchmark"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                      className="card"
                    >
                      <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-wider">
                        🏆 Candidate <span className="text-[#00f3ff]">Benchmark</span>
                      </h2>
                      <p className="text-sm text-gray-400 mb-8 border-l-2 border-[#00f3ff] pl-4">Multi-candidate ranking & comparison</p>
                      <CandidateBenchmark />
                    </motion.div>
                  </ProtectedRoute>
                )}

                {(activeTab === 'upload' || (!analysisResults && activeTab !== 'benchmark')) && (
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
                        { label: 'Readiness', value: `${gapAnalysis?.statistics?.readiness_score}%`, color: '#00f3ff' },
                      ].map((stat, i) => (
                        <div key={i} className="glass-card flex flex-col items-center py-6 border-b-2" style={{ borderColor: stat.color }}>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1" style={{ color: stat.color }}>{stat.label}</span>
                          <span className="text-3xl font-black text-white">{stat.value || 0}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 card">
                        <h3 className="text-sm font-black text-[#00f3ff] mb-4 uppercase tracking-widest">📋 Methodology & Steps</h3>
                        <div className="space-y-4">
                          {reasoningTrace?.steps?.map((step, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <span className="text-[#bc13fe] mt-1 text-xs font-bold">{idx + 1}.</span>
                              <p className="text-sm text-gray-400 font-medium">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="card bg-gradient-to-br from-[#bc13fe]/10 to-transparent">
                        <h3 className="text-sm font-black text-[#bc13fe] mb-4 uppercase tracking-widest">✨ Key Insights</h3>
                        <ul className="space-y-3">
                          {reasoningTrace?.key_insights?.map((insight, idx) => (
                            <li key={idx} className="text-xs text-gray-300 flex gap-2">
                              <span className="text-[#bc13fe]">✦</span> {insight}
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
        <footer className="bg-white/[0.02] border-t border-white/5 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-500">
              CodeForge <span className="text-[#bc13fe]">Hackathon</span> 2026
            </p>
            <p className="text-[9px] text-gray-600 mt-2">ADVANCED NEURAL ARCHITECTURE FOR ONBOARDING ADAPTATION</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
