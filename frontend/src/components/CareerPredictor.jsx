import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiBriefcase, FiDollarSign, FiClock, FiChevronRight } from 'react-icons/fi'
import axios from 'axios'

export default function CareerPredictor({ roadmapData, targetRole, auth }) {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async () => {
    setLoading(true)
    try {
      const config = {
        headers: { Authorization: `Bearer ${auth.token}` }
      }
      const response = await axios.post('https://artpark-codeforge-hackathon.onrender.com/career/predict', {
        roadmap_data: roadmapData,
        target_role: targetRole
      }, config)
      setPrediction(response.data)
    } catch (err) {
      console.error('Prediction failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-8 border-none bg-gradient-to-br from-[#bc13fe]/5 to-transparent rounded-3xl group transition-all duration-500 hover:shadow-[0_0_40px_rgba(188,19,254,0.1)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-2">
            <FiTrendingUp className="text-[#bc13fe]" /> Career Path Predictor
          </h3>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI-powered trajectory analysis</p>
        </div>
        {!prediction && (
          <button 
            onClick={handlePredict}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#00f3ff] transition-all disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Predict Trajectory'}
          </button>
        )}
      </div>

      {prediction ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Role Readiness</span>
              <div className="text-2xl font-black text-[#bc13fe]">{prediction.readiness_score}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Salary Range</span>
              <div className="text-sm font-black text-white">{prediction.market_outlook.salary_range}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Market Growth</span>
              <div className="text-sm font-black text-[#34d399]">{prediction.market_outlook.growth}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Strategic Next Steps</h4>
            <div className="space-y-3">
              {prediction.next_steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 group/step hover:border-white/20 transition-all">
                  <FiChevronRight className="text-[#bc13fe] group-hover/step:translate-x-1 transition-transform" />
                  <p className="text-xs text-gray-400 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiClock className="text-gray-500" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Est. Time to Hire:</span>
                <span className="text-[10px] font-black text-white uppercase">{prediction.estimated_time_to_hire}</span>
              </div>
              <button onClick={() => setPrediction(null)} className="text-[8px] font-black text-gray-600 hover:text-white uppercase tracking-widest">Recalculate</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-10 flex flex-col items-center justify-center text-center opacity-30 select-none">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-500 mb-4 animate-[spin_10s_linear_infinite]"></div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Trajectory Engine Standby</p>
        </div>
      )}
    </div>
  )
}
