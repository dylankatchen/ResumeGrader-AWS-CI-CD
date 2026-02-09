import { useState } from 'react'
import './App.css'

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
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
    <>
      <h1>Resume Grader</h1>
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Job Description:</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              style={{ width: '100%', padding: '0.5rem' }}
              placeholder="Paste the job description here..."
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Resume (PDF or Text):</label>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Grading...' : 'Grade Resume'}
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {result && (
          <div style={{ marginTop: '2rem', textAlign: 'left', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
            <h2>Score: {result.score}/100</h2>
            <h3>Reasoning:</h3>
            <p>{result.reasoning}</p>
            <h3>Pointers:</h3>
            <ul>
              {result.pointers && result.pointers.map((pointer, index) => (
                <li key={index}>{pointer}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default App
