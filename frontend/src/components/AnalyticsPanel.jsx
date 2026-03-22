import React, { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts'
import { FiTrendingUp, FiPieChart, FiBarChart2, FiClock, FiActivity, FiZap } from 'react-icons/fi'
import axios from 'axios'
import { motion } from 'framer-motion'

const API_BASE_URL = 'https://artpark-codeforge-hackathon.onrender.com'

export default function AnalyticsPanel({ auth }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE_URL}/hr/analytics-extended`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        })
        setData(response.data)
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError('Failed to load advanced analytics.')
      } finally {
        setLoading(false)
      }
    }

    if (auth.token) fetchAnalytics()
  }, [auth.token])

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-12 h-12 border-4 border-[#00f3ff] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">Synthesizing visual insights...</p>
    </div>
  )

  if (error) return (
    <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 text-center text-xs font-bold uppercase tracking-widest">
      {error}
    </div>
  )

  if (!data) return null

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
        
        {/* Skill Gap Distribution - Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 group hover:border-[#bc13fe]/40 transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="min-w-0">
              <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                <FiPieChart className="text-[#bc13fe] shrink-0" /> Global <span className="text-[#bc13fe]">Skill Gap</span>
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 truncate"> Expertise distribution across pipeline</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.skill_gap_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {data.skill_gap_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Readiness Trend - Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 group hover:border-[#00f3ff]/40 transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="min-w-0">
              <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                <FiTrendingUp className="text-[#00f3ff] shrink-0" /> Readiness <span className="text-[#00f3ff]">Velocity</span>
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 truncate">Average candidate score progression</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.readiness_trend}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '16px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#00f3ff" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Role-wise Performance - Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 md:col-span-2 group hover:border-[#ff00e5]/40 transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="min-w-0">
              <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                <FiActivity className="text-[#ff00e5] shrink-0" /> Role <span className="text-[#ff00e5]">Benchmarking</span>
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Mean readiness vs candidate volume</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.role_performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="role" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '16px' }}
                />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Bar dataKey="readiness" fill="#bc13fe" radius={[6, 6, 0, 0]} name="Avg Readiness %" barSize={30} />
                <Bar dataKey="candidates" fill="#00f3ff" radius={[6, 6, 0, 0]} name="Volume Index" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Onboarding Efficiency - Radar Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-white/[0.01] p-6 sm:p-8 md:col-span-2 group hover:border-white/20 transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="min-w-0">
              <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                <FiClock className="text-white shrink-0" /> Onboarding <span className="opacity-50">Efficiency</span>
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Predicted training hours saved per domain</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#bc13fe]/10 border border-[#bc13fe]/20">
               <FiZap className="text-[#bc13fe]" />
            </div>
          </div>
          <div className="h-[400px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.time_saved_by_role}>
                <PolarGrid stroke="#ffffff05" />
                <PolarAngleAxis dataKey="role" tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 500]} tick={{ fill: '#374151', fontSize: 8 }} axisLine={false} />
                <Radar
                  name="Hours Saved"
                  dataKey="saved"
                  stroke="#bc13fe"
                  fill="#bc13fe"
                  fillOpacity={0.6}
                  animationDuration={2000}
                />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '16px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
