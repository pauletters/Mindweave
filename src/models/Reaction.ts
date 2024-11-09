import { Schema, Document, ObjectId, Types, SchemaDefinitionProperty } from 'mongoose';

interface IReaction extends Document {
  reactionId: ObjectId;
  reactionBody: string;
  username: string;
  createdAt: Date;
}

const reactionSchema = new Schema<IReaction>(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
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
    },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

export default reactionSchema;
