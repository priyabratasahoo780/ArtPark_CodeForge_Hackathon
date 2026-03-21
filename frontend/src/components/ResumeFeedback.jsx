import React from 'react';
import {
  HiOutlineLightBulb,
  HiOutlineClipboardList,
  HiOutlineTag,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import { motion } from 'framer-motion';

const ResumeFeedback = ({ feedback, optimizations }) => {
  if (!feedback || feedback.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center border-[#00f3ff]/20"
      >
        <div className="w-16 h-16 bg-[#00f3ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <HiOutlineCheckCircle className="h-10 w-10 text-[#00f3ff]" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-wider">Perfect Alignment!</h3>
        <p className="text-gray-400 max-w-md mx-auto font-medium text-sm">
          AI detection found zero critical gaps. Your profile is optimized for this role.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mastery Optimizations */}
      {optimizations && optimizations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card bg-[#34d399]/10 border-[#34d399]/30 p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#34d399]/20 rounded-xl flex items-center justify-center border border-[#34d399]/30">
              <HiOutlineCheckCircle className="h-6 w-6 text-[#34d399]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-wider">Mastery-Based Optimizations</h2>
              <p className="text-[10px] font-bold text-[#34d399] uppercase tracking-widest mt-1">Verified achievements ready for your resume</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {optimizations.map((opt, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-[#34d399]/50 transition-all">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-[#34d399] uppercase tracking-[0.2em]">{opt.skill}</span>
                  <span className="text-[8px] font-bold text-gray-500 uppercase px-2 py-0.5 rounded bg-white/5">{opt.category}</span>
                </div>
                <p className="text-sm text-gray-200 font-medium leading-relaxed italic">"{opt.suggestion}"</p>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => navigator.clipboard.writeText(opt.suggestion)}
                    className="text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-[#34d399] transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-gradient-to-r from-[#bc13fe]/10 to-[#00f3ff]/10 border-white/10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
            <HiOutlineLightBulb className="h-5 w-5 text-[#bc13fe]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-white uppercase italic tracking-wider leading-none">
              Resume <span className="text-[#bc13fe]">Optimization</span>
            </h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">AI-Powered Alignment Strategies</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 font-medium leading-relaxed">
          Suggestions synthesized from detected skill indices and industry-standard requirements for the target role.
        </p>
      </motion.div>

      {/* Feedback cards */}
      {feedback.map((item, index) => {
        const isCritical = item.type === 'Critical Gap';
        const accentColor = isCritical ? '#ff00e5' : '#bc13fe';
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-2xl border border-white/10 overflow-hidden"
            style={{ borderLeftWidth: 4, borderLeftColor: accentColor, background: 'rgba(255,255,255,0.02)' }}
          >
            {/* Card header */}
            <div className="p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${accentColor}15`, color: accentColor }}
                  >
                    {isCritical
                      ? <HiOutlineExclamationCircle className="h-6 w-6" />
                      : <HiOutlineLightBulb className="h-6 w-6" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-white text-lg uppercase tracking-tight break-words">
                      {item.skill_name}
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded border border-white/10 text-gray-400 uppercase tracking-widest mt-1.5 inline-block">
                      {item.category}
                    </span>
                  </div>
                </div>
                {/* Badge — wraps below on very small screens */}
                <span
                  className="shrink-0 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] text-white"
                  style={{ background: accentColor }}
                >
                  {item.type}
                </span>
              </div>

              {/* Two-column body — stacks on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left: suggestion + keywords */}
                <div className="space-y-4">
                  <div>
                    <h4 className="flex items-center gap-1.5 text-[10px] font-black text-[#00f3ff] mb-2 uppercase tracking-[0.25em]">
                      <HiOutlineClipboardList className="text-lg shrink-0" />
                      Improvement Vector
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.suggestion}</p>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-1.5 text-[10px] font-black text-[#bc13fe] mb-2 uppercase tracking-[0.25em]">
                      <HiOutlineTag className="text-lg shrink-0" />
                      Keyword Injections
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.keywords_to_add?.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-black bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-xl uppercase tracking-wide"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: recommended projects */}
                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  <h4 className="text-[10px] font-black mb-4 uppercase tracking-[0.25em] flex items-center gap-2" style={{ color: accentColor }}>
                    <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: accentColor }} />
                    Recommended Projects
                  </h4>
                  <ul className="space-y-3">
                    {item.suggested_projects?.map((project, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-white/25 select-none text-xs font-black italic shrink-0">0{i + 1}</span>
                        <span className="text-xs text-gray-300 font-medium leading-relaxed">{project}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ResumeFeedback;
