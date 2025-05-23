import mongoose from "mongoose";
import Admin from "../model/admin.model.js";
import Masjid from "../model/masjid.model.js";
import Member from "../model/member.model.js";
import Role from "../model/role.model.js";
import Event from "../model/event.model.js";
import { createMasjidSchema } from "../validator/masjid.validator.js";
import { addRoleSchema } from "../validator/superadmin/role.validator.js";
import { addMemberSchema } from "../validator/superadmin/member.validator.js";
import { addEventSchema } from "../validator/event.validator.js";
import User from "../model/user.model.js";
const AdminController = {
  getDashboardDetails: async (req, res) => {
    try {
      const masjid_count = await Masjid.countDocuments({});
      const member_count = await Member.countDocuments({});
      const role_count = await Role.countDocuments({});
      const event_count = await Event.countDocuments({});
      const recent_event = await Event.findOne().sort({ _id: -1 }).limit(1);

      const dashboard_data = {
        masjid_count,
        member_count,
        role_count,
        event_count,
        recent_event,
      };

      res.json({ message: "Data fetched successfully", dashboard_data });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
  createMasjid: async (req, res) => {
    try {
      const { masjid_name, address, phone_number } = createMasjidSchema.parse(
        req.body
      );

      await Masjid.create({
        masjid_name,
        address,
        phone_number,
      });

      res.json({ message: "Masjid created successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  },
  addRole: async (req, res) => {
    try {
      const { role_name, description, masjid_id } = addRoleSchema.parse(
        req.body
      );
      const findUser = await Role.findOne({ role_name, masjid_id });

      if (findUser) {
        return res.status(400).json({ message: "Role already exists" });
      }
      await Role.create({
        role_name,
        description,
        masjid_id,
      });

      res.json({ message: "Role created successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  },
  addMember: async (req, res) => {
    try {
      const {
        full_name,
        age,
        father_name,
        phone_number,
        address,
        occupation,
        qualification,
        role_id,
        masjid_id,
      } = addMemberSchema.parse(req.body);

      const findUser = await Member.findOne({ phone_number });
      if (findUser) {
        return res.status(400).json({ message: "Member already exists" });
      }
      await Member.create({
        full_name,
        age,
        father_name,
        phone_number,
        address,
        occupation,
        qualification,
        role_id,
        masjid_id,
      });

      res.json({ message: "Member added successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  },

  addUser: async (req, res) => {
    try {
      const { phone, password, masjid_id } = req.body;
      console.log(phone, password, masjid_id);
      const findUser = await Admin.findOne({ phone });
      if (findUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      await Admin.create({
        phone,
        password,
        role: "admin",
        masjid_id,
      });

      res.json({ message: "User added successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  },
  addEvent: async (req, res) => {
    try {
      const { title, description, poster_url, date, masjid_id } =
        addEventSchema.parse(req.body);

      if (!req.file && !req.file.filename) {
        return res.status(400).json({ message: "Image is required" });
      }
      await Event.create({
        title,
        description,
        poster_url: req.file.filename,
        date,
        masjid_id,
      });

      res.json({ message: "Event added successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong", error });
    }
  },
  getMasjidAddMember: async (req, res) => {
    try {
      const { masjid_id } = req.query;
      console.log(masjid_id, "masjid");
      let roles;
      if (masjid_id) {
        roles = await Role.find({ masjid_id });
      } else {
        roles = await Role.find({});
      }
      const masjids = await Masjid.find({});

      res.json({
        message: "Data fetched successfully",
        details: { roles, masjids },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  },

  getMasjidAddRole: async (req, res) => {
    try {
      const masjid = await Masjid.find({});

      res.json({
        message: "Data fetched successfully",
        details: { masjid },
      });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong", error });
    }
  },
  getMasjidAddUser: async (req, res) => {
    try {
      const masjid = await Masjid.find({});

      res.json({
        message: "Data fetched successfully",
        details: { masjid },
      });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong", error });
    }
  },
  getEditMasjidData: async (req, res) => {
    try {
      const masjids = await Masjid.find();
      res.json(masjids);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
  updateMasjid: async (req, res) => {
    const { id } = req.params;

    console.log(id);
    try {
      const existingMasjid = await Masjid.findById(id);
      if (!existingMasjid) {
        return res.status(404).json({ message: "Masjid not found" });
      }

      // Update only if a value is provided; else retain existing
      existingMasjid.masjid_name =
        req.body.masjid_name || existingMasjid.masjid_name;
      existingMasjid.address = req.body.address || existingMasjid.address;
      existingMasjid.phone_number =
        req.body.phone_number || existingMasjid.phone_number;

      const updatedMasjid = await existingMasjid.save();
      res.json(updatedMasjid);
    } catch (err) {
      res.status(500).json({ message: "Update failed", error: err.message });
    }
  },
  deleteMasjid: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if masjid exists
      const masjid = await Masjid.findById(id);
      if (!masjid) {
        return res.status(404).json({ message: "Masjid not found" });
      }

      // Delete related roles
      await Role.deleteMany({ masjid_id: id });

      // Delete related members
      await Member.deleteMany({ masjid_id: id });

      // Delete masjid itself
      await Masjid.findByIdAndDelete(id);

      res
        .status(200)
        .json({ message: "Masjid and related data deleted successfully" });
    } catch (error) {
      console.error("Error deleting masjid:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getEditMemberData: async (req, res) => {
    try {
      const { masjid_id } = req.query;
      console.log(masjid_id);
      const filter = masjid_id ? { masjid_id } : {};

      const members = await Member.find(filter);
      console.log(members);
      return res.status(200).json({
        success: true,
        members,
      });
    } catch (error) {
      console.error("Error fetching members:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch members",
      });
    }
  },
  editMemberData: async (req, res) => {
    try {
      const { id } = req.query;

      // Fetch existing member
      const existingMember = await Member.findById(id);
      if (!existingMember) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }

      // Merge existing data with new data (only update fields that are provided)
      const updatedData = {
        name: req.body.name || existingMember.name,
        email: req.body.email || existingMember.email,
        phone: req.body.phone || existingMember.phone,
        address: req.body.address || existingMember.address,
        role: req.body.role || existingMember.role,
        // Add other fields as necessary
      };

      // Save updated member
      const updatedMember = await Member.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      return res.status(200).json({
        success: true,
        message: "Member data updated successfully",
        data: updatedMember,
      });
    } catch (error) {
      console.error("Error updating member data:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update member data",
      });
    }
  },
  getEditMemberDataById: async (req, res) => {
    try {
      const { id } = req.params;
      const ObjectId = mongoose.Types.ObjectId;

      // ✅ First, check if the member exists
      const member = await Member.findById(id);

      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      // ✅ Safe to log now
      console.log("member.masjid_id:", member.masjid_id.toString());
      console.log("expected:", "682c1c48347ec3935d529b76");
      console.log(
        "equal:",
        member.masjid_id.toString() === "682c1c48347ec3935d529b76"
      );

      // ✅ Query all roles with this masjid_id
      const roles = await Role.find({
        masjid_id: member.masjid_id, // Already an ObjectId
      });

      console.log(roles);

      res.json({ member_data: member, roles });
    } catch (error) {
      console.error("Error fetching member by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default AdminController;
