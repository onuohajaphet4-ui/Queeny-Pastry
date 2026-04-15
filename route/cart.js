import express from 'express'
import  {addCart, deleteCart, getAllCart,getCartById, updateCart } from '../controller/cart.js'
import auth from "../middleware/auth.js"

const router = express.Router ()

router.post ('/',    addCart)
router.get ('/',  getAllCart)
router.get ('/:id',  getCartById)
router.put ('/:id',  updateCart)
router.delete ('/delete/:id',  deleteCart)

export default router