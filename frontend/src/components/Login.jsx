import React, { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail as MailIcon, FiLock as LockIcon, FiUser as UserIcon, FiBriefcase as WorkIcon, FiZap as ZapIcon, FiAlertCircle as AlertIcon } from 'react-icons/fi'

const API_BASE_URL = 'https://artpark-codeforge-hackathon.onrender.com'

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER') // 'USER' or 'HR'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login'
      const payload = isRegistering 
        ? { email, password, role } 
        : { email, password } // Login payload doesn't strictly need role, backend infers it
      
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload)
      
      // Save to localStorage
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('role', response.data.role)
      
      onLogin({ token: response.data.access_token, role: response.data.role })
    } catch (err) {
      console.error('Authentication error:', err)
      setError(err.response?.data?.detail || err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#bc13fe]/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#00f3ff]/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#bc13fe] to-[#00f3ff] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(188,19,254,0.4)] mx-auto mb-6 transform rotate-3">
            <ZapIcon className="text-white text-3xl transform -rotate-3" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic leading-none mb-2">
            CodeForge <span className="text-[#00f3ff]">Portal</span>
          </h1>
          <p className="text-[#bc13fe] text-[10px] font-bold uppercase tracking-[0.2em] glow-text-purple">
            AI-Adaptive Engine 2026
          </p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 flex items-center gap-3 text-sm"
              >
                <AlertIcon className="flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MailIcon className="text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0c]/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#bc13fe] focus:ring-1 focus:ring-[#bc13fe] transition-all placeholder-gray-600"
                  placeholder="agent@codeforge.ai"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockIcon className="text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0c]/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#bc13fe] focus:ring-1 focus:ring-[#bc13fe] transition-all placeholder-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Select Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('USER')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        role === 'USER' 
                          ? 'border-[#00f3ff] bg-[#00f3ff]/10 text-white shadow-[0_0_15px_rgba(0,243,255,0.2)]' 
                          : 'border-white/5 bg-white/[0.02] text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <UserIcon className={`text-2xl mb-2 ${role === 'USER' ? 'text-[#00f3ff]' : ''}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Candidate / User</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setRole('HR')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        role === 'HR' 
                          ? 'border-[#bc13fe] bg-[#bc13fe]/10 text-white shadow-[0_0_15px_rgba(188,19,254,0.2)]' 
                          : 'border-white/5 bg-white/[0.02] text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <WorkIcon className={`text-2xl mb-2 ${role === 'HR' ? 'text-[#bc13fe]' : ''}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">HR / Manager</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-[#bc13fe] to-[#8a2be2] hover:from-[#d034ff] hover:to-[#9c3df3] text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(188,19,254,0.3)] transition-all uppercase tracking-widest text-xs disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                isRegistering ? 'Initialize Override' : 'Access Terminal'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-400 font-medium">
              {isRegistering ? 'Already have clearance?' : 'Need system clearance?'}
              <button 
                onClick={() => {
                  setIsRegistering(!isRegistering)
                  setError(null)
                }}
                className="ml-2 text-[#00f3ff] font-bold hover:text-white transition-colors"
              >
                {isRegistering ? 'Login Instead' : 'Register Now'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
