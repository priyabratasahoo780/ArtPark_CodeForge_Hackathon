import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const SkillGalaxy = ({ masteredSkills }) => {
  const [data, setData] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/galaxy/data?skills=${masteredSkills.join(',')}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (masteredSkills?.length > 0) fetchData();
  }, [masteredSkills]);

  if (!data) return null;

  return (
    <div className="relative w-full h-[600px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden group cursor-grab active:cursor-grabbing">
      {/* Background Starfield */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random(),
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>

      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-4xl font-black italic bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          SKILL GALAXY
        </h2>
        <p className="text-gray-500 text-sm mt-2">Interactive 3D Neural Universe</p>
      </div>

      <motion.div 
        ref={containerRef}
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        className="relative w-full h-full flex items-center justify-center p-20"
      >
        <svg viewBox="0 0 1000 1000" className="w-[80%] h-[80%] transform-gpu origin-center overflow-visible">
          {/* Central Core */}
          <radialGradient id="coreGradient">
            <stop offset="0%" stopColor="#bc13fe" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <circle cx="500" cy="500" r="150" fill="url(#coreGradient)" className="opacity-40 animate-pulse" />
          
          {/* Orbital Rings */}
          <circle cx="500" cy="500" r="250" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
          <circle cx="500" cy="500" r="400" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />

          {/* Connections */}
          {data.connections.map((conn, idx) => {
            const from = data.nodes.find(n => n.id === conn.from);
            const to = data.nodes.find(n => n.id === conn.to);
            if (!from || !to) return null;
            return (
              <motion.line 
                key={`conn-${idx}`}
                x1={500 + (from.position.x / 2)}
                y1={500 + (from.position.y / 2)}
                x2={500 + (to.position.x / 2)}
                y2={500 + (to.position.y / 2)}
                stroke="#00f3ff"
                strokeWidth="1"
                strokeOpacity="0.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            );
          })}

          {/* Nodes */}
          {data.nodes.map((node) => (
            <motion.g 
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                translateX: (node.position.x / 2),
                translateY: (node.position.y / 2)
              }}
              whileHover={{ scale: 1.2 }}
              className="cursor-pointer"
            >
              <filter id={`glow-${node.id}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              <circle 
                cx="500" 
                cy="500" 
                r="12" 
                fill={node.color} 
                filter={`url(#glow-${node.id})`}
              />
              <text 
                x="500" 
                y="535" 
                textAnchor="middle" 
                className="text-[14px] font-bold fill-white/80 pointer-events-none drop-shadow-lg"
              >
                {node.label}
              </text>
              <text 
                x="500" 
                y="550" 
                textAnchor="middle" 
                className="text-[10px] font-mono fill-gray-500 pointer-events-none"
              >
                LEVEL {node.level}%
              </text>
            </motion.g>
          ))}
        </svg>
      </motion.div>

      <div className="absolute bottom-8 right-8 flex gap-4">
        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          {data.nodes.length} Neural Nodes Active
        </div>
      </div>
    </div>
  );
};

export default SkillGalaxy;
