import React from 'react'

export default function SkillsAnalysis({ data }) {
  const resumeSkills = data?.resume_skills?.skills || []
  const jobSkills = data?.job_requirements?.required_skills || []
  
  const resumeCategories = data?.resume_skills?.skill_categories || {}
  const jobCategories = data?.job_requirements?.skill_categories || {}

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Skills */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📄 Your Skills</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Total: <span className="font-bold text-purple-600">{resumeSkills.length}</span> skills found
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(resumeCategories).map(([category, skills]) => (
              <div key={category}>
                <h3 className="text-sm font-bold text-gray-700 mb-2 border-b-2 border-purple-200 pb-1">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => {
                    const skillData = resumeSkills.find(s => s.name === skill)
                    return (
                      <span key={skill} className="skill-badge known">
                        {skill}
                        {skillData?.level && ` (${skillData.level})`}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Required Skills */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💼 Job Requirements</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Total: <span className="font-bold text-indigo-600">{jobSkills.length}</span> skills required
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(jobCategories).map(([category, skills]) => (
              <div key={category}>
                <h3 className="text-sm font-bold text-gray-700 mb-2 border-b-2 border-indigo-200 pb-1">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Skills Table */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Detailed Skills Breakdown</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Skill</th>
                <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Category</th>
                <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Your Level</th>
                <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {resumeSkills.map((skill, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{skill.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{skill.category}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      skill.level === 'Advanced' ? 'bg-green-100 text-green-700' :
                      skill.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {skill.level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                          style={{ width: `${(skill.confidence || 0.9) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {Math.round((skill.confidence || 0.9) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
