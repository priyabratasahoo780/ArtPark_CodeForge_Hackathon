import React, { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const TIER_STYLES = {
  'Strong Fit 🟢':      { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', ring: 'border-emerald-400' },
  'Potential Fit 🟡':   { bar: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700 border-amber-200',   ring: 'border-amber-400' },
  'Moderate Gap 🟠':    { bar: 'bg-orange-400',  badge: 'bg-orange-100 text-orange-700 border-orange-200', ring: 'border-orange-400' },
  'Significant Gap 🔴': { bar: 'bg-red-400',     badge: 'bg-red-100 text-red-700 border-red-200',         ring: 'border-red-400' },
}

const EMPTY_CANDIDATE = { name: '', resumeText: '' }

/**
 * CandidateBenchmark — Feature 8
 * A self-contained panel with its own submit flow (separate from main analysis).
 */
export default function CandidateBenchmark() {
  const [jdText, setJdText] = useState('')
  const [candidates, setCandidates] = useState([
    { ...EMPTY_CANDIDATE, name: 'Candidate 1' },
    { ...EMPTY_CANDIDATE, name: 'Candidate 2' },
  ])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addCandidate = () => {
    if (candidates.length >= 10) return
    setCandidates(prev => [...prev, { name: `Candidate ${prev.length + 1}`, resumeText: '' }])
  }

  const removeCandidate = (idx) => {
    if (candidates.length <= 2) return
    setCandidates(prev => prev.filter((_, i) => i !== idx))
  }

  const updateCandidate = (idx, field, value) => {
    setCandidates(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c))
  }

  const handleBenchmark = async () => {
    if (!jdText.trim()) { setError('Please enter a job description.'); return }
    const valid = candidates.filter(c => c.resumeText.trim().length >= 10)
    if (valid.length < 2) { setError('Please provide at least 2 resumes with content.'); return }

    setLoading(true); setError(null); setResults(null)
    try {
      const resp = await axios.post(`${API_BASE_URL}/benchmark/candidates`, {
        job_description_text: jdText,
        candidates: valid.map(c => ({ name: c.name || 'Unnamed', resume_text: c.resumeText })),
      })
      setResults(resp.data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Benchmark failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Job Description */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-3">💼 Job Description</h3>
        <textarea
          id="benchmark-jd"
          value={jdText}
          onChange={e => setJdText(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Candidate inputs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">👥 Candidates ({candidates.length})</h3>
          <button
            onClick={addCandidate}
            disabled={candidates.length >= 10}
            className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-40 transition-all"
          >
            + Add Candidate
          </button>
        </div>
        <div className="space-y-4">
          {candidates.map((c, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={c.name}
                  onChange={e => updateCandidate(idx, 'name', e.target.value)}
                  placeholder="Candidate name"
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                {candidates.length > 2 && (
                  <button
                    onClick={() => removeCandidate(idx)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >✕</button>
                )}
              </div>
              <textarea
                value={c.resumeText}
                onChange={e => updateCandidate(idx, 'resumeText', e.target.value)}
                placeholder={`Paste ${c.name || 'candidate'}'s resume text...`}
                className="w-full h-28 p-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}

      {/* Run button */}
      <button
        id="run-benchmark-btn"
        onClick={handleBenchmark}
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg"
      >
        {loading ? '⏳ Benchmarking...' : '🏆 Run Benchmark'}
      </button>

      {/* Results */}
      {results && <BenchmarkResults results={results} />}
    </div>
  )
}

function BenchmarkResults({ results }) {
  const { ranked_candidates: candidates, summary, job_description_skills } = results
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg">
        <h3 className="text-lg font-bold mb-3">📊 Benchmark Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryChip label="Candidates" value={summary.total_candidates} />
          <SummaryChip label="Strong Fits" value={summary.strong_fits} />
          <SummaryChip label="Avg Score" value={`${summary.avg_composite_score}/100`} />
          <SummaryChip label="JD Skills" value={summary.total_required_skills} />
        </div>
        {summary.matched_role && (
          <p className="mt-3 text-indigo-200 text-sm">
            📌 Role matched: <strong className="text-white">{summary.matched_role.role}</strong>
            {' '}({Math.round(summary.matched_role.confidence * 100)}% confidence)
          </p>
        )}
      </div>

      {/* Ranked list */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 Candidate Rankings</h3>
        <div className="space-y-3">
          {candidates.map(c => {
            const tier = TIER_STYLES[c.recommendation] || TIER_STYLES['Significant Gap 🔴']
            const isExpanded = expanded === c.rank
            return (
              <div
                key={c.rank}
                className={`border-2 rounded-xl ${tier.ring} overflow-hidden transition-all`}
              >
                {/* Card header */}
                <button
                  className="w-full text-left p-4 hover:bg-gray-50 transition-all"
                  onClick={() => setExpanded(isExpanded ? null : c.rank)}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank badge */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white shadow ${
                      c.rank === 1 ? 'bg-amber-400' : c.rank === 2 ? 'bg-gray-400' : c.rank === 3 ? 'bg-orange-400' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {c.rank === 1 ? '🥇' : c.rank === 2 ? '🥈' : c.rank === 3 ? '🥉' : `#${c.rank}`}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-800 truncate">{c.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tier.badge}`}>
                          {c.recommendation}
                        </span>
                      </div>
                      {/* Score bar */}
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${tier.bar} transition-all duration-700`}
                            style={{ width: `${c.composite_score}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-14 text-right">
                          {c.composite_score}/100
                        </span>
                      </div>
                    </div>

                    {/* Mini stats */}
                    <div className="hidden md:flex gap-3 text-xs text-gray-500 items-center">
                      <span>Match: <strong className="text-gray-700">{c.skill_match_pct}%</strong></span>
                      <span>Gap: <strong className="text-gray-700">{c.gap_score}</strong></span>
                      <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                    {c.error ? (
                      <p className="text-red-500 text-sm mt-3">⚠️ {c.error}</p>
                    ) : (
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <MiniStat label="Coverage" value={`${c.skill_match_pct}%`} />
                        <MiniStat label="Readiness" value={`${c.readiness_score}/100`} />
                        <MiniStat label="Confidence" value={`${Math.round(c.avg_confidence * 100)}%`} />
                        <MiniStat label="Percentile" value={`Top ${Math.round(100 - c.percentile + 1)}%`} />
                        <SkillPills label="✅ Known" skills={c.known_skills} colour="bg-emerald-100 text-emerald-700" />
                        <SkillPills label="⚠️ Partial" skills={c.partial_skills} colour="bg-amber-100 text-amber-700" />
                        <SkillPills label="❌ Missing" skills={c.missing_skills} colour="bg-red-100 text-red-700" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* JD skills reference */}
      {job_description_skills?.length > 0 && (
        <div className="card">
          <p className="text-sm font-semibold text-gray-600 mb-2">📋 Required JD Skills ({job_description_skills.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {job_description_skills.map(s => (
              <span key={typeof s === 'string' ? s : s.name}
                className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                {typeof s === 'string' ? s : s.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryChip({ label, value }) {
  return (
    <div className="bg-white/20 rounded-lg p-2.5 text-center">
      <div className="text-xl font-black">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-2.5">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="font-bold text-gray-800">{value}</div>
    </div>
  )
}

function SkillPills({ label, skills, colour }) {
  if (!skills?.length) return null
  return (
    <div className="col-span-2 md:col-span-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex flex-wrap gap-1">
        {skills.map(s => (
          <span key={s} className={`px-2 py-0.5 rounded-full text-xs font-medium ${colour}`}>{s}</span>
        ))}
      </div>
    </div>
  )
}
