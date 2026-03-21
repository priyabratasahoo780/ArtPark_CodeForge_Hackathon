import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiDollarSign, FiTrendingUp, FiTarget, FiInfo, FiBriefcase } from 'react-icons/fi'
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
        role: role || "Software Engineer",
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
    <div className="glass-card p-8 h-64 flex flex-col justify-center items-center gap-4">
      <div className="w-10 h-10 border-4 border-[#00f3ff]/20 border-t-[#00f3ff] rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00f3ff]">Calculating Potential...</p>
    </div>
  )

  if (!data) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 border-none bg-gradient-to-br from-[#bc13fe]/5 to-transparent relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
         <FiDollarSign className="text-8xl text-[#bc13fe]" />
      </div>

      <div className="flex items-center gap-4 mb-8">
         <div className="w-12 h-12 rounded-2xl bg-[#bc13fe]/10 flex items-center justify-center text-xl text-[#bc13fe] shadow-[0_0_20px_rgba(188,19,254,0.2)]">
            <FiTrendingUp />
         </div>
         <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Global Earnings Predictor</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">AI-Projected Market Value</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
         <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Market Low</p>
            <h4 className="text-2xl font-black text-white">${data.salary_low.toLocaleString()}<span className="text-[10px] text-gray-600 block">entry level / median lo</span></h4>
         </div>
         <div className="p-6 bg-[#bc13fe]/10 rounded-3xl border border-[#bc13fe]/20 shadow-[0_0_40px_rgba(188,19,254,0.1)]">
            <p className="text-[9px] font-black text-[#bc13fe] uppercase tracking-widest mb-1">Projected Mid</p>
            <h4 className="text-3xl font-black text-white">${data.salary_mid.toLocaleString()}<span className="text-[10px] text-gray-400 block font-bold">OPTIMIZED ESTIMATE</span></h4>
         </div>
         <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Market High</p>
            <h4 className="text-2xl font-black text-white">${data.salary_high.toLocaleString()}<span className="text-[10px] text-gray-600 block">expert / niche mastery</span></h4>
         </div>
      </div>

      <div className="space-y-6">
         <div>
            <div className="flex justify-between items-end mb-2">
               <p className="text-[10px] font-black text-white uppercase tracking-widest">Market Percentile</p>
               <span className="text-sm font-black text-[#00f3ff]">{data.market_percentile}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${data.market_percentile}%` }}
                 transition={{ duration: 1.5, ease: 'easeOut' }}
                 className="h-full bg-gradient-to-r from-[#bc13fe] to-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.5)]"
               />
            </div>
         </div>

         <div className="flex flex-wrap gap-2">
            {data.top_paying_skills.map(skill => (
              <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <FiTarget className="text-[#00f3ff]" /> {skill}
              </span>
            ))}
         </div>

         <div className="pt-6 border-t border-white/5 flex items-start gap-4">
            <FiInfo className="text-xl text-[#00f3ff] mt-1 shrink-0" />
            <p className="text-[11px] font-medium text-gray-400 leading-relaxed italic">
               "{data.negotiation_tip}"
            </p>
         </div>
      </div>
    </motion.div>
  )
}

export default SalaryPredictor
