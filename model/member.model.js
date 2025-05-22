import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  father_name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  role_id : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Role",
    required : true
  },
  masjid_id : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Masjid",
    required : true
  },
});

const Member = mongoose.model("Member",memberSchema)
export default Member;