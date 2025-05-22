import mongoose from "mongoose";
import Member from "../model/member.model.js";
import Role from "../model/role.model.js";
import Masjid from "../model/masjid.model.js";
const UserController = {
  getMasjidAndRoles: async (req, res) => {
    try {
      const pipeline = [
        {
          $lookup: {
            from: "roles", // Role model
            localField: "_id",
            foreignField: "masjid_id",
            as: "roles",
          },
        },
        {
          $unwind: {
            path: "$roles",
            preserveNullAndEmptyArrays: true, // in case a masjid has no roles
          },
        },
        {
          $lookup: {
            from: "members", // Member model
            localField: "roles._id",
            foreignField: "role_id",
            as: "roles.members",
          },
        },
        {
          $group: {
            _id: "$_id",
            masjid_name: { $first: "$masjid_name" },
            roles: {
              $push: {
                _id: "$roles._id",
                role_name: "$roles.role_name",
                members: "$roles.members",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            masjid_id: "$_id",
            masjid_name: 1,
            roles: 1,
          },
        },
      ];

      const masjidsWithRoles = await mongoose
        .model("Masjid")
        .aggregate(pipeline);

      res.json({
        message: "Data fetched successfully",
        masjid_data: masjidsWithRoles,
      });
    } catch (error) {
      console.error("Error fetching masjids and roles:", error);
      res.status(500).json({
        message: "Something went wrong while fetching data.",
        error: error.message,
      });
    }
  },
  getList: async (req, res) => {
    try {
      const { masjid_name, role_name } = req.query;

      // Build the base query
      let query = {};

      // Apply masjid filter if provided
      if (masjid_name) {
        const masjid = await Masjid.findOne({ masjid_name });
        if (masjid) {
          query.masjid_id = masjid._id;
        } else {
          return res.status(404).json({ message: "Masjid not found" });
        }
      }

      // Apply role filter if provided
      if (role_name) {
        const role = await Role.findOne({ role_name });
        if (role) {
          query.role_id = role._id;
        } else {
          return res.status(404).json({ message: "Role not found" });
        }
      }

      const members = await Member.find(query)
        .populate("role_id", "role_name")
        .populate("masjid_id", "masjid_name");

      const formattedMembers = members.map((member) => ({
        full_name: member.full_name,
        father_name: member.father_name,
        phone_number: member.phone_number,
        address: member.address,
        occupation: member.occupation,
        qualification: member.qualification,
        age: member.age,
        role_name: member.role_id?.role_name || "",
        masjid_name: member.masjid_id?.masjid_name || "",
      }));

      res.status(200).json({ success: true, members: formattedMembers });
    } catch (error) {
      console.error("Failed to get members:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  },

  getMemberData: async (req, res) => {
    try {
      // Extract the member ID from the query parameters (e.g., /getmemberdata?id=...)
      const { id } = req.query;

      // Check if an ID was provided
      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Member ID is required" });
      }

      // Find the member by ID using Mongoose
      // .lean() is often used to get a plain JavaScript object instead of a Mongoose document,
      // which can be slightly faster if you don't need Mongoose methods.
      const member = await Member.findById(id).lean();

      // If no member is found with the given ID
      if (!member) {
        return res
          .status(404)
          .json({ success: false, message: "Member not found" });
      }

      // If member is found, send the member object directly in the response body.
      // This matches the frontend's expectation of accessing response.data directly.
      res.status(200).json(member);
    } catch (error) {
      // Log the error on the server side
      console.error("Failed to get member data:", error);

      // Send a generic error response to the client
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  },
};

export default UserController;
