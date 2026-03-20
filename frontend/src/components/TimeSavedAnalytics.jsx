import React from 'react'

/**
 * TimeSavedAnalytics - Feature 7
 * Renders a premium comparison card: Traditional vs Adaptive learning time.
 */
export default function TimeSavedAnalytics({ data }) {
  if (!data) return null

  const {
    traditional_days,
    traditional_weeks,
    traditional_hours,
    optimized_days,
    optimized_weeks,
    optimized_hours,
    days_saved,
    hours_saved,
    time_saved_label,
    efficiency_gain,
    known_skills_skipped,
    prerequisites_deduped,
    breakdown,
  } = data

  const savedPct = parseFloat(data.time_saved_percent) || 0
  const optimizedPct = 100 - savedPct

  // Colour band based on savings
  const badgeColour =
    savedPct >= 60
      ? 'from-emerald-500 to-green-600'
      : savedPct >= 40
      ? 'from-blue-500 to-indigo-600'
      : 'from-amber-500 to-orange-500'

  return (
    <div className="card overflow-hidden">
      {/* Title row */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">⏱️ Time Saved Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Adaptive vs. traditional one-size-fits-all learning
          </p>
        </div>
        {/* Big badge */}
        <div
          className={`bg-gradient-to-br ${badgeColour} text-white rounded-2xl px-5 py-3 text-center shadow-lg`}
        >
          <div className="text-3xl font-black leading-none">{time_saved_label}</div>
          <div className="text-xs font-semibold tracking-wide opacity-90 mt-0.5">TIME SAVED</div>
        </div>
      </div>

      {/* Visual timeline bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
          <span>0</span>
          <span>{traditional_days} days (traditional)</span>
        </div>
        <div className="relative h-7 rounded-full bg-gray-100 overflow-hidden shadow-inner">
          {/* Optimised portion */}
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-end pr-2 transition-all duration-700"
            style={{ width: `${Math.max(optimizedPct, 4)}%` }}
          >
            <span className="text-white text-xs font-bold whitespace-nowrap">
              {optimized_days}d
            </span>
          </div>
          {/* Saved portion */}
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-emerald-400/40 to-emerald-500/40 flex items-center justify-center"
            style={{
              left: `${Math.max(optimizedPct, 4)}%`,
              width: `${Math.min(savedPct, 96)}%`,
            }}
          >
            <span className="text-emerald-700 text-xs font-bold">
              {days_saved}d saved
            </span>
          </div>
        </div>
        <div className="flex gap-4 mt-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 inline-block" />
            Adaptive path
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-400/60 inline-block" />
            Time saved
          </span>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          emoji="📚"
          label="Traditional"
          primary={`${traditional_days} days`}
          secondary={`${traditional_weeks}w · ${traditional_hours}h`}
          colour="bg-rose-50 border-rose-200 text-rose-700"
        />
        <StatCard
          emoji="🚀"
          label="Adaptive"
          primary={`${optimized_days} days`}
          secondary={`${optimized_weeks}w · ${optimized_hours}h`}
          colour="bg-violet-50 border-violet-200 text-violet-700"
        />
        <StatCard
          emoji="✅"
          label="Time Saved"
          primary={`${days_saved} days`}
          secondary={`${hours_saved}h · ${time_saved_label}`}
          colour="bg-emerald-50 border-emerald-200 text-emerald-700"
        />
        <StatCard
          emoji="⚡"
          label="Efficiency"
          primary={efficiency_gain}
          secondary={`${known_skills_skipped} skills skipped`}
          colour="bg-amber-50 border-amber-200 text-amber-700"
        />
      </div>

      {/* Savings breakdown */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          How the savings were calculated
        </p>
        <div className="space-y-2">
          <BreakdownRow
            icon="✅"
            label={`${known_skills_skipped} known skills skipped`}
            value={`${breakdown?.known_skills_hours_skipped ?? 0}h saved`}
            colour="text-emerald-600"
          />
          <BreakdownRow
            icon="🔗"
            label={`${prerequisites_deduped} prerequisites deduplicated`}
            value={`${breakdown?.prerequisite_dedup_saving_hours ?? 0}h saved`}
            colour="text-blue-600"
          />
          <BreakdownRow
            icon="🗂️"
            label="Overhead eliminated (searches, context-switching)"
            value={`${breakdown?.overhead_hours_eliminated ?? 0}h saved`}
            colour="text-violet-600"
          />
        </div>

        <p className="text-xs text-gray-400 mt-3 italic">
          Traditional model: all required skills from scratch + 20% overhead · {data.hours_per_week_assumed}h/week
        </p>
      </div>
    </div>
  )
}

function StatCard({ emoji, label, primary, secondary, colour }) {
  return (
    <div className={`border rounded-xl p-3 ${colour}`}>
      <div className="text-xl mb-1">{emoji}</div>
      <div className="text-xs font-semibold opacity-70">{label}</div>
      <div className="text-lg font-black leading-tight">{primary}</div>
      <div className="text-xs opacity-60">{secondary}</div>
    </div>
  )
}

function BreakdownRow({ icon, label, value, colour }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-gray-600">
        <span>{icon}</span>
        {label}
      </span>
      <span className={`font-semibold ${colour}`}>{value}</span>
    </div>
  )
}
