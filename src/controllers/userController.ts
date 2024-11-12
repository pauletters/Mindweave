import User from '../models/User.js';
import Thought from '../models/Thought.js';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

// finds all users
  export const getUsers = async(_req: Request, res: Response): Promise<Response> => {
    try {
      console.log('Finding all users...');
      const users = await User.find();
      console.log(`Found ${users.length} users`);
      return res.json(users);
    } catch (err) {
      console.error('Error in getUsers:', err);
      return res.status(500).json(err);
    }
  }

  // finds a single user by their ID and populates thought and friend data
  export const getSingleUser = async(req: Request, res: Response): Promise<Response> => {
    try {
      console.log('Getting user with ID:', req.params.userId);
      if (!Types.ObjectId.isValid(req.params.userId)) {
        console.log('Invalid user ID');
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const user = await User.findById({ _id: req.params.userId })
        .select('-__v')
        .populate('thoughts')
        .populate('friends');
        console.log('Found user:', user);

      if (!user) {
        console.log('No user with that ID:', req.params.userId);
         return res.status(404).json({ message: 'No user with that ID' });
      }
      console.log('Found user:', user);
        return res.json(user);     
    } catch (err) {
      console.error('Error details:', err);
      return res.status(500).json({ 
        message: 'Server error',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
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

  // adds a friend to a user's friend list
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
  
  // removes a friend from a user's friend list by ID
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
