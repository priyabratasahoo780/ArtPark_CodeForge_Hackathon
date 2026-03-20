import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

export default function GapAnalysis({ data }) {
  const [expandedSkill, setExpandedSkill] = useState(null)
  
  const knownSkills = data?.known_skills || []
  const partialSkills = data?.partial_skills || []
  const missingSkills = data?.missing_skills || []
  const stats = data?.statistics || {}

  const toggleExpand = (skillName) => {
    setExpandedSkill(expandedSkill === skillName ? null : skillName)
  }

  const SkillCard = ({ skill, status, onExpand, isExpanded }) => (
    <div className="border-l-4 border-purple-500 pl-4 py-3 mb-3 bg-white rounded-r-lg shadow-sm hover:shadow-md transition-shadow">
      <div
        onClick={() => onExpand(skill.name)}
        className="cursor-pointer flex items-center justify-between"
      >
        <div className="flex-1">
          <h4 className="font-bold text-gray-800">{skill.name}</h4>
          <p className="text-sm text-gray-600">{skill.category}</p>
          {skill.reason && (
            <p className="text-sm text-gray-700 mt-1 italic">💡 {skill.reason}</p>
          )}
        </div>
        <div className="ml-4 flex items-center gap-2">
          {skill.gap_score && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
              Gap: {skill.gap_score}/3
            </span>
          )}
          {isExpanded ? <FiChevronUp className="text-2xl" /> : <FiChevronDown className="text-2xl" />}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t-2 border-gray-200 space-y-3">
          {skill.resume_level && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Your Level:</span>
              <span className="font-bold text-blue-600">{skill.resume_level}</span>
            </div>
          )}
          {skill.required_level && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Required Level:</span>
              <span className="font-bold text-indigo-600">{skill.required_level}</span>
            </div>
          )}
          {skill.prerequisites && skill.prerequisites.length > 0 && (
            <div>
              <span className="text-sm text-gray-600">Prerequisites:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {skill.prerequisites.map((prereq) => (
                  <span key={prereq} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-sm text-green-600 font-semibold">✅ Known Skills</div>
          <div className="text-3xl font-bold text-green-800 mt-2">{stats.known_count || 0}</div>
          <div className="text-xs text-green-600 mt-1">
            {stats.total_required_skills && stats.known_count
              ? Math.round((stats.known_count / stats.total_required_skills) * 100)
              : 0}% covered
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="text-sm text-yellow-600 font-semibold">⚠️ Partial Skills</div>
          <div className="text-3xl font-bold text-yellow-800 mt-2">{stats.partial_count || 0}</div>
          <div className="text-xs text-yellow-600 mt-1">Need improvement</div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100">
          <div className="text-sm text-red-600 font-semibold">❌ Missing Skills</div>
          <div className="text-3xl font-bold text-red-800 mt-2">{stats.missing_count || 0}</div>
          <div className="text-xs text-red-600 mt-1">To learn</div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-sm text-purple-600 font-semibold">📊 Readiness</div>
          <div className="text-3xl font-bold text-purple-800 mt-2">{stats.readiness_score || 0}/100</div>
          <div className="text-xs text-purple-600 mt-1">Job readiness score</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Coverage Analysis</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Skill Coverage</span>
            <span className="font-bold text-purple-600">{stats.coverage_percentage || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${stats.coverage_percentage || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Known Skills */}
      {knownSkills.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Known Skills ({knownSkills.length})</h2>
          <p className="text-sm text-gray-600 mb-4">
            These skills are already in your skillset and meet or exceed job requirements
          </p>
          <div className="space-y-2">
            {knownSkills.map((skill) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                status="known"
                onExpand={toggleExpand}
                isExpanded={expandedSkill === skill.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Partial Skills */}
      {partialSkills.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-yellow-700 mb-4">⚠️ Partial Skills ({partialSkills.length})</h2>
          <p className="text-sm text-gray-600 mb-4">
            You have some experience but need improvement to meet job requirements
          </p>
          <div className="space-y-2">
            {partialSkills.map((skill) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                status="partial"
                onExpand={toggleExpand}
                isExpanded={expandedSkill === skill.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-red-700 mb-4">❌ Missing Skills ({missingSkills.length})</h2>
          <p className="text-sm text-gray-600 mb-4">
            Critical skills you need to learn to be fully qualified for the role
          </p>
          <div className="space-y-2">
            {missingSkills.map((skill) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                status="missing"
                onExpand={toggleExpand}
                isExpanded={expandedSkill === skill.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-bold text-gray-800 mb-3">📋 Summary</h3>
        <p className="text-gray-700">
          You have <strong>{stats.known_count}</strong> out of <strong>{stats.total_required_skills}</strong> required skills.
          Your skill coverage is <strong>{stats.coverage_percentage}%</strong>, with a job readiness score of <strong>{stats.readiness_score}/100</strong>.
          Focus on addressing the <strong>{stats.partial_count + stats.missing_count}</strong> skill gaps through targeted learning.
        </p>
      </div>
    </div>
  )
}
