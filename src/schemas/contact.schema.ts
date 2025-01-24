import mongoose, { Schema, Document } from 'mongoose';
export interface IContact extends Document {
  inquiryPurpose: string;
  description: string;
  fullName: string;
  email: string;
  organization?: string;
  phone?: string;
  message: string;
  createdAt: Date;
}

export const ContactSchema: Schema = new Schema<IContact>({
  inquiryPurpose: {
    type: String,
    required: [true, 'Inquiry purpose is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Enforces uniqueness for emails
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
  },
  organization: {
    type: String,
    default: null, // Optional field
  },
  phone: {
    type: String,
    default: null, // Optional field
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date
  },
});

// Create a model from the schema
const Contact = mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
