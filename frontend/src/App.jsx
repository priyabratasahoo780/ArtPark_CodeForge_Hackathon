import React, { useState, useEffect } from 'react'
import { 
  FiUpload, FiZap, FiTarget, FiActivity, FiAlertCircle, 
  FiMap, FiMessageSquare, FiLogOut, FiAward,
  FiRefreshCw, FiClock, FiTrendingUp, FiMic, FiCast, FiFeather, FiPlay,
  FiCode, FiBookOpen, FiGlobe, FiEye, FiUser, FiSettings, FiHelpCircle, FiShield
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
import Login from './components/Login'
import NeuralRoadmap from './components/NeuralRoadmap'
import AchievementSystem from './components/AchievementSystem'
import ActivityFeed from './components/ActivityFeed'
import CareerPredictor from './components/CareerPredictor'
import InterviewModal from './components/InterviewModal'
import CollaborativeCanvas from './components/CollaborativeCanvas'
import EliteAnalytics from './components/EliteAnalytics'
import CodingSandbox from './components/CodingSandbox'
import FlashcardDeck from './components/FlashcardDeck'
import GlobalTrendMap from './components/GlobalTrendMap'
import RecruiterDashboard from './components/RecruiterDashboard'
import HelpCenter from './components/HelpCenter'
import SettingsModal from './components/SettingsModal'
import FlowTimer from './components/FlowTimer'
import TechnicalPortfolio from './components/TechnicalPortfolio'
import FutureMap from './components/FutureMap'
import SystemStatus from './components/SystemStatus'
import SalaryPredictor from './components/SalaryPredictor'
import JobMatcher from './components/JobMatcher'
import DailyStreak from './components/DailyStreak'
import ResumeScoreRadar from './components/ResumeScoreRadar'
import UIVision from './components/UIVision'
import SkillGalaxy from './components/SkillGalaxy'
import PitchGenerator from './components/PitchGenerator'
import CodeRadar from './components/CodeRadar'
import SquadHub from './components/SquadHub'
import SystemGuardian from './components/SystemGuardian'
import ExecutivePacket from './components/ExecutivePacket'

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
    if (!resumeText || !jobDescriptionText) return setError('Please provide both resume and job description.')
    setLoading(true)
    setError(null)
    try {
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
      setActiveTab('results')
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

  if (!auth.token) return <Login onLogin={setAuth} />

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden relative transition-colors duration-1000`}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] blur-[120px] transition-all duration-1000" style={{ backgroundColor: `${theme.primary}15` }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[120px] transition-all duration-1000" style={{ backgroundColor: `${theme.secondary}15` }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="bg-white/[0.02] backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => { setActiveTab('upload'); setViewMode('candidate'); }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-1000" style={{ background: `linear-gradient(to br, ${theme.primary}, ${theme.secondary})` }}>
                <FiZap className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-black uppercase italic tracking-tighter sm:block hidden">CodeForge</h1>
            </div>

            <div className="flex-1 items-center gap-2 overflow-x-auto no-scrollbar flex min-w-0">
               <div className="ml-auto flex-shrink-0"></div>
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
                   <NavTab active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<FiHelpCircle />} label="Help" color="#94a3b8" />
                   <NavTab active={activeTab === 'ecosystem'} onClick={() => setActiveTab('ecosystem')} icon={<FiGlobe />} label="Ecosystem" color="#ff00e5" />
                   <NavTab active={activeTab === 'status'} onClick={() => setActiveTab('status')} icon={<FiActivity />} label="Health" color="#34d399" />
                 </>
               )}
               
               <div className="flex items-center gap-1 border-l border-white/10 ml-4 pl-4">
                  <button onClick={() => setIsHelpOpen(true)} className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"><FiHelpCircle /></button>
                  <button onClick={() => setIsSettingsOpen(true)} className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"><FiSettings /></button>
               </div>

               {analysisResults && (
                 <button 
                  onClick={() => setViewMode(prev => prev === 'candidate' ? 'recruiter' : 'candidate')}
                  className={`ml-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'recruiter' ? 'bg-white text-black' : 'bg-white/5 text-white border border-white/10'}`}
                 >
                   {viewMode === 'recruiter' ? <FiUser /> : <FiEye />}
                   {viewMode === 'recruiter' ? 'Candidate View' : 'Recruiter View'}
                 </button>
               )}
               <button onClick={() => setAuth({token:null})} className="p-2.5 rounded-xl bg-white/5 text-gray-400 ml-2"><FiLogOut /></button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar py-10 px-4">
           <div className="max-w-7xl mx-auto">
             <AnimatePresence mode="wait">
                {viewMode === 'recruiter' ? (
                   <motion.div key="recruiter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <RecruiterDashboard candidateData={analysisResults} learningPath={learningPath} marketBenchmark={marketBenchmark} />
                   </motion.div>
                ) : (
                  <>
                    {activeTab === 'upload' && (
                       <UploadSection 
                        resumeText={resumeText} onResumeChange={setResumeText} 
                        jobDescriptionText={jobDescriptionText} onJobDescriptionChange={setJobDescriptionText} 
                        targetRole={targetRole} onTargetRoleChange={setTargetRole}
                        timelineDays={timelineDays} onTimelineChange={setTimelineDays}
                        onAnalyze={handleAnalyze} loading={loading}
                       />
                    )}

                    {activeTab === 'results' && analysisResults && (
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
                    )}

                    {activeTab === 'path' && learningPath && (
                       <div>
                         <div className="flex justify-end mb-6">
                            <button onClick={() => setPathViewMode(pathViewMode === 'neural' ? 'list' : 'neural')} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400">Toggle View ({pathViewMode})</button>
                         </div>
                         {pathViewMode === 'neural' ? <NeuralRoadmap data={learningPath?.modules} completedSkillNames={completedSkillNames} decayData={decayData} /> : <LearningPath data={learningPath} onToggleSkill={handleToggleSkill} completedSkillNames={completedSkillNames} />}
                       </div>
                    )}

                    {activeTab === 'sandbox' && (
                       <div className="space-y-8">
                          <div className="flex justify-end pr-4">
                             <FlowTimer />
                          </div>
                          <CodingSandbox activeSkill={activeSandboxSkill} auth={auth} />
                       </div>
                    )}

                    {activeTab === 'recall' && (
                       <FlashcardDeck masteredSkills={Array.from(completedSkillNames)} auth={auth} />
                    )}

                    {activeTab === 'ecosystem' && (
                       <GlobalTrendMap />
                    )}

                    {activeTab === 'insights' && (
                       <div className="space-y-10">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             <DailyStreak completedCount={completedSkillNames.size} />
                             <ResumeScoreRadar skills={skillsAnalysis?.skills} gapStats={gapAnalysis?.statistics} />
                          </div>
                          <SalaryPredictor role={targetRole || analysisResults?.target_role} skills={skillsAnalysis?.skills} />
                          <JobMatcher skills={skillsAnalysis?.skills} />
                       </div>
                    )}

                    {activeTab === 'portfolio' && (
                       <TechnicalPortfolio 
                        user_name={analysisResults?.candidate_name || "Developer"} 
                        mastered_skills={Array.from(completedSkillNames)} 
                        target_role={targetRole || analysisResults?.target_role} 
                       />
                    )}

                    {activeTab === 'future' && (
                       <FutureMap activeRole={targetRole || analysisResults?.target_role} />
                    )}

                    {activeTab === 'alpha' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                          <UIVision />
                          <PitchGenerator masteredSkills={Array.from(completedSkillNames)} />
                        </div>
                        <SkillGalaxy masteredSkills={Array.from(completedSkillNames)} />
                        <CodeRadar />
                      </motion.div>
                    )}

                    {activeTab === 'elite' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                          <SquadHub masteredSkills={Array.from(completedSkillNames)} />
                          <ExecutivePacket resumeData={resumeText} masteredSkills={Array.from(completedSkillNames)} gapStats={gapAnalysis?.statistics} />
                        </div>
                        <SystemGuardian />
                      </motion.div>
                    )}

                    {activeTab === 'settings' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
                        <HelpCenter onClose={() => setActiveTab('results')} />
                      </motion.div>
                    )}

                    {activeTab === 'status' && (
                       <SystemStatus />
                    )}
                  </>
                )}
             </AnimatePresence>
           </div>
        </main>

        <AnimatePresence>
          {isInterviewModalOpen && (
            <InterviewModal masteredSkills={Array.from(completedSkillNames)} auth={auth} onClose={() => setIsInterviewModalOpen(false)} />
          )}
          {isHelpOpen && (
            <HelpCenter onClose={() => setIsHelpOpen(false)} />
          )}
          {isSettingsOpen && (
            <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setIsSettingsOpen(false)} />
          )}
        </AnimatePresence>
      </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
