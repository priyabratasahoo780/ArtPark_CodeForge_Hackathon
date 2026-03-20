import React from 'react'
import { FiX, FiAlertCircle } from 'react-icons/fi'

export default function ErrorAlert({ message, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 max-w-md bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-start gap-3 animate-fadeIn z-50">
      <FiAlertCircle className="flex-shrink-0 text-xl mt-0.5" />
      
      <div className="flex-1">
        <h3 className="font-bold mb-1">Error</h3>
        <p className="text-sm">{message}</p>
      </div>

      <button
        onClick={onDismiss}
        className="flex-shrink-0 hover:bg-red-600 p-1 rounded transition-colors"
      >
        <FiX className="text-xl" />
      </button>
    </div>
  )
}
