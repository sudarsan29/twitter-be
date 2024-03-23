const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const tweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        timestamps: true
    },
    image: {
        type: String,
        required: true,
        timestamps: true
    },
    likes: [
        {
            type: ObjectId,
            required: true,
            ref: "UserModel",
            timestamps: true
        }
    ],
    tweetedBy: [
        {
            type: ObjectId,
            required: true,
            ref: "UserModel",
            timestamps: true
        }
    ],
    retweetedBy: [
        {
            retweetText: String,
            retweetBy: { type: ObjectId, ref: "UserModel" }
        }
    ],
    replies: [
        {
            replyText: String,
            replyBy: { type: ObjectId, ref: "UserModel"}
        }
    ],
    author: {
        type: ObjectId,
        ref: "UserModel"
    }
});

mongoose.model("TweetModel", tweetSchema);