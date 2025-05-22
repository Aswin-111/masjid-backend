import mongoose from "mongoose";

const masjidSchema = new mongoose.Schema({
    masjid_name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      phone_number: {
        type: String,
        required: true,
      },

} , {timestamps : true})
const Masjid = mongoose.model("Masjid", masjidSchema)
export default Masjid