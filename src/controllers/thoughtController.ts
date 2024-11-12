import Thought from '../models/Thought.js';
import User from '../models/User.js';
import { Request, Response } from 'express';

// finds all thoughts
  export const getThoughts = async(_req: Request, res: Response): Promise<Response> => {
    try {
      const thoughts = await Thought.find();
      return res.json(thoughts);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // finds a single thought by its ID
  export const getSingleThought = async(req: Request, res: Response): Promise<Response> => {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')

      if (!thought) {
         return res.status(404).json({ message: 'No thought associated with that ID' });
      }
        return res.json(thought);     
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // creates a new thought and adds it to the associated user's thoughts array
  export const createThought = async(req: Request, res: Response): Promise<Response> => {
    try {
      const thought = await Thought.create(req.body);

      await User.findByIdAndUpdate(
        req.body.userId,
        { $push: { thoughts: thought._id } },
        { new: true }
        );

      return res.json(thought);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // updates a thought by its ID
  export const updateThought = async(req: Request, res: Response): Promise<Response> => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought associated with that ID' });
      }

      return res.json(thought);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // deletes a thought by its ID
  export const deleteThought = async(req: Request, res: Response): Promise<Response> => {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought associated with that ID' });
      }

      // Removes the thought from the user's thoughts array
    await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      return res.json({ message: 'Thought deleted' });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // adds a reaction to a thought by its ID
  export const addReaction = async(req: Request, res: Response): Promise<Response> => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { new: true, runValidators: true }
      );
  
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with that ID' });
      }
  
      return res.json(thought);
    } catch (err) {
      return res.status(500).json(err);
    }
  };
  
  // removes a reaction from a thought by its ID
  export const removeReaction = async(req: Request, res: Response): Promise<Response> => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
  
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with that ID' });
      }
  
      return res.json(thought);
    } catch (err) {
      return res.status(500).json(err);
    }
  };