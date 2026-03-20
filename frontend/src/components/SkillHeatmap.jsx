import React from 'react';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';

const CustomizedContent = (props) => {
  const { x, y, width, height, index, name, strength } = props;
  
  // Green = strong (>=80), Yellow = partial (>=40), Red = weak (<40)
  const fillColor = strength >= 80 ? '#22c55e' : strength >= 40 ? '#eab308' : '#ef4444';

  if (width < 30 || height < 30) {
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: fillColor,
          stroke: '#1a1a1a',
          strokeWidth: 2,
        }}
      />
    );
  }

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: fillColor,
          stroke: '#1a1a1a',
          strokeWidth: 2,
        }}
      />
      {width > 60 && height > 40 && (
         <text x={x + width / 2} y={y + height / 2 + 5} textAnchor="middle" fill="#fff" fontSize={11} className="uppercase font-black tracking-widest" style={{ pointerEvents: 'none' }}>
           {name}
         </text>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const levelText = data.strength >= 80 ? 'Strong' : data.strength >= 40 ? 'Partial' : 'Weak';
    return (
      <div className="bg-[#1a1a1a] border border-white/10 p-3 rounded-xl shadow-2xl">
        <p className="text-sm font-black text-white uppercase tracking-widest">{data.name}</p>
        <p className="text-xs text-gray-400 mt-1">Status: <span className={data.strength >= 80 ? 'text-green-500' : data.strength >= 40 ? 'text-yellow-500' : 'text-red-500'}>{levelText}</span></p>
        <p className="text-[10px] text-gray-500 mt-1">Category: {data.category}</p>
      </div>
    );
  }
  return null;
};

export default function SkillHeatmap({ data }) {
  const knownSkills = data?.known_skills || [];
  const partialSkills = data?.partial_skills || [];
  const missingSkills = data?.missing_skills || [];

  if (!knownSkills.length && !partialSkills.length && !missingSkills.length) {
    return null;
  }

  // 1. Map skill to score
  const heatmapData = [
    ...knownSkills.map(s => ({ name: s.name, size: 400, strength: 100, category: s.category })),
    ...partialSkills.map(s => ({ name: s.name, size: 300, strength: 50, category: s.category })),
    ...missingSkills.map(s => ({ name: s.name, size: 250, strength: 10, category: s.category }))
  ];

  const treemapData = [
    {
      name: "Skills Hub",
      children: heatmapData
    }
  ];

  return (
    <div className="card bg-white/[0.02] border-white/10 mt-6">
      <div className="mb-4">
        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
          Skill <span className="text-green-500">Heatmap</span>
        </h2>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
          Visual capability distribution
        </p>
      </div>
      
      <div className="w-full h-[300px] bg-black/50 rounded-2xl overflow-hidden p-2">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="size"
            ratio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
            content={<CustomizedContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Strong</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weak</span>
        </div>
      </div>
    </div>
  );
}
