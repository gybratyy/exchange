import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    image:{
        type:String,
        required: true,
        unique: true,
        default:"https://res.cloudinary.com/dm0qftlwq/image/upload/v1747544832/book-default_mqyoo3.webp"
    }
})

const Category = mongoose.model("Category", categorySchema);

export default Category;