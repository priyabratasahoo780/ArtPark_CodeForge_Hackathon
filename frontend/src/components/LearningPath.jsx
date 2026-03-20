import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi'

export default function LearningPath({ data }) {
  const [expandedModule, setExpandedModule] = useState(null)
  const [completedModules, setCompletedModules] = useState(new Set())

  const modules = data?.modules || []
  const timeline = data?.timeline || {}
  const milestones = data?.milestones || []
  const strategies = data?.strategies || []

  const toggleExpand = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId)
  }

  const toggleComplete = (moduleId) => {
    const newCompleted = new Set(completedModules)
    if (newCompleted.has(moduleId)) {
      newCompleted.delete(moduleId)
    } else {
      newCompleted.add(moduleId)
    }
    setCompletedModules(newCompleted)
  }

  const completionPercentage = Math.round((completedModules.size / modules.length) * 100)

  return (
    <div className="space-y-6">
      {/* Timeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-sm text-blue-600 font-semibold">⏱️ Total Duration</div>
          <div className="text-3xl font-bold text-blue-800 mt-2">{timeline.estimated_weeks || 0}w</div>
          <div className="text-xs text-blue-600 mt-1">~{timeline.total_hours || 0} hours</div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-sm text-purple-600 font-semibold">📚 Modules</div>
          <div className="text-3xl font-bold text-purple-800 mt-2">{modules.length}</div>
          <div className="text-xs text-purple-600 mt-1">Learning steps</div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-sm text-green-600 font-semibold">✅ Completed</div>
          <div className="text-3xl font-bold text-green-800 mt-2">{completedModules.size}</div>
          <div className="text-xs text-green-600 mt-1">{completionPercentage}% progress</div>
        </div>

        <div className="card bg-gradient-to-br from-indigo-50 to-indigo-100">
          <div className="text-sm text-indigo-600 font-semibold">📅 Pace</div>
          <div className="text-2xl font-bold text-indigo-800 mt-2">{timeline.pace || 'Self'}</div>
          <div className="text-xs text-indigo-600 mt-1">No deadlines</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Learning Progress</h3>
          <span className="text-lg font-bold text-purple-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{completedModules.size} of {modules.length} modules completed</p>
      </div>

      {/* Learning Strategies */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Learning Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strategy, idx) => (
            <div key={idx} className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-bold text-gray-800">{strategy.name}</h4>
              <p className="text-sm text-gray-600 mt-2">{strategy.description}</p>
              <p className="text-xs text-purple-600 mt-2 font-semibold">→ {strategy.implementation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Modules */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">🗺️ Learning Modules</h3>
        <p className="text-sm text-gray-600 mb-4">
          Complete modules in order for optimal learning. Each module includes resources and assessment criteria.
        </p>

        <div className="space-y-3">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`border-l-4 pl-4 py-4 rounded-r-lg bg-white shadow-sm hover:shadow-md transition-all ${
                completedModules.has(module.id) ? 'border-green-500 opacity-75' : 'border-purple-500'
              }`}
            >
              <div
                onClick={() => toggleExpand(module.id)}
                className="cursor-pointer flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleComplete(module.id)
                      }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        completedModules.has(module.id)
                          ? 'bg-green-500 border-green-500'
                          : 'border-purple-300 hover:border-purple-500'
                      }`}
                    >
                      {completedModules.has(module.id) && <FiCheck className="text-white" />}
                    </button>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        Module {module.order}: {module.skill_name}
                      </h4>
                      <p className="text-sm text-gray-600">{module.category}</p>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-purple-600">{module.time_estimate_hours}h</div>
                    <div className="text-xs text-gray-500">{module.difficulty}</div>
                  </div>
                  {expandedModule === module.id ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </div>

              {expandedModule === module.id && (
                <div className="mt-4 pt-4 border-t-2 border-gray-200 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Reason</p>
                    <p className="text-sm text-gray-600 mt-1">{module.reason}</p>
                  </div>

                  {module.prerequisites && module.prerequisites.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Prerequisites</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {module.prerequisites.map((prereq) => (
                          <span key={prereq} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-gray-700">Learning Objectives</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      {module.learning_objectives?.map((obj, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">Assessment Criteria</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      {module.assessment_criteria?.map((criteria, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{criteria}</li>
                      ))}
                    </ul>
                  </div>

                  {module.resources && module.resources.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Recommended Resources</p>
                      <div className="space-y-2 mt-1">
                        {module.resources.map((resource, idx) => (
                          <div key={idx} className="bg-blue-50 p-2 rounded text-sm">
                            <p className="font-semibold text-blue-900">{resource.name}</p>
                            <p className="text-xs text-blue-700">
                              {resource.type} • {resource.platform} • {resource.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🎖️ Milestones</h3>
          <div className="space-y-3">
            {milestones.map((milestone, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border-l-4 border-purple-500"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl font-bold text-purple-600">🎖️</div>
                  <div>
                    <h4 className="font-bold text-gray-800">Milestone {milestone.milestone_number}</h4>
                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                    <p className="text-xs text-purple-600 mt-2">
                      {milestone.modules_completed} modules • {milestone.total_hours_invested} hours invested
                    </p>
                    <p className="text-sm text-gray-700 mt-1 font-semibold">→ {milestone.checkpoint}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Recommendation */}
      <div className="card bg-gradient-to-r from-indigo-50 to-purple-50">
        <h3 className="text-lg font-bold text-gray-800 mb-2">📈 Timeline Recommendation</h3>
        <p className="text-gray-700">{timeline.recommendation}</p>
        <p className="text-sm text-gray-600 mt-3">
          💡 <strong>Pro Tip:</strong> Start with prerequisite modules first. Each module builds on previous knowledge.
          Dedicate focused time blocks for learning and hands-on practice for best results.
        </p>
      </div>
    </div>
  )
}
