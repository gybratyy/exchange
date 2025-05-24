import Blog from "../models/blog.model.js";
import cloudinary from "../lib/cloudinary.js";

async function imageToCloudUrl(image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    return uploadResponse.secure_url;
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate("author", "_id fullName email profilePic").populate("categories", "_id name image");
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
export const getMyBlogs = async (req, res) => {
    const userId = req.user._id;
    try {
        const blogs = await Blog.find({author: userId}).populate("author", "_id fullName email profilePic").populate("categories", "_id name image");
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getBlogById = async (req, res) => {
    const {id} = req.params;
    try {
        const blog = await Blog.findById(id).populate("author", "_id fullName email profilePic").populate("categories", "_id name image");
        if (!blog) {
            return res.status(404).json({message: "Blog not found"});
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const deleteBlog = async (req, res) => {
    const {id} = req.params;
    try {
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({message: "Blog not found"});
        }
        res.status(200).json({message: "Blog deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const createBlog = async (req, res) => {
    const {title, text, categories, image} = req.body;
    const author = req.user._id;


    try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        const blog = new Blog({title, text, author, categories, image: uploadResponse.secure_url})
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updateBlog = async (req, res) => {
    const {id} = req.params;
    const {title, text, categories, image} = req.body;

    try {

        const oldBlog = await Blog.findById(id);
        let newImage = oldBlog.image;
        if (image && image !== oldBlog.image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            newImage = uploadResponse.secure_url;
        }
        const blog = await Blog.findByIdAndUpdate(id, {title, text, categories, image: newImage}, {new: true});
        if (!blog) {
            return res.status(404).json({message: "Blog not found"});
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const interact = async (req, res) => {
    const {action} = req.body;
    const {id} = req.params;
    const userId = req.user._id;
    try {
        const blog = await Blog.findById(id).populate("author", "_id fullName email profilePic").populate("categories", "_id name image");
        const liked = blog.likes.includes(userId);
        const disliked = blog.dislikes.includes(userId);

        switch (action) {
            case "like":
                if (liked) {
                    blog.likes = blog.likes.filter(user => user.toString() !== userId.toString());
                } else {
                    blog.likes.push(userId);
                    if (disliked) {
                        blog.dislikes = blog.dislikes.filter(user => user.toString() !== userId.toString());
                    }
                }
                break;
            case "dislike":
                if (disliked) {
                    blog.dislikes = blog.dislikes.filter(user => user.toString() !== userId.toString());
                } else {
                    blog.dislikes.push(userId);
                    if (liked) {
                        blog.likes = blog.likes.filter(user => user.toString() !== userId.toString());
                    }
                }
                break;
            default:
                return res.status(400).json({message: "Invalid action"});
        }

        await blog.save();

        res.status(200).json(blog);
    } catch {
        res.status(500).json({message: error.message});
    }
}