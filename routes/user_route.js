const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const UserModel = mongoose.model("UserModel");
const { JWT_SECRET } = require('../config')


router.post("/signup", (req,res)=>{
    const {name, userName, email, password, profilePicture,location,dateofBirth,Followers,following} = req.body;
    if(!name || !userName || !email || !password){
        return res.status(400).json({error: "One or more Mandatory fields are empty"})
    }
    UserModel.findOne({email: email})
    .then((userInDB)=>{
        if(userInDB){
            return res.status(500).json({error: "User with this email already registered"});
        }
        bcryptjs.hash(password, 16)
        .then((hashedPassword)=>{
            const user = new UserModel({name, userName, email, password: hashedPassword, profilePicture,location,dateofBirth,Followers,following});
            user.save()
            .then((newUser)=>{
                res.status(201).json({result: "User Signed Up Successfully"});
            })
            .catch((err)=>{
                console.log(err);
            })
        }).catch((err)=>{
            console.log(err);
        })
    })
    .catch((err)=>{
        console.log(err);
    })
});

router.post("/login", (req,res)=>{
    const { userName, password} = req.body;
    if(!userName || !password){
        return res.status(400).json({error: "One or more Mandatory fields are empty"})
    }
    UserModel.findOne({userName: userName})
    .then((userInDB)=>{
        if(!userInDB){
            return res.status(401).json({error: "Invalid Credentials"});
        }
        bcryptjs.compare(password, userInDB.password)
        .then((didMatch)=>{
            if(didMatch){
                const jwtToken = jwt.sign({_id: userInDB._id}, JWT_SECRET);
                const userInfo = {"password": userInDB.password, "userName": userInDB.userName};

                res.status(200).json({result: {token: jwtToken, user: userInfo}});
            }else{
                return res.status(401).json({error: "Invalid Credentials"});
            }
        }).catch((err)=>{
            console.log(err);
        })
    })
    .catch((err)=>{
        console.log(err);
    })
});

module.exports = router;