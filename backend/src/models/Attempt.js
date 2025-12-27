import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  userId: {
    type: String,
    required: false
  },
  query: {
    type: String,
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  errorMessage: {
    type: String,
    required: false
  },
  executionTime: {
    type: Number,
    required: false
  },
  rowCount: {
    type: Number,
    required: false
  },
  isCorrect: {
    type: Boolean,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

attemptSchema.index({ assignmentId: 1, createdAt: -1 });
attemptSchema.index({ userId: 1, createdAt: -1 });

const Attempt = mongoose.model('Attempt', attemptSchema);

export default Attempt;
