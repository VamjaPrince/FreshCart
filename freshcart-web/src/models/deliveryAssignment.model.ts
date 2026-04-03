import mongoose from "mongoose";

interface IDeliveryAssignment {
  _id: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  broadcasedTo: mongoose.Types.ObjectId[];
  assignedTo: mongoose.Types.ObjectId | null;
  status: "broadcasted" | "assigned" | "Completed";
  acceptedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const deliveryAssignmentSchema = new mongoose.Schema<IDeliveryAssignment>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    broadcasedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["broadcasted", "assigned", "Completed"],
      default: "broadcasted",
    },
    acceptedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const DeliveryAssignment =
  mongoose.models.DeliveryAssignment ||
  mongoose.model("DeliveryAssignment", deliveryAssignmentSchema);

export default DeliveryAssignment;