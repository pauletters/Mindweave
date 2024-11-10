import User from '../models/User.js';
import Thought from '../models/Thought.js';
import { Request, Response } from 'express';

// finds all users
  export const getUsers = async(_req: Request, res: Response): Promise<Response> => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // finds a single user by their ID and populates thought and friend data
  export const getSingleUser = async(req: Request, res: Response): Promise<Response> => {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('thoughts')
        .populate('friends');

      if (!user) {
         return res.status(404).json({ message: 'No user with that ID' });
      }
        return res.json(user);     
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // creates a new user
  export const createUser = async(req: Request, res: Response): Promise<Response> => {
    try {
      const dbUserData = await User.create(req.body);
      return res.json(dbUserData);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // updates a user by their ID
  export const updateUser = async(req: Request, res: Response): Promise<Response> => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      return res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // deletes a user by their ID and removes associated thoughts
  export const deleteUser = async(req: Request, res: Response): Promise<Response> => {
    try {
      const user = await User.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ username: user.username });

      await User.findByIdAndDelete(req.params.userId);

      return res.json({ message: 'User and associated thoughts deleted' });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  export const addFriend = async(req: Request, res: Response): Promise<Response> => {
    try {
      const user = await User.findById(req.params.userId);
      const friend = await User.findById(req.params.friendId);
  
      // Checks if both user and friend exist
      if (!user || !friend) {
        return res.status(404).json({ 
          message: 'No user found with one or both of the provided IDs' 
        });
      }
  
      // Checks if friend is already in user's friend list
      if (user.friends.includes(friend._id as any)) {
        return res.status(400).json({ 
          message: 'These users are already friends' 
        });
      }
  
      // Adds friend to user's friend list
      user.friends.push(friend._id as any);
      await user.save();
  
      return res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  
  export const removeFriend = async(req: Request, res: Response): Promise<Response> => {
    try {
      const user = await User.findById(req.params.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'No user found with this ID' });
      }
  
      // Checks if friend exists in user's friend list
      if (!user.friends.includes(req.params.friendId as any)) {
        return res.status(404).json({ 
          message: 'These users are not friends' 
        });
      }
  
      // Removes friend from user's friend list
      user.friends = user.friends.filter(
        friend => friend.toString() !== req.params.friendId
      );
      
      await user.save();
  
      return res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
