import express from "express";
import { createOrder , getAllOrders, getOrderById, deleteOrder,getUserOrders, updateOrderStatus,getOrderByReference} from "../controller/order.js";
import auth from "../middleware/auth.js"

const router = express.Router();

router.post("/create",auth, createOrder);
router.get("/", getAllOrders);
router.get("/customer",auth, getUserOrders);
router.get("/:reference", getOrderByReference);
router.delete ('/delete/:id', deleteOrder)
router.put("/admin/status/:id", updateOrderStatus)
router.get ('/:id', getOrderById)




export default router;