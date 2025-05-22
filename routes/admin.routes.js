import express from "express";
import AdminController from "../controller/admin.controller.js";
import eventUploader from "../middleware/multer.middleware.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/dashboard", auth, AdminController.getDashboardDetails);
// router.post("/createmasjid", auth, AdminController.createMasjid);
router.post("/addrole", auth, AdminController.addRole);
router.post("/addmember", auth, AdminController.addMember);
router.post(
  "/addevent",
  auth,
  eventUploader.single("poster_image"),
  AdminController.addEvent
);

router.get("/editshowallmembers", auth, AdminController.editShowAllMembers);
router.get("/editmembershowdetails", auth, AdminController.getEditMemberData);

router.get("/geteditmemberdata/:id", auth, AdminController.getEditMemberDT);
router.put("/editmember", auth, AdminController.editMember);
router.get("/addmemberdetails", auth, AdminController.getAddMemberDetails);
router.delete("/deletemember/:id", auth, AdminController.deleteMember);
// router.get("/addrolemasjid", auth, AdminController.getMasjidAddRole);
// router.get("/addusermasjid", auth, AdminController.getMasjidAddUser);

// router.post("/adduser", auth, AdminController.addUser);
export default router;
