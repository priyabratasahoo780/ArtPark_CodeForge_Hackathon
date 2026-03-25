import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMic, FiSquare, FiChevronDown, FiCloud, FiActivity } from 'react-icons/fi'

const API_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:8000' : 'https://artpark-codeforge-hackathon.onrender.com'

export default function VoiceExplain({ reasoningTrace, gapStats, auth }) {
  const [mode, setMode] = useState('idle') // idle | speaking | loading | playing | error
  const [script, setScript] = useState('')
  const [audioSrc, setAudioSrc] = useState(null)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [browserTTSAvailable] = useState(() => 'speechSynthesis' in window)
  const utteranceRef = useRef(null)
  const audioRef = useRef(null)

  const buildScript = useCallback(() => {
    const parts = []
    const role = auth?.role || 'USER'
    
    if (role === 'HR') {
      parts.push("Here is the candidate benchmarking brief.")
      if (gapStats) {
        parts.push(`The candidate matches ${gapStats.known_count} out of ${gapStats.total_required_skills} core competencies, resulting in a readiness score of ${gapStats.readiness_score} percent.`)
      }
      const insights = reasoningTrace?.key_insights || []
      if (insights.length > 0) parts.push("Key potential markers include " + insights.slice(0, 2).join('. '))
    } else {
      parts.push("Here is your personalized onboarding analysis.")
      if (gapStats) {
        parts.push(`You currently have ${gapStats.known_count} out of ${gapStats.total_required_skills} required skills. Readiness score is ${gapStats.readiness_score} percent.`)
      }
      const insights = reasoningTrace?.key_insights || []
      if (insights.length > 0) parts.push("Key insights include " + insights.slice(0, 2).join('. '))
    }
    
    parts.push("End of briefing.")
    return parts.join(' ')
  }, [reasoningTrace, gapStats, auth?.role])

  const speakWithBrowser = useCallback(() => {
    if (!browserTTSAvailable) return false
    const text = buildScript()
    setScript(text)
    setMode('speaking')
    setError(null)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.onend = () => setMode('idle')
    utterance.onerror = () => setMode('error')
    utteranceRef.current = utterance
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    return true
  }, [browserTTSAvailable, buildScript])

  const speakWithBackend = useCallback(async () => {
    setMode('loading')
    try {
      const res = await fetch(`${API_BASE_URL}/explain/voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reasoning_trace: reasoningTrace, 
          gap_stats: gapStats,
          role: auth?.role || 'USER'
        }),
      })
      const data = await res.json()
      setScript(data.script || '')
      if (data.audio_b64) {
        setAudioSrc(`data:${data.audio_mime};base64,${data.audio_b64}`)
        setMode('playing')
      } else {
        setMode('idle'); setExpanded(true)
      }
    } catch (err) {
      setError('Connection failed'); setMode('error')
    }
  }, [reasoningTrace, gapStats, auth?.role])

  const handleSpeak = () => {
    if (mode === 'speaking' || mode === 'playing') {
      window.speechSynthesis.cancel()
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
      setMode('idle')
      return
    }
    browserTTSAvailable ? speakWithBrowser() : speakWithBackend()
  }

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card bg-gradient-to-br from-[#bc13fe]/10 to-[#00f3ff]/5 border-white/10 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
        <FiMic size={40} className="text-[#bc13fe]" />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSpeak}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
                mode === 'speaking' || mode === 'playing' ? 'bg-[#ff00e5] animate-pulse' : 'bg-gradient-to-br from-[#bc13fe] to-[#8a2be2]'
              }`}
            >
              {(mode === 'speaking' || mode === 'playing') ? <FiSquare size={20} /> : <FiMic size={24} />}
            </motion.button>
            {(mode === 'speaking' || mode === 'playing') && (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-2xl border-2 border-[#ff00e5] pointer-events-none"
                />
            )}
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-tight">Neural <span className="text-[#00f3ff]">Narrative</span></h3>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">
              {mode === 'speaking' || mode === 'playing' ? 'Synthesizing Audio Stream...' : 'AI Generated Voice Briefing'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(mode === 'speaking' || mode === 'playing') && (
            <div className="flex items-end gap-1 h-6 px-4 border-l border-white/10">
              {[0.4, 0.8, 0.5, 1.0, 0.7].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['20%', '100%', '20%'] }}
                  transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, ease: 'easeInOut' }}
                  className="w-1 bg-[#00f3ff] rounded-full"
                />
              ))}
            </div>
          )}

          <div className="flex gap-2">
            {script && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="btn-secondary py-1.5 px-3 text-[10px] flex items-center gap-1"
              >
                <FiActivity size={12} /> {expanded ? 'Hide Script' : 'View Script'}
              </button>
            )}
            {browserTTSAvailable && mode === 'idle' && (
              <button onClick={speakWithBackend} className="btn-secondary py-1.5 px-3 text-[10px]" title="Backend Engine">
                <FiCloud size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && script && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            <div className="bg-[#0a0a0c] p-4 rounded-xl border border-white/5 relative">
              <div className="absolute -top-2 left-4 px-2 bg-[#0a0a0c] text-[8px] font-black text-[#bc13fe] uppercase tracking-[0.2em]">Neural Transcript</div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed italic">&quot;{script}&quot;</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {audioSrc && <audio ref={audioRef} src={audioSrc} hidden onEnded={() => setMode('idle')} />}
    </motion.div>
  )
}
