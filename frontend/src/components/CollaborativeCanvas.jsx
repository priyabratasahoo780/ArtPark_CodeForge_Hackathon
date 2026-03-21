import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiEdit3, FiTrash2, FiUsers, FiShare2 } from 'react-icons/fi'

const CollaborativeCanvas = ({ sessionId, auth }) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [paths, setPaths] = useState([])
  const [currentPath, setCurrentPath] = useState([])
  const [color, setColor] = useState('#00f3ff')
  const svgRef = useRef(null)
  const wsRef = useRef(null)

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `ws://localhost:8000/ws/progress/${sessionId}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'draw_event') {
        setPaths(prev => [...prev, message.path])
      }
    }

    return () => ws.close()
  }, [sessionId])

  const getCoordinates = (e) => {
    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    const coords = getCoordinates(e)
    setCurrentPath([coords])
  }

  const draw = (e) => {
    if (!isDrawing) return
    const coords = getCoordinates(e)
    setCurrentPath(prev => [...prev, coords])
  }

  const endDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    
    const newPath = { 
      points: currentPath, 
      color, 
      id: Date.now(),
      user: auth.role 
    }
    
    setPaths(prev => [...prev, newPath])
    
    // Broadcast to others
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'draw_event',
        path: newPath
      }))
    }
    
    setCurrentPath([])
  }

  const clearCanvas = () => {
    setPaths([])
  }

  return (
    <div className="glass-card p-0 overflow-hidden relative border border-white/10 rounded-3xl h-[600px] flex flex-col">
      {/* Toolbar */}
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FiEdit3 className="text-[#00f3ff]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Neural Whiteboard</span>
          </div>
          <div className="flex gap-2">
            {['#00f3ff', '#bc13fe', '#ff00e5', '#34d399'].map(c => (
              <button 
                key={c}
                onClick={() => setColor(c)}
                className={`w-4 h-4 rounded-full border-2 transition-all ${color === c ? 'border-white scale-125' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <FiUsers className="text-[10px] text-gray-500" />
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Live Session: {sessionId.slice(-4)}</span>
          </div>
          <button onClick={clearCanvas} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-all">
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 cursor-crosshair relative bg-black/40">
        <svg
          ref={svgRef}
          className="w-full h-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
        >
          {paths.map((path) => (
            <path
              key={path.id}
              d={`M ${path.points.map(p => `${p.x},${p.y}`).join(' L')}`}
              fill="none"
              stroke={path.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]"
            />
          ))}
          {isDrawing && currentPath.length > 0 && (
            <path
              d={`M ${currentPath.map(p => `${p.x},${p.y}`).join(' L')}`}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-50"
            />
          )}
        </svg>

        {/* Floating Instruction */}
        {paths.length === 0 && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center grayscale opacity-20">
              <FiShare2 className="text-6xl mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-[0.3em]">Collaborative Architecture Sketch</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollaborativeCanvas
