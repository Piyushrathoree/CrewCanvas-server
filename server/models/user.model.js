import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const userSchema = mongoose.Schema(
    {
        name: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        teamspaces: [
            {
                teamspace: {
                    type: Schema.Types.ObjectId, // Reference to a Teamspace
                    ref: "Teamspace",
                },
                role: {
                    type: String,
                    enum: ["owner","admin", "member"], // Roles could be expanded later
                    default: "member",
                },
            },
        ],
        password: {
            type: String,
            required: true,
            // select:false
        },
        picture: {
            type: String,
            default: "", //for cloudinary url
        },
    },
    { timestamps: true }
);

userSchema.statics.hashPassword= async function(password){
    return await bcrypt.hash(password ,10);
}
// // utility for changing password in the 
// userSchema.pre("save", async function (next) {
//     if(!this.isModified("password")){
//         next();
//     }
//     // const salt = await bcrypt.genSalt(10);
//     this.password =  bcrypt.hash(this.password, 10);
// });

userSchema.methods.isPasswordCorrect = async function (password) {
    if (!password) {
        throw new Error("Password is required for comparison");
    }
    console.log(password);
    console.log(this.password);
    
    
    const match = await bcrypt.compare(password, this.password);
    return match;
};

userSchema.methods.generateToken = function  (){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET ,{expiresIn: "48h"})
} 

const User = mongoose.model("User", userSchema);

export default User;