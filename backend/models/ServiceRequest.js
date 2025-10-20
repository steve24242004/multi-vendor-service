import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Plumbing', 'Electrical', 'Appliance', 'Other'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Assigned', 'InProgress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    // --- ADD THIS NEW FIELD ---
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
  },
  {
    timestamps: true,
  }
);

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
export default ServiceRequest;