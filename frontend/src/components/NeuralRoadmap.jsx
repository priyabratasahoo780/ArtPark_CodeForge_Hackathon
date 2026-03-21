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
      // Dynamic layer assignment (max 2-3 nodes vertically for an aesthetic neural look)
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
      // Add slight vertical staggering for a more "organic neural" spread
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
          isCompleted: completedSkillNames.has(item.skill_name),
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
      // 1. Try connecting based on exact prerequisites (if provided)
      let explicitConnected = false
      if (node.prerequisites && Array.isArray(node.prerequisites)) {
         node.prerequisites.forEach(prereqName => {
           const prereqNode = nodes.find(n => n.skill_name.toLowerCase() === prereqName.toLowerCase())
           if (prereqNode) {
             explicitConnected = true
             lines.push({
               id: `${prereqNode.skill_name}-${node.skill_name}`,
               x1: prereqNode.x,
               y1: prereqNode.y,
               x2: node.x,
               y2: node.y,
               isActive: prereqNode.isCompleted && node.isCompleted,
               isPending: prereqNode.isCompleted && !node.isCompleted
             })
           }
         })
      }

      // 2. Dense connection fallback: Connect to nodes in the next neural layer
      if (!explicitConnected) {
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
      }
    })
    return lines
  }, [nodes])

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
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connection Lines */}
        {connections.map(line => (
          <motion.line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.isActive ? '#00f3ff' : (line.isPending ? '#bc13fe' : 'rgba(255,255,255,0.05)')}
            strokeWidth={line.isActive ? 4 : 2}
            strokeDasharray={line.isActive ? '0' : '8,8'}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g 
            key={node.skill_name}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05, type: 'spring' }}
            className="cursor-pointer"
          >
            {/* Decay Halo */}
            {node.isCompleted && node.decayStatus !== 'mastered' && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius + 15}
                fill="none"
                stroke={node.decayStatus === 'fading' ? '#f59e0b' : '#ef4444'}
                strokeWidth="2"
                strokeDasharray="4,4"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="opacity-40"
              />
            )}

            {/* Main Node Circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius}
              fill={node.isCompleted ? '#00f3ff' : 'rgba(255,255,255,0.03)'}
              stroke={node.isCompleted ? '#00f3ff' : 'rgba(255,255,255,0.1)'}
              strokeWidth="2"
              filter={node.isCompleted ? 'url(#glow)' : 'none'}
              className="transition-all duration-500"
            />
            
            {/* Progress Ring for Mastered Skills */}
            {node.isCompleted && (
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius - 5}
                fill="none"
                stroke="white"
                strokeWidth="1"
                className="opacity-20"
              />
            )}

            {/* Icon/Symbol Area */}
            <foreignObject
              x={node.x - 20}
              y={node.y - 20}
              width="40"
              height="40"
              className="pointer-events-none"
            >
              <div className="flex items-center justify-center w-full h-full">
                {node.isCompleted ? (
                   <FiZap className="text-white text-xl" />
                ) : (
                   <FiTarget className="text-gray-500 text-xl" />
                )}
              </div>
            </foreignObject>

            {/* Title & Tooltip info */}
            <text
              x={node.x}
              y={node.y + nodeRadius + 25}
              textAnchor="middle"
              className="fill-gray-400 text-[10px] font-black uppercase tracking-widest"
            >
              {node.skill_name?.length > 15 ? node.skill_name.slice(0, 12) + '...' : node.skill_name}
            </text>
            
            {node.isCompleted && node.decayStatus !== 'mastered' && (
              <text
                x={node.x}
                y={node.y + nodeRadius + 38}
                textAnchor="middle"
                className={`text-[8px] font-black uppercase ${node.decayStatus === 'fading' ? 'fill-amber-500' : 'fill-red-500'}`}
              >
                {node.decayStatus === 'fading' ? 'Retention Fading' : 'Needs Refresh'}
              </text>
            )}
          </motion.g>
        ))}
      </svg>

      {/* Side Legend */}
      <div className="absolute top-8 right-8 space-y-3 pointer-events-none">
         <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/5">
            <div className="w-3 h-3 rounded-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00f3ff]">Mastered</span>
         </div>
         <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/5">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b] opacity-40"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Decaying</span>
         </div>
      </div>

      <div className="absolute bottom-8 left-8 flex items-center gap-4">
         <div className="bg-black/60 px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-3">
            <FiInfo className="text-[#bc13fe]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Neural Hierarchy View</span>
         </div>
      </div>
    </div>
  )
}

export default NeuralRoadmap
