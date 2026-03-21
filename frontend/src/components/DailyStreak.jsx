import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiZap, FiAward, FiTarget, FiCalendar, FiStar, FiFlag } from 'react-icons/fi'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const DailyStreak = ({ completedCount }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStreak()
  }, [completedCount])

  const fetchStreak = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/streak/data?completed_count=${completedCount || 0}`)
      setData(resp.data)
    } catch (err) {
      console.error('Streak fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !data) return null

  return (
    <div className="glass-card p-8 border-none bg-[#f59e0b]/5 relative overflow-hidden group">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f59e0b]/10 blur-[60px] rounded-full group-hover:bg-[#f59e0b]/20 transition-all duration-1000"></div>

      <div className="flex items-center justify-between mb-8 relative z-10">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f59e0b]/10 flex items-center justify-center text-xl text-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.2)]">
               <FiZap className={data.daily_goal_met ? "animate-bounce" : ""} />
            </div>
            <div>
               <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Learning Momentum</h3>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">{data.rank} Level Protocol</p>
            </div>
         </div>
         <div className="text-right">
            <div className="text-2xl font-black text-white flex items-center gap-2 justify-end">
               {data.current_streak_days} <span className="text-[#f59e0b] text-base"><FiStar /></span>
            </div>
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Day Streak Active</p>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
         <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Mastery XP</p>
            <h4 className="text-lg font-black text-white">{data.total_xp.toLocaleString()}</h4>
            <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(data.total_xp / data.next_rank_xp) * 100}%` }}
                 className="h-full bg-[#f59e0b]"
               />
            </div>
         </div>
         <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Elite Badges</p>
            <div className="flex items-center gap-1 mt-1">
               {Array.from({ length: 5 }).map((_, i) => (
                 <FiAward key={i} className={`text-xs ${i < data.badges_earned ? "text-[#f59e0b]" : "text-gray-800"}`} />
               ))}
               <span className="text-[8px] font-black text-gray-600 ml-1">+{data.badges_earned - 5 > 0 ? data.badges_earned - 5 : 0}</span>
            </div>
         </div>
      </div>

      <div className="relative z-10">
         <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
               <FiCalendar className="text-[#f59e0b]" /> Neural Consistency Grid
            </p>
            <span className="text-[8px] font-black text-gray-600 uppercase italic">Last 28 Days</span>
         </div>
         <div className="grid grid-cols-7 gap-1">
            {data.weekly_heatmap.map((val, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-[2px] transition-all hover:scale-125 cursor-help ${
                  val === 0 ? "bg-white/[0.02]" :
                  val === 1 ? "bg-[#f59e0b]/20" :
                  val === 2 ? "bg-[#f59e0b]/40" :
                  val === 3 ? "bg-[#f59e0b]/60" :
                  val === 4 ? "bg-[#f59e0b]/80" : "bg-[#f59e0b]"
                }`}
                title={`Activity Level: ${val}`}
              />
            ))}
         </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
         <div className="flex items-center gap-2">
            <FiFlag className="text-[#f59e0b] text-xs" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Next Rank: <span className="text-white">{data.rank === "Expert" ? "MAX" : "Elite"}</span></span>
         </div>
         <div className="text-[9px] font-bold text-gray-600 italic">"Consistency is the forge of giants."</div>
      </div>
    </div>
  )
}

export default DailyStreak
