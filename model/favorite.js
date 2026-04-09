import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true
    }
  },
  { timestamps: true }
)

favoriteSchema.index({ user: 1, product: 1 }, { unique: true })

export const favorite = mongoose.model("favorite", favoriteSchema)