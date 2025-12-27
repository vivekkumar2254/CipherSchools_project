import { Link } from 'react-router-dom';
import './AssignmentCard.scss';

const AssignmentCard = ({ assignment }) => {
  const difficultyColors = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444'
  };

  return (
    <Link to={`/assignment/${assignment._id}`} className="assignment-card">
      {assignment.solved && (
        <div className="assignment-card__solved-badge">
          <span>✓</span>
        </div>
      )}
      <div className="assignment-card__header">
        <h3 className="assignment-card__title">{assignment.title}</h3>
        <span 
          className="assignment-card__difficulty"
          style={{ backgroundColor: difficultyColors[assignment.difficulty] }}
        >
          {assignment.difficulty}
        </span>
      </div>
      
      <p className="assignment-card__description">
        {assignment.description}
      </p>
      
      <div className="assignment-card__footer">
        <span className="assignment-card__table">
          {assignment.tableName}
        </span>
        {assignment.solved && (
          <span className="assignment-card__solved-text">
            Solved
          </span>
        )}
      </div>
    </Link>
  );
};

export default AssignmentCard;
