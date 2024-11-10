import { Schema, Document, Types, model, SchemaDefinitionProperty } from 'mongoose';
import reactionsSchema from './Reaction.js';

interface IThought extends Document {
  thoughtText: string;
  createdAt: Date;
  username: string;
  userId: Types.ObjectId;
  reactions: Array<{
    reactionId: Types.ObjectId;
    reactionBody: string;
    username: string;
    createdAt: Date;
  }>;
 }

// Schema to create User model
const thoughtSchema = new Schema<IThought>(
  {
    thoughtText: {
    type: String,
    required: [true, 'A message is required'],
    minlength: 1,
    maxlength: 280,
    },
    createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp: Date) => timestamp.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    })
 } as SchemaDefinitionProperty<Date>,
    username: {
    type: String,
    required: [true, 'Username is required'],
    },
    userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    },
    reactions: [reactionsSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

thoughtSchema
  .virtual('reactionCount')
  .get(function (this: IThought) {
    return `${this.reactions.length}`;
  });

// Initialize User model
const Thought = model<IThought>('Thought', thoughtSchema);

export default Thought;
