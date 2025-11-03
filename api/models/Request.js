import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  headers: {
    type: Object,
    default: {}
  },
  body: {
    type: Object,
    default: {}
  },
  params: {
    type: Object,
    default: {}
  },
  response: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  statusCode: {
    type: Number,
    default: null
  },
  responseTime: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Request', requestSchema);