import mongoose from 'mongoose';
import User from '../models/User.js';
import Thought from '../models/Thought.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/MindweaveDB';

const seedDatabase = async () => {
  try {
    // Connects to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to the database.');

    // Clears existing data
    console.log('Clearing existing data...');
    const deletedUsers = await User.deleteMany({});
    const deletedThoughts = await Thought.deleteMany({});
    console.log(`Cleared ${deletedUsers.deletedCount} users and ${deletedThoughts.deletedCount} thoughts`);

    // Creates users
    console.log('Creating users...');
    const users = await User.create([
      {
        username: 'NedStark',
        email: 'ned.stark@winterfell.com'
      },
      {
        username: 'CatelynStark',
        email: 'catelyn.stark@winterfell.com'
      },
      {
        username: 'RobbStark',
        email: 'robb.stark@winterfell.com'
      },
      {
        username: 'SansaStark',
        email: 'sansa.stark@winterfell.com'
      },
      {
        username: 'AryaStark',
        email: 'arya.stark@winterfell.com'
      },
      {
        username: 'BranStark',
        email: 'bran.stark@winterfell.com'
      },
      {
        username: 'RickonStark',
        email: 'rickon.stark@winterfell.com'
      },
      {
        username: 'JonSnow',
        email: 'jon.snow@winterfell.com'
      }
    ]);
    console.log(`Created ${users.length} users`);

    // Creates thoughts
    console.log('Creating thoughts...');
    const thoughts = await Thought.create([
      {
        thoughtText: 'Winter is coming.',
        username: 'NedStark',
        userId: users[0]._id,
        reactions: [
          {
            reactionBody: 'The North remembers!',
            username: 'RobbStark'
          }
        ]
      },
      {
        thoughtText: 'A girl has no name.',
        username: 'AryaStark',
        userId: users[4]._id,
        reactions: [
          {
            reactionBody: 'Be careful, little sister.',
            username: 'JonSnow'
          }
        ]
      },
      {
        thoughtText: 'I am the three-eyed raven now.',
        username: 'BranStark',
        userId: users[5]._id,
        reactions: [
          {
            reactionBody: 'What does that mean?',
            username: 'SansaStark'
          }
        ]
      },
      {
        thoughtText: 'The lone wolf dies, but the pack survives.',
        username: 'SansaStark',
        userId: users[3]._id,
        reactions: [
          {
            reactionBody: 'Strong words, sister.',
            username: 'AryaStark'
          }
        ]
      },
      {
        thoughtText: 'I know nothing.',
        username: 'JonSnow',
        userId: users[7]._id,
        reactions: [
          {
            reactionBody: 'You know more than you think, Jon Snow.',
            username: 'BranStark'
          }
        ]
      }
    ]);
    console.log(`Created ${thoughts.length} thoughts`);

    // Adds friends
    console.log('Adding friend relationships...');
    const jonSnow = users.find(u => u.username === 'JonSnow');
    const aryaStark = users.find(u => u.username === 'AryaStark');
    const sansaStark = users.find(u => u.username === 'SansaStark');
    const branStark = users.find(u => u.username === 'BranStark');

    if (jonSnow && aryaStark) {
      await User.findByIdAndUpdate(
        jonSnow._id,
        { $addToSet: { friends: aryaStark._id } }
      );
      await User.findByIdAndUpdate(
        aryaStark._id,
        { $addToSet: { friends: jonSnow._id } }
      );
    }

    if (sansaStark && branStark) {
      await User.findByIdAndUpdate(
        sansaStark._id,
        { $addToSet: { friends: branStark._id } }
      );
      await User.findByIdAndUpdate(
        branStark._id,
        { $addToSet: { friends: sansaStark._id } }
      );
    }
    console.log('Added friend relationships');

    // Adds thoughts to users
    console.log('Adding thoughts to users...');
    for (const thought of thoughts) {
      await User.findOneAndUpdate(
        { username: thought.username },
        { $push: { thoughts: thought._id } }
      );
    }
    console.log('Added thoughts to users');

    // Verifies final counts
    const finalUserCount = await User.countDocuments();
    const finalThoughtCount = await Thought.countDocuments();
    console.log(`Final counts - Users: ${finalUserCount}, Thoughts: ${finalThoughtCount}`);

    console.log('🌱 Seed data planted! 🌱');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};


    console.log('Seeding database...');
    seedDatabase();
    console.log('Connected to the database. Database seeded successfully.');