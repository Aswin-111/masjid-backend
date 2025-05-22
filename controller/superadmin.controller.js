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
};

export default AdminController;
