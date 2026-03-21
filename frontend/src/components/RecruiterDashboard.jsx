import React from 'react'
import { motion } from 'framer-motion'
import { FiTarget, FiZap, FiActivity, FiGlobe, FiShare2, FiArrowUpRight, FiShield } from 'react-icons/fi'

const RecruiterDashboard = ({ candidateData, learningPath, marketBenchmark }) => {
  return (
    <div className="space-y-10">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 p-10 rounded-[3rem] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6">
           <div className="flex items-center gap-2 px-4 py-2 bg-[#34d399]/10 border border-[#34d399]/20 rounded-full">
              <FiShield className="text-[#34d399]" />
              <span className="text-[10px] font-black text-[#34d399] uppercase tracking-widest">Verified Talent Hub</span>
           </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#bc13fe] to-[#00f3ff] p-1 shadow-2xl">
             <div className="w-full h-full bg-[#0a0a0c] rounded-[1.8rem] flex items-center justify-center">
                <span className="text-3xl font-black text-white">JD</span>
             </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Elite Candidate <span className="text-gray-600 ml-4 font-normal not-italic opacity-40">#CODE-4492</span></h2>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#34d399]"></div>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Open to roles</span>
              </div>
              <div className="flex items-center gap-2">
                 <FiTarget className="text-[#00f3ff]" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">{candidateData?.target_role || 'Senior Engineer'}</span>
              </div>
            </div>
          </div>
        </div>

        <button className="px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all flex items-center gap-3">
           <FiShare2 /> Export Talent Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Readiness Metric */}
        <div className="glass-card p-8 border-none bg-gradient-to-br from-[#00f3ff]/10 to-transparent rounded-3xl col-span-1">
          <h3 className="text-[10px] font-black text-[#00f3ff] uppercase tracking-widest mb-6">Market Readiness Index</h3>
          <div className="flex items-baseline gap-2">
             <span className="text-6xl font-black text-white">{marketBenchmark?.user_percentile || 94}%</span>
             <span className="text-xs font-black text-[#34d399]">+6.2% High</span>
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-4 leading-relaxed">Top 6% against 2,400+ technical candidates verified in the last 30 days.</p>
        </div>

        {/* Growth Velocity */}
        <div className="glass-card p-8 border-none bg-gradient-to-br from-[#bc13fe]/10 to-transparent rounded-3xl col-span-2">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black text-[#bc13fe] uppercase tracking-widest">Mastery Velocity</h3>
              <FiActivity className="text-[#bc13fe]" />
           </div>
           
           <div className="h-24 flex items-end gap-2">
              {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group">
                   <motion.div 
                     initial={{ height: 0 }}
                     animate={{ height: `${h}%` }}
                     className="absolute bottom-0 w-full bg-gradient-to-t from-[#bc13fe] to-[#bc13fe]/40 rounded-t-lg"
                   />
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-4 text-[8px] font-black text-gray-500 uppercase tracking-widest">
              <span>Day 1</span>
              <span>Onboarding Velocity (Past 7 Days)</span>
              <span>Today</span>
           </div>
        </div>
      </div>

      {/* Verified Skills Stack */}
      <div className="glass-card p-8 border-none bg-white/[0.02] rounded-3xl">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8">Verified Technology Stack</h3>
        <div className="flex flex-wrap gap-4">
           {learningPath?.modules?.map((skill, idx) => (
             <div key={idx} className="px-6 py-4 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4 hover:border-[#00f3ff]/30 transition-all cursor-default">
                <div className="w-2 h-2 rounded-full bg-[#00f3ff]"></div>
                <div>
                   <span className="text-xs font-black text-white uppercase tracking-tight">{skill.skill_name}</span>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] font-bold text-gray-600 uppercase">Assessment: </span>
                      <span className="text-[8px] font-black text-[#34d399] uppercase">Verified Platinum</span>
                   </div>
                </div>
                <FiArrowUpRight className="text-gray-700 ml-4" />
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}

export default RecruiterDashboard
