import { useState } from 'react';
import './index.css';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription || !resumeFile) {
      setError('Please provide both a job description and a resume.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('resume', resumeFile);

    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to grade resume');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('An error occurred while grading the resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">ResumeGrader<span className="text-indigo-600">.ai</span></span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-4">
            Optimize your resume for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">any job</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500">
            Get instant, AI-powered feedback on how well your resume matches a job description. Improve your chances of landing an interview.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Input Form Column */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold">1</span>
                Upload Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Paste Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-sm leading-relaxed"
                    placeholder="e.g. We are looking for a Senior Software Engineer with experience in React, Node.js, and AWS..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Resume
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${resumeFile ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}>
                      <div className="flex flex-col items-center justify-center gap-2">
                        {resumeFile ? (
                          <>
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="font-medium text-indigo-900">{resumeFile.name}</p>
                            <p className="text-xs text-indigo-500">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-colors">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <p className="font-medium text-slate-900">Click to upload or drag and drop</p>
                            <p className="text-xs text-slate-500">PDF or TXT (max 10MB)</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 ${loading
                      ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:ring-4 focus:ring-indigo-100'
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Resume...
                    </span>
                  ) : (
                    'Grade My Resume'
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Column */}
          <div className={`transition-all duration-500 ${result ? 'opacity-100 translate-y-0' : 'opacity-50 blur-sm pointer-events-none grayscale'}`}>
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">

              {/* Result Content */}
              {result ? (
                <>
                  {/* Top Score Banner */}
                  <div className={`p-8 pb-12 text-center text-white ${result.score >= 80 ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                      result.score >= 60 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                        'bg-gradient-to-br from-red-500 to-pink-600'
                    }`}>
                    <h2 className="text-lg font-medium opacity-90 mb-2">Match Score</h2>
                    <div className="text-7xl font-bold tracking-tighter mb-2">{result.score}</div>
                    <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                      out of 100
                    </div>
                  </div>

                  {/* Move Up - Content Container */}
                  <div className="px-6 sm:px-8 -mt-8 relative z-10">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 mb-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Reasoning</h3>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                        {result.reasoning}
                      </p>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Actionable Pointers
                      </h3>
                      <div className="space-y-3">
                        {result.pointers && result.pointers.map((pointer, index) => (
                          <div key={index} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center font-bold text-xs mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed">{pointer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">No Analysis Yet</h3>
                  <p className="text-sm">Submit your resume to see the breakdown here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} ResumeGrader.ai. Built with AWS Bedrock.</p>
      </footer>
    </div>
  );
}

export default App;
