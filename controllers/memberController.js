const Member = require('../models/member');
const jwt = require('jsonwebtoken');
const { constants } = require('../constants');

const generateAccessToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '21h' });
  return accessToken;
};

const addMember = async (req, res) => {
  try {
    const { community, user, role } = req.body;

    const loggedInUserRole = req.user.role;
    if (loggedInUserRole !== 'Community Admin') {
      return res.status(constants.UNAUTHORIZED).json({ error: 'Only Community Admin can add a member' });
    }

    const member = new Member({
      community,
      user,
      role,
    });

    await member.save();

    const memberAccessToken = generateAccessToken(member.user);

    const responseData = {
      id: member._id,
      community: member.community,
      user: member.user,
      role: member.role,
      created_at: member.created_at,
      access_token: memberAccessToken,
    };

    res.status(constants.SUCCESSFULL_POST).json({ status: true, content: { data: responseData } });
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ status: false, error: 'Internal server error' });
  }
};


const removeMember = async (req, res) => {
  try {
    const { id } = req.params;

    const loggedInUserRole = req.user.role;
    if (loggedInUserRole !== 'Community Admin' && loggedInUserRole !== 'Community Moderator') {
      return res.status(constants.NOT_ALLOWED_ACCESS).json({ error: 'Only Community Admin and Community Moderator can remove a member' });
    }

    await Member.findByIdAndRemove(id);

    res.status(constants.SUCCESSFULL_REQUEST).json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

module.exports = { addMember, removeMember };


