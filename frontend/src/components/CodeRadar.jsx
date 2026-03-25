import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiCpu, FiEye, FiActivity, FiTerminal, FiChevronRight, FiCheck } from 'react-icons/fi';
import axios from 'axios';

const CodeRadar = () => {
  const [code, setCode] = useState("def solve_problem():\n    # Optimal solution\n    return 42");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/code/analyze', {
        code: code,
        language: "python"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTimeout(() => {
        setAnalysis(response.data);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 9) return "text-green-400";
    if (score >= 8) return "text-blue-400";
    return "text-yellow-400";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
        <FiActivity size={120} className="text-emerald-500" />
      </div>

      <div className="relative z-10">
        <h2 className="text-4xl font-black italic bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent mb-2">
          CODE RADAR
        </h2>
        <p className="text-gray-400 mb-8 max-w-lg">
          Paste your sandbox snippets for an instant, professional-grade architectural audit.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-[#0d0d0d] rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-500 flex items-center gap-2">
                    <FiTerminal /> sandbox_snippet.py
                  </span>
                </div>
                <textarea 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-[250px] bg-transparent p-6 text-emerald-400 font-mono text-sm focus:outline-none scrollbar-hide resize-none"
                  spellCheck="false"
                />
              </div>
            </div>
            <button 
              onClick={runAnalysis}
              disabled={loading}
              className="w-full py-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-2xl text-emerald-400 font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full" />
              ) : (
                <>Start Audit <FiChevronRight /></>
              )}
            </button>
          </div>

          <div className="min-h-[300px] flex flex-col">
            {analysis ? (
              <div className="space-y-6 flex-grow">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(analysis.scores).map(([key, score]) => (
                    <div key={key} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">{key}</span>
                      <span className={`text-2xl font-black ${getScoreColor(score)}`}>{score.toFixed(1)}</span>
                      <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${score * 10}%` }}
                          className={`h-full ${score >= 9 ? 'bg-green-500' : 'bg-blue-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-2xl">
                  <h4 className="text-emerald-400 font-bold flex items-center gap-2 mb-2 text-sm">
                    <FiCheck /> {analysis.ai_verdict}
                  </h4>
                  <ul className="space-y-2">
                    {analysis.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] p-10 text-center">
                <p className="text-gray-600 text-sm italic">Audit required to generate Code Intelligence Radar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CodeRadar;
