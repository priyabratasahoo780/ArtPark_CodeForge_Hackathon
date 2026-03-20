import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiBriefcase, FiArrowRight } from 'react-icons/fi';

export default function CareerPredictor({ roles = [] }) {
  if (!roles || roles.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card border-white/10 bg-gradient-to-br from-blue-900/20 to-purple-900/10 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400">
          <FiTrendingUp className="text-xl" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            Career <span className="text-blue-400">Trajectory</span>
          </h2>
          <p className="text-[10px] text-blue-200/50 uppercase tracking-[0.2em] font-bold">O*NET Predictive Matching</p>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {roles.map((role, i) => (
          <motion.div
            key={role}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group p-4 rounded-xl border border-white/5 bg-black/40 hover:bg-white/[0.03] hover:border-blue-500/30 transition-all cursor-default"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiBriefcase className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                <h3 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{role}</h3>
              </div>
              <FiArrowRight className="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
            </div>
            
            {i === 0 && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  Based on your verified skills, you have a high aptitude match for this role. Complete your current path to unlock full readiness.
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-5 text-center">
        <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Powered by System Analysis</p>
      </div>
    </motion.div>
  );
}
