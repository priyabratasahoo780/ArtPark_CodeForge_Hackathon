import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAward, FiStar, FiZap, FiTarget, FiCheckCircle } from 'react-icons/fi'

const BADGES = [
  { id: 'early_adopter', name: 'Early Adopter', icon: <FiStar />, criteria: 1, color: '#00f3ff' },
  { id: 'fast_learner', name: 'Fast Learner', icon: <FiZap />, criteria: 3, color: '#bc13fe' },
  { id: 'skill_master', name: 'Skill Master', icon: <FiAward />, criteria: 5, color: '#34d399' },
  { id: 'career_ready', name: 'Career Ready', icon: <FiTarget />, criteria: 8, color: '#fbbf24' }
]

export default function AchievementSystem({ completedCount }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Mastery Milestones</h3>
        <span className="text-[10px] font-black text-[#00f3ff] uppercase bg-[#00f3ff]/10 px-3 py-1 rounded-full border border-[#00f3ff]/20">
          {completedCount} Skills Mastered
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {BADGES.map((badge, i) => {
          const isUnlocked = completedCount >= badge.criteria
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`
                relative p-6 rounded-3xl border transition-all duration-500 flex flex-col items-center text-center gap-3
                ${isUnlocked 
                  ? 'bg-gradient-to-b from-white/[0.08] to-transparent border-white/20 shadow-xl' 
                  : 'bg-black/20 border-white/5 opacity-40 grayscale'}
              `}
            >
              <div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border transition-all duration-500`}
                style={{ 
                  backgroundColor: isUnlocked ? `${badge.color}20` : 'transparent',
                  borderColor: isUnlocked ? `${badge.color}40` : 'rgba(255,255,255,0.1)',
                  color: isUnlocked ? badge.color : 'gray'
                }}
              >
                {isUnlocked ? badge.icon : <FiCheckCircle />}
              </div>
              
              <div>
                <h4 className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                  {badge.name}
                </h4>
                <p className="text-[8px] font-bold text-gray-600 uppercase mt-1">
                  {isUnlocked ? 'Unlocked' : `${badge.criteria} Skills Required`}
                </p>
              </div>

              {isUnlocked && (
                <motion.div
                  layoutId="glow"
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ boxShadow: `inset 0 0 20px ${badge.color}10` }}
                />
              )}
            </motion.div>
          )
        })}
      </div>
      
      {completedCount >= 5 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-gradient-to-r from-[#bc13fe]/20 to-[#00f3ff]/20 border border-white/10 flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl text-white border border-white/10 group-hover:scale-110 transition-transform">
              <FiAward />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase italic tracking-wider">Dynamic Growth Certificate</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ready for high-fidelity export</p>
            </div>
          </div>
          <button onClick={() => window.print()} className="px-6 py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#00f3ff] transition-all print:hidden">
            Download
          </button>
        </motion.div>
      )}
    </div>
  )
}
