import React from 'react'
import { FiUpload, FiFileText, FiBriefcase, FiZap, FiTarget } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function UploadSection({
  resumeText,
  jobDescriptionText,
  onResumeChange,
  onJobDescriptionChange,
  targetRole,
  onTargetRoleChange,
  timelineDays,
  onTimelineChange,
  onAnalyze,
  loading
}) {
  const handleResumeFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result
        if (typeof text === 'string') {
          onResumeChange(text)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleJobFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result
        if (typeof text === 'string') {
          onJobDescriptionChange(text)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resume Upload */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card border-white/10 group"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiFileText className="text-2xl text-[#bc13fe] group-hover:glow-text-purple transition-all" />
            <h2 className="text-xl font-black text-white uppercase italic tracking-wider">Candidate <span className="text-[#bc13fe]">Persona</span></h2>
          </div>
          
          <div className="mb-4">
            <div className="mb-4">
              <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-[#bc13fe]/50 cursor-pointer transition-all bg-white/[0.02] hover:bg-[#bc13fe]/5">
                <div className="flex flex-col items-center justify-center">
                  <FiUpload className="w-8 h-8 text-[#bc13fe] mb-2" />
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Inject Resume Data</span>
                  <span className="text-[9px] text-[#bc13fe]/60 font-medium mt-1">PDF • DOCX • TXT</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleResumeFileUpload}
                  accept=".txt,.pdf,.docx"
                />
              </label>
            </div>

            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Manual Data Entry</p>
            <textarea
              value={resumeText}
              onChange={(e) => onResumeChange(e.target.value)}
              placeholder="Paste raw resume text for neural analysis..."
              className="w-full h-48 p-4 bg-[#0a0a0c] border border-white/10 rounded-2xl focus:border-[#bc13fe] focus:ring-1 focus:ring-[#bc13fe]/30 focus:outline-none resize-none text-sm text-gray-300 font-medium placeholder:text-gray-700 transition-all shadow-inner"
            />
          </div>

          <div className="text-right text-[10px] font-black text-[#bc13fe] uppercase tracking-widest opacity-40">
            {resumeText.length} Bytes Detected
          </div>
        </motion.div>

        {/* Job Description Upload */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card border-white/10 group"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiBriefcase className="text-2xl text-[#00f3ff] group-hover:glow-text-cyan transition-all" />
            <h2 className="text-xl font-black text-white uppercase italic tracking-wider">Target <span className="text-[#00f3ff]">Architecture</span></h2>
          </div>
          
          <div className="mb-4">
            <div className="mb-4">
              <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-[#00f3ff]/50 cursor-pointer transition-all bg-white/[0.02] hover:bg-[#00f3ff]/5">
                <div className="flex flex-col items-center justify-center">
                  <FiUpload className="w-8 h-8 text-[#00f3ff] mb-2" />
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Import Job Metrics</span>
                  <span className="text-[9px] text-[#00f3ff]/60 font-medium mt-1">PDF • DOCX • TXT</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleJobFileUpload}
                  accept=".txt,.pdf,.docx"
                />
              </label>
            </div>

            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Specification Matrix</p>
            <textarea
              value={jobDescriptionText}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Paste requirements to generate adaptation path..."
              className="w-full h-48 p-4 bg-[#0a0a0c] border border-white/10 rounded-2xl focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff]/30 focus:outline-none resize-none text-sm text-gray-300 font-medium placeholder:text-gray-700 transition-all shadow-inner"
            />
          </div>

          <div className="text-right text-[10px] font-black text-[#00f3ff] uppercase tracking-widest opacity-40">
            {jobDescriptionText.length} Bytes Detected
          </div>
        </motion.div>
      </div>

      {/* Advanced Goal Setting Options */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <FiTarget className="text-xl text-[#34d399]" />
          <h2 className="text-lg font-black text-white uppercase italic tracking-wider">Smart <span className="text-[#34d399]">Goal Parameters</span> (Optional)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">Target Persona / Role</label>
            <input 
              type="text" 
              value={targetRole || ''}
              onChange={(e) => onTargetRoleChange(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 font-medium focus:border-[#34d399] outline-none"
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">Target Timeline (Days)</label>
            <input 
              type="number" 
              value={timelineDays || ''}
              onChange={(e) => onTimelineChange(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g. 30"
              min="1"
              max="365"
              className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 font-medium focus:border-[#34d399] outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Analyze Button */}
      <div className="flex justify-center py-4">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(188,19,254,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onAnalyze}
          disabled={loading || !resumeText.trim() || !jobDescriptionText.trim()}
          className={`group flex items-center gap-3 bg-gradient-to-r from-[#bc13fe] to-[#8a2be2] text-white text-base font-black px-12 py-5 rounded-2xl uppercase tracking-widest shadow-[0_0_20px_rgba(188,19,254,0.2)] transition-all ${
            loading || !resumeText.trim() || !jobDescriptionText.trim()
              ? 'opacity-30 cursor-not-allowed grayscale'
              : 'hover:glow-purple'
          }`}
        >
          {loading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <FiZap />
              </motion.div>
              <span>Synthesizing...</span>
            </>
          ) : (
            <>
              <FiZap className="text-xl group-hover:animate-pulse" />
              <span>Initiate Deep Analysis</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Sample Templates */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-white/5 bg-white/[0.01] p-6 text-center"
      >
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Baseline Templates</h3>
        <div className="flex flex-wrap justify-center gap-6">
          <button
            onClick={() => onResumeChange(`JOHN DOE\nFull-Stack Dev\nSkills: React, Node, Python`)}
            className="text-[10px] font-black text-[#bc13fe] hover:text-white uppercase tracking-widest border-b border-[#bc13fe]/30 hover:border-white transition-all pb-1"
          >
            Load Tech Resume
          </button>
          <button
            onClick={() => onJobDescriptionChange(`ROLE: FULL STACK\nREQ: Node, React, AWS`)}
            className="text-[10px] font-black text-[#00f3ff] hover:text-white uppercase tracking-widest border-b border-[#00f3ff]/30 hover:border-white transition-all pb-1"
          >
            Load Standard JD
          </button>
        </div>
      </motion.div>
    </div>
  )
}
