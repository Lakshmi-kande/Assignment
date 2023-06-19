const { constants } = require('../constants');
const Role = require('../models/role');

const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    const role = await Role.create({ name });

    const responseData = {
      id: role._id,
      name: role.name,
      created_at: role.created_at,
      updated_at: role.updated_at,
    };

    res.status(constants.SUCCESSFULL_POST).json({ status: true, content: { data: responseData } });
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ error: 'Internal server error' });
  }
};


const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const roles = await Role.find()
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await Role.countDocuments();

    const totalPages = Math.ceil(totalCount / limit);

    const responseData = {
      meta: {
        total: totalCount,
        pages: totalPages,
        page: page,
      },
      data: roles,
    };

    res.status(constants.SUCCESSFULL_REQUEST).json(responseData);
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

module.exports = { createRole, getAll };
