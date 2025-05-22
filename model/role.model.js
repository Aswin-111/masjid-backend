import mongoose from "mongoose"

const roleSchema = new mongoose.Schema({
    role_name : {
        type : String,
        required : true
    },
    description :{
        type : String,

    },
    masjid_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Masjid",

        required : true
    }
} , {timestamps : true})



const Role = mongoose.model("Role", roleSchema)

export default Role