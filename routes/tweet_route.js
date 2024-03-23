const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const TweetModel = mongoose.model("TweetModel");
const protectedRoute = require('../middleware/protectedResource');


//all user tweets
router.get("/alltweets", (req,res)=>{
    TweetModel.find()
    .populate("author", "_id userName profilePicture")
    .then((dbTweets)=>{
        res.status(200).json({tweets: dbTweets})
    })
    .catch((error)=>{
        console.log(error);
    })
});

//all tweets only from the logged in user
router.get("/myalltweets", protectedRoute, (req,res)=>{
    TweetModel.find({author: req.user._id})
    .populate("author", "_id userName profilePicture")
    .then((dbTweets)=>{
        res.status(200).json({tweets: dbTweets})
    })
    .catch((error)=>{
        console.log(error);
    })
});

router.post("/createtweet",protectedRoute, (req,res)=>{
    const {content, image} = req.body;
    if(!content || !image){
        return res.status(400).json({error: "One or more mandatory fields are empty"});
    }
    req.user.password = undefined;
    const tweetObj = new TweetModel({content: content, image: image, author: req.user});
    tweetObj.save()
    .then((newTweet)=>{
        res.status(201).json({tweet: newTweet});
    })
    .catch((error)=>{
        console.log(error);
    })
});

router.delete("/deletetweet/:tweetId", protectedRoute, (req,res)=>{
    TweetModel.findOne({_id: req.params.tweetId})
    .populate("author", "_id")
    .exec((error, tweetFound)=>{
        if(error || !tweetFound){
            return res.status(400).json({error: "Tweet does not exist"});
        }
        //check if the tweet author is same as loggedin user only then allow deletion
        if(tweetFound.author._id.toString() === req.user._id.toString()){
            tweetFound.remove()
            .then((data)=>{
                res.status(200).json({result: data});
            })
            .catch((error)=>{
                console.log(error);
            })
        } 
    })
});

router.put("/like", protectedRoute, (req,res)=>{
    TweetModel.findByIdAndUpdate(req.body.tweetId, {
        $push: {likes: req.user._id}
    }, {
        new: true //return updated record
    }).populate("author","_id name")
    .exec((error, result)=>{
        if(error){
            return res.status(400).json({error: error});
        }else{
            res.json(result);
        }
    })
});

router.put("/dislike", protectedRoute, (req,res)=>{
    TweetModel.findByIdAndUpdate(req.body.tweetId, {
        $pull: {likes: req.user._id}
    }, {
        new: true //return updated record
    }).populate("author","_id name")
    .exec((error, result)=>{
        if(error){
            return res.status(400).json({error: error});
        }else{
            res.json(result);
        }
    })
});

router.put("/tweetedby", protectedRoute, (req,res)=>{
    TweetModel.findByIdAndUpdate(req.body.tweetId, {
        $push: {tweetedBy: req.user._id}
    }, {
        new: true //return updated record
    }).populate("author","_id name")
    .exec((error, result)=>{
        if(error){
            return res.status(400).json({error: error});
        }else{
            res.json(result);
        }
    })
});

router.put("/reply", protectedRoute, (req,res) =>{
    const reply = {replyText: req.body.replyText, replyBy: req.user._id}

    TweetModel.findByIdAndUpdate(req.body.tweetId, {
        $push: { replies: reply }
    }, {
        new: true //return updated record
    }).populate("replies.replyBy", "_id name") //reply owner
        .populate("author", "_id name")// tweet owner
        .exec((error, result)=>{
            if(error) {
                return res.status(400).json({ error: error});
            }else{
                res.json(result);
            }
        })
});

router.put("/retweet", protectedRoute, (req,res) =>{
    const retweet = {retweetText: req.body.retweetText, retweetBy: req.user._id}

    TweetModel.findByIdAndUpdate(req.body.tweetId, {
        $push: { retweetedBy: retweet }
    }, {
        new: true //return updated record
    }).populate("retweetedBy.retweetBy", "_id name") //reply owner
        .populate("author", "_id name")// retweet owner
        .exec((error, result)=>{
            if(error) {
                return res.status(400).json({ error: error});
            }else{
                res.json(result);
            }
        })
});

module.exports = router;