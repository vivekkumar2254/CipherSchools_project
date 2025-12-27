import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { mockApi } from '../services/mockApi';
import './AssignmentAttemptPage.scss';

const AssignmentAttemptPage = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);

  // Get user-specific localStorage key
  const getStorageKey = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || 'guest';
    return `query_${userId}_${id}`;
  };

  useEffect(() => {
    loadAssignment();
    // Load saved query from localStorage with user-specific key
    const savedQuery = localStorage.getItem(getStorageKey());
    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, [id]);

  // Save query to localStorage whenever it changes with user-specific key
  useEffect(() => {
    if (query && id) {
      localStorage.setItem(getStorageKey(), query);
    }
  }, [query, id]);

  const loadAssignment = async () => {
    try {
      setLoading(true);
      const response = await mockApi.getAssignment(id);
      
      if (response.success) {
        setAssignment(response.data);
        // If assignment is solved and has a correct answer, load it in the editor
        // But only if there's no saved query in localStorage (user hasn't started working)
        const savedQuery = localStorage.getItem(getStorageKey());
        if (response.data.solved && response.data.correctAnswer && !savedQuery) {
          setQuery(response.data.correctAnswer);
        }
      }
    } catch (err) {
      console.error('Failed to load assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      setResult({
        success: false,
        error: 'Please enter a SQL query'
      });
      return;
    }

    try {
      setExecuting(true);
      setResult(null);
      const response = await mockApi.executeQuery(id, query);
      setResult(response);
      
      if (response.success && response.data && response.data.isCorrect) {
        await loadAssignment();
      }
    } catch (err) {
      setResult({
        success: false,
        error: 'Failed to execute query'
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleGetHint = async () => {
    try {
      setLoadingHint(true);
      const response = await mockApi.getHint(id, query);
      
      if (response.success) {
        setHint(response.data.hint);
      }
    } catch (err) {
      console.error('Failed to get hint:', err);
    } finally {
      setLoadingHint(false);
    }
  };

  if (loading) {
    return (
      <div className="assignment-attempt-page">
        <div className="loading">Loading assignment...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="assignment-attempt-page">
        <div className="error">Assignment not found</div>
        <Link to="/" className="back-link">← Back to assignments</Link>
      </div>
    );
  }

  return (
    <div className="assignment-attempt-page">
      {/* Header */}
      <header className="attempt-header">
        <Link to="/" className="attempt-header__back">← Back</Link>
        <div className="attempt-header__title-group">
          <h1 className="attempt-header__title">{assignment.title}</h1>
          {assignment.solved && (
            <span className="attempt-header__solved">
              ✓ Solved
            </span>
          )}
        </div>
        <span 
          className="attempt-header__difficulty"
          style={{ backgroundColor: assignment.difficulty === 'easy' ? '#10b981' : assignment.difficulty === 'medium' ? '#f59e0b' : '#ef4444' }}
        >
          {assignment.difficulty}
        </span>
      </header>

      {/* Main Content */}
      <div className="attempt-content">
        {/* Left Panel: Question & Schema */}
        <aside className="attempt-panel">
          <section className="question-section">
            <h2 className="section-title">Question</h2>
            <p className="question-text">{assignment.description}</p>
          </section>

          <section className="schema-section">
            <h2 className="section-title">Table Schema</h2>
            <div className="schema-table">
              <table>
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Type</th>
                    <th>Key</th>
                  </tr>
                </thead>
                <tbody>
                  {assignment.schema.map((col, idx) => (
                    <tr key={idx}>
                      <td><code>{col.name}</code></td>
                      <td>{col.type}</td>
                      <td>{col.key || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="sample-data-section">
            <h2 className="section-title">📋 Sample Data</h2>
            <div className="sample-data-table">
              <table>
                <thead>
                  <tr>
                    {Object.keys(assignment.sampleData[0] || {}).map(key => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assignment.sampleData.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td key={i}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </aside>

        {/* Right Panel: Editor & Results */}
        <main className="attempt-workspace">
          <section className="editor-section">
            <div className="section-header">
              <h2 className="section-title">SQL Editor</h2>
              <div className="editor-actions">
                <button 
                  className="btn btn--hint"
                  onClick={handleGetHint}
                  disabled={loadingHint}
                >
                  {loadingHint ? 'Loading...' : '💡 Get Hint'}
                </button>
                <button 
                  className="btn btn--execute"
                  onClick={handleExecuteQuery}
                  disabled={executing}
                >
                  {executing ? '⏳ Executing...' : '▶ Execute Query'}
                </button>
              </div>
            </div>

            <div className="editor-container">
              <Editor
                height="600px"
                defaultLanguage="sql"
                value={query}
                onChange={(value) => setQuery(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            </div>
          </section>

          {/* Hint Display */}
          {hint && (
            <section className="hint-section">
              <h3 className="hint-title">💡 Hint</h3>
              <p className="hint-text">{hint}</p>
              <button className="hint-close" onClick={() => setHint(null)}>✕</button>
            </section>
          )}

          {/* Results Section */}
          {result && (
            <section className="results-section">
              <h2 className="section-title">
                {result.success ? 'Query Results' : 'Error'}
              </h2>

              {result.success ? (
                <div className="results-container">
                  {result.data.message && (
                    <div className={`validation-message ${result.data.isCorrect ? 'correct' : 'incorrect'}`}>
                      {result.data.message}
                    </div>
                  )}
                  
                  <div className="results-meta">
                    <span>{result.data.rowCount} rows returned</span>
                    <span>Executed in {result.data.executionTime}ms</span>
                    {result.data.isCorrect !== undefined && (
                      <span className={result.data.isCorrect ? 'status-correct' : 'status-incorrect'}>
                        {result.data.isCorrect ? '✓ Correct Answer' : '✗ Incorrect Answer'}
                      </span>
                    )}
                  </div>

                  <h3 className="results-subtitle">Your Result:</h3>
                  <div className="results-table">
                    <table>
                      <thead>
                        <tr>
                          {result.data.columns.map(col => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.data.rows.map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).map((val, i) => (
                              <td key={i}>{val}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {result.data.expectedResult && !result.data.isCorrect && (
                    <>
                      <h3 className="results-subtitle">Expected Result:</h3>
                      <div className="results-table expected-table">
                        <table>
                          <thead>
                            <tr>
                              {(result.data.expectedColumns || Object.keys(result.data.expectedResult[0] || {})).map(key => (
                                <th key={key}>{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {result.data.expectedResult.map((row, idx) => (
                              <tr key={idx}>
                                {Object.values(row).map((val, i) => (
                                  <td key={i}>{val !== null ? String(val) : 'NULL'}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="error-message">
                  <pre>{result.error}</pre>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AssignmentAttemptPage;
