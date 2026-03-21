import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiTarget, FiInfo, FiZap, FiAlertCircle } from 'react-icons/fi'

const NeuralRoadmap = ({ data, completedSkillNames, decayData = [] }) => {
  // SVG Viewport constants
  const width = 1000
  const height = 800
  const nodeRadius = 45

  // Generate node positions based on dynamic layers
  const nodes = useMemo(() => {
    if (!data || !Array.isArray(data)) return []
    
    // Distribute nodes intelligently into neural layers
    const levels = {}
    data.forEach((item, index) => {
      // Dynamic layer assignment (max 2 nodes vertically for an aesthetic neural look)
      const colIdx = Math.floor(index / 2)
      if (!levels[colIdx]) levels[colIdx] = []
      levels[colIdx].push({ ...item, colIdx })
    })

    const result = []
    const levelKeys = Object.keys(levels).map(Number).sort((a, b) => a - b)
    const levelWidth = width / (levelKeys.length + 1)

    levelKeys.forEach((colIdx, idx) => {
      const x = levelWidth * (idx + 1)
      const items = levels[colIdx]
      const levelHeight = height / (items.length + 1)

      items.forEach((item, i) => {
        let y = levelHeight * (i + 1)
        if (items.length === 1 && idx % 2 !== 0) y += 50 // Stagger single nodes

        // Find decay info
        const decayInfo = decayData.find(d => d.name === item.skill_name)
        
        result.push({
          ...item,
          x,
          y,
          isCompleted: Boolean(completedSkillNames && completedSkillNames.has(item.skill_name)),
          decayStatus: decayInfo?.status || 'mastered',
          retention: decayInfo?.retention || 100
        })
      })
    })

    return result
  }, [data, completedSkillNames, decayData])

  // Generate connection lines
  const connections = useMemo(() => {
    const lines = []
    nodes.forEach(node => {
      // Connect to nodes in the next neural layer
      const nextLevelNodes = nodes.filter(n => n.colIdx === node.colIdx + 1)
      nextLevelNodes.forEach(next => {
        lines.push({
          id: `${node.skill_name}-${next.skill_name}`,
          x1: node.x,
          y1: node.y,
          x2: next.x,
          y2: next.y,
          isActive: node.isCompleted && next.isCompleted,
          isPending: node.isCompleted && !next.isCompleted
        })
      })
    })
    return lines
  }, [nodes])

  if (!data || data.length === 0) {
    return (
      <div className="w-full aspect-[5/4] bg-white/[0.02] rounded-3xl border border-white/5 flex items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
          <FiAlertCircle className="text-gray-500 text-2xl" />
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-white uppercase tracking-widest">No Roadmap Data</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 px-10">Run a deep analysis to generate your neural career map</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-[5/4] bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden group">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
        backgroundSize: '30px 30px' 
      }}></div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full relative z-10 p-10">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="line-gradient-active" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="line-gradient-pending" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4b5563" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Neural Connections */}
        {connections.map((conn) => {
          const midX = (conn.x1 + conn.x2) / 2
          const path = `M ${conn.x1} ${conn.y1} C ${midX} ${conn.y1}, ${midX} ${conn.y2}, ${conn.x2} ${conn.y2}`
          
          return (
            <g key={conn.id}>
              <motion.path
                d={path}
                stroke={conn.isActive ? "url(#line-gradient-active)" : "url(#line-gradient-pending)"}
                strokeWidth={conn.isActive ? "3" : "1.5"}
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </g>
          )
        })}

        {/* Neural Nodes */}
        {nodes.map((node, index) => {
          const categoryColors = {
            "Programming Language": ["#3b82f6", "#60a5fa"],
            "Frontend": ["#ec4899", "#f472b6"],
            "Backend": ["#8b5cf6", "#a78bfa"],
            "Database": ["#10b981", "#34d399"],
            "Cloud": ["#f59e0b", "#fbbf24"],
            "DevOps": ["#ef4444", "#f87171"],
            "Other": ["#6b7280", "#9ca3af"]
          }
          const [primaryColor, secondaryColor] = categoryColors[node.category] || categoryColors["Other"]

          return (
            <motion.g
              key={node.skill_name + index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              {/* Node Circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill="#0f172a"
                stroke={node.isCompleted ? primaryColor : "#334155"}
                strokeWidth="2.5"
                className="transition-colors duration-300"
              />

              <defs>
                <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={primaryColor} stopOpacity={node.isCompleted ? 0.3 : 0.1} />
                  <stop offset="100%" stopColor={secondaryColor} stopOpacity={node.isCompleted ? 0.1 : 0.05} />
                </linearGradient>
              </defs>
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius - 2}
                fill={`url(#grad-${index})`}
              />

              {/* Category Label */}
              <text
                x={node.x}
                y={node.y - 8}
                textAnchor="middle"
                className="text-[8px] font-black uppercase tracking-tighter fill-white/40"
              >
                {node.category.substring(0, 5)}
              </text>

              {/* Skill Name */}
              <text
                x={node.x}
                y={node.y + 10}
                textAnchor="middle"
                className="text-[11px] font-bold fill-white"
              >
                {node.skill_name?.length > 12 ? node.skill_name.slice(0, 10) + '..' : node.skill_name}
              </text>

              {/* Icon */}
              <g transform={`translate(${node.x - 10}, ${node.y - 30})`}>
                {node.isCompleted ? <FiZap size={20} color={primaryColor} /> : <FiTarget size={20} color="#334155" />}
              </g>
            </motion.g>
          )
        })}
      </svg>

      {/* Side Legend */}
      <div className="absolute top-8 right-8 space-y-3 pointer-events-none">
         <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/5">
            <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_#8b5cf6]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Neural Path</span>
         </div>
      </div>
    </div>
  )
}

export default NeuralRoadmap
