import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiMic, FiSend, FiAward, FiStar, FiChevronRight } from 'react-icons/fi'
import axios from 'axios'

export default function InterviewModal({ masteredSkills, auth, onClose }) {
  const [step, setStep] = useState('intro') // intro, questions, grading
  const [questions, setQuestions] = useState([])
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [gradingResult, setGradingResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleStart = async () => {
    setLoading(true)
    try {
      const config = {
        headers: { Authorization: `Bearer ${auth.token}` }
      }
      const response = await axios.post('http://localhost:8000/interview/start', {
        mastered_skills: masteredSkills
      }, config)
      setQuestions(response.data.questions || [])
      setStep('questions')
    } catch (err) {
      console.error('Failed to start interview:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGrade = async () => {
    setLoading(true)
    try {
      const config = {
        headers: { Authorization: `Bearer ${auth.token}` }
      }
      const response = await axios.post('http://localhost:8000/interview/grade', {
        question: questions[activeQuestionIdx].text,
        answer: answer
      }, config)
      setGradingResult(response.data)
      setStep('grading')
    } catch (err) {
      console.error('Grading failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl glass-card border-white/10 bg-[#0a0a0c]/90 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#bc13fe]/10 rounded-xl flex items-center justify-center text-[#bc13fe]">
              <FiMic size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">AI Mock Interview</h3>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Simulating technical mastery</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <FiX className="text-gray-500" />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center py-10">
                <div className="w-20 h-20 bg-gradient-to-br from-[#bc13fe] to-[#00f3ff] rounded-3xl mx-auto flex items-center justify-center text-white text-3xl mb-6 shadow-xl">
                  <FiStar />
                </div>
                <h4 className="text-xl font-black text-white uppercase italic mb-4">Ready to test your skills?</h4>
                <p className="text-sm text-gray-400 max-w-sm mx-auto mb-10 leading-relaxed">
                  The AI interviewer will generate questions based on your mastered skills: 
                  <span className="text-white block mt-2">{masteredSkills.slice(0, 3).join(', ')}...</span>
                </p>
                <button 
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-[#00f3ff] transition-all"
                >
                  {loading ? 'Initializing AI...' : 'Begin Session'}
                </button>
              </motion.div>
            )}

            {step === 'questions' && (
              <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-[#bc13fe] uppercase tracking-widest">Question {activeQuestionIdx + 1} of {questions.length}</span>
                    <span className="px-3 py-1 bg-[#bc13fe]/10 text-[#bc13fe] text-[8px] font-black uppercase rounded-full border border-[#bc13fe]/20">
                      Skill: {questions[activeQuestionIdx]?.skill}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white leading-tight">
                    {questions[activeQuestionIdx]?.text}
                  </h4>
                </div>

                <div className="relative mb-8">
                  <textarea 
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Provide your technical explanation here..."
                    className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder:text-gray-700 outline-none focus:border-[#bc13fe]/50 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleGrade}
                    disabled={loading || !answer}
                    className="flex-1 py-4 rounded-2xl bg-[#bc13fe] text-white text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-[#bc13fe]/20 transition-all disabled:opacity-50"
                  >
                    {loading ? 'AI is grading...' : 'Submit Answer'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'grading' && (
              <motion.div key="grading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6">
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                      <circle 
                        cx="48" cy="48" r="40" stroke={gradingResult.is_pass ? "#34d399" : "#fbbf24"} strokeWidth="8" 
                        strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - gradingResult.score/100)}
                        strokeLinecap="round" fill="transparent" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white">{gradingResult.score}</span>
                      <span className="text-[8px] font-black text-gray-500 uppercase">Score</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 mb-10">
                  <h5 className="text-[10px] font-black text-[#bc13fe] uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FiAward /> AI Performance Feedback
                  </h5>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                    "{gradingResult.feedback}"
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setStep('intro')
                      setAnswer('')
                      setGradingResult(null)
                    }}
                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Try Another
                  </button>
                  <button 
                    onClick={onClose}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#bc13fe] to-[#00f3ff] text-white text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all"
                  >
                    Finish Session
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
