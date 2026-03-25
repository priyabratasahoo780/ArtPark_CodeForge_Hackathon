import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiZap, FiAward, FiCalendar, FiStar, FiFlag, FiTrendingUp } from 'react-icons/fi'
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

  if (loading || !data) return (
    <div className="rounded-3xl bg-white/[0.03] border border-white/5 p-8 h-full animate-pulse">
      <div className="h-4 bg-white/5 rounded mb-3 w-1/2"></div>
      <div className="h-8 bg-white/5 rounded mb-6 w-1/3"></div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({length:28}).map((_,i) => <div key={i} className="aspect-square rounded bg-white/5"></div>)}
      </div>
    </div>
  )

  const xpPct = Math.min(100, Math.round((data.total_xp / data.next_rank_xp) * 100))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-[#f59e0b]/20 bg-gradient-to-br from-[#f59e0b]/10 via-black/60 to-transparent backdrop-blur-xl relative overflow-hidden group h-full"
    >
      {/* Glow blob */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#f59e0b]/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#f59e0b]/30 transition-all duration-1000" />
      
      <div className="p-8 relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f59e0b]/20 border border-[#f59e0b]/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <FiZap className={`text-[#f59e0b] text-xl ${data.daily_goal_met ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Learning Momentum</h3>
              <p className="text-[9px] font-bold text-[#f59e0b]/60 uppercase tracking-[0.2em] mt-0.5">{data.rank} Rank Active</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-white tabular-nums">{data.current_streak_days}</div>
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 justify-end"><FiStar className="text-[#f59e0b]" /> Day Streak</p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-black/30 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Mastery XP Progress</span>
            <span className="text-[9px] font-black text-[#f59e0b]">{data.total_xp.toLocaleString()} / {data.next_rank_xp.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#f59e0b] to-[#fcd34d] shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[8px] text-gray-600 uppercase">{xpPct}% to next rank</span>
            <div className="flex items-center gap-1">
              {Array.from({length: 5}).map((_,i) => (
                <FiAward key={i} className={`text-xs ${i < data.badges_earned ? 'text-[#f59e0b]' : 'text-gray-800'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <FiCalendar className="text-[#f59e0b]" /> Neural Consistency Grid
            </p>
            <span className="text-[8px] text-gray-600 uppercase italic">Last 28 Days</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {data.weekly_heatmap.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
                className={`aspect-square rounded-md transition-all hover:scale-110 cursor-help ${
                  val === 0 ? 'bg-white/[0.03] border border-white/5' :
                  val === 1 ? 'bg-[#f59e0b]/25' :
                  val === 2 ? 'bg-[#f59e0b]/45' :
                  val === 3 ? 'bg-[#f59e0b]/65 shadow-[0_0_6px_rgba(245,158,11,0.4)]' :
                  val === 4 ? 'bg-[#f59e0b]/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                  'bg-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                }`}
                title={`Activity Level: ${val}`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiFlag className="text-[#f59e0b] text-xs" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Next: <span className="text-white">{data.rank === 'Expert' ? 'MAX RANK' : 'Elite'}</span>
            </span>
          </div>
          <span className="text-[8px] font-bold text-gray-600 italic">Consistency is the forge of giants.</span>
        </div>
      </div>
    </motion.div>
  )
}

export default DailyStreak
