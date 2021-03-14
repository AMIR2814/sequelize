const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { User, Sequelize } = require("./../models");

/**
 * get user info by Id
 * @param {ObjectId} id 
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
    return await User.findByPk(id);
}

/**
 * query 
 * @param {Object} filter 
 * @param {Object} options 
 * @returns {Promise<User>}
 */
const queryUsers = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
}

/**
 * create new user
 * @param {Object} userBody 
 * @returns {Promise <User>}
 */
const createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
    }

    const user = await User.create(userBody);
    return user;
}

/**
 * get User info from email address
 * @param {ObjectItem} email 
 */
const getUserByEmail = async (email) => {
    return User.findOne({
        where: {
            email
        }
    })
}

/**
 * update user info by Id
 * @param {ObjectId} id 
 * @param {Object} updateBody 
 * @returns {Promise <User>}
 */
const updateUserById = async (id, updateBody) => {
    const user = await getUserById(id);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
    }
    if (await User.isEmailTaken(user.dataValues.email, id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
    }

    await Object.assign(user, updateBody);
    console.log(user);
    const temp = await User.update(user, {
        returning: true,
        where: { id }
    });
    console.log("where", { id });
    return user;
}

/**
 * delete user row by Id
 * @param {ObjectId} userId 
 * @returns {Promise <User>}
 */
const deleteUserById = async (userId) => {
    const user = await User.destroy({
        where: {
            id: userId
        }
    });
    return user;
}


module.exports = {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
}
