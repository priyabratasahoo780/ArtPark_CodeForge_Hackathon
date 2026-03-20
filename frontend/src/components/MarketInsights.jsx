import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

export default function MarketInsights({ insights }) {
  if (!insights || !insights.missing_trending_skills || insights.missing_trending_skills.length === 0) {
    return null;
  }

  const missingSkills = insights.missing_trending_skills;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card border-orange-500/20 bg-gradient-to-br from-orange-900/10 to-red-900/5 relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 text-orange-400">
          <FiTrendingUp className="text-xl" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            Market <span className="text-orange-400">Insights</span>
          </h2>
          <p className="text-[10px] text-orange-200/50 uppercase tracking-[0.2em] font-bold">Resume vs Industry Demand</p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-black/40 border border-white/5 mb-4">
          <FiAlertCircle className="text-orange-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              Based on real-time market data matching your domain, you are missing these highly trending skills. 
              Adding them to your roadmap will significantly boost your competitive edge.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
