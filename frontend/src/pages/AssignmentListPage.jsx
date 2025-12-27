import { useState, useEffect } from 'react';
import AssignmentCard from '../components/AssignmentCard';
import { mockApi } from '../services/mockApi';
import './AssignmentListPage.scss';

const AssignmentListPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await mockApi.getAssignments();
      
      if (response.success) {
        setAssignments(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(a => a.difficulty === filter);

  if (loading) {
    return (
      <div className="assignment-list-page">
        <div className="loading">Loading assignments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignment-list-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="assignment-list-page">
      <div className="assignment-list-page__content">
        <header className="assignment-list-page__header">
          <h1 className="assignment-list-page__title">SQL Assignments</h1>
          <p className="assignment-list-page__subtitle">
            Practice SQL queries with interactive assignments
          </p>
        </header>

        <div className="assignment-list-page__filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'filter-btn--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({assignments.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'easy' ? 'filter-btn--active' : ''}`}
            onClick={() => setFilter('easy')}
          >
            Easy
          </button>
          <button 
            className={`filter-btn ${filter === 'medium' ? 'filter-btn--active' : ''}`}
            onClick={() => setFilter('medium')}
          >
            Medium
          </button>
          <button 
            className={`filter-btn ${filter === 'hard' ? 'filter-btn--active' : ''}`}
            onClick={() => setFilter('hard')}
          >
            Hard
          </button>
        </div>

        <div className="assignment-list-page__grid">
          {filteredAssignments.map(assignment => (
            <AssignmentCard key={assignment._id} assignment={assignment} />
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="assignment-list-page__empty">
            No assignments found for this filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentListPage;
