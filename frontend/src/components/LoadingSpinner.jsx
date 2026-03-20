import React from 'react'
import { motion } from 'framer-motion'
import { FiCpu } from 'react-icons/fi'

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-8">
      <div className="relative">
        {/* Outer Glow Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="w-32 h-32 rounded-full border-t-2 border-b-2 border-[#00f3ff] shadow-[0_0_40px_rgba(0,243,255,0.3)]"
        />
        
        {/* Inner Counter-Rotating Ring */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-4 rounded-full border-l-2 border-r-2 border-[#bc13fe] shadow-[0_0_30px_rgba(188,19,254,0.3)]"
        />

        {/* Central Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <FiCpu className="text-3xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </motion.div>
        </div>
      </div>

      <div className="text-center space-y-3">
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
          Neural <span className="text-[#00f3ff]">Synthesis</span>
        </h2>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] font-black text-[#bc13fe] uppercase tracking-[0.4em] animate-pulse">
            Constructing Adaptation Matrix
          </p>
          <div className="flex gap-1.5 mt-2">
            {[0, 0.1, 0.2].map((delay, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 0.8, delay }}
                className="w-1 h-3 bg-[#00f3ff] rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
