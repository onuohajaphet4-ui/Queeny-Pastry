import Order from "../model/order.js";
import {cart} from "../model/cart.js";
import axios from "axios";
import {product} from '../model/product.js'
import mongoose from "mongoose";


export const createOrder = async (req, res) => {
try {
const { reference } = req.body;

if (!reference) {
  return res.status(400).json({ message: "Reference is required" });
}

//  VERIFY PAYMENT WITH PAYSTACK
const verify = await axios.get(
  `https://api.paystack.co/transaction/verify/${reference}`,
  {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
    },
  }
);

const paymentData = verify.data.data;

if (paymentData.status !== "success") {
  return res.status(400).json({ message: "Payment not verified" });
}

//  GET METADATA
const metadata = paymentData.metadata;

const cartItems = JSON.parse(metadata.cartItems || "[]");
const delivery = JSON.parse(metadata.delivery || "{}");

if (!cartItems.length) {
  return res.status(400).json({ message: "Cart is empty" });
}

//  FORMAT ITEMS
const items = cartItems.map(item => ({
  productId: item._id,
  quantity: item.quantity,
  price: item.price
}));

//  OPTIONAL USER (guest support)
const userId = req.user ? req.user.id : null;

//  CREATE ORDER
const order = await Order.create({
  userId,
  email: paymentData.customer.email,
  items,
  delivery,
  totalAmount: paymentData.amount / 100,
  paymentReference: reference,
  status: "processing"
});

//  UPDATE PRODUCT SALES
for (const item of items) {
  await product.findByIdAndUpdate(
    item.productId,
    { $inc: { totalSold: item.quantity } }
  );
}

res.status(201).json({
  success: true,
  message: "Order created successfully",
  order
});

} catch (error) {
console.log("🔥 ERROR:", error.response?.data || error.message);

res.status(500).json({
  success: false,
  message: "Order creation failed"
});

}
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteOrder  = async (req, res) => {
       try {
           const id = req.params.id
           const orders = await Order.findByIdAndDelete(id)
           if(!orders) return res.status(400).json({message: 'Order do not exist'}) 
           res.status(201).json({ success:true,
        message: 'Order deleted successful'})
           
             
       } catch (error) {
           res.status(500).json({ success:false,message:"Sever Error", error})
       }
}

export const getUserOrders = async (req, res) => {
  console.log("getUserOrders HIT");
  try {

    const userId = req.user?.id;
    const email = req.user?.email;

    console.log("USER ID:", userId);
    console.log("EMAIL:", email);

    const orders = await Order.find({
      $or: [
        userId ? { userId: new mongoose.Types.ObjectId(userId) } : null,
        email ? { email: email } : null
      ].filter(Boolean)
    })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderByReference = async (req, res) => {
  try {
    
    const { reference } = req.params;

    const order = await Order.findOne({
      paymentReference: reference
    }).populate("items.productId");
    console.log(reference)
    

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["paid", "processing", "shipped", "delivered"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//Get Order by id

 
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};