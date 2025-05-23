import express from "express";
import AdminController from "../controller/superadmin.controller.js";
import eventUploader from "../middleware/multer.middleware.js";
import superAuth from "../middleware/super.js";
const router = express.Router();

router.get("/dashboard", superAuth, AdminController.getDashboardDetails);
router.post("/createmasjid", superAuth, AdminController.createMasjid);
router.post("/addrole", superAuth, AdminController.addRole);
router.post("/addmember", superAuth, AdminController.addMember);
router.post(
  "/addevent",
  eventUploader.single("poster_image"),
  AdminController.addEvent
);

router.get("/addmemberdetails", superAuth, AdminController.getMasjidAddMember);
router.get("/addrolemasjid", superAuth, AdminController.getMasjidAddRole);
router.get("/addusermasjid", superAuth, AdminController.getMasjidAddUser);

router.post("/adduser", superAuth, AdminController.addUser);

router.get("/editmasjid", superAuth, AdminController.getEditMasjidData);
router.put("/editmasjid/:id", superAuth, AdminController.updateMasjid);
router.delete("/deletemasjid/:id", superAuth, AdminController.deleteMasjid);

// edit member

router.get("/editmember", superAuth, AdminController.getEditMemberData);
router.put("/editmember", superAuth, AdminController.editMemberData);
router.get(
  "/geteditmemberbyid/:id",
  superAuth,
  AdminController.getEditMemberDataById
);

export default router;
