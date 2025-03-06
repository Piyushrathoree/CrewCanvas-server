import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    name:{
        firstName:{
            type: String,
            required:true,
        },
        lastName:{
            type:String,
        },
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    picture:{
        type:String,
        default:'', //for cloudinary url
    },
},
{timestamps:true}
);

// utility for changing password in the 
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        next();
    }
    // const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.statics.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};

userSchema.methods.generateToken = function  (){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET ,{expiresIn: "48h"})
} 

const User = mongoose.model("User", userSchema);

export default User;