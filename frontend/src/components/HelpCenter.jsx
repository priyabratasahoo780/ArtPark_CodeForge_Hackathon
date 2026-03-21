import React from 'react';
import { motion } from 'framer-motion';
import { FiHelpCircle, FiBookOpen, FiZap, FiTarget, FiShield, FiGlobe, FiCpu, FiX } from 'react-icons/fi';

const HelpCenter = ({ onClose }) => {
  const features = [
    {
      icon: <FiTarget />,
      title: "Core Onboarding",
      desc: "Upload your resume to trigger a deep-layer skill extraction and personalized career roadmap."
    },
    {
      icon: <FiZap />,
      title: "Alpha Intel",
      desc: "Use UI Vision to turn screenshots to code, or generate recruiter-ready pitches with AI Audio."
    },
    {
      icon: <FiGlobe />,
      title: "Ecosystem Mastery",
      desc: "Visualize your progress in 3D Skill Galaxies and connect with global Alpha Squads."
    },
    {
      icon: <FiShield />,
      title: "Elite Command",
      desc: "Monitor AI health in real-time and generate your final Executive Career Packet for submission."
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-4xl p-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
      >

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
              <FiHelpCircle size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black italic text-white uppercase tracking-wider">Help & Navigation</h2>
              <p className="text-gray-400 text-sm">Understanding the AI Onboarding Ecosystem</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-blue-400 text-xl">{f.icon}</div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-wide">{f.title}</h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-[2rem] relative overflow-hidden">
             <div className="flex items-center gap-6 relative z-10">
                <FiBookOpen size={48} className="text-blue-400" />
                <div>
                  <h4 className="text-xl font-black text-white italic">OPERATIONAL PROTOCOL</h4>
                  <p className="text-sm text-gray-300 mt-2">
                    Navigate through the tabs to access different intelligence layers. Each action is verified by 30+ micro-services working in sync to ensure your career dominance.
                  </p>
                </div>
             </div>
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <FiCpu size={120} />
             </div>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onClose) onClose();
          }}
          className="absolute top-6 right-6 p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all z-[100] cursor-pointer"
        >
          <FiX size={24} />
        </button>
      </motion.div>
    </div>
  );
};

export default HelpCenter;
