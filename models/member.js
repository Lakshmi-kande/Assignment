const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
