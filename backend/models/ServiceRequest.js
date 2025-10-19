import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links to the User model
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to the User model (optional, assigned later)
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      // You can expand this list later
      enum: ['Plumbing', 'Electrical', 'Appliance', 'Other'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Assigned', 'InProgress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
export default ServiceRequest;