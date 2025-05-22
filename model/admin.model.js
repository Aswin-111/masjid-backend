import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    masjid_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Masjid",
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
