import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    publishedDate:{
        type: Date,
        required: true
    },
    language:{
        type: String,
        required: true
    },
    categories: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Category",
        required: false,
    },
    image:{
        type: String,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type:{
        type: String,
        enum: ["forSale", "forExchange","any","forFree"],
        default: "forSale",
        required: true
    },
    price:{
        type: Number,
        required: true,
        default:0
    },
}, { timestamps: true });


const Book = mongoose.model("Book", bookSchema);

export default Book;