const { userService } = require('../services');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'password']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await userService.queryUsers(filter, options);
    res.send(result);
});

const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
    }
    res.send(user);
});

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.send(user);
})


const updateUser = catchAsync(async (req, res) => {
    const user = await userService.updateUserById(req.params.id, req.body);
    res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
    await userService.deleteUserById(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
}