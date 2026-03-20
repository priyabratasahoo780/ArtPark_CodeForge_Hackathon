import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-spin" />
        <div className="absolute inset-1 bg-gradient-to-br from-slate-900 to-slate-900 rounded-full" />
        <div className="absolute inset-1 flex items-center justify-center">
          <span className="text-2xl">🧠</span>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mt-4">Analyzing Your Profile...</h2>
      <p className="text-purple-200 mt-2 text-center">
        Extracting skills • Analyzing gaps • Generating learning path
      </p>
      <div className="mt-6 flex gap-2">
        <div className="w-2 h-8 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-8 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-2 h-8 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  )
}
