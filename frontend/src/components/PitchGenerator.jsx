import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTarget, FiMessageSquare, FiVolume2, FiCopy, FiZap, FiCheck } from 'react-icons/fi';
import axios from 'axios';

const PitchGenerator = ({ masteredSkills }) => {
  const [target, setTarget] = useState('Full Stack Developer');
  const [loading, setLoading] = useState(false);
  const [pitch, setPitch] = useState(null);
  const [copiedType, setCopiedType] = useState(null);

  const generatePitch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://artpark-codeforge-hackathon.onrender.com/pitch/generate', {
        skills: masteredSkills,
        job_target: target
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTimeout(() => {
        setPitch(response.data);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-xl overflow-hidden relative h-full flex flex-col"
    >
      <div className="absolute -top-10 -right-10 opacity-10">
        <FiTarget size={250} className="text-blue-500" />
      </div>

      <div className="relative z-10 flex-grow flex flex-col">
        <h2 className="text-4xl font-black italic bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
          RECRUITER PITCH
        </h2>
        <p className="text-gray-400 mb-8 max-w-md">
          Synthesize your mastery into a high-conversion "Elevator Pitch" tailored for your dream role.
        </p>

        <div className="flex gap-4 mb-8">
          <div className="flex-grow">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 block mb-2">Target Job Role</label>
            <input 
              type="text" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
              placeholder="e.g. Senior Backend Architect"
            />
          </div>
          <button 
            onClick={generatePitch}
            disabled={loading}
            className="self-end p-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50"
          >
            <FiZap size={24} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {pitch && !loading ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-6 flex-grow"
            >
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-xs tracking-widest">
                    <FiMessageSquare /> Short Pitch
                  </div>
                  <button onClick={() => handleCopy(pitch.short_pitch, 'short')} className="text-gray-500 hover:text-white transition-colors">
                    {copiedType === 'short' ? <FiCheck className="text-green-400" /> : <FiCopy />}
                  </button>
                </div>
                <p className="text-lg text-white font-medium italic">"{pitch.short_pitch}"</p>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase text-xs tracking-widest">
                    <FiVolume2 /> Audio Script
                  </div>
                  <button onClick={() => handleCopy(pitch.audio_script, 'audio')} className="text-gray-500 hover:text-white transition-colors">
                    {copiedType === 'audio' ? <FiCheck className="text-green-400" /> : <FiCopy />}
                  </button>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed font-mono">"{pitch.audio_script}"</p>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-xs tracking-widest">
                    <FiTarget /> Full Trajectory Meta
                  </div>
                  <button onClick={() => handleCopy(pitch.long_pitch, 'long')} className="text-gray-500 hover:text-white transition-colors">
                    {copiedType === 'long' ? <FiCheck className="text-green-400" /> : <FiCopy />}
                  </button>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{pitch.long_pitch}</p>
              </div>
            </motion.div>
          ) : loading && (
            <div className="flex flex-col items-center justify-center flex-grow p-10">
              <div className="w-16 h-1 border-white/10 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ left: '-100%' }}
                  animate={{ left: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-blue-500 w-full"
                />
              </div>
              <p className="text-gray-500 text-xs mt-4 font-mono uppercase tracking-tighter">Analyzing Career Trajectory Resonance...</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PitchGenerator;
