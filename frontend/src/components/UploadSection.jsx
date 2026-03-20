import React from 'react'
import { FiUpload } from 'react-icons/fi'

export default function UploadSection({
  resumeText,
  jobDescriptionText,
  onResumeChange,
  onJobDescriptionChange,
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Upload */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📄 Resume</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Resume File or Paste Text
            </label>
            
            <div className="mb-3">
              <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 cursor-pointer transition-colors bg-purple-50">
                <div className="flex flex-col items-center justify-center">
                  <FiUpload className="w-8 h-8 text-purple-600 mb-1" />
                  <span className="text-sm text-purple-600 font-semibold">Click to upload or drag file</span>
                  <span className="text-xs text-purple-500">TXT, PDF, DOCX</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleResumeFileUpload}
                  accept=".txt,.pdf,.docx"
                />
              </label>
            </div>

            <textarea
              value={resumeText}
              onChange={(e) => onResumeChange(e.target.value)}
              placeholder="Or paste your resume text here..."
              className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none resize-none"
            />
          </div>

          <div className="text-right text-sm text-gray-500">
            {resumeText.length} characters
          </div>
        </div>

        {/* Job Description Upload */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💼 Job Description</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Job Description File or Paste Text
            </label>
            
            <div className="mb-3">
              <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-indigo-300 rounded-lg hover:border-indigo-500 cursor-pointer transition-colors bg-indigo-50">
                <div className="flex flex-col items-center justify-center">
                  <FiUpload className="w-8 h-8 text-indigo-600 mb-1" />
                  <span className="text-sm text-indigo-600 font-semibold">Click to upload or drag file</span>
                  <span className="text-xs text-indigo-500">TXT, PDF, DOCX</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleJobFileUpload}
                  accept=".txt,.pdf,.docx"
                />
              </label>
            </div>

            <textarea
              value={jobDescriptionText}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Or paste the job description here..."
              className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none resize-none"
            />
          </div>

          <div className="text-right text-sm text-gray-500">
            {jobDescriptionText.length} characters
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <button
          onClick={onAnalyze}
          disabled={loading || !resumeText.trim() || !jobDescriptionText.trim()}
          className={`btn-primary text-lg px-12 py-4 ${
            loading || !resumeText.trim() || !jobDescriptionText.trim()
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          {loading ? '⚙️ Analyzing...' : '🚀 Analyze & Generate Learning Path'}
        </button>
      </div>

      {/* Sample Data */}
      <div className="card bg-gradient-to-r from-purple-50 to-indigo-50">
        <h3 className="text-lg font-bold text-gray-800 mb-3">📝 Sample Templates</h3>
        <p className="text-sm text-gray-600 mb-3">Don't have content? Try these sample inputs:</p>
        
        <div className="space-y-2 text-sm">
          <button
            onClick={() => onResumeChange(`JOHN DOE
Mobile: (555) 123-4567 | Email: john@example.com | LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced Software Engineer with 5 years in full-stack development using JavaScript, Python, React and Node.js. Strong problem-solving skills and track record of delivering scalable solutions.

TECHNICAL SKILLS
- Languages: JavaScript, Python, SQL, HTML, CSS
- Frontend: React, Vue.js, Bootstrap, Tailwind CSS
- Backend: Node.js, Express, Django, FastAPI
- Databases: MongoDB, PostgreSQL, MySQL
- Tools & Platforms: Git, Docker, AWS, Linux

PROFESSIONAL EXPERIENCE
Senior Frontend Developer - Tech Corp (2022-Present)
- Built and maintained React-based applications serving 1M+ users
- Implemented responsive UI components with Tailwind CSS
- Led team of 3 junior developers

Full Stack Developer - StartUp Inc (2020-2022)
- Developed full-stack features using Node.js and React
- Managed PostgreSQL databases
- Implemented CI/CD pipelines with Docker

EDUCATION
B.S. in Computer Science - Tech University (2020)`)}
            className="text-purple-600 hover:text-purple-800 font-semibold"
          >
            → Load Sample Resume
          </button>
          
          <button
            onClick={() => onJobDescriptionChange(`FULL STACK DEVELOPER - TechCorp

About the Role:
We are looking for an experienced Full Stack Developer to join our growing team. You will work on building scalable web applications and APIs.

Responsibilities:
- Design and implement backend APIs using FastAPI or Node.js
- Develop responsive frontend applications with React
- Manage and optimize PostgreSQL databases
- Write clean, maintainable code with strong documentation
- Collaborate with cross-functional teams

Required Skills:
- 3+ years professional development experience
- Strong JavaScript and React knowledge
- Python or Node.js backend development
- SQL and database design
- Git version control
- Communication and teamwork skills

Nice to Have:
- Docker and Kubernetes experience
- AWS cloud platform
- TypeScript
- Machine Learning knowledge
- Agile/Scrum methodology

Compensation: $120K - $160K + benefits`)}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            → Load Sample Job Description
          </button>
        </div>
      </div>
    </div>
  )
}
