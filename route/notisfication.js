import express from "express"
import {
    createNotification,
    getAllNotification,
    deleteNotification
  
} from "../controller/notisfication.js"

import auth from "../middleware/auth.js"

const router = express.Router()

router.post("/", auth, createNotification)
router.get("/", auth, getAllNotification)
router.delete("/:id", auth,deleteNotification)

export default router