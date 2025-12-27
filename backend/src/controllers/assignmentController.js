import Assignment from '../models/Assignment.js';
import Attempt from '../models/Attempt.js';

export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .select('-expectedQuery')
      .sort({ difficulty: 1, createdAt: -1 });

    if (req.user) {
      const solvedAssignments = await Attempt.find({
        userId: req.user.userId,
        isCorrect: true
      }).distinct('assignmentId');

      const assignmentsWithStatus = assignments.map(assignment => {
        const solved = solvedAssignments.some(id => id.toString() === assignment._id.toString());
        return {
          ...assignment.toObject(),
          solved
        };
      });

      return res.json({
        success: true,
        data: assignmentsWithStatus
      });
    }

    const assignmentsWithoutAuth = assignments.map(assignment => ({
      ...assignment.toObject(),
      solved: false
    }));

    res.json({
      success: true,
      data: assignmentsWithoutAuth
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignments'
    });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const assignment = await Assignment.findById(id)
      .select('-expectedQuery');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    let solved = false;
    let correctAnswer = null;
    if (req.user) {
      const solvedAttempt = await Attempt.findOne({
        assignmentId: id,
        userId: req.user.userId,
        isCorrect: true
      }).sort({ createdAt: 1 });
      solved = !!solvedAttempt;
      if (solvedAttempt) {
        correctAnswer = solvedAttempt.query;
      }
    }

    res.json({
      success: true,
      data: {
        ...assignment.toObject(),
        solved,
        correctAnswer
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignment'
    });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const assignmentData = req.body;
    
    const newAssignment = await Assignment.create(assignmentData);

    res.status(201).json({
      success: true,
      data: newAssignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create assignment'
    });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update assignment'
    });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete assignment'
    });
  }
};
