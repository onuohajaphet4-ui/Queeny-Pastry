import dotenv from "dotenv"
dotenv.config()
import mongoose from"mongoose";
import express from "express";
import cors from "cors";
import path from "path"
import { fileURLToPath } from "url"
import userRoutes from './route/user.js'
import productRoutes from './route/product.js'
import cartRoute from "./route/cart.js"
import faveRoute from "./route/favorite.js"
import paymentRoutes from './route/payment.js'
import orderRoutes from './route/order.js'
import dashRoutes from './route/dashboard.js'
import notisficationRoutes from './route/notisfication.js'
import goggleRoutes from "./route/passport.js"
import passport from 'passport'
import './controller/passport.js'



const app = express();
app.use(express.json())
app.use(cors({
  origin: "*",
  methods:'GET,POST,PUT,DELETE',
  allowedHeaders:'Content-Type,Authorization'
}))
app.use(passport.initialize())




mongoose
  .connect(process.env.MOGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));




app.get ('/' , (req, res) => {
res.send ("hello Japhet you are cute")
})

//Route
app.use('/api/user', userRoutes)
app.use('/api/product', productRoutes)
app.use('/api/cart', cartRoute)
app.use('/api/favorite', faveRoute)
app.use('/api/payment', paymentRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/dash', dashRoutes)
app.use('/', goggleRoutes)
app.use('/api/notisfication',notisficationRoutes)
// Start server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log("✅ Backend running on http://localhost:3000");
});