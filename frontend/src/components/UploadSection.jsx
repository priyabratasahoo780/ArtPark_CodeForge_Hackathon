import React, { useState } from 'react'
import { FiUpload, FiFileText, FiBriefcase, FiZap, FiTarget, FiAlertCircle, FiLoader, FiCheckCircle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://artpark-codeforge-hackathon.onrender.com'

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
  loading,
  isHR = false,
  onMultiResumesChange,
  batchResumes = [],
  onRemoveResume
}) {
  const [attempted, setAttempted] = useState(false)
  const [resumeUploading, setResumeUploading] = useState(false)
  const [jobUploading, setJobUploading] = useState(false)
  const [resumeFileName, setResumeFileName] = useState(null)
  const [jobFileName, setJobFileName] = useState(null)
  const [resumeUploadError, setResumeUploadError] = useState(null)
  const [jobUploadError, setJobUploadError] = useState(null)

  const hasResume = isHR ? (batchResumes.length > 0 || (resumeText && resumeText.trim().length > 0)) : (resumeText && resumeText.trim().length > 0)
  const hasJob = jobDescriptionText && jobDescriptionText.trim().length > 0

  const handleClick = () => {
    if (!hasResume || !hasJob) {
      setAttempted(true)
      return
    }
    setAttempted(false)
    onAnalyze()
  }

  const extractTextFromFile = async (file, setUploading, setFileName, setError, onTextChange) => {
    setUploading(true)
    setError(null)
    setFileName(file.name)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const resp = await axios.post(`${API_BASE_URL}/extract/text`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      })
      const text = resp.data?.text || ''
      if (text.trim()) {
        onTextChange(text)
        setAttempted(false)
      } else {
        setError('No readable text found in file.')
      }
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(detail || 'Failed to extract text. Try uploading a TXT file or paste the text manually.')
      setFileName(null)
    } finally {
      setUploading(false)
    }
  }

  const handleResumeFileUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (!isHR) {
      // Single file mode
      extractTextFromFile(files[0], setResumeUploading, setResumeFileName, setResumeUploadError, onResumeChange)
    } else {
      // Multi file mode for HR
      setResumeUploading(true)
      setResumeUploadError(null)
      setResumeFileName(`${files.length} resumes selected`)
      
      try {
        const results = await Promise.all(files.map(async (file) => {
          const formData = new FormData()
          formData.append('file', file)
          const resp = await axios.post(`${API_BASE_URL}/extract/text`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 60000,
          })
          return { name: file.name, text: resp.data?.text || '' }
        }))
        
        const validResults = results.filter(r => r.text.trim().length > 0)
        if (validResults.length > 0) {
          onMultiResumesChange(validResults)
          setAttempted(false)
        } else {
          setResumeUploadError('No readable text found in any of the files.')
        }
      } catch (err) {
        setResumeUploadError('Error extracting some resumes. Please try again.')
      } finally {
        setResumeUploading(false)
      }
    }
    e.target.value = ''
  }

  const handleJobFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) extractTextFromFile(file, setJobUploading, setJobFileName, setJobUploadError, onJobDescriptionChange)
    e.target.value = ''
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
              <label className={`flex items-center justify-center w-full p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${resumeUploading ? 'border-[#bc13fe]/70 bg-[#bc13fe]/10' : 'border-white/10 hover:border-[#bc13fe]/50 bg-white/[0.02] hover:bg-[#bc13fe]/5'}`}>
                <div className="flex flex-col items-center justify-center gap-1">
                  {resumeUploading ? (
                    <FiLoader className="w-8 h-8 text-[#bc13fe] animate-spin" />
                  ) : (resumeFileName || batchResumes.length > 0) && hasResume ? (
                    <FiCheckCircle className="w-8 h-8 text-green-400" />
                  ) : (
                    <FiUpload className="w-8 h-8 text-[#bc13fe] mb-1" />
                  )}
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    {resumeUploading ? 'Extracting...' : (resumeFileName && !isHR) ? resumeFileName : isHR && batchResumes.length > 0 ? `${batchResumes.length} Resumes Ready` : 'Inject Resume Data'}
                  </span>
                  <span className="text-[9px] text-[#bc13fe]/60 font-medium">PDF • TXT</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleResumeFileUpload}
                  accept=".txt,.pdf"
                  disabled={resumeUploading}
                  multiple={isHR}
                />
              </label>
              <AnimatePresence>
                {resumeUploadError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1 text-[9px] font-black text-red-400 uppercase tracking-widest mt-1 ml-1">
                    <FiAlertCircle /> {resumeUploadError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* ── Multi-Resume List (HR Only) ── */}
            {isHR && batchResumes.length > 0 && (
              <div className="mb-6 space-y-2 max-h-40 overflow-y-auto no-scrollbar p-2 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Processed Resumes ({batchResumes.length})</p>
                <div className="space-y-2">
                  <AnimatePresence>
                    {batchResumes.map((res, idx) => (
                      <motion.div 
                        key={res.name + idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FiFileText className="text-[#bc13fe] shrink-0" />
                          <span className="text-[10px] font-bold text-gray-300 truncate tracking-tight">{res.name}</span>
                        </div>
                        <button 
                          onClick={() => onRemoveResume(res.name)}
                          className="text-[9px] font-black text-gray-600 hover:text-red-400 uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Remove
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Manual Data Entry</p>
            <textarea
              value={resumeText}
              onChange={(e) => { onResumeChange(e.target.value); if (e.target.value.trim()) { setAttempted(false); setResumeFileName(null) } }}
              placeholder={isHR ? "Paste multiple resumes or upload files above..." : "Paste raw resume text for neural analysis..."}
              className={`w-full h-48 p-4 bg-[#0a0a0c] border rounded-2xl focus:ring-1 focus:outline-none resize-none text-sm text-gray-300 font-medium placeholder:text-gray-700 transition-all shadow-inner ${
                attempted && !hasResume
                  ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30 animate-pulse'
                  : 'border-white/10 focus:border-[#bc13fe] focus:ring-[#bc13fe]/30'
              }`}
            />
            <AnimatePresence>
              {attempted && !hasResume && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-[9px] font-black text-red-400 uppercase tracking-widest mt-1 ml-1"
                >
                  <FiAlertCircle /> Resume data required
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="text-right text-[10px] font-black text-[#bc13fe] uppercase tracking-widest opacity-40">
            {isHR ? `${batchResumes.length} Files` : `${resumeText.length} Bytes`} Detected
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
              <label className={`flex items-center justify-center w-full p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${jobUploading ? 'border-[#00f3ff]/70 bg-[#00f3ff]/10' : 'border-white/10 hover:border-[#00f3ff]/50 bg-white/[0.02] hover:bg-[#00f3ff]/5'}`}>
                <div className="flex flex-col items-center justify-center gap-1">
                  {jobUploading ? (
                    <FiLoader className="w-8 h-8 text-[#00f3ff] animate-spin" />
                  ) : jobFileName && hasJob ? (
                    <FiCheckCircle className="w-8 h-8 text-green-400" />
                  ) : (
                    <FiUpload className="w-8 h-8 text-[#00f3ff] mb-1" />
                  )}
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    {jobUploading ? 'Extracting...' : jobFileName ? jobFileName : 'Import Job Metrics'}
                  </span>
                  <span className="text-[9px] text-[#00f3ff]/60 font-medium">PDF • TXT</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleJobFileUpload}
                  accept=".txt,.pdf"
                  disabled={jobUploading}
                />
              </label>
              <AnimatePresence>
                {jobUploadError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1 text-[9px] font-black text-red-400 uppercase tracking-widest mt-1 ml-1">
                    <FiAlertCircle /> {jobUploadError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Specification Matrix</p>
            <textarea
              value={jobDescriptionText}
              onChange={(e) => { onJobDescriptionChange(e.target.value); if (e.target.value.trim()) { setAttempted(false); setJobFileName(null) } }}
              placeholder="Paste requirements to generate adaptation path..."
              className={`w-full h-48 p-4 bg-[#0a0a0c] border rounded-2xl focus:ring-1 focus:outline-none resize-none text-sm text-gray-300 font-medium placeholder:text-gray-700 transition-all shadow-inner ${
                attempted && !hasJob
                  ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30 animate-pulse'
                  : 'border-white/10 focus:border-[#00f3ff] focus:ring-[#00f3ff]/30'
              }`}
            />
            <AnimatePresence>
              {attempted && !hasJob && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-[9px] font-black text-red-400 uppercase tracking-widest mt-1 ml-1"
                >
                  <FiAlertCircle /> Job description required
                </motion.p>
              )}
            </AnimatePresence>
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
      <div className="flex flex-col items-center gap-3 py-4">
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.05, boxShadow: loading ? 'none' : '0 0 30px rgba(188,19,254,0.4)' }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          onClick={handleClick}
          disabled={loading}
          className={`group flex items-center gap-3 text-white text-base font-black px-12 py-5 rounded-2xl uppercase tracking-widest transition-all ${
            loading
              ? 'bg-gradient-to-r from-[#bc13fe]/60 to-[#8a2be2]/60 cursor-wait'
              : 'bg-gradient-to-r from-[#bc13fe] to-[#8a2be2] shadow-[0_0_20px_rgba(188,19,254,0.3)] hover:shadow-[0_0_40px_rgba(188,19,254,0.5)] cursor-pointer'
          }`}
        >
          {loading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <FiZap />
              </motion.div>
              <span>{isHR ? 'Orchestrating Batch Sync...' : 'Synthesizing Neural Map...'}</span>
            </>
          ) : (
            <>
              <FiZap className="text-xl group-hover:animate-pulse" />
              <span>{isHR ? 'Initiate Batch Analysis' : 'Initiate Deep Analysis'}</span>
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {attempted && (!hasResume || !hasJob) && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest"
            >
              <FiAlertCircle /> Fill in the highlighted fields above to proceed
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Sample Templates */}
      {!isHR && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border-white/5 bg-white/[0.01] p-6 text-center"
        >
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Baseline Templates</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => { onResumeChange(`JOHN DOE\nFull-Stack Dev\nSkills: React, Node, Python`); setResumeFileName(null) }}
              className="text-[10px] font-black text-[#bc13fe] hover:text-white uppercase tracking-widest border-b border-[#bc13fe]/30 hover:border-white transition-all pb-1"
            >
              Load Tech Resume
            </button>
            <button
              onClick={() => { onJobDescriptionChange(`ROLE: FULL STACK\nREQ: Node, React, AWS`); setJobFileName(null) }}
              className="text-[10px] font-black text-[#00f3ff] hover:text-white uppercase tracking-widest border-b border-[#00f3ff]/30 hover:border-white transition-all pb-1"
            >
              Load Standard JD
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
