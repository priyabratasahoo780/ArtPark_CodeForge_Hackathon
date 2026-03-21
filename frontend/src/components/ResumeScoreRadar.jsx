import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTarget, FiZap, FiChevronRight } from 'react-icons/fi'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const ResumeScoreRadar = ({ skills, gapStats }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScore()
  }, [skills, gapStats])

  const fetchScore = async () => {
    try {
      const resp = await axios.post(`${API_BASE_URL}/resume/score`, {
        skills: skills || [],
        gap_stats: gapStats || {}
      })
      setData(resp.data)
    } catch (err) {
      console.error('Resume scoring failed:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !data) return null

  const axes = Object.keys(data.axes)
  const points = axes.map((axis, i) => {
    const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2
    const r = (data.axes[axis] / 100) * 80
    return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`
  }).join(' ')

  return (
    <div className="glass-card p-8 border-none bg-gradient-to-tr from-[#00f3ff]/5 to-transparent relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00f3ff]/10 flex items-center justify-center text-xl text-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.2)]">
               <FiTarget />
            </div>
            <div>
               <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">6-Axis Readiness Radar</h3>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">{data.grade} Grade Mastery</p>
            </div>
         </div>
         <div className="text-center">
            <h4 className="text-3xl font-black text-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">{data.overall_score}%</h4>
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Global Index</p>
         </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12">
         <div className="relative w-48 h-48 shrink-0">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,243,255,0.2)]">
               {/* Background spider web */}
               {[20, 40, 60, 80].map(r => (
                 <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.05" />
               ))}
               {axes.map((_, i) => {
                 const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2
                 return (
                   <line key={i} x1="100" y1="100" x2={100 + 80 * Math.cos(angle)} y2={100 + 80 * Math.sin(angle)} stroke="white" strokeWidth="0.5" strokeOpacity="0.05" />
                 )
               })}
               
               {/* Data polygon */}
               <motion.polygon
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 0.4, scale: 1 }}
                 points={points}
                 fill="#00f3ff"
                 className="transition-all duration-1000"
               />
               <motion.polygon
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 points={points}
                 fill="none"
                 stroke="#00f3ff"
                 strokeWidth="1.5"
                 className="transition-all duration-1000"
               />
               
               {/* Axis Labels */}
               {axes.map((axis, i) => {
                 const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2
                 const x = 100 + 95 * Math.cos(angle)
                 const y = 100 + 95 * Math.sin(angle)
                 return (
                   <text 
                     key={axis} 
                     x={x} 
                     y={y} 
                     textAnchor="middle" 
                     className="text-[6px] font-black fill-gray-500 uppercase tracking-tighter"
                   >
                     {axis}
                   </text>
                 )
               })}
            </svg>
         </div>

         <div className="flex-1 space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-[9px] font-black text-[#00f3ff] uppercase mb-1">Top Strength</p>
                <div className="flex items-center justify-between">
                   <span className="text-sm font-black text-white uppercase tracking-tight">{data.top_strength}</span>
                   <span className="text-xs font-black text-[#34d399]">{data.axes[data.top_strength]}%</span>
                </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-[9px] font-black text-red-400 uppercase mb-1">Primary Gap</p>
                <div className="flex items-center justify-between">
                   <span className="text-sm font-black text-white uppercase tracking-tight">{data.top_weakness}</span>
                   <span className="text-xs font-black text-red-400">{data.axes[data.top_weakness]}%</span>
                </div>
            </div>
            <div className="flex items-start gap-3 mt-4">
               <FiZap className="text-[#00f3ff] text-lg mt-1 shrink-0" />
               <p className="text-[10px] font-medium text-gray-400 leading-relaxed italic">
                  "{data.ai_verdict}"
               </p>
            </div>
         </div>
      </div>
    </div>
  )
}

export default ResumeScoreRadar
