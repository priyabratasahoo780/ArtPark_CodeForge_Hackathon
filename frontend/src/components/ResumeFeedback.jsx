import React from 'react';
import { 
  HiOutlineLightBulb, 
  HiOutlineClipboardList, 
  HiOutlineTag, 
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle
} from 'react-icons/hi';

const ResumeFeedback = ({ feedback }) => {
  if (!feedback || feedback.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
        <HiOutlineCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellent Resume!</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Your resume perfectly matches the job requirements. No critical gaps were found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-xl border border-purple-200">
        <div className="flex items-center gap-3 mb-2">
          <HiOutlineLightBulb className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Resume Optimization Guide</h2>
        </div>
        <p className="text-gray-700">
          Based on our AI analysis, here are actionable suggestions to improve your resume's impact and alignment with this specific role.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {feedback.map((item, index) => (
          <div 
            key={index} 
            className={`border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md ${
              item.type === 'Critical Gap' ? 'border-red-200 bg-red-50/30' : 'border-amber-200 bg-amber-50/30'
            }`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'Critical Gap' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {item.type === 'Critical Gap' ? <HiOutlineExclamationCircle className="h-6 w-6" /> : <HiOutlineLightBulb className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{item.skill_name}</h3>
                    <span className="text-sm font-medium px-2 py-0.5 rounded bg-gray-200 text-gray-700 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${
                  item.type === 'Critical Gap' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {item.type}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                    <HiOutlineClipboardList className="text-purple-600" />
                    How to Improve
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {item.suggestion}
                  </p>

                  <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                    <HiOutlineTag className="text-purple-600" />
                    Keywords to Include
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.keywords_to_add.map((kw, i) => (
                      <span key={i} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded shadow-sm">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/50 p-4 rounded-lg border border-gray-200/50">
                  <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
                    Suggested Projects
                  </h4>
                  <ul className="space-y-3">
                    {item.suggested_projects.map((project, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>{project}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeFeedback;
