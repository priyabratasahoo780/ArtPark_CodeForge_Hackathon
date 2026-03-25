import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiActivity, FiCpu, FiGlobe, FiCheckCircle, FiZap } from 'react-icons/fi';
import axios from 'axios';

const SystemGuardian = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/system/health', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHealth(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading && !health) return null;

  return (
    <div className="p-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <FiShield size={150} className="text-emerald-500 animate-pulse" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black italic bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              SYSTEM GUARDIAN
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 transition-all duration-500 shadow-[0_0_10px_#10b981]" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{health?.status || "Analyzing Protocols..."}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Response Latency</span>
            <span className="text-2xl font-black text-white">{health?.latency_ms}ms</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {health && Object.entries(health.services).map(([service, status]) => (
            <div key={service} className="p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{service}</span>
                <FiCheckCircle className="text-emerald-500 group-hover:scale-110 transition-transform" />
              </div>
              <span className={`text-xs font-bold ${status === 'Healthy' || status === 'Operational' || status === 'Active' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiActivity className="text-emerald-400" />
              <span className="text-xs text-gray-400">Total System Uptime</span>
            </div>
            <span className="text-sm font-mono text-white">{health?.uptime}</span>
          </div>
          
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-emerald-500/20 transition-all">
            <div className="flex items-center gap-3">
              <FiZap className="text-emerald-400 group-hover:animate-bounce" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Perform Deep Sync Audit</span>
            </div>
            <FiGlobe className="text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemGuardian;
