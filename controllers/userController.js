const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { constants } = require('../constants');

const generateAccessToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '21h' });
  return accessToken;
};

  
const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(constants.VALIDATION_ERROR).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(user.id);

    res.status(constants.SUCCESSFULL_POST).json({
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        meta: {
          access_token: accessToken,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(constants.SERVER_ERROR).json({ error: 'Internal server error' });
  }
};



const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(constants.NOT_FOUND).json({ error: 'User not found' });
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(constants.UNAUTHORIZED).json({ error: 'Invalid password' });
    }

    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: '20h' }
    );
  
    res.status(constants.SUCCESSFULL_REQUEST).json({ message: 'Sign in successful', user, accessToken });
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ error: 'Internal server error' });
  }
};
  


const getMe = async (req, res) => {
  try {
    const { userId } = req;
  
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    res.status(constants.SUCCESSFULL_REQUEST).json({ status: true, user });
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ error: 'Internal server error' });
  }
};
  

module.exports = {
  signUp,
  signIn,
  getMe,
};
