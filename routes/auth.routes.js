import express from "express"
import AuthController from "../controller/auth.controller.js"
const router = express.Router()

// http://localhost:5000/auth/login


router.post("/login", AuthController.login)
export default router 
