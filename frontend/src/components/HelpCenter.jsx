import React from 'react';
import { motion } from 'framer-motion';
import { FiHelpCircle, FiBookOpen, FiZap, FiTarget, FiShield, FiGlobe, FiCpu } from 'react-icons/fi';

const HelpCenter = () => {
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
    <div className="p-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
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
    </div>
  );
};

export default HelpCenter;
