const { constants } = require('../constants');
const Community = require('../models/community');
const User = require('../models/user');


const createCommunity = async (req, res) => {
  try {
    const { name } = req.body;
    const { userId } = req;
  
    const slug = generateSlug(name);
  
    const community = await Community.create({
      name,
      slug,
      owner: userId,
    });
  
    // await addCommunityAdmin(community._id, userId);
  
    res.status(constants.SUCCESSFULL_POST).json({
      status: true,
      content: {
        data: {
          id: community._id,
          name: community.name,
          slug: community.slug,
          owner: community.owner,
          created_at: community.created_at,
          updated_at: community.updated_at,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(constants.SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const generateSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};



const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const communities = await Community.find()
      .populate('owner', 'id name')
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Community.countDocuments();

    const pages = Math.ceil(total / limit);

    res.status(constants.SUCCESSFULL_REQUEST).json({
      status: true,
      content: {
        data: communities,
        meta: {
          total,
          pages,
          page,
        },
      },
    });
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ error: 'Internal server error' });
  }
};


const getAllMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const community = await Community.findById(id).select('_id');

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    const members = await User.find({ community: id })
      .select('id name')
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await User.countDocuments({ community: id });

    const pages = Math.ceil(total / limit);

    res.status(constants.SUCCESSFULL_REQUEST).json({
      status: true,
      content: {
        data: {
          community: community._id,
          members,
        },
        meta: {
          total,
          pages,
          page,
        },
      },
    });
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ error: 'Internal server error' });
  }
};


const getMyOwnedCommunity = async (req, res) => {
  try {
    const { userId } = req;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const communities = await Community.find({ owner: userId })
      .select('-owner')
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Community.countDocuments({ owner: userId });

    const pages = Math.ceil(total / limit);

    res.status(constants.SUCCESSFULL_REQUEST).json({
      status: true,
      content: {
        data: communities,
        meta: {
          total,
          pages,
          page,
        },
      },
    });
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ error: 'Internal server error' });
  }
};


const getMyJoinedCommunity = async (req, res) => {
  try {
    const { userId } = req;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const communities = await Community.find({ members: userId })
      .populate('owner', 'id name')
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Community.countDocuments({ members: userId });

    const pages = Math.ceil(total / limit);

    res.status(constants.SUCCESSFULL_REQUEST).json({
      status: true,
      content: {
        data: communities,
        meta: {
          total,
          pages,
          page,
        },
      },
    });
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ error: 'Internal server error' });
  }
};


module.exports = { createCommunity, getAll , getAllMembers, getMyOwnedCommunity, getMyJoinedCommunity};


