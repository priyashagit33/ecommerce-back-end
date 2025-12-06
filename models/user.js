import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
    type:String,
    required:true,
    unique:true
    },
    password:{
    type:String,
    required:true
    },
    phone:{
    type:String,
    default:"Not Given"
    },
    isBlocked:{
    type:Boolean,
    default:false
    },
    role:{
    type:String,
    dafault:"user"
    },
    isEmailVerified:{
        type:Boolean,
        dafault:false
    },
    image:{
        type:String,
        default:"https://pixabay.com/illustrations/icon-profile-user-clip-art-7797704/"
    }
})

const User = mongoose.model("users",userSchema);

export default User;
