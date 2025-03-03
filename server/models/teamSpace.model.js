import mongoose, { Schema } from 'mongoose';

const teamSpaceSchema = new mongoose.Schema({
    projectName:{
        type: String,
        required: true
    },
    OwnerId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    members:[{
        type:Schema.Types.ObjectId,
        ref:'User',
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const TeamSpace = mongoose.model('TeamSpace', teamSpaceSchema);