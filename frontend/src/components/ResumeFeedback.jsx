import React from 'react';
import { 
  HiOutlineLightBulb, 
  HiOutlineClipboardList, 
  HiOutlineTag, 
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import { motion } from 'framer-motion';

const ResumeFeedback = ({ feedback }) => {
  if (!feedback || feedback.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center border-[#00f3ff]/20"
      >
        <div className="w-16 h-16 bg-[#00f3ff]/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
          <HiOutlineCheckCircle className="h-10 w-10 text-[#00f3ff]" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-wider">Perfect Alignment!</h3>
        <p className="text-gray-400 max-w-md mx-auto font-medium">
          Our AI detection found zero critical gaps. Your current profile is optimized for this target architecture.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-gradient-to-r from-[#bc13fe]/10 to-[#00f3ff]/10 border-white/10"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
            <HiOutlineLightBulb className="h-6 w-6 text-[#bc13fe]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-wider leading-none">Resume <span className="text-[#bc13fe]">Optimization</span></h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">AI-Powered alignment strategies</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 font-medium leading-relaxed">
          The following suggestions are synthesized based on detected skill indices and industry-standard job requirements for the target role.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {feedback.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card overflow-hidden group hover:bg-white/[0.04] p-0 border-l-4 ${
              item.type === 'Critical Gap' ? 'border-[#ff00e5]' : 'border-[#bc13fe]'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                    item.type === 'Critical Gap' ? 'bg-[#ff00e5]/10 text-[#ff00e5]' : 'bg-[#bc13fe]/10 text-[#bc13fe]'
                  }`}>
                    {item.type === 'Critical Gap' ? <HiOutlineExclamationCircle className="h-7 w-7" /> : <HiOutlineLightBulb className="h-7 w-7" />}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg uppercase tracking-tight group-hover:glow-text-cyan transition-all">{item.skill_name}</h3>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded border border-white/10 text-gray-400 uppercase tracking-widest">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                  item.type === 'Critical Gap' ? 'bg-[#ff00e5] text-white' : 'bg-[#bc13fe] text-white'
                }`}>
                  {item.type}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-[#00f3ff] mb-3 uppercase tracking-[0.3em]">
                      <HiOutlineClipboardList className="text-lg" />
                      Improvement Vector
                    </h4>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                      {item.suggestion}
                    </p>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-[#bc13fe] mb-3 uppercase tracking-[0.3em]">
                        <HiOutlineTag className="text-lg" />
                        Keyword Injections
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.keywords_to_add.map((kw, i) => (
                        <span key={i} className="text-[9px] font-black bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-lg uppercase tracking-wider group-hover:border-[#00f3ff]/30 transition-colors">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                  <h4 className="text-[10px] font-black text-[#ff00e5] mb-4 uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff00e5]"></span> Recommended Projects
                  </h4>
                  <ul className="space-y-4">
                    {item.suggested_projects.map((project, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="text-white/20 select-none text-xs font-black italic">0{i+1}</span>
                        <span className="text-xs text-gray-300 font-medium leading-normal">{project}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResumeFeedback;
