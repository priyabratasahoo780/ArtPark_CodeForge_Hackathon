import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiAward, FiTrendingUp, FiZap, FiShield } from 'react-icons/fi';
import axios from 'axios';

const SquadHub = ({ masteredSkills }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/squad/stats?skills=${masteredSkills.join(',')}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [masteredSkills]);

  if (loading) return null;

  return (
    <div className="p-8 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden h-full">
      <div className="absolute -bottom-20 -left-20 opacity-5">
        <FiUsers size={300} className="text-purple-500" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-black italic bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              ALPHA SQUADS
            </h2>
            <p className="text-gray-400 text-sm mt-1">Global Peer Mastery Synchronization</p>
          </div>
          <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Active Members: {stats?.active_members.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-3xl font-black italic shadow-lg shadow-purple-900/40">
              #{stats?.rank}
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Global Squad Rank</p>
              <h4 className="text-xl font-black text-white">{stats?.squad_name} Squad</h4>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400 border border-white/10">
              <FiTrendingUp size={32} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mastery Percentile</p>
              <h4 className="text-xl font-black text-white">{stats?.mastery_percentile}%</h4>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
             <FiZap className="text-yellow-400" /> Real-time Activity Feed
          </h5>
          {stats?.recent_activity.map((activity, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all cursor-default"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-sm text-gray-300 font-medium">{activity}</span>
              </div>
              <FiShield className="text-gray-600 group-hover:text-purple-400 transition-colors" />
            </motion.div>
          ))}
        </div>

        <button className="w-full mt-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-900/20">
          Sync Squad Data
        </button>
      </div>
    </div>
  );
};

export default SquadHub;
