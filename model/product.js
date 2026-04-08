import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: String,
  rating: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const productSchmema = new mongoose.Schema(
    {
        name:{
            type:String , required:true
        },
        price:{
            type:Number , required:true
        },
        imageUrl:{
            type:String 
        },
        stock:{
            type:String 
        },
        section:{
            type:String,
            enum:["Cake",
                  "Pastries",
                  "Small-chop",
                  "Snack",
                ]
        },

        totalSold: {
          type: Number,
         default: 0
        },
        
        reviews: [reviewSchema],  
        averageRating: { type: Number, default: 0 }
    } , 
    {timestamps:true}
)

export const product = mongoose.model("product", productSchmema)