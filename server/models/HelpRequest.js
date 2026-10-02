const mongoose = require('mongoose');

const CATEGORIES = [
  'Food',
  'Medicine',
  'Transportation',
  'Essential Supplies',
  'Education',
  'Elderly Assistance',
  'Other',
];

const URGENCIES = ['Low', 'Medium', 'High', 'Urgent'];

const STATUSES = ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'];

const helpRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: CATEGORIES, message: 'Invalid category' },
    },
    urgency: {
      type: String,
      required: [true, 'Urgency is required'],
      enum: { values: URGENCIES, message: 'Invalid urgency' },
      default: 'Medium',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [150, 'Location cannot exceed 150 characters'],
    },
    contactName: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,15}$/, 'Please provide a valid phone number'],
    },
    requiredDate: {
      type: Date,
      required: [true, 'Required date is required'],
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: { values: STATUSES, message: 'Invalid status' },
      default: 'Pending',
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Text index for search (useful in Module 7)
helpRequestSchema.index({ title: 'text', description: 'text', location: 'text' });

helpRequestSchema.statics.CATEGORIES = CATEGORIES;
helpRequestSchema.statics.URGENCIES = URGENCIES;
helpRequestSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model('HelpRequest', helpRequestSchema);