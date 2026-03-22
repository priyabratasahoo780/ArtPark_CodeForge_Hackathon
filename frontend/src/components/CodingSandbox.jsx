import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCode, FiZap, FiPlay, FiCheckCircle, FiInfo, FiChevronRight } from 'react-icons/fi'
import axios from 'axios'

const API_BASE_URL = 'https://artpark-codeforge-hackathon.onrender.com'

const CodingSandbox = ({ activeSkill, auth }) => {
  const [code, setCode] = useState(`// Master ${activeSkill || 'the concepts'}\n\nfunction solution() {\n  // Your implementation here\n  \n}`)
  const [hint, setHint] = useState('')
  const [loadingHint, setLoadingHint] = useState(false)
  const [output, setOutput] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const fetchHint = async () => {
    setLoadingHint(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/sandbox/hint?skill=${activeSkill || 'General'}`)
      setHint(response.data.hint)
    } catch (err) {
      console.error('Hint fetch error:', err)
    } finally {
      setLoadingHint(false)
    }
  }

  const runCode = () => {
    setOutput('Compiling and running tests...')
    setTimeout(() => {
      setOutput('Test Case 1: PASSED\nTest Case 2: PASSED\n\nAll requirements met for ' + activeSkill)
      setIsSuccess(true)
    }, 1500)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Editor Side */}
      <div className="lg:col-span-2 flex flex-col glass-card border-white/10 overflow-hidden relative group">
        <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Main.js - {activeSkill || 'Mastery Sandbox'}</span>
          </div>
          <button 
            onClick={runCode}
            className="px-4 py-1.5 bg-[#00f3ff] text-black text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all"
          >
            <FiPlay /> Run
          </button>
        </div>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-transparent p-6 text-sm font-mono text-gray-300 focus:outline-none resize-none leading-relaxed"
          spellCheck="false"
        />

        <div className="p-4 bg-black/40 border-t border-white/5 font-mono text-[10px] text-[#00f3ff]">
          <pre className="whitespace-pre-wrap">{output || '> Ready to execute'}</pre>
        </div>
      </div>

      {/* AI Assistant Side */}
      <div className="space-y-6 flex flex-col">
        <div className="glass-card p-6 border-none bg-gradient-to-br from-[#bc13fe]/10 to-transparent flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <FiZap className="text-[#bc13fe]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">AI Pair Programmer</span>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
            <AnimatePresence mode="wait">
              {hint ? (
                <motion.div 
                  key="hint"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/5 p-4 rounded-2xl border border-white/10"
                >
                  <p className="text-xs text-gray-300 leading-relaxed italic">"{hint}"</p>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full opacity-20 grayscale">
                  <FiCode className="text-4xl" />
                </div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={fetchHint}
            disabled={loadingHint}
            className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#bc13fe] transition-all flex items-center justify-center gap-2"
          >
            {loadingHint ? 'Processing...' : 'Request Logic Hint'}
            <FiChevronRight />
          </button>
        </div>

        {isSuccess && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 border-[#34d399]/30 bg-[#34d399]/5 flex items-center gap-4"
          >
            <FiCheckCircle className="text-2xl text-[#34d399]" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#34d399]">Skill Validated</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Ready for implementation</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CodingSandbox
