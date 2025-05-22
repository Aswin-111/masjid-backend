import Admin from "../model/admin.model.js";
import Masjid from "../model/masjid.model.js";
import Member from "../model/member.model.js";
import Role from "../model/role.model.js";
import Event from "../model/event.model.js";
import { createMasjidSchema } from "../validator/masjid.validator.js";
import { addRoleSchema } from "../validator/role.validator.js";
import { addMemberSchema } from "../validator/member.validator.js";
import { addEventSchema } from "../validator/event.validator.js";
import editMemberSchema from "../validator/admineditmember.validator.js";
const AdminController = {
  getDashboardDetails: async (req, res) => {
    try {
      const member_count = await Member.countDocuments({});
      const role_count = await Role.countDocuments({});
      const event_count = await Event.countDocuments({});
      const recent_event = await Event.findOne().sort({ _id: -1 }).limit(1);

      const dashboard_data = {
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
      return res.status(500).json({ message: "Something went wrong", error });
    }
  },
  addRole: async (req, res) => {
    try {
      const { role_name, description } = addRoleSchema.parse(req.body);

      const findUser = await Admin.findById({ _id: req.user.id });
      const { masjid_id } = findUser;
      const findRole = await Role.findOne({ role_name, masjid_id });
      if (findRole) {
        return res.status(400).json({ message: "Role already exists" });
      }
      await Role.create({
        role_name,
        description,
        masjid_id,
      });

      res.json({ message: "Role created successfully" });
    } catch (error) {
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
      } = addMemberSchema.parse(req.body);
      const findMasjid = await Admin.findById({ _id: req.user.id });
      console.log(findMasjid);
      const { masjid_id } = findMasjid;
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

  editShowAllMembers: async (req, res) => {
    try {
      const findUser = await Admin.findById({ _id: req.user.id });
      const { masjid_id } = findUser;
      const members = await Member.find({ masjid_id });
      res.json({ message: "Data fetched successfully", members });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  },

  getEditMemberData: async (req, res) => {
    try {
      const findUser = await Admin.findById({ _id: req.user.id });
      const { masjid_id } = findUser;
      const roles = await Role.find({ masjid_id });
      const members = await Member.findById({ _id: req.params.id });
      res.json({
        message: "Data fetched successfully",
        member_data: { roles, members },
      });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
  getEditMemberDT: async (req, res) => {
    try {
      const findUser = await Admin.findById({ _id: req.user.id });
      const { masjid_id } = findUser;
      const roles = await Role.find({ masjid_id });
      const member = await Member.findById({ _id: req.params.id });
      res.json({
        message: "Data fetched successfully",
        member_data: { roles, member },
      });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
  editMember: async (req, res) => {
    try {
      console.log(req.body);
      const {
        id,
        full_name,
        age,
        father_name,
        phone_number,
        address,
        occupation,
        qualification,
        role_id,
      } = editMemberSchema.parse(req.body);
      console.log(id);
      const findUser = await Admin.findById({ _id: req.user.id });
      const { masjid_id } = findUser;
      const member = await Member.findById(id);

      member.full_name = full_name || member.full_name;
      member.age = age || member.age;
      member.father_name = father_name || member.father_name;
      member.phone_number = phone_number || member.phone_number;
      member.address = address || member.address;
      member.occupation = occupation || member.occupation;
      member.qualification = qualification || member.qualification;
      member.role_id = role_id || member.role_id;
      member.masjid_id = masjid_id || member.masjid_id;
      await member.save();
      res.json({ message: "Member updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },

  getAddMemberDetails: async (req, res) => {
    try {
      const findUser = await Admin.findById({ _id: req.user.id });
      const { masjid_id } = findUser;
      const roles = await Role.find({ masjid_id });
      res.json({
        message: "Data fetched successfully",
        member_data: { roles },
      });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  },

  deleteMember: async (req, res) => {
    try {
      
      await Member.findByIdAndDelete({ _id: req.params.id });
      res.json({ message: "Member deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
};

export default AdminController;
