import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'
import { 
  FiUpload, FiZap, FiTarget, FiActivity, FiAlertCircle, 
  FiMap, FiMessageSquare, FiLogOut, FiAward,
  FiRefreshCw, FiClock, FiTrendingUp, FiMic, FiCast, FiFeather, FiPlay,
  FiCode, FiBookOpen, FiGlobe, FiEye, FiUser, FiSettings, FiHelpCircle, FiShield
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

// ─── Eager (first-paint critical) ────────────────────────────────────
import Login from './components/Login'
import UploadSection from './components/UploadSection'

// ─── Lazy (loaded only when the user navigates to them) ──────────────
const GapAnalysis         = lazy(() => import('./components/GapAnalysis'))
const LearningPath        = lazy(() => import('./components/LearningPath'))
const SkillsAnalysis      = lazy(() => import('./components/SkillsAnalysis'))
const ResumeFeedback      = lazy(() => import('./components/ResumeFeedback'))
const VoiceExplain        = lazy(() => import('./components/VoiceExplain'))
const TimeSavedAnalytics  = lazy(() => import('./components/TimeSavedAnalytics'))
const NeuralRoadmap       = lazy(() => import('./components/NeuralRoadmap'))
const AchievementSystem   = lazy(() => import('./components/AchievementSystem'))
const ActivityFeed        = lazy(() => import('./components/ActivityFeed'))
const CareerPredictor     = lazy(() => import('./components/CareerPredictor'))
const InterviewModal      = lazy(() => import('./components/InterviewModal'))
const CollaborativeCanvas = lazy(() => import('./components/CollaborativeCanvas'))
const EliteAnalytics      = lazy(() => import('./components/EliteAnalytics'))
const CodingSandbox       = lazy(() => import('./components/CodingSandbox'))
const FlashcardDeck       = lazy(() => import('./components/FlashcardDeck'))
const GlobalTrendMap      = lazy(() => import('./components/GlobalTrendMap'))
const RecruiterDashboard  = lazy(() => import('./components/RecruiterDashboard'))
const HelpCenter          = lazy(() => import('./components/HelpCenter'))
const SettingsModal       = lazy(() => import('./components/SettingsModal'))
const FlowTimer           = lazy(() => import('./components/FlowTimer'))
const TechnicalPortfolio  = lazy(() => import('./components/TechnicalPortfolio'))
const FutureMap           = lazy(() => import('./components/FutureMap'))
const SystemStatus        = lazy(() => import('./components/SystemStatus'))
const SalaryPredictor     = lazy(() => import('./components/SalaryPredictor'))
const JobMatcher          = lazy(() => import('./components/JobMatcher'))
const DailyStreak         = lazy(() => import('./components/DailyStreak'))
const ResumeScoreRadar    = lazy(() => import('./components/ResumeScoreRadar'))
const UIVision            = lazy(() => import('./components/UIVision'))
const SkillGalaxy         = lazy(() => import('./components/SkillGalaxy'))
const PitchGenerator      = lazy(() => import('./components/PitchGenerator'))
const CodeRadar           = lazy(() => import('./components/CodeRadar'))
const SquadHub            = lazy(() => import('./components/SquadHub'))
const SystemGuardian      = lazy(() => import('./components/SystemGuardian'))
const ExecutivePacket     = lazy(() => import('./components/ExecutivePacket'))

// ─── Lightweight Suspense fallback ───────────────────────────────────
const TabFallback = () => (
  <div className="flex items-center justify-center py-32">
    <div className="w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
  </div>
)

const API_BASE_URL = 'https://artpark-codeforge-hackathon.onrender.com'

const NavTab = ({ active, onClick, icon, label, color = '#bc13fe' }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 whitespace-nowrap md:w-full md:justify-start ${
      active 
        ? `text-white shadow-[0_0_20px_rgba(0,0,0,0.4)]` 
        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
    }`}
    style={{ 
      background: active ? `linear-gradient(to right, ${color}, #00f3ff)` : 'transparent'
    }}
  >
    <span className="text-lg">{icon}</span>
    <span className="block">{label}</span>
  </button>
)

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">CRITICAL SYSTEM FAILURE</h1>
          <p className="text-gray-400 mb-8 max-w-md">An unhandled exception has occurred in the neural engine.</p>
          <div className="bg-white/5 border border-red-500/30 p-4 rounded-xl text-left font-mono text-xs overflow-auto max-w-full">
            {this.state.error?.toString()}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-2 bg-red-500 text-white rounded-lg font-bold"
          >
            Reboot System
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('upload')
  const [viewMode, setViewMode] = useState('candidate') // 'candidate' or 'recruiter'
  
  // Phase 8 State
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('codeforge_settings')
      if (saved) return JSON.parse(saved)
    } catch (e) { console.error('Error loading settings', e) }
    return {
      theme: 'midnight',
      audio: true,
      notifications: true,
      websockets: true
    }
  })

  useEffect(() => {
    localStorage.setItem('codeforge_settings', JSON.stringify(settings))
  }, [settings])

  // Theme Config
  const themeColors = {
    midnight: { primary: '#bc13fe', secondary: '#00f3ff' },
    solar: { primary: '#f59e0b', secondary: '#ef4444' },
    deepspace: { primary: '#3b82f6', secondary: '#1e293b' }
  }
  const theme = themeColors[settings.theme] || themeColors.midnight

  // Data
  const [resumeText, setResumeText] = useState('')
  const [jobDescriptionText, setJobDescriptionText] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [timelineDays, setTimelineDays] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [batchResumes, setBatchResumes] = useState([]) // [{ name, text }]
  const [batchResults, setBatchResults] = useState([])
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0)
  
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
  
  // Phase 6/7 State
  const [decayData, setDecayData] = useState([])
  const [loadStats, setLoadStats] = useState(null)
  const [marketBenchmark, setMarketBenchmark] = useState(null)
  const [audioBriefingUrl, setAudioBriefingUrl] = useState(null)
  const [isBriefingGenerating, setIsBriefingGenerating] = useState(false)
  const [activeSandboxSkill, setActiveSandboxSkill] = useState(null)
  
  // Progress
  const [completedSkillNames, setCompletedSkillNames] = useState(new Set())
  const [sessionId] = useState(`session-${Math.random().toString(36).substr(2, 9)}`)
  
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role') || 'USER'
  })

  // Helper to build auth headers for every request
  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
  })

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem('token', auth.token)
      localStorage.setItem('role', auth.role)
      
      // Sync viewMode with user role
      if (auth.role === 'HR' || auth.role === 'MANAGER') {
        setViewMode('recruiter')
      } else {
        setViewMode('candidate')
      }
    }
  }, [auth])

  useEffect(() => {
    if (!analysisResults || !settings.websockets) return
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${API_BASE_URL.replace(/^http:/, protocol)}/ws/progress/${sessionId}`
    const ws = new WebSocket(wsUrl)
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'progress_updated') {
         const data = message.data
         if (data.updated_gap_analysis) setGapAnalysis(data.updated_gap_analysis)
         if (data.updated_learning_path) setLearningPath(data.updated_learning_path)
      }
    }
    return () => ws.close()
  }, [analysisResults, sessionId, settings.websockets])

  useEffect(() => {
    fetchDecayStatus()
  }, [completedSkillNames])

  useEffect(() => {
    if (analysisResults) fetchMarketBenchmark()
  }, [analysisResults])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const fetchDecayStatus = async () => {
    try {
      const mastered_skills = Array.from(completedSkillNames).map(name => ({
         name,
         mastered_at: Date.now() / 1000 - (Math.random() * 86400 * 5)
      }))
      const daily_progress = [0, 0, 0, 0, completedSkillNames.size]
      const response = await axios.post(`${API_BASE_URL}/decay/status`, {
        mastered_skills,
        daily_progress
      }, authHeaders())
      setDecayData(response.data.decay_map)
      setLoadStats(response.data.neural_load)
    } catch (err) { console.error(err) }
  }

  const fetchMarketBenchmark = async () => {
    try {
      const role = targetRole || analysisResults.target_role || "Software Engineer"
      const readiness = gapAnalysis?.statistics?.readiness_score || 50
      const response = await axios.get(`${API_BASE_URL}/market/benchmark?role=${role}&readiness=${readiness}`, authHeaders())
      setMarketBenchmark(response.data)
    } catch (err) { console.error(err) }
  }

  const generateBriefing = async () => {
    setIsBriefingGenerating(true)
    try {
      const pendingModule = learningPath?.modules?.find(m => !completedSkillNames.has(m.skill_name))
      const resp = await axios.post(`${API_BASE_URL}/briefing/generate`, {
        user_name: "CodeForge Talent",
        mastered_count: completedSkillNames.size,
        total_skills: learningPath?.modules?.length || 10,
        next_milestone: pendingModule ? pendingModule.skill_name : "End of path",
        lang: "en"
      }, authHeaders())
      setAudioBriefingUrl(`${API_BASE_URL}${resp.data.audio_url}`)
    } catch (err) { console.error(err) }
    finally { setIsBriefingGenerating(false) }
  }

  const handleAnalyze = async () => {
    if ((!resumeText && batchResumes.length === 0) || !jobDescriptionText) return setError('Please provide resume(s) and job description.')
    setLoading(true)
    setError(null)
    
    try {
      if (auth.role === 'HR' && batchResumes.length > 0) {
        const results = []
        for (const res of batchResumes) {
          try {
            const resp = await axios.post(`${API_BASE_URL}/onboarding/complete`, {
              resume_text: res.text,
              job_description_text: jobDescriptionText,
              target_role: targetRole || undefined,
              timeline_days: timelineDays || undefined
            }, authHeaders())
            results.push({ 
              ...resp.data, 
              candidate_name: res.name.replace(/\.[^/.]+$/, "") // Remove extension
            })
          } catch (e) {
            console.error(`Error analyzing ${res.name}:`, e)
          }
        }
        
        if (results.length === 0) throw new Error("All analyses failed.")
        
        setBatchResults(results)
        setAnalysisResults(results[0])
        setGapAnalysis(results[0].gap_analysis)
        setLearningPath(results[0].learning_path)
        setReasoningTrace(results[0].reasoning_trace)
        setSelectedCandidateIndex(0)
        setActiveTab('results')
      } else {
        // Single Analysis Logic
        const resp = await axios.post(`${API_BASE_URL}/onboarding/complete`, {
          resume_text: resumeText,
          job_description_text: jobDescriptionText,
          target_role: targetRole || undefined,
          timeline_days: timelineDays || undefined
        }, authHeaders())
        setAnalysisResults(resp.data)
        setGapAnalysis(resp.data.gap_analysis)
        setLearningPath(resp.data.learning_path)
        setReasoningTrace(resp.data.reasoning_trace)
        setBatchResults([{ ...resp.data, candidate_name: "Primary Candidate" }])
        setActiveTab('results')
      }
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(detail ? `Analysis error: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}` : 'Analysis failed. Make sure both servers are running.')
    }
    finally { setLoading(false) }
  }

  const handleToggleSkill = (name) => {
    const next = new Set(completedSkillNames)
    if (next.has(name)) next.delete(name)
    else {
      next.add(name)
      setActiveSandboxSkill(name)
    }
    setCompletedSkillNames(next)
  }

  const insightsSkills = useMemo(() => {
    const initial = analysisResults?.skills_analysis?.resume_skills || (skillsAnalysis?.skills || []);
    const completed = Array.from(completedSkillNames).map(n => ({ name: n }));
    return [...initial, ...completed];
  }, [analysisResults, skillsAnalysis, completedSkillNames]);

  if (!auth.token) return <Login onLogin={setAuth} />

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden relative transition-colors duration-1000`}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] blur-[120px] transition-all duration-1000" style={{ backgroundColor: `${theme.primary}15` }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[120px] transition-all duration-1000" style={{ backgroundColor: `${theme.secondary}15` }}></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row h-screen overflow-hidden">
        <aside className="bg-white/[0.02] backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 flex flex-col w-full md:w-64 h-auto md:h-screen shrink-0 z-50">
           <div className="p-4 md:p-6 flex items-center justify-between md:justify-start gap-4 border-b border-white/10">
              <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => { setActiveTab('upload'); setViewMode('candidate'); }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-1000" style={{ background: `linear-gradient(to br, ${theme.primary}, ${theme.secondary})` }}>
                  <FiZap className="text-white text-xl" />
                </div>
                <h1 className="text-xl font-black uppercase italic tracking-tighter">CodeForge</h1>
              </div>
              <div className="flex items-center gap-2 md:hidden">
                 <button onClick={() => setIsHelpOpen(true)} className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white"><FiHelpCircle /></button>
                 <button onClick={() => setIsSettingsOpen(true)} className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white"><FiSettings /></button>
                 <button onClick={() => setAuth({token:null})} className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white"><FiLogOut /></button>
              </div>
           </div>

           <div className="flex-1 overflow-x-auto md:overflow-y-auto no-scrollbar p-3 md:p-4 flex md:flex-col gap-2 items-center md:items-stretch">
               {analysisResults && viewMode === 'candidate' && (
                 <>
                   <NavTab active={activeTab === 'results'} onClick={() => setActiveTab('results')} icon={<FiActivity />} label="Results" color={theme.primary} />
                   <NavTab active={activeTab === 'path'} onClick={() => setActiveTab('path')} icon={<FiMap />} label="Roadmap" color={theme.primary} />
                   <NavTab active={activeTab === 'sandbox'} onClick={() => setActiveTab('sandbox')} icon={<FiCode />} label="Sandbox" color="#34d399" />
                   <NavTab active={activeTab === 'recall'} onClick={() => setActiveTab('recall')} icon={<FiBookOpen />} label="Recall" color={theme.secondary} />
                   <NavTab active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} icon={<FiAward />} label="Portfolio" color="#f59e0b" />
                   <NavTab active={activeTab === 'future'} onClick={() => setActiveTab('future')} icon={<FiTrendingUp />} label="2030" color="#3b82f6" />
                   <NavTab active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<FiTarget />} label="Insights" color="#00f3ff" />
                   <NavTab active={activeTab === 'alpha'} onClick={() => setActiveTab('alpha')} icon={<FiZap />} label="Alpha" color="#bc13fe" />
                   <NavTab active={activeTab === 'elite'} onClick={() => setActiveTab('elite')} icon={<FiShield />} label="Elite" color="#10b981" />
                   <NavTab active={activeTab === 'ecosystem'} onClick={() => setActiveTab('ecosystem')} icon={<FiGlobe />} label="Ecosystem" color="#ff00e5" />
                   <NavTab active={activeTab === 'status'} onClick={() => setActiveTab('status')} icon={<FiActivity />} label="Health" color="#34d399" />
                 </>
               )}
           </div>

           <div className="hidden md:flex flex-col gap-2 p-4 border-t border-white/10">
              <button onClick={() => setIsHelpOpen(true)} className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all flex items-center gap-3 w-full font-black text-[10px] uppercase tracking-widest"><FiHelpCircle /> Help Center</button>
              <button onClick={() => setIsSettingsOpen(true)} className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all flex items-center gap-3 w-full font-black text-[10px] uppercase tracking-widest"><FiSettings /> Settings</button>
              {analysisResults && (auth.role === 'HR' || auth.role === 'MANAGER') && (
                 <button 
                  onClick={() => setViewMode(prev => prev === 'candidate' ? 'recruiter' : 'candidate')}
                  className={`p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full flex items-center justify-center gap-2 ${viewMode === 'recruiter' ? 'bg-white text-black' : 'bg-white/5 text-white border border-white/10'}`}
                 >
                   {viewMode === 'recruiter' ? <FiUser /> : <FiEye />}
                   {viewMode === 'recruiter' ? 'Candidate View' : 'Recruiter View'}
                 </button>
              )}
              <button onClick={() => setAuth({token:null})} className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-red-400 border border-red-500/10 hover:border-red-500/30 transition-all flex items-center justify-center gap-3 w-full font-black text-[10px] uppercase tracking-widest mt-2"><FiLogOut /> Logout</button>
           </div>
        </aside>

        <main className="flex-1 overflow-y-auto no-scrollbar py-8 px-4 h-full relative z-0">
           <div className="max-w-7xl mx-auto">
             <AnimatePresence>
               {error && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="mb-8"
                 >
                   <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                       <FiAlertCircle className="text-red-500 text-xl shrink-0" />
                       <p className="text-xs font-black uppercase tracking-widest text-red-500">{error}</p>
                     </div>
                     <button onClick={() => setError(null)} className="text-gray-500 hover:text-white transition-all text-lg">×</button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             <AnimatePresence mode="wait">
                {viewMode === 'recruiter' ? (
                   <motion.div key="recruiter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <Suspense fallback={<TabFallback />}>
                        <RecruiterDashboard 
                           candidateData={analysisResults} 
                           learningPath={learningPath} 
                           marketBenchmark={marketBenchmark} 
                           completedSkillNames={completedSkillNames}
                           insightsSkills={insightsSkills}
                           batchResults={batchResults}
                           onSelectCandidate={(index) => {
                              const selected = batchResults[index]
                              setAnalysisResults(selected)
                              setGapAnalysis(selected.gap_analysis)
                              setLearningPath(selected.learning_path)
                              setReasoningTrace(selected.reasoning_trace)
                              setSelectedCandidateIndex(index)
                           }}
                           selectedIndex={selectedCandidateIndex}
                        />
                      </Suspense>
                   </motion.div>
                ) : (
                  <>
                    {activeTab === 'upload' && (
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
                        isHR={auth.role === 'HR' || auth.role === 'MANAGER'}
                        batchResumes={batchResumes}
                        onMultiResumesChange={(newResumes) => setBatchResumes(prev => [...prev, ...newResumes])}
                        onRemoveResume={(name) => setBatchResumes(prev => prev.filter(r => r.name !== name))}
                       />
                    )}

                    {activeTab === 'results' && analysisResults && (
                      <Suspense fallback={<TabFallback />}>
                        <div className="space-y-10">
                          <AchievementSystem completedCount={completedSkillNames.size} />
                          <EliteAnalytics decayData={decayData} loadStats={loadStats} marketBenchmark={marketBenchmark} />
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             <CareerPredictor roadmapData={learningPath} targetRole={targetRole || analysisResults.target_role} auth={auth} />
                             <div className="glass-card p-8 border-none flex flex-col justify-between transition-all duration-1000" style={{ backgroundColor: `${theme.primary}05` }}>
                                <div>
                                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-2"><FiCast style={{ color: theme.primary }} /> Onboarding Podcast</h3>
                                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">{audioBriefingUrl ? 'Audio generated successfully' : 'Generate an AI summary of your progress'}</p>
                                  {audioBriefingUrl && <audio controls src={audioBriefingUrl} className="mt-8 w-full h-8" />}
                                </div>
                                <button onClick={generateBriefing} disabled={isBriefingGenerating} className="mt-8 w-full py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-1000" style={{ backgroundColor: theme.primary }}>
                                  {isBriefingGenerating ? <FiRefreshCw className="animate-spin" /> : <FiMic />} {isBriefingGenerating ? 'Generating...' : 'Start Podcast'}
                                </button>
                             </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <VoiceExplain reasoningTrace={reasoningTrace} gapStats={gapAnalysis?.statistics} auth={auth} />
                             <div className="glass-card p-8 border-none bg-[#00f3ff]/5 rounded-3xl flex flex-col justify-between">
                               <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><FiMic className="text-[#00f3ff]" /> Technical Interview</h3>
                               <button onClick={() => setIsInterviewModalOpen(true)} className="mt-8 py-4 rounded-2xl bg-[#00f3ff] text-black text-[10px] font-black uppercase tracking-widest">Begin Session</button>
                             </div>
                          </div>
                        </div>
                      </Suspense>
                    )}

                    {activeTab === 'path' && learningPath && (
                      <Suspense fallback={<TabFallback />}>
                       <div>
                         <div className="flex justify-end mb-6">
                            <button onClick={() => setPathViewMode(pathViewMode === 'neural' ? 'list' : 'neural')} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400">Toggle View ({pathViewMode})</button>
                         </div>
                         {pathViewMode === 'neural' ? <NeuralRoadmap data={learningPath?.modules} completedSkillNames={completedSkillNames} decayData={decayData} /> : <LearningPath data={learningPath} onToggleSkill={handleToggleSkill} completedSkillNames={completedSkillNames} />}
                       </div>
                      </Suspense>
                    )}

                    {activeTab === 'sandbox' && (
                      <Suspense fallback={<TabFallback />}>
                       <div className="space-y-8">
                          <div className="flex justify-end pr-4">
                             <FlowTimer />
                          </div>
                          <CodingSandbox activeSkill={activeSandboxSkill} auth={auth} />
                       </div>
                      </Suspense>
                    )}

                    {activeTab === 'recall' && (
                      <Suspense fallback={<TabFallback />}>
                       <FlashcardDeck masteredSkills={Array.from(new Set([...(analysisResults?.skills_analysis?.resume_skills?.map(s => s.name) || []), ...completedSkillNames]))} auth={auth} />
                      </Suspense>
                    )}

                    {activeTab === 'ecosystem' && (
                      <Suspense fallback={<TabFallback />}>
                       <GlobalTrendMap />
                      </Suspense>
                    )}

                    {activeTab === 'insights' && (
                      <Suspense fallback={<TabFallback />}>
                       <div className="space-y-10">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             <DailyStreak completedCount={completedSkillNames.size} />
                             <ResumeScoreRadar skills={insightsSkills} gapStats={gapAnalysis?.statistics} />
                          </div>
                           <SalaryPredictor role={targetRole || analysisResults?.target_role} skills={insightsSkills} />
                           <JobMatcher skills={insightsSkills} />
                        </div>
                      </Suspense>
                    )}

                    {activeTab === 'portfolio' && (
                      <Suspense fallback={<TabFallback />}>
                       <TechnicalPortfolio 
                        user_name={analysisResults?.candidate_name || "Developer"} 
                        mastered_skills={Array.from(new Set([...(analysisResults?.skills_analysis?.resume_skills?.map(s => s.name) || []), ...completedSkillNames]))} 
                        target_role={targetRole || analysisResults?.target_role} 
                       />
                      </Suspense>
                    )}

                    {activeTab === 'future' && (
                      <Suspense fallback={<TabFallback />}>
                       <FutureMap activeRole={targetRole || analysisResults?.target_role} />
                      </Suspense>
                    )}

                    {activeTab === 'alpha' && (
                      <Suspense fallback={<TabFallback />}>
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
                         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                           <UIVision />
                           <PitchGenerator masteredSkills={Array.from(completedSkillNames)} />
                         </div>
                         <SkillGalaxy masteredSkills={Array.from(completedSkillNames)} />
                         <CodeRadar />
                       </motion.div>
                      </Suspense>
                    )}

                    {activeTab === 'elite' && (
                      <Suspense fallback={<TabFallback />}>
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
                         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                           <SquadHub masteredSkills={Array.from(completedSkillNames)} />
                           <ExecutivePacket resumeData={resumeText} masteredSkills={Array.from(completedSkillNames)} gapStats={gapAnalysis?.statistics} />
                         </div>
                         <SystemGuardian />
                       </motion.div>
                      </Suspense>
                    )}

                    {activeTab === 'settings' && (
                      <Suspense fallback={<TabFallback />}>
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
                         <HelpCenter onClose={() => setActiveTab('results')} />
                       </motion.div>
                      </Suspense>
                    )}

                    {activeTab === 'status' && (
                      <Suspense fallback={<TabFallback />}>
                       <SystemStatus />
                      </Suspense>
                    )}
                  </>
                )}
             </AnimatePresence>
           </div>
        </main>

        <AnimatePresence>
          {isInterviewModalOpen && (
            <Suspense fallback={null}>
              <InterviewModal masteredSkills={Array.from(completedSkillNames)} auth={auth} onClose={() => setIsInterviewModalOpen(false)} />
            </Suspense>
          )}
          {isHelpOpen && (
            <Suspense fallback={null}>
              <HelpCenter onClose={() => setIsHelpOpen(false)} />
            </Suspense>
          )}
          {isSettingsOpen && (
            <Suspense fallback={null}>
              <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setIsSettingsOpen(false)} />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
