import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTarget, FiZap, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import axios from 'axios'

const API_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:8000' : 'https://artpark-codeforge-hackathon.onrender.com'

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

  if (loading || !data) return (
    <div className="rounded-3xl bg-white/[0.03] border border-white/5 p-8 h-full animate-pulse">
      <div className="h-4 bg-white/5 rounded mb-3 w-1/2"></div>
      <div className="w-32 h-32 rounded-full bg-white/5 mx-auto my-6"></div>
    </div>
  )

  const axes = Object.keys(data.axes)
  const svgSize = 200
  const center = svgSize / 2
  const maxR = 70

  const points = axes.map((axis, i) => {
    const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2
    const r = (data.axes[axis] / 100) * maxR
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
  }).join(' ')

  const gradeColor = data.overall_score >= 80 ? '#34d399' : data.overall_score >= 60 ? '#00f3ff' : data.overall_score >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-[#00f3ff]/20 bg-gradient-to-br from-[#00f3ff]/10 via-black/60 to-transparent backdrop-blur-xl relative overflow-hidden group h-full"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#00f3ff]/15 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#00f3ff]/25 transition-all duration-1000" />

      <div className="p-8 relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00f3ff]/15 border border-[#00f3ff]/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.2)]">
              <FiTarget className="text-[#00f3ff] text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Readiness Radar</h3>
              <p className="text-[9px] font-bold text-[#00f3ff]/60 uppercase tracking-[0.2em] mt-0.5">{data.grade} Grade Mastery</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black tabular-nums" style={{ color: gradeColor, textShadow: `0 0 20px ${gradeColor}80` }}>
              {data.overall_score}%
            </div>
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Global Index</p>
          </div>
        </div>

        {/* Spider Chart + Stats */}
        <div className="flex items-center gap-6 flex-1">
          <div className="relative shrink-0" style={{ width: 160, height: 160 }}>
            <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full h-full drop-shadow-[0_0_20px_rgba(0,243,255,0.15)]">
              <defs>
                <filter id="radarGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {[20, 40, 60].map(r => (
                <circle key={r} cx={center} cy={center} r={r * maxR / 80}
                  fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.06" />
              ))}
              {axes.map((_, i) => {
                const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2
                return <line key={i} x1={center} y1={center}
                  x2={center + maxR * Math.cos(angle)} y2={center + maxR * Math.sin(angle)}
                  stroke="white" strokeWidth="0.5" strokeOpacity="0.06" />
              })}
              <motion.polygon
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.3, scale: 1 }}
                points={points}
                fill="#00f3ff"
                className="transition-all duration-1000"
                filter="url(#radarGlow)"
              />
              <motion.polygon
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                points={points}
                fill="none"
                stroke="#00f3ff"
                strokeWidth="1.5"
              />
              {axes.map((axis, i) => {
                const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2
                return (
                  <text key={axis}
                    x={center + (maxR + 18) * Math.cos(angle)}
                    y={center + (maxR + 18) * Math.sin(angle)}
                    textAnchor="middle" dominantBaseline="middle"
                    className="fill-gray-500 uppercase"
                    fontSize="6" fontWeight="900" letterSpacing="1"
                  >{axis}</text>
                )
              })}
            </svg>
          </div>

          <div className="flex-1 space-y-3">
            {axes.map(axis => (
              <div key={axis} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{axis}</span>
                  <span className="text-[8px] font-black" style={{ color: data.axes[axis] >= 70 ? '#34d399' : data.axes[axis] >= 40 ? '#f59e0b' : '#ef4444' }}>
                    {data.axes[axis]}%
                  </span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.axes[axis]}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: data.axes[axis] >= 70 ? '#34d399' : data.axes[axis] >= 40 ? '#f59e0b' : '#ef4444' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom insights */}
        <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#34d399]/5 border border-[#34d399]/20">
            <div className="flex items-center gap-1 mb-1"><FiTrendingUp className="text-[#34d399] text-xs" /><span className="text-[8px] font-black text-[#34d399] uppercase tracking-widest">Strength</span></div>
            <p className="text-[10px] font-black text-white uppercase">{data.top_strength}</p>
            <p className="text-[8px] text-gray-500">{data.axes[data.top_strength]}%</p>
          </div>
          <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
            <div className="flex items-center gap-1 mb-1"><FiTrendingDown className="text-red-400 text-xs" /><span className="text-[8px] font-black text-red-400 uppercase tracking-widest">Gap</span></div>
            <p className="text-[10px] font-black text-white uppercase">{data.top_weakness}</p>
            <p className="text-[8px] text-gray-500">{data.axes[data.top_weakness]}%</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ResumeScoreRadar
