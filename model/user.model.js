import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phone_number : {
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    role : {
        type : String,
    }
    ,
    masjid_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Masjid",
        required : true
    }
} ,{timestamps : true})


const User = mongoose.model("User" , userSchema)
export default User