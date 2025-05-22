import express from "express";
import UserController from "../controller/user.controller.js";
const router = express.Router();

router.get("/getmasjidandroles", UserController.getMasjidAndRoles);
router.get("/memberlist", UserController.getList);
router.get("/getmemberdata", UserController.getMemberData);

export default router;
