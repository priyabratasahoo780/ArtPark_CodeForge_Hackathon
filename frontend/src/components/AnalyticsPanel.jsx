import React, { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts'
import { FiTrendingUp, FiPieChart, FiBarChart2, FiUsers, FiClock, FiActivity } from 'react-icons/fi'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

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
      <p className="text-gray-400 font-medium animate-pulse">Synthesizing visual insights...</p>
    </div>
  )

  if (error) return (
    <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center">
      {error}
    </div>
  )

  if (!data) return null

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Skill Gap Distribution - Pie Chart */}
        <div className="card group hover:border-[#bc13fe]/50 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                <FiPieChart className="text-[#bc13fe]" /> Global Skill Gap
              </h3>
              <p className="text-xs text-gray-500">Aggregate expertise distribution across candidates</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.skill_gap_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {data.skill_gap_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness Trend - Area Chart */}
        <div className="card group hover:border-[#00f3ff]/50 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                <FiTrendingUp className="text-[#00f3ff]" /> Readiness Velocity
              </h3>
              <p className="text-xs text-gray-500">Average candidate readiness score over time</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.readiness_trend}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#00f3ff" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role-wise Performance - Bar Chart */}
        <div className="card lg:col-span-2 group hover:border-[#ff00e5]/50 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                <FiActivity className="text-[#ff00e5]" /> Role Benchmarking
              </h3>
              <p className="text-xs text-gray-500">Mean readiness score and candidate volume per role track</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.role_performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="role" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Legend />
                <Bar dataKey="readiness" fill="#bc13fe" radius={[4, 4, 0, 0]} name="Avg Readiness %" />
                <Bar dataKey="candidates" fill="#00f3ff" radius={[4, 4, 0, 0]} name="Candidate Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Saved by Role - Radar Chart */}
        <div className="card lg:col-span-2 group hover:border-white/20 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                <FiClock className="text-white" /> Onboarding efficiency
              </h3>
              <p className="text-xs text-gray-500">Total training hours saved per domain</p>
            </div>
          </div>
          <div className="h-[400px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.time_saved_by_role}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="role" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 500]} tick={{ fill: '#4b5563' }} axisLine={false} />
                <Radar
                  name="Hours Saved"
                  dataKey="saved"
                  stroke="#bc13fe"
                  fill="#bc13fe"
                  fillOpacity={0.5}
                />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}
