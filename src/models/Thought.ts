import { Schema, Document, model, ObjectId, SchemaDefinitionProperty } from 'mongoose';
import reactionsSchema from './Reaction';

interface IThought extends Document {
  thoughtText: String;
  createdAt: Date;
  username: String;
  reactions: ObjectId[];
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
    default: () => new Date(),
    get: (value: any) => new Date(value).toLocaleDateString('en-US', { 
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
  // Getter
  .get(function (this: any) {
    return `${this.reactions.length}`;
  });

// Initialize User model
const Thought = model('Thought', thoughtSchema);

export default Thought;
