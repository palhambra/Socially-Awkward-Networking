const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser
} = require('../../controllers/userController')

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).delete(deleteUser);

// /api/users/:userId/friends/:friendId
// need to make function

router.route('/:userId/friends/:friendId');

module.exports = router;