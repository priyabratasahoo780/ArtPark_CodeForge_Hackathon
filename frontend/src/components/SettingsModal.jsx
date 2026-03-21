import React from 'react'
import { motion } from 'framer-motion'
import { FiX, FiCheck, FiMoon, FiSun, FiZap, FiBell, FiGlobe } from 'react-icons/fi'

const SettingsModal = ({ settings, setSettings, onClose }) => {
  const themes = [
    { id: 'midnight', name: 'Midnight Neon', colors: ['#bc13fe', '#00f3ff'] },
    { id: 'solar', name: 'Solar Flare', colors: ['#f59e0b', '#ef4444'] },
    { id: 'deepspace', name: 'Deep Space', colors: ['#3b82f6', '#1e293b'] }
  ]

  const updateSetting = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }))
  }

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
        className="glass-card w-full max-w-lg p-8 border-white/10 space-y-8"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Platform <span className="text-[#00f3ff]">Preferences</span></h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all"><FiX /></button>
        </div>

        {/* Neural Themes */}
        <section className="space-y-4">
           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <FiZap /> Neural Presence Themes
           </label>
           <div className="grid grid-cols-3 gap-3">
              {themes.map(theme => (
                <button 
                  key={theme.id}
                  onClick={() => updateSetting('theme', theme.id)}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${settings.theme === theme.id ? 'border-[#00f3ff] bg-white/5' : 'border-white/5 bg-transparent'}`}
                >
                   <div className="flex gap-1">
                      {theme.colors.map((c, i) => (
                        <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }}></div>
                      ))}
                   </div>
                   <span className="text-[8px] font-black uppercase text-center">{theme.name}</span>
                </button>
              ))}
           </div>
        </section>

        {/* Toggles */}
        <section className="space-y-4">
           {[
             { id: 'audio', label: 'Enable AI Audio Narrations', icon: <FiGlobe /> },
             { id: 'notifications', label: 'Push Milestone Announcements', icon: <FiBell /> },
             { id: 'websockets', label: 'Real-time Social Syncing', icon: <FiSun /> }
           ].map(item => (
             <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="text-gray-500">{item.icon}</div>
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</span>
                </div>
                <button 
                  onClick={() => updateSetting(item.id, !settings[item.id])}
                  className={`w-10 h-5 rounded-full relative transition-all ${settings[item.id] ? 'bg-[#00f3ff]' : 'bg-white/10'}`}
                >
                   <motion.div 
                     animate={{ x: settings[item.id] ? 20 : 2 }}
                     className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-lg"
                   />
                </button>
             </div>
           ))}
        </section>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-[#bc13fe] to-[#00f3ff] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(188,19,254,0.3)]"
        >
          Save & Synchronize Engine
        </button>
      </motion.div>
    </motion.div>
  )
}

export default SettingsModal
