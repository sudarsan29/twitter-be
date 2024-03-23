const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        timestamps: true
    },
    userName: {
        type: String,
        required: true,
        timestamps: true
    },
    email: {
        type: String,
        required: true,
        timestamps: true
    },
    password: {
        type: String,
        required: true,
        timestamps: true
    },
    profilePicture: ({
        type: String,
        default: "https://images.unsplash.com/photo-1683538967101-a1543aac2dc9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",   
        timestamps: true
    }),
    location: {
        type: String,
        timestamps: true
    },
    dateofBirth: {
        type: String,
        default: Date.now,
        timestamps: true
    },
    Followers:[ 
    {
        type: ObjectId,
        ref: 'UserModel',
        unique: false,
        timestamps: true
    }],
    following:[ 
    {
        type: ObjectId,
        ref: 'UserModel',
        unique: false,
        timestamps: true
    }
    ],
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

mongoose.model("UserModel", userSchema);