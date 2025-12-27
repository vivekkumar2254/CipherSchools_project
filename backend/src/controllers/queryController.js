import Assignment from '../models/Assignment.js';
import { executeQuery } from '../services/queryExecutor.js';
import { generateHint } from '../services/llmService.js';

export const executeUserQuery = async (req, res) => {
  try {
    const { query, assignmentId } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment ID is required'
      });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    const userId = req.user ? req.user.userId : null;
    const result = await executeQuery(query, assignmentId, userId);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getHint = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { query } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    const result = await generateHint(assignment, query);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate hint'
    });
  }
};
