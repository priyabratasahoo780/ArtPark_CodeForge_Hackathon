import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiX, FiSearch, FiInfo, FiZap, FiMap, FiMessageSquare, 
  FiMic, FiCode, FiBookOpen, FiGlobe, FiChevronRight 
} from 'react-icons/fi'

const HelpCenter = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('getting_started')

  const helpData = [
    {
      id: 'getting_started',
      icon: <FiZap className="text-[#bc13fe]" />,
      title: 'Getting Started',
      content: 'CodeForge uses AI to analyze your resume against a Job Description. Start by uploading both to generate your first Neural Roadmap.'
    },
    {
      id: 'roadmap',
      icon: <FiMap className="text-[#00f3ff]" />,
      title: 'Neural Roadmap',
      content: 'An interactive SVG visualization of your skill gaps. Nodes represent skills; connections represent dependencies. Mastered skills glow cyan.'
    },
    {
      id: 'podcast',
      icon: <FiMic className="text-[#ff00e5]" />,
      title: 'AI Podcast',
      content: 'Generates a personalized audio briefing of your current status, recent wins, and the next big milestone in your journey.'
    },
    {
      id: 'sandbox',
      icon: <FiCode className="text-[#34d399]" />,
      title: 'Mastery Sandbox',
      content: 'A safe environment to practice code. Use the AI Pair Programmer for logical hints when you get stuck during implementation.'
    },
    {
      id: 'biometrics',
      icon: <FiInfo className="text-amber-500" />,
      title: 'Neural Load',
      content: 'Tracks your learning velocity and burnout risk. The Skill-Decay Heatmap shows which skills need refreshing based on retention curves.'
    }
  ]

  const filteredData = helpData.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card w-full max-w-4xl max-h-[80vh] overflow-hidden border-white/10 flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Help & <span className="text-[#bc13fe]">Guides</span></h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Master every feature of the CodeForge ecosystem</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all">
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 border-r border-white/5 p-6 space-y-2 hidden md:block">
             <div className="relative mb-6">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input 
                  type="text" 
                  placeholder="Search guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold focus:outline-none focus:border-[#bc13fe] transition-all"
                />
             </div>
             
             {helpData.map(cat => (
               <button 
                 key={cat.id}
                 onClick={() => setActiveCategory(cat.id)}
                 className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeCategory === cat.id ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
               >
                 {cat.icon}
                 <span className="text-[10px] font-black uppercase tracking-widest">{cat.title}</span>
               </button>
             ))}
          </aside>

          {/* Content */}
          <main className="flex-1 p-8 overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
               <motion.div 
                 key={activeCategory}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                 {filteredData.map(item => (
                   item.id === activeCategory && (
                     <div key={item.id}>
                        <div className="flex items-center gap-4 mb-6">
                           <div className="text-3xl">{item.icon}</div>
                           <h3 className="text-xl font-black text-white uppercase tracking-tight">{item.title}</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed font-bold border-l-2 border-[#bc13fe]/20 pl-6 py-2">{item.content}</p>
                        
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <span className="text-[9px] font-black text-gray-600 uppercase block mb-2">Pro Tip</span>
                              <p className="text-[10px] text-gray-300">Master 3 base skills to unlock the Career Predictor dashboard.</p>
                           </div>
                           <div className="p-4 bg-[#bc13fe]/5 rounded-2xl border border-[#bc13fe]/10">
                              <span className="text-[9px] font-black text-[#bc13fe] uppercase block mb-2">Neural Link</span>
                              <p className="text-[10px] text-gray-300">WebSockets ensure your progress is synced across all team sessions instantly.</p>
                           </div>
                        </div>
                     </div>
                   )
                 ))}
               </motion.div>
            </AnimatePresence>
          </main>
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-white/[0.02] border-t border-white/10 flex justify-center gap-8">
           <div className="flex items-center gap-2 grayscale opacity-40">
              <FiGlobe className="text-[10px]" />
              <span className="text-[8px] font-black uppercase tracking-widest">Global Support Hub</span>
           </div>
           <div className="flex items-center gap-2 grayscale opacity-40">
              <FiMessageSquare className="text-[10px]" />
              <span className="text-[8px] font-black uppercase tracking-widest">Community Discord</span>
           </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default HelpCenter
