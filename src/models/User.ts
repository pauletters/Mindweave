import { Schema, Document, model, ObjectId } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  thoughts: ObjectId[];
  friends: ObjectId[];
 }

// Schema to create User model
const userSchema = new Schema<IUser>(
  {
    username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    },
    email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email address'
    ]
  },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema
  .virtual('friendCount')
  // Getter
  .get(function (this: any) {
    return `${this.friends.length}`;
  });

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

// Initialize User model
const User = model('user', userSchema);

export default User
