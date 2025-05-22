import Admin from "../model/admin.model.js";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
const AuthController = {
  login: async (req, res) => {
    try {
      const { phone, password } = req.body;
      console.log(phone, password);
      if (!phone || !password) {
        return res
          .status(400)
          .json({ message: "Phone and Password is required" });
      }

      const findAdmin = await Admin.findOne({
        phone,
      });
      console.log(findAdmin);
      if (!findAdmin) {
        return res.status(400).json({ message: "User not found" });
      }

      if (findAdmin.password !== password) {
        return res
          .status(400)
          .json({ message: "Phone or password is invalid" });
      }

      const token = jwt.sign(
        { id: findAdmin._id, role: findAdmin.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      res.json({
        message: "Admin logged in Successfully",
        token,
        role: findAdmin.role,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  },
};

export default AuthController;
