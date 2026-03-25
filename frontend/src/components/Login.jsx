import React, { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail as MailIcon, FiLock as LockIcon, FiUser as UserIcon, FiBriefcase as WorkIcon, FiZap as ZapIcon, FiAlertCircle as AlertIcon, FiCheckCircle as CheckIcon, FiArrowLeft as BackIcon, FiShield as ShieldIcon } from 'react-icons/fi'

const API_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:8000' : 'https://artpark-codeforge-hackathon.onrender.com'

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('USER') // 'USER' or 'HR'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const isRegistering = mode === 'register'
  const isForgot = mode === 'forgot'

  const resetState = (newMode) => {
    setMode(newMode)
    setError(null)
    setSuccessMsg(null)
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login'
      const payload = isRegistering 
        ? { email, password, role } 
        : { email, password }
      
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload)
      
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

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email,
        new_password: newPassword,
      })
      setSuccessMsg(response.data.message || 'Password reset successful! You can now log in.')
    } catch (err) {
      console.error('Password reset error:', err)
      setError(err.response?.data?.detail || err.message || 'Password reset failed. Please try again.')
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

          {/* ───── ERROR ───── */}
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

          {/* ───── SUCCESS ───── */}
          <AnimatePresence mode="wait">
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-xl mb-6 flex items-center gap-3 text-sm"
              >
                <CheckIcon className="flex-shrink-0" />
                <p>{successMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════════ FORGOT PASSWORD FORM ═══════════════ */}
          <AnimatePresence mode="wait">
            {isForgot ? (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#bc13fe]/20 to-[#00f3ff]/10 rounded-xl flex items-center justify-center border border-[#bc13fe]/30">
                    <ShieldIcon className="text-[#bc13fe]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">Reset Password</h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Enter your email & new password</p>
                  </div>
                </div>

                {!successMsg ? (
                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Registered Email</label>
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

                    {/* New Password */}
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <LockIcon className="text-gray-500" />
                        </div>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-[#0a0a0c]/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#bc13fe] focus:ring-1 focus:ring-[#bc13fe] transition-all placeholder-gray-600"
                          placeholder="Min. 6 characters"
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <LockIcon className={`${confirmPassword && confirmPassword !== newPassword ? 'text-red-400' : 'text-gray-500'}`} />
                        </div>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full bg-[#0a0a0c]/50 border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none transition-all placeholder-gray-600 ${
                            confirmPassword && confirmPassword !== newPassword
                              ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                              : 'border-white/10 focus:border-[#bc13fe] focus:ring-1 focus:ring-[#bc13fe]'
                          }`}
                          placeholder="Re-enter new password"
                        />
                      </div>
                      {confirmPassword && confirmPassword !== newPassword && (
                        <p className="text-red-400 text-[10px] mt-1 ml-1">Passwords do not match</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 bg-gradient-to-r from-[#bc13fe] to-[#8a2be2] hover:from-[#d034ff] hover:to-[#9c3df3] text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(188,19,254,0.3)] transition-all uppercase tracking-widest text-xs disabled:opacity-50 flex justify-center items-center"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        'Initiate Reset Protocol'
                      )}
                    </button>
                  </form>
                ) : (
                  // Success state — show action to go back to login
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckIcon className="text-green-400 text-3xl" />
                    </div>
                    <p className="text-gray-400 text-xs mb-6">Your password has been updated. Head back to log in with your new credentials.</p>
                    <button
                      onClick={() => resetState('login')}
                      className="w-full bg-gradient-to-r from-[#00f3ff]/20 to-[#bc13fe]/20 border border-[#00f3ff]/30 hover:border-[#00f3ff]/60 text-[#00f3ff] font-black py-3 rounded-xl transition-all uppercase tracking-widest text-xs"
                    >
                      Back to Login
                    </button>
                  </motion.div>
                )}

                {/* Back link */}
                {!successMsg && (
                  <div className="mt-6 pt-5 border-t border-white/10 text-center">
                    <button
                      onClick={() => resetState('login')}
                      className="text-xs text-gray-400 hover:text-[#00f3ff] transition-colors flex items-center gap-1.5 mx-auto"
                    >
                      <BackIcon className="text-sm" />
                      Back to Login
                    </button>
                  </div>
                )}
              </motion.div>

            ) : (
              /* ═══════════════ LOGIN / REGISTER FORM ═══════════════ */
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.25 }}
              >
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
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                      {!isRegistering && (
                        <button
                          type="button"
                          onClick={() => resetState('forgot')}
                          className="text-[10px] text-[#bc13fe] hover:text-[#d034ff] font-bold uppercase tracking-wider transition-colors"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
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
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-[8px] font-bold animate-pulse">Establishing Secure Neural Link...</span>
                      </div>
                    ) : (
                      isRegistering ? 'Initialize Override' : 'Access Terminal'
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                  <p className="text-xs text-gray-400 font-medium">
                    {isRegistering ? 'Already have clearance?' : 'Need system clearance?'}
                    <button 
                      onClick={() => resetState(isRegistering ? 'login' : 'register')}
                      className="ml-2 text-[#00f3ff] font-bold hover:text-white transition-colors"
                    >
                      {isRegistering ? 'Login Instead' : 'Register Now'}
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
