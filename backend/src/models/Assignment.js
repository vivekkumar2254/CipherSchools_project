import mongoose from 'mongoose';

const schemaFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  key: { type: String, enum: ['PK', 'FK', ''], default: '' }
}, { _id: false });

const sampleDataSchema = new mongoose.Schema({}, { strict: false });

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tableName: {
    type: String,
    required: true
  },
  schema: [schemaFieldSchema],
  sampleData: [sampleDataSchema],
  expectedQuery: {
    type: String,
    required: false
  },
  hints: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['select', 'join', 'aggregate', 'subquery', 'advanced'],
    default: 'select'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

assignmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
