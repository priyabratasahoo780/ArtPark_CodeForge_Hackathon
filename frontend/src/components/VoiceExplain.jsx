import React, { useState, useEffect, useRef, useCallback } from 'react'

const API_BASE_URL = 'http://localhost:8000'

/**
 * VoiceExplain — Voice Explanation Component (Feature 6)
 *
 * Strategy (layered, fastest-first):
 *  1. Browser Web Speech API (SpeechSynthesis) — zero latency, no backend call
 *  2. Backend gTTS endpoint    — server-side MP3, fallback if browser TTS unavailable
 *  3. Text-only display        — always available
 */
export default function VoiceExplain({ reasoningTrace, gapStats }) {
  const [mode, setMode] = useState('idle') // idle | speaking | loading | playing | error
  const [script, setScript] = useState('')
  const [audioSrc, setAudioSrc] = useState(null)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [browserTTSAvailable] = useState(() => 'speechSynthesis' in window)
  const utteranceRef = useRef(null)
  const audioRef = useRef(null)

  // Build a concise spoken script client-side (mirrors backend logic, avoids network for speed)
  const buildScript = useCallback(() => {
    const parts = []
    parts.push("Here is your personalized onboarding analysis.")

    if (gapStats) {
      const { known_count, total_required_skills, coverage_percentage, readiness_score, missing_count, partial_count } = gapStats
      parts.push(
        `You currently have ${known_count} out of ${total_required_skills} required skills. ` +
        `Your skill coverage is ${coverage_percentage} percent and your readiness score is ${readiness_score} out of 100.`
      )
      if ((missing_count || 0) + (partial_count || 0) > 0) {
        parts.push(`You have ${missing_count || 0} missing skills and ${partial_count || 0} skills that need improvement.`)
      }
    }

    const roleInfo = reasoningTrace?.role_analysis
    if (roleInfo?.matched_role) {
      parts.push(
        `Your closest role match is ${roleInfo.matched_role}, with ${Math.round((roleInfo.confidence || 0) * 100)} percent confidence.`
      )
      if (roleInfo.skills_added_from_role?.length > 0) {
        parts.push(`Core skills added from your role track: ${roleInfo.skills_added_from_role.slice(0, 4).join(', ')}.`)
      }
    }

    const insights = reasoningTrace?.key_insights || []
    if (insights.length > 0) {
      parts.push("Key insights.")
      insights.slice(0, 3).forEach(i => parts.push(i + '.'))
    }

    const recs = reasoningTrace?.recommendations || []
    if (recs.length > 0) {
      parts.push("Recommendations.")
      recs.slice(0, 2).forEach(r => parts.push(r + '.'))
    }

    parts.push("Good luck with your onboarding journey!")
    return parts.join(' ')
  }, [reasoningTrace, gapStats])

  // ---- Browser Web Speech API ----
  const speakWithBrowser = useCallback(() => {
    if (!browserTTSAvailable) return false
    const text = buildScript()
    setScript(text)
    setMode('speaking')
    setError(null)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.92
    utterance.pitch = 1.0
    utterance.lang = 'en-US'
    utterance.onend = () => setMode('idle')
    utterance.onerror = (e) => {
      setError(`Browser TTS error: ${e.error}`)
      setMode('error')
    }
    utteranceRef.current = utterance
    window.speechSynthesis.cancel() // stop any previous
    window.speechSynthesis.speak(utterance)
    return true
  }, [browserTTSAvailable, buildScript])

  // ---- Backend gTTS fallback ----
  const speakWithBackend = useCallback(async () => {
    setMode('loading')
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/explain/voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reasoning_trace: reasoningTrace, gap_stats: gapStats }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setScript(data.script || '')
      if (data.tts_available && data.audio_b64) {
        const src = `data:${data.audio_mime};base64,${data.audio_b64}`
        setAudioSrc(src)
        setMode('playing')
      } else {
        // Text-only fallback
        setMode('idle')
        setExpanded(true)
      }
    } catch (err) {
      setError(`Could not reach backend TTS: ${err.message}`)
      setMode('error')
      // Still show script from client-side build
      setScript(buildScript())
      setExpanded(true)
    }
  }, [reasoningTrace, gapStats, buildScript])

  // Main speak handler
  const handleSpeak = useCallback(() => {
    if (mode === 'speaking') {
      window.speechSynthesis.cancel()
      setMode('idle')
      return
    }
    if (mode === 'playing' && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setMode('idle')
      return
    }
    if (browserTTSAvailable) {
      speakWithBrowser()
    } else {
      speakWithBackend()
    }
  }, [mode, browserTTSAvailable, speakWithBrowser, speakWithBackend])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  // Auto-play when audio src is ready
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }, [audioSrc])

  const buttonLabel = {
    idle: '🎤 Explain',
    speaking: '⏹ Stop',
    loading: '⏳ Loading...',
    playing: '⏹ Stop',
    error: '🔄 Retry',
  }[mode]

  const buttonColor = {
    idle: 'from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700',
    speaking: 'from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
    loading: 'from-gray-500 to-gray-600 cursor-wait',
    playing: 'from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
    error: 'from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700',
  }[mode]

  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4 shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎤</span>
          <div>
            <p className="font-semibold text-violet-800 text-sm">Voice Explanation</p>
            <p className="text-xs text-violet-500">
              {browserTTSAvailable ? 'Browser TTS ready' : 'Using backend TTS'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Speaking animation */}
          {mode === 'speaking' && (
            <div className="flex items-end gap-0.5 h-5">
              {[1, 2, 3, 2, 1].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-violet-500 rounded-full"
                  style={{
                    height: `${h * 4}px`,
                    animation: `pulse 0.${6 + i}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Main button */}
          <button
            id="voice-explain-btn"
            onClick={handleSpeak}
            disabled={mode === 'loading'}
            className={`px-4 py-2 rounded-lg text-white font-semibold text-sm bg-gradient-to-r transition-all shadow-md ${buttonColor}`}
          >
            {buttonLabel}
          </button>

          {/* Script toggle */}
          {script && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="px-3 py-2 rounded-lg text-violet-700 bg-white border border-violet-200 hover:bg-violet-50 text-sm font-medium transition-all"
            >
              {expanded ? '📄 Hide Text' : '📄 Show Text'}
            </button>
          )}

          {/* Backend TTS fallback button (when browser TTS is available, offer server option too) */}
          {browserTTSAvailable && mode === 'idle' && (
            <button
              onClick={speakWithBackend}
              title="Use server-side TTS (gTTS)"
              className="px-3 py-2 rounded-lg text-violet-600 bg-white border border-violet-200 hover:bg-violet-50 text-sm transition-all"
            >
              ☁️
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
          ⚠️ {error} — showing text below instead.
        </div>
      )}

      {/* Hidden audio element for backend MP3 */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          controls
          className="w-full mt-3 rounded-lg"
          onEnded={() => setMode('idle')}
          onError={() => {
            setError('Audio playback failed')
            setMode('error')
          }}
        />
      )}

      {/* Script text */}
      {expanded && script && (
        <div className="mt-3 p-3 bg-white border border-violet-100 rounded-lg text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
          <p className="font-semibold text-violet-700 mb-1 text-xs uppercase tracking-wide">Script</p>
          {script}
        </div>
      )}
    </div>
  )
}
