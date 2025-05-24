import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    categories: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Category",
        required: false,
    },
    image: {
        type: String,
        required: true
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required: false,
    },
    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required: false,
    },


}, {timestamps: true});


const Blog = mongoose.model("Blog", blogSchema);

export default Blog;