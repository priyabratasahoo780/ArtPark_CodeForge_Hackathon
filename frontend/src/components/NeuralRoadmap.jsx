import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiAlertCircle, FiCheck, FiClock, FiTarget } from 'react-icons/fi'

const CATEGORY_COLORS = {
  'Programming Language': '#3b82f6',
  'Frontend': '#ec4899',
  'Frontend Framework': '#ec4899',
  'Backend': '#8b5cf6',
  'Backend Framework': '#8b5cf6',
  'Database': '#10b981',
  'Database Language': '#10b981',
  'Cloud': '#f59e0b',
  'Cloud Platform': '#f59e0b',
  'DevOps': '#ef4444',
  'ML Library': '#a855f7',
  'Other': '#6b7280',
  'General': '#6b7280',
}

const getColor = (category) => CATEGORY_COLORS[category] || CATEGORY_COLORS['Other']

const NeuralRoadmap = ({ data, completedSkillNames, decayData = [] }) => {
  const [hoveredNode, setHoveredNode] = useState(null)

  // Accept either a direct array or an object with .modules
  const modules = useMemo(() => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (Array.isArray(data.modules)) return data.modules
    return []
  }, [data])

  const width = 1200
  const height = 700
  const nodeRadius = 44

  const nodes = useMemo(() => {
    if (!modules.length) return []

    const cols = {}
    modules.forEach((item, index) => {
      const col = Math.floor(index / 2)
      if (!cols[col]) cols[col] = []
      cols[col].push({ ...item, colIdx: col })
    })

    const result = []
    const colKeys = Object.keys(cols).map(Number).sort((a, b) => a - b)
    const colWidth = width / (colKeys.length + 1)

    colKeys.forEach((col, idx) => {
      const x = colWidth * (idx + 1)
      const items = cols[col]
      const rowHeight = height / (items.length + 1)

      items.forEach((item, i) => {
        let y = rowHeight * (i + 1)
        if (items.length === 1 && idx % 2 !== 0) y += 40

        const decay = decayData.find(d => d.name === item.skill_name)
        result.push({
          ...item,
          x,
          y,
          colIdx: col,
          isCompleted: Boolean(completedSkillNames?.has(item.skill_name)),
          decayStatus: decay?.status || 'mastered',
          retention: decay?.retention ?? 100,
        })
      })
    })

    return result
  }, [modules, completedSkillNames, decayData])

  const connections = useMemo(() => {
    const lines = []
    nodes.forEach(node => {
      nodes
        .filter(n => n.colIdx === node.colIdx + 1)
        .forEach(next => {
          lines.push({
            id: `${node.skill_name}-${next.skill_name}`,
            x1: node.x, y1: node.y,
            x2: next.x, y2: next.y,
            active: node.isCompleted && next.isCompleted,
            pending: node.isCompleted && !next.isCompleted,
          })
        })
    })
    return lines
  }, [nodes])

  if (!modules.length) {
    return (
      <div className="w-full aspect-[5/4] bg-white/[0.02] rounded-3xl border border-white/5 flex items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
          <FiAlertCircle className="text-gray-500 text-2xl" />
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-white uppercase tracking-widest">No Roadmap Data</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 px-10">
            Run a deep analysis to generate your neural career map
          </p>
        </div>
      </div>
    )
  }

  // ── Hovered node info
  const hovered = nodes.find(n => n.skill_name === hoveredNode)

  return (
    <div className="relative w-full rounded-3xl border border-white/5 overflow-hidden bg-[#080810]">
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
        {[
          { label: 'Completed', color: '#00f3ff' },
          { label: 'Pending', color: '#334155' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5 bg-black/40 backdrop-blur px-3 py-1.5 rounded-lg border border-white/5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/50">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur px-3 py-1.5 rounded-lg border border-white/5">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/50">
            {nodes.filter(n => n.isCompleted).length} / {nodes.length} Done
          </span>
        </div>
      </div>

      {/* SVG roadmap */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minHeight: 340 }}
      >
        <defs>
          <linearGradient id="conn-active" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="conn-pending" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Connections ── */}
        {connections.map(conn => {
          const mx = (conn.x1 + conn.x2) / 2
          const path = `M ${conn.x1} ${conn.y1} C ${mx} ${conn.y1}, ${mx} ${conn.y2}, ${conn.x2} ${conn.y2}`
          return (
            <motion.path
              key={conn.id}
              d={path}
              stroke={conn.active ? 'url(#conn-active)' : 'url(#conn-pending)'}
              strokeWidth={conn.active ? 3 : 1.5}
              strokeDasharray={conn.pending ? '6 4' : undefined}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          )
        })}

        {/* ── Nodes ── */}
        {nodes.map((node, i) => {
          const color = getColor(node.category)
          const completed = node.isCompleted
          const isHov = hoveredNode === node.skill_name

          return (
            <motion.g
              key={`${node.skill_name}-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.06, duration: 0.4, type: 'spring', stiffness: 200 }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredNode(node.skill_name)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Glow ring for completed */}
              {completed && (
                <circle
                  cx={node.x} cy={node.y} r={nodeRadius + 8}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                  strokeOpacity={0.25}
                />
              )}

              {/* Hover ring */}
              {isHov && (
                <circle
                  cx={node.x} cy={node.y} r={nodeRadius + 6}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeOpacity={0.5}
                />
              )}

              {/* Main circle */}
              <circle
                cx={node.x} cy={node.y} r={nodeRadius}
                fill="#0f172a"
                stroke={completed ? color : '#1e293b'}
                strokeWidth={2.5}
              />

              {/* Inner fill */}
              <circle
                cx={node.x} cy={node.y} r={nodeRadius - 3}
                fill={color}
                fillOpacity={completed ? 0.18 : 0.06}
              />

              {/* Order number (top-left inside circle) */}
              <text
                x={node.x - nodeRadius + 10}
                y={node.y - nodeRadius + 16}
                fontSize={10}
                fontWeight="900"
                fill={color}
                fillOpacity={0.7}
                fontFamily="monospace"
              >
                {node.order || i + 1}
              </text>

              {/* ✓ or target icon as text */}
              <text
                x={node.x}
                y={node.y - 6}
                textAnchor="middle"
                fontSize={18}
                fill={completed ? color : '#475569'}
              >
                {completed ? '✓' : '◎'}
              </text>

              {/* Skill name */}
              <text
                x={node.x}
                y={node.y + 14}
                textAnchor="middle"
                fontSize={10}
                fontWeight="700"
                fill={completed ? '#ffffff' : '#94a3b8'}
                letterSpacing="0.03em"
              >
                {node.skill_name?.length > 11
                  ? node.skill_name.slice(0, 10) + '…'
                  : node.skill_name}
              </text>

              {/* Category badge */}
              <text
                x={node.x}
                y={node.y + 28}
                textAnchor="middle"
                fontSize={7.5}
                fontWeight="800"
                fill={color}
                fillOpacity={0.7}
                letterSpacing="0.08em"
              >
                {(node.category || '').slice(0, 7).toUpperCase()}
              </text>
            </motion.g>
          )
        })}
      </svg>

      {/* Tooltip overlay */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-4 pointer-events-none z-30"
        >
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: getColor(hovered.category), boxShadow: `0 0 8px ${getColor(hovered.category)}` }}
          />
          <div>
            <p className="text-xs font-black text-white uppercase tracking-widest">{hovered.skill_name}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              {hovered.category} · {hovered.difficulty || 'Medium'} · {hovered.time_estimate_hours}h
            </p>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            {hovered.isCompleted ? (
              <span className="text-[10px] font-black text-[#00f3ff] uppercase tracking-widest flex items-center gap-1">
                <FiCheck /> Done
              </span>
            ) : (
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <FiTarget /> Pending
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <FiClock className="text-xs" />
            {hovered.time_estimate_hours}h
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default NeuralRoadmap
