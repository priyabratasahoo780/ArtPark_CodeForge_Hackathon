import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiDownload, FiCheckCircle, FiShield, FiStar, FiZap } from 'react-icons/fi';
import axios from 'axios';

const ExecutivePacket = ({ resumeData, masteredSkills, gapStats }) => {
  const [loading, setLoading] = useState(false);
  const [packet, setPacket] = useState(null);

  const generatePacket = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:8000/packet/generate', {
        resume: resumeData,
        skills: masteredSkills,
        gap_stats: gapStats
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTimeout(() => {
        setPacket(response.data);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden h-full">
      <div className="absolute -top-10 -right-10 opacity-10">
        <FiFileText size={200} className="text-blue-500 rotate-12" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <h2 className="text-3xl font-black italic bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
          EXECUTIVE PACKET
        </h2>
        <p className="text-gray-400 text-sm mb-8 max-w-sm">
          A premium, AI-orchestrated bundle of your entire career trajectory, validated for top-tier recruiters.
        </p>

        {!packet ? (
          <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] p-10 bg-white/[0.01]">
            <FiShield size={64} className="text-gray-700 mb-6" />
            <button 
              onClick={generatePacket}
              disabled={loading}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/40 flex items-center gap-3 disabled:opacity-50"
            >
              {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <FiZap />}
              {loading ? "Synthesizing Career Data..." : "Generate Mastery Packet"}
            </button>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-6">Secure AI Validation Required</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-grow space-y-6"
          >
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <FiDownload size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">{packet.packet_id}.pdf</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Ready for distribution</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-blue-400">{packet.readiness_index}%</span>
              </div>
              
              <div className="space-y-2 mb-6">
                {packet.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <FiCheckCircle className="text-emerald-500 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <a 
                href={packet.download_url} 
                className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-white font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3"
              >
                <FiDownload /> Download Alpha Packet
              </a>
            </div>

            <div className="flex items-center gap-4 px-4">
               <div className="flex -space-x-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0c] bg-gray-800 flex items-center justify-center shadow-lg">
                       <FiStar size={12} className="text-yellow-500" />
                    </div>
                  ))}
               </div>
               <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Premium AI Verification Seals Attached</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExecutivePacket;
