const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
