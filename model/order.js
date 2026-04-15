import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  email: String,

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: Number,
      price: Number
    }
  ],

  delivery: {
    name: String,
    phone: String,
    address: String,
    city: String
  },

  userId: {
      type: mongoose.Schema.Types.ObjectId,
       ref: "user",
      required: false,
    },
  

  totalAmount: Number,
  paymentReference: String,
  paymentStatus: { type: String, default: "paid" },

  status: {
  type: String,
  enum: [ "processing", "shipped", "delivered"],
  default: "processing"
},

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);