const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find()
      .select('-__v');
      res.json(thoughts);
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  // Get single thought
  async getSingleThought(req, res) {
    try {
      const thoughts = await Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v');

      if(!thoughts) {
        return res.status(404).json({ message: 'No thought with that ID' })
      }
      res.json(thoughts)
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create thought
  async createThought(req, res) {
    try {
      const thoughts = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thoughts._id }},
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'Thought created, but no user with that ID' })
      }

      res.json('Created thought')
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update thought
  async updateThought(req, res) {
    try {
      const thoughts = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true}
        );

        if (!thoughts) {
          return res.status(404).json({ message: 'No thought with this ID' })
        }
        res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete thought
  async deleteThought(req, res) {
    try {
      const thoughts = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thoughts) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      )

      if(!user) {
        return res.status(404).json({ message: 'Thought deleted but no user with this ID' })
      }
      
      res.json({ message: 'Thought deleted' })
    } catch (err) {
      res.status(500).json(err)
    }
  },

  // Add thought reaction
  async addReaction(req, res) {
    try {
      const thoughts = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thoughts) {
        return res.status(404).json({ message: 'No thought with that ID '})
      }

      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err)
    }
  },

  // Delete reaction
  async removeReaction(req, res) {
    try {
      const thoughts = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thoughts) {
        return res.status(404).json({ message: 'No thought with this ID' })
      }

      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err)
    }
  }
}