import React from 'react'
import { FiX, FiAlertTriangle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function ErrorAlert({ message, onDismiss }) {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, x: 100, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.9 }}
        className="fixed top-6 right-6 max-w-sm glass-card border-l-4 border-[#ff00e5] bg-[#ff00e5]/5 p-5 shadow-[0_0_40px_rgba(255,0,229,0.1)] z-[100] flex items-start gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-[#ff00e5]/10 flex items-center justify-center text-[#ff00e5] shadow-lg">
          <FiAlertTriangle className="text-xl" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">System Exception</h3>
          <p className="text-xs text-gray-400 font-medium leading-relaxed">{message}</p>
        </div>

        <button
          onClick={onDismiss}
          className="text-gray-600 hover:text-white transition-colors"
        >
          <FiX className="text-xl" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
