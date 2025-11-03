import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  requests: [{
    name: {
      type: String,
      required: true
    },
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
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Collection', collectionSchema);