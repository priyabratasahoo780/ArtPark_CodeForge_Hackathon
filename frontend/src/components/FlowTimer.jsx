import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiPlay, FiPause, FiRefreshCw, FiZap } from 'react-icons/fi'

const FlowTimer = () => {
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [totalMin, setTotalMin] = useState(0)

  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive])

  const formatTime = (s) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const reset = () => {
    setTotalMin(Math.floor(seconds / 60))
    setSeconds(0)
    setIsActive(false)
  }

  return (
    <div className="glass-card p-6 border-none bg-black/40 rounded-3xl flex flex-col items-center justify-center space-y-4">
       <div className="flex items-center gap-2 mb-2">
          <FiClock className="text-[#00f3ff] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Flow State Meter</span>
       </div>
       
       <div className="text-4xl font-black text-white font-mono tracking-tighter">
          {formatTime(seconds)}
       </div>

       <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`p-3 rounded-full transition-all ${isActive ? 'bg-amber-500/20 text-amber-500' : 'bg-[#34d399]/20 text-[#34d399]'}`}
          >
            {isActive ? <FiPause /> : <FiPlay />}
          </button>
          <button 
            onClick={reset}
            className="p-3 rounded-full bg-white/5 text-gray-500 hover:text-white"
          >
            <FiRefreshCw />
          </button>
       </div>

       {totalMin > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4 border-t border-white/5 w-full text-center">
             <div className="flex items-center justify-center gap-2 text-[#bc13fe]">
                <FiZap className="text-[10px]" />
                <span className="text-[9px] font-black uppercase">+ {totalMin} Mastery XP Earned</span>
             </div>
          </motion.div>
       )}
    </div>
  )
}

export default FlowTimer
