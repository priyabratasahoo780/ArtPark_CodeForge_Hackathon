import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSend, FiCpu, FiExternalLink, FiHelpCircle } from 'react-icons/fi'
import axios from 'axios'

const API_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:8000' : 'https://artpark-codeforge-hackathon.onrender.com'

export default function DoubtModal({ skillName, isOpen, onClose }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/doubt/solve`, {
        skill_name: skillName,
        question: question
      })
      setAnswer(response.data)
    } catch (err) {
      console.error('Doubt solving failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg glass-card overflow-hidden rounded-3xl border border-white/10"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#00f3ff]/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00f3ff]/20 flex items-center justify-center border border-[#00f3ff]/30">
                  <FiHelpCircle className="text-[#00f3ff] text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase tracking-widest text-sm">AI Doubt Solver</h3>
                  <p className="text-xs text-[#00f3ff] font-bold opacity-70">Focus: {skillName}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {!answer ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-white/40 uppercase tracking-widest mb-3 block">What's your technical doubt?</label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder={`e.g. How do I implement middleware in ${skillName}?`}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-[#00f3ff]/50 outline-none min-h-[120px] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00f3ff] to-[#bc13fe] text-white font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-[#00f3ff]/20"
                  >
                    {loading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <FiCpu />
                      </motion.div>
                    ) : (
                      <>
                        <FiSend /> Send to AI Tutor
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="p-4 rounded-2xl bg-[#00f3ff]/5 border border-[#00f3ff]/20">
                    <h4 className="text-[10px] font-black text-[#00f3ff] uppercase tracking-widest mb-2 flex items-center gap-2">
                       <FiCpu /> AI Response
                    </h4>
                    <p className="text-sm text-gray-200 leading-relaxed font-medium">{answer.answer}</p>
                  </div>

                  {answer.resources && answer.resources.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Recommended Concept Deep-Dive</h4>
                      {answer.resources.map((res, i) => (
                        <a 
                          key={i} 
                          href={res.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#bc13fe]/50 transition-all group"
                        >
                          <span className="text-sm text-white font-bold">{res.title}</span>
                          <FiExternalLink className="text-[#bc13fe] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setAnswer(null)}
                    className="w-full py-3 rounded-xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-white/20 transition-all"
                  >
                    Ask another question
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
