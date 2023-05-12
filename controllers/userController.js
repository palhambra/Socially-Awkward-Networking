const { User, Thought } = require('../models');

module.exports = {
  // GET all users
  async getUsers(req, res) {
    try {
      const users = await User.find()
      .select('-__v');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
      .populate('thoughts')
      .populate('friends')
      .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with this ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
      console.log(err)
    }
  },

  // Create new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  // Update user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId},
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if(!user) {
        return res.status(404).json({ message: 'No user with that ID' })
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete user and associated thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with this ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and associated thoughts deleted '})
    } catch (err) {
      res.status(500).json(err)
    }
  },

  // Add friend
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
        );

        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' })
        }
        
        const friend = await User.findOneAndUpdate(
          { _id: req.params.friendId },
          { $addToSet: { friends: req.params.userId } },
          { new: true }
        );
    
        if (!friend) {
          return res.status(404).json({ message: 'No friend with that ID' })
        }
        res.json(user);
    } catch (err) {
      res.status(500).json(err)
    }
  },

  // Remove friend
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: { friendId: req.params.friendId } } },
        { new: true }
      );

      if(!user) {
        return res.status(404).json({ message: 'No user with that ID' })
      }
      
      res.json(user);
    } catch (err) {
      res.status(500).json(err)
    }
  }
};
