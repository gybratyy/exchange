import Book from "../models/book.model.js";
import Category from "../models/category.model.js";
import cloudinary from "../lib/cloudinary.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";


function populateCategories(book) {
    return Promise.all(book.categories.map(async (categoryId) => {
        const category = await Category.findById(categoryId);
        return category.name;
    }));
}
function populateReviews(book) {
    return Promise.all(book.reviews.map(async (reviewId) => {
        const review = await Review.findById(reviewId).select('_id reviewerId profilePic fullName text rating');
        return review;
    }));
}

async function findBookAndPopulate(bookId, filter = {}) {
    if (bookId) {
        try {
            return Book.findById(bookId)
                .populate('owner', '_id fullName email city country')
                .populate('categories', '_id name image')
                .populate('reviews', '_id reviewerId profilePic fullName text rating');

        } catch (error) {
            console.error("Error finding book in (findBookAndPopulate):", error);
            throw new Error("Book not found");
        }
    } else {
        try {
            return Book.find(filter)
                .populate('owner', '_id fullName email city country')
                .populate('categories', '_id name image')
                .populate('reviews', '_id reviewerId profilePic fullName text rating');
        } catch (error) {
            console.error("Error finding books in (findBookAndPopulate):", error);
            throw new Error("Book not found");
        }
    }
}

async function categoriesToIds(categories) {
    const allCategories = await Category.find();

    const categoryIds = categories.map((categoryName) => {
        const category = allCategories.find((cat) => cat.name === categoryName);
        return category ? category._id : null;
    }).filter((id) => id !== null);

    return categoryIds;
}

async function imageToCloudUrl(image){
    const uploadResponse = await cloudinary.uploader.upload(image);
    return uploadResponse.secure_url;
}

export const getAllBooks = async (req, res) => {
    try {
        const books = await findBookAndPopulate();

        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books in (getAllBooks):", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getBookById = async (req, res) => {
    const { id: bookId} = req.params;
    try {
        const book = await findBookAndPopulate(bookId);
        res.status(200).json(book);
    } catch(error){
        console.error("Error fetching book in (getBookById):", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const createCategory = async (req, res) => {
    const {name} = req.body;

    try {
        const newCategory = new Category({name});
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const createBook = async (req, res) =>{
    const {title, description, author, publishedDate, language, categories, image, type, price, productType, condition} = req.body;
    const owner = req.user._id;
    try {
        const categoryIds =  await categoriesToIds(categories);
        const newBook = new Book({
            title,
            description,
            author,
            publishedDate,
            language,
            categories: categoryIds,
            image: await imageToCloudUrl(image),
            owner,
            type,
            price,
            productType,
            condition,
        });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateBook = async (req, res) => {
    const { id: bookId } = req.params;
    const { title, description, author, publishedDate, language, categories, image, type, price, productType, condition } = req.body;



    try {
        const categoryIds = await categoriesToIds(categories);
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { title,
                description,
                author,
                publishedDate,
                language,
                categories: categoryIds,
                image: await imageToCloudUrl(image),
                type,
                price,
                productType,
                condition,
            },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(updatedBook);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMyBooks = async (req, res) => {
    try {
        const books = await findBookAndPopulate();
        const ownerId = req.user._id;
        const myBooks = books.filter(book => book.owner._id.toString() === ownerId.toString());
        res.status(200).json(myBooks);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteBook = async (req, res) => {
    const { id: bookId } = req.params;
    const ownerId = req.user._id;
    try {
        const bookToDelete = await Book.findById(bookId);
        if(!bookToDelete) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (bookToDelete.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this book" });
        }
        await Book.findByIdAndDelete(bookId);

    } catch(error){
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const addReview = async (req, res) => {
    const { bookId } = req.params;
    const { text, rating } = req.body;
    const {_id, profilePic, fullName} = req.user;
    const reviewerId = _id
    if (!text) {
        return res.status(400).json({ message: "Review text is required." });
    }
    if (!rating) {
        return res.status(400).json({ message: "Rating is required." });
    }

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }
        const newReview = new Review({  reviewerId,profilePic:profilePic || "not provided",fullName, text, rating})
        await newReview.save();

        book.reviews = [...book.reviews, newReview._id];

        await book.save();


        res.status(200).json({ message: "Review added/updated successfully.", reviews: newReview  });

    } catch (error) {
        console.error("Error adding/updating review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addView = async (req, res) => {
    const {bookId} = req.params;
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({message: "Book not found."});
        }
        book.views = (book.views || 0) + 1;
        await book.save();
        res.status(200).json({message: "View count updated successfully.", views: book.views});
    } catch (e) {
        console.error("Error updating view count:", e);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const disableBook = async (req, res) => {
    const {bookId} = req.params;
    const ownerId = req.user._id;
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({message: "Book not found."});
        }
        if (book.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({message: "You are not authorized to disable this book."});
        }
        book.isActive = false;
        await book.save();
        const updatedBook = await findBookAndPopulate(bookId);
        res.status(200).json({message: "Book disabled successfully.", updatedBook});
    } catch (e) {
        console.error("Error disabling book:", e);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const enableBook = async (req, res) => {
    const {bookId} = req.params;
    const ownerId = req.user._id;
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({message: "Book not found."});
        }
        if (book.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({message: "You are not authorized to enable this book."});
        }
        book.isActive = true;
        await book.save();

        const updatedBook = await findBookAndPopulate(bookId);
        res.status(200).json({message: "Book enabled successfully.", updatedBook});
    } catch (e) {
        console.error("Error enabling book:", e);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getBooksByCategory = async (req, res) => {
    const {categoryId} = req.params;

    const filter = {categories: {$in: [categoryId]}}
    try {
        const books = await findBookAndPopulate(null, filter);
        res.status(200).json(books);
    } catch {
        res.status(500).json({message: "Internal Server Error"});

    }
}
