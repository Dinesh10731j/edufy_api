import { Schema, Document } from 'mongoose';

// Define the User schema
export const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Defining the User interface for type safety
export interface User extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  createdAt: Date;
}
