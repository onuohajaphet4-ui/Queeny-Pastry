import mongoose from "mongoose";

const notisficationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    message:{
        type:String , required:true
    },
    createdAt: {
    type: Date,
    default: Date.now
  }
  },
  { timestamps: true }
)



export const notisfication = mongoose.model("notisfication", notisficationSchema)