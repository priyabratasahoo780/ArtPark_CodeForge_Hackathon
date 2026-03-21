import React, { useState, useEffect } from 'react'
import { 
  FiUpload, FiZap, FiTarget, FiActivity, FiAlertCircle, 
  FiMap, FiMessageSquare, FiDownload, FiLogOut, FiAward,
  FiRefreshCw, FiClock, FiTrendingUp, FiMic, FiCast, FiFeather, FiPlay
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
import NeuralRoadmap from './components/NeuralRoadmap'
import AchievementSystem from './components/AchievementSystem'
import ActivityFeed from './components/ActivityFeed'
import CareerPredictor from './components/CareerPredictor'
import InterviewModal from './components/InterviewModal'
import CollaborativeCanvas from './components/CollaborativeCanvas'
import EliteAnalytics from './components/EliteAnalytics'

const API_BASE_URL = 'http://localhost:8000'

const NavTab = ({ active, onClick, icon, label, color = '#bc13fe' }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 whitespace-nowrap ${
      active 
        ? `text-white shadow-[0_0_20px_rgba(0,0,0,0.4)] scale-105` 
        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
    }`}
    style={{ 
      background: active ? `linear-gradient(to right, ${color}, #00f3ff)` : 'transparent'
    }}
  >
    <span className="text-base">{icon}</span>
    <span className="hidden md:block">{label}</span>
  </button>
)

function App() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescriptionText, setJobDescriptionText] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [timelineDays, setTimelineDays] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Results
  const [analysisResults, setAnalysisResults] = useState(null)
  const [skillsAnalysis, setSkillsAnalysis] = useState(null)
  const [gapAnalysis, setGapAnalysis] = useState(null)
  const [learningPath, setLearningPath] = useState(null)
  const [reasoningTrace, setReasoningTrace] = useState(null)
  const [timeSavedData, setTimeSavedData] = useState(null)
  const [resumeOptimizations, setResumeOptimizations] = useState([])
  const [goalText, setGoalText] = useState(null)
  const [pathViewMode, setPathViewMode] = useState('neural')
  const [activities, setActivities] = useState([])
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false)
  
  // Phase 6 State
  const [decayData, setDecayData] = useState([])
  const [loadStats, setLoadStats] = useState(null)
  const [marketBenchmark, setMarketBenchmark] = useState(null)
  const [audioBriefingUrl, setAudioBriefingUrl] = useState(null)
  const [isBriefingGenerating, setIsBriefingGenerating] = useState(false)
  
  // Real-time progress tracking
  const [completedSkillNames, setCompletedSkillNames] = useState(new Set())
  const [syncingProgress, setSyncingProgress] = useState(false)
  const [sessionId] = useState(`session-${Math.random().toString(36).substr(2, 9)}`)
  
  const [activeTab, setActiveTab] = useState('upload')
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role') || 'USER'
  })
  const [syncStatus, setSyncStatus] = useState('idle')

  // Auth persistence
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem('token', auth.token)
      localStorage.setItem('role', auth.role)
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
  }, [auth])

  // WebSocket Collaboration
  useEffect(() => {
    if (!analysisResults) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${API_BASE_URL.replace(/^http/, protocol)}/ws/progress/${sessionId}`
    const ws = new WebSocket(wsUrl)

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'progress_updated') {
        const data = message.data
        if (data.updated_gap_analysis) setGapAnalysis(data.updated_gap_analysis)
        if (data.updated_learning_path) setLearningPath(data.updated_learning_path)
        if (data.efficiency_metrics) setTimeSavedData(data.efficiency_metrics)
        
        setActivities(prev => [{
          id: Date.now(),
          user: message.user || 'Collaborator',
          text: `Mastered a new skill!`,
          type: 'progress',
          time: 'Just now'
        }, ...prev].slice(0, 50))
      }
    }

    return () => ws.close()
  }, [analysisResults, sessionId])

  // Phase 6 Data Fetchers
  useEffect(() => {
    if (completedSkillNames.size > 0) {
      fetchDecayStatus()
    }
  }, [completedSkillNames])

  useEffect(() => {
    if (analysisResults) {
      fetchMarketBenchmark()
    }
  }, [analysisResults])

  const fetchDecayStatus = async () => {
    try {
      const mastered_skills = Array.from(completedSkillNames).map(name => ({
         name,
         mastered_at: Date.now() / 1000 - (Math.random() * 86400 * 5) // Mock historical data
      }))
      const response = await axios.post(`${API_BASE_URL}/decay/status`, {
        mastered_skills,
        daily_progress: [2, 1, 0, 4, 1] // Mock velocity
      })
      setDecayData(response.data.decay_map)
      setLoadStats(response.data.neural_load)
    } catch (err) {
      console.error('Decay fetch error:', err)
    }
  }

  const fetchMarketBenchmark = async () => {
    try {
      const role = targetRole || analysisResults.target_role || "Software Engineer"
      const readiness = gapAnalysis?.statistics?.readiness_score || 50
      const response = await axios.get(`${API_BASE_URL}/market/benchmark?role=${role}&readiness=${readiness}`)
      setMarketBenchmark(response.data)
    } catch (err) {
      console.error('Benchmark fetch error:', err)
    }
  }

  const generateBriefing = async () => {
    setIsBriefingGenerating(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/briefing/generate`, {
        user_name: "Elite Developer",
        mastered_count: completedSkillNames.size,
        total_skills: learningPath?.length || 10,
        next_milestone: learningPath?.find(m => !completedSkillNames.has(m.name))?.name || "End of path",
        lang: "en"
      })
      setAudioBriefingUrl(`${API_BASE_URL}${response.data.audio_url}`)
    } catch (err) {
      console.error('Briefing error:', err)
    } finally {
      setIsBriefingGenerating(false)
    }
  }

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescriptionText) {
      setError('Please provide both resume and job description.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/onboarding/complete`, {
        resume_text: resumeText,
        job_description_text: jobDescriptionText,
        target_role: targetRole || undefined,
        timeline_days: timelineDays || undefined
      }, { headers: { Authorization: `Bearer ${auth.token}` } })

      const data = response.data
      setAnalysisResults(data)
      setSkillsAnalysis(data.skills_analysis)
      setGapAnalysis(data.gap_analysis)
      setLearningPath(data.learning_path)
      setReasoningTrace(data.reasoning_trace)
      setTimeSavedData(data.efficiency_metrics)
      setGoalText(data.goal)
      
      setActiveTab('results')
    } catch (err) {
      console.error('Analysis error:', err)
      setError('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSkill = (skillName) => {
    const newCompleted = new Set(completedSkillNames)
    if (newCompleted.has(skillName)) newCompleted.delete(skillName)
    else newCompleted.add(skillName)
    setCompletedSkillNames(newCompleted)
    
    // Sync logic (simplified for elite demo)
    setSyncingProgress(true)
    setTimeout(() => setSyncingProgress(false), 800)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setAuth({ token: null, role: null })
  }

  if (!auth.token) {
    return <Login onLogin={setAuth} />
  }

  return (
    <div className={`min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden relative`}>
      {/* Background Decorative Blurs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#bc13fe]/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00f3ff]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/[0.02] backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('upload')}>
              <div className="w-10 h-10 bg-gradient-to-br from-[#bc13fe] to-[#00f3ff] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(188,19,254,0.3)]">
                <FiZap className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-black text-white uppercase italic tracking-tighter hidden sm:block">
                CodeForge <span className="text-[#00f3ff]">Onboarding</span>
              </h1>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
               {analysisResults && (
                 <>
                   <NavTab active={activeTab === 'results'} onClick={() => setActiveTab('results')} icon={<FiActivity />} label="Results" />
                   <NavTab active={activeTab === 'path'} onClick={() => setActiveTab('path')} icon={<FiMap />} label="Roadmap" />
                   <NavTab active={activeTab === 'canvas'} onClick={() => setActiveTab('canvas')} icon={<FiFeather />} label="Canvas" color="#34d399" />
                   <NavTab active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} icon={<FiMessageSquare />} label="Resume" />
                 </>
               )}
               <NavTab active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={<FiUpload />} label={analysisResults ? "New" : "Analyze"} />
               <button onClick={handleLogout} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white shrink-0 ml-2"><FiLogOut /></button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 flex overflow-hidden">
            {analysisResults && activeTab !== 'upload' && (
               <aside className="w-80 hidden xl:block p-4 border-r border-white/5 bg-black/20 overflow-y-auto no-scrollbar">
                 <ActivityFeed activities={activities} />
               </aside>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
               <div className="max-w-7xl mx-auto px-4 pt-8">
                  <AnimatePresence mode="wait">
                    {activeTab === 'upload' && (
                       <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                         <UploadSection
                            resumeText={resumeText}
                            jobDescriptionText={jobDescriptionText}
                            onResumeChange={setResumeText}
                            onJobDescriptionChange={setJobDescriptionText}
                            targetRole={targetRole}
                            onTargetRoleChange={setTargetRole}
                            timelineDays={timelineDays}
                            onTimelineChange={setTimelineDays}
                            onAnalyze={handleAnalyze}
                            loading={loading}
                         />
                       </motion.div>
                    )}

                    {activeTab === 'results' && analysisResults && (
                      <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                        <AchievementSystem completedCount={completedSkillNames.size} />
                        
                        {/* Phase 6 Elite Analytics */}
                        <EliteAnalytics decayData={decayData} loadStats={loadStats} marketBenchmark={marketBenchmark} />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                           <CareerPredictor roadmapData={learningPath} targetRole={targetRole || analysisResults.target_role} auth={auth} />
                           
                           {/* AI Podcast Briefing */}
                           <div className="glass-card p-8 border-none bg-gradient-to-br from-[#bc13fe]/5 to-transparent rounded-3xl flex flex-col justify-between">
                              <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-2">
                                  <FiCast className="text-[#bc13fe]" /> AI Audio Briefing
                                </h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">A custom narrrative of your onboarding journey, status, and market positioning.</p>
                                
                                {audioBriefingUrl && (
                                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-black/40 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-full bg-[#bc13fe] flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-all">
                                         <FiPlay />
                                      </div>
                                      <audio controls src={audioBriefingUrl} className="flex-1 sm:block hidden h-8" />
                                      <div className="flex-1 sm:hidden">
                                         <span className="text-[10px] font-black uppercase tracking-widest">Briefing Ready</span>
                                      </div>
                                   </motion.div>
                                )}
                              </div>
                              
                              <button 
                                onClick={generateBriefing}
                                disabled={isBriefingGenerating}
                                className="mt-8 w-full py-4 rounded-2xl bg-[#bc13fe] text-white text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(188,19,254,0.3)] transition-all flex items-center justify-center gap-3"
                              >
                                {isBriefingGenerating ? <FiRefreshCw className="animate-spin" /> : <FiMic />}
                                {isBriefingGenerating ? 'Generating Studio Audio...' : 'Generate Onboarding Podcast'}
                              </button>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <VoiceExplain reasoningTrace={reasoningTrace} gapStats={gapAnalysis?.statistics} auth={auth} />
                           <div className="glass-card p-8 border-none bg-gradient-to-br from-[#00f3ff]/5 to-transparent rounded-3xl flex flex-col justify-between">
                             <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                               <FiMic className="text-[#00f3ff]" /> Technical Mock Interview
                             </h3>
                             <button onClick={() => setIsInterviewModalOpen(true)} className="mt-8 py-4 rounded-2xl bg-[#00f3ff] text-black text-xs font-black uppercase tracking-widest">Start Simulation</button>
                           </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'path' && learningPath && (
                       <motion.div key="path" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                         <div className="flex justify-end mb-6">
                            <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl">
                               <button onClick={() => setPathViewMode('list')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pathViewMode === 'list' ? 'bg-[#00f3ff] text-black' : 'text-gray-500'}`}>List</button>
                               <button onClick={() => setPathViewMode('neural')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pathViewMode === 'neural' ? 'bg-[#bc13fe] text-white' : 'text-gray-500'}`}>Neural</button>
                            </div>
                         </div>
                         {pathViewMode === 'neural' ? (
                           <NeuralRoadmap data={learningPath} completedSkillNames={completedSkillNames} decayData={decayData} />
                         ) : (
                           <LearningPath data={learningPath} onToggleSkill={handleToggleSkill} completedSkillNames={completedSkillNames} />
                         )}
                       </motion.div>
                    )}

                    {activeTab === 'canvas' && (
                       <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                         <CollaborativeCanvas sessionId={sessionId} auth={auth} />
                       </motion.div>
                    )}

                    {activeTab === 'feedback' && resumeFeedback && (
                      <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ResumeFeedback feedback={resumeFeedback} optimizations={resumeOptimizations} />
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {isInterviewModalOpen && (
            <InterviewModal masteredSkills={Array.from(completedSkillNames)} auth={auth} onClose={() => setIsInterviewModalOpen(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
