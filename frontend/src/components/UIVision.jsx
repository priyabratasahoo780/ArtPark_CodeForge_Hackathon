import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiCode, FiZap, FiCheckCircle, FiCopy } from 'react-icons/fi';
import axios from 'axios';

const UIVision = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/vision/process', 
        { image_data: "base64_placeholder" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Simulate processing time for "WOW" effect
      setTimeout(() => {
        setResult(response.data);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(result.code_snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-8 opacity-20">
        <FiZap size={120} className="text-purple-500 animate-pulse" />
      </div>

      <div className="relative z-10">
        <h2 className="text-4xl font-black italic bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
          AI UI VISION
        </h2>
        <p className="text-gray-400 mb-8 max-w-lg">
          Upload a design screenshot or wireframe. Our multi-modal AI extracts the essence and generates production-ready React components instantly.
        </p>

        {!result && !loading && (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-white/5 transition-all group">
            <FiUploadCloud size={48} className="text-gray-500 group-hover:text-purple-400 transition-colors mb-4" />
            <span className="text-gray-400 group-hover:text-white transition-colors">Drop design file here or click to browse</span>
            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
          </label>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-64 bg-white/5 rounded-3xl">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"
            />
            <p className="text-purple-400 font-bold animate-pulse">Neural Mesh Processing...</p>
          </div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                <img src={image} alt="Target Design" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-widest bg-purple-900/50 px-2 py-1 rounded">Input Analysis</span>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <FiCheckCircle className="text-green-400" /> AI Insights
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">{result.explanation}</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 flex flex-col h-full">
                <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                  <span className="text-xs font-mono text-gray-500">{result.component_name}.jsx</span>
                  <button 
                    onClick={copyCode}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    {copied ? <FiCheckCircle className="text-green-400" /> : <FiCopy />}
                  </button>
                </div>
                <pre className="p-6 text-xs text-purple-300 font-mono overflow-auto flex-grow max-h-[300px] scrollbar-hide">
                  {result.code_snippet}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UIVision;
