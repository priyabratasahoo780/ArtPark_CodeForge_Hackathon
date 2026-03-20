import React, { useState } from 'react'
import axios from 'axios'
import { FiUpload, FiRefreshCw, FiDownload } from 'react-icons/fi'
import UploadSection from './components/UploadSection'
import SkillsAnalysis from './components/SkillsAnalysis'
import GapAnalysis from './components/GapAnalysis'
import LearningPath from './components/LearningPath'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorAlert from './components/ErrorAlert'
import './index.css'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescriptionText, setJobDescriptionText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('upload')
  
  // Analysis results
  const [analysisResults, setAnalysisResults] = useState(null)
  const [skillsAnalysis, setSkillsAnalysis] = useState(null)
  const [gapAnalysis, setGapAnalysis] = useState(null)
  const [learningPath, setLearningPath] = useState(null)
  const [reasoningTrace, setReasoningTrace] = useState(null)

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
          'Content-Type': 'application/json'
        }
      })

      setAnalysisResults(response.data)
      setSkillsAnalysis(response.data.skills_analysis)
      setGapAnalysis(response.data.gap_analysis)
      setLearningPath(response.data.learning_path)
      setReasoningTrace(response.data.reasoning_trace)
      setActiveTab('results')
    } catch (err) {
      console.error('Analysis error:', err)
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Error analyzing documents. Make sure the backend is running on http://localhost:8000'
      )
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
    
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `onboarding-analysis-${new Date().getTime()}.json`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                🚀 AI-Adaptive Onboarding Engine
              </h1>
              <p className="text-purple-200 mt-1">Personalized Learning Pathways for New Hires</p>
            </div>
            {analysisResults && (
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadResults}
                  className="btn-secondary"
                >
                  <FiDownload className="inline mr-2" /> Download
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  <FiRefreshCw className="inline mr-2" /> New Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

        {loading && <LoadingSpinner />}

        {!loading && (
          <div className="space-y-6">
            {/* Tabs */}
            {analysisResults && (
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'upload', label: '📄 Input' },
                  { id: 'results', label: '📊 Results' },
                  { id: 'skills', label: '🎯 Skills' },
                  { id: 'gaps', label: '⚠️ Gaps' },
                  { id: 'path', label: '🛣️ Learning Path' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Content Sections */}
            {activeTab === 'upload' || !analysisResults ? (
              <UploadSection
                resumeText={resumeText}
                jobDescriptionText={jobDescriptionText}
                onResumeChange={setResumeText}
                onJobDescriptionChange={setJobDescriptionText}
                onAnalyze={handleAnalyze}
                loading={loading}
              />
            ) : null}

            {activeTab === 'results' && analysisResults && reasoningTrace && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Analysis Summary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                      <div className="text-sm text-blue-600 font-semibold">Known Skills</div>
                      <div className="text-3xl font-bold text-blue-800">
                        {gapAnalysis?.statistics?.known_count || 0}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                      <div className="text-sm text-yellow-600 font-semibold">Partial Skills</div>
                      <div className="text-3xl font-bold text-yellow-800">
                        {gapAnalysis?.statistics?.partial_count || 0}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                      <div className="text-sm text-red-600 font-semibold">Missing Skills</div>
                      <div className="text-3xl font-bold text-red-800">
                        {gapAnalysis?.statistics?.missing_count || 0}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                      <div className="text-sm text-green-600 font-semibold">Readiness Score</div>
                      <div className="text-3xl font-bold text-green-800">
                        {gapAnalysis?.statistics?.readiness_score || 0}/100
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Approach & Methodology</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Approach:</p>
                      <p className="text-gray-700">{reasoningTrace?.approach}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Methodology:</p>
                      <p className="text-gray-700">{reasoningTrace?.methodology}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Steps:</p>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        {reasoningTrace?.steps?.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Key Insights</h3>
                  <ul className="space-y-2">
                    {reasoningTrace?.key_insights?.map((insight, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-2xl mr-3">✨</span>
                        <span className="text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Recommendations</h3>
                  <ul className="space-y-2">
                    {reasoningTrace?.recommendations?.map((rec, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-2xl mr-3">→</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'skills' && skillsAnalysis && (
              <SkillsAnalysis data={skillsAnalysis} />
            )}

            {activeTab === 'gaps' && gapAnalysis && (
              <GapAnalysis data={gapAnalysis} />
            )}

            {activeTab === 'path' && learningPath && (
              <LearningPath data={learningPath} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-purple-200">
          <p>AI-Adaptive Onboarding Engine • Powered by Advanced NLP & Machine Learning</p>
          <p className="text-sm mt-2">© 2024 CodeForge Hackathon</p>
        </div>
      </footer>
    </div>
  )
}

export default App
