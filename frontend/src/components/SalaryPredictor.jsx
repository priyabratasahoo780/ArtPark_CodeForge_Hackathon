import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiDollarSign, FiTrendingUp, FiTarget, FiInfo } from 'react-icons/fi'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const SalaryPredictor = ({ role, skills }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrediction()
  }, [role, skills])

  const fetchPrediction = async () => {
    try {
      const resp = await axios.post(`${API_BASE_URL}/salary/predict`, {
        role: role || 'Software Engineer',
        skills: skills || [],
        experience_years: 3
      })
      setData(resp.data)
    } catch (err) {
      console.error('Salary prediction failed:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="rounded-3xl bg-white/[0.03] border border-white/5 p-8 animate-pulse">
      <div className="h-5 bg-white/5 rounded w-1/2 mb-4" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
      </div>
    </div>
  )

  if (!data) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-[#bc13fe]/20 bg-gradient-to-br from-[#bc13fe]/10 via-black/60 to-transparent backdrop-blur-xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#bc13fe]/15 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#bc13fe]/25 transition-all duration-1000" />

      <div className="p-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#bc13fe]/15 border border-[#bc13fe]/30 flex items-center justify-center shadow-[0_0_20px_rgba(188,19,254,0.3)]">
            <FiTrendingUp className="text-[#bc13fe] text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Global Earnings Predictor</h3>
            <p className="text-[9px] font-bold text-[#bc13fe]/60 uppercase tracking-[0.2em] mt-0.5">AI-Projected Market Value</p>
          </div>
        </div>

        {/* Salary range cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Low */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-black/40 border border-white/5 text-center"
          >
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">Entry</p>
            <p className="text-xl font-black text-white">${(data.salary_low / 1000).toFixed(0)}K</p>
            <p className="text-[7px] text-gray-600 uppercase mt-1">Market Low</p>
          </motion.div>

          {/* Mid - Highlighted */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-[#bc13fe]/15 border border-[#bc13fe]/30 text-center shadow-[0_0_30px_rgba(188,19,254,0.15)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#bc13fe]/10 to-transparent" />
            <p className="text-[8px] font-black text-[#bc13fe] uppercase tracking-widest mb-2 relative z-10">You</p>
            <p className="text-2xl font-black text-white relative z-10" style={{ textShadow: '0 0 20px rgba(188,19,254,0.5)' }}>
              ${(data.salary_mid / 1000).toFixed(0)}K
            </p>
            <p className="text-[7px] text-[#bc13fe]/70 uppercase mt-1 relative z-10">Optimized</p>
          </motion.div>

          {/* High */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-black/40 border border-white/5 text-center"
          >
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">Expert</p>
            <p className="text-xl font-black text-white">${(data.salary_high / 1000).toFixed(0)}K</p>
            <p className="text-[7px] text-gray-600 uppercase mt-1">Market High</p>
          </motion.div>
        </div>

        {/* Market Percentile */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Your Market Percentile</span>
            <span className="text-sm font-black text-[#00f3ff]" style={{ textShadow: '0 0 10px rgba(0,243,255,0.5)' }}>
              Top {100 - data.market_percentile}%
            </span>
          </div>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.market_percentile}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#bc13fe] to-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.4)]"
            />
          </div>
          <p className="text-[8px] text-gray-600 uppercase mt-1">{data.market_percentile}th percentile globally</p>
        </div>

        {/* Top paying skills */}
        <div className="mb-6">
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Your Highest-Paying Skills</p>
          <div className="flex flex-wrap gap-2">
            {(data.top_paying_skills || []).map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[8px] font-black text-gray-300 uppercase tracking-wider flex items-center gap-1.5"
              >
                <FiTarget className="text-[#00f3ff] text-xs" /> {skill}
              </motion.span>
            ))}
          </div>
        </div>

        {/* AI Tip */}
        <div className="pt-5 border-t border-white/5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#00f3ff]/10 flex items-center justify-center shrink-0 mt-0.5">
            <FiInfo className="text-[#00f3ff] text-sm" />
          </div>
          <p className="text-[10px] font-medium text-gray-400 leading-relaxed italic">
            "{data.negotiation_tip}"
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default SalaryPredictor
