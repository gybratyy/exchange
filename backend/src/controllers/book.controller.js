import Book from "../models/book.model.js";
import Category from "../models/category.model.js";
import cloudinary from "../lib/cloudinary.js";
import Review from "../models/review.model.js";


function populateCategories(book) {
    return Promise.all(book.categories.map(async (categoryId) => {
        const category = await Category.findById(categoryId);
        return category.name;
    }));
}
function populateReviews(book) {
    return Promise.all(book.reviews.map(async (reviewId) => {
        const review = await Review.findById(reviewId);
        return review;
    }));
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
        const books = await Book.find();
        const booksWithCategories = await Promise.all(
            books.map(async (book) => {
                const categories = await populateCategories(book);
                const reviews = await populateReviews(book);
                return { ...book._doc, categories, reviews };
            })
        );
        res.status(200).json(booksWithCategories);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getBookById = async (req, res) => {
    const { id: bookId} = req.params;
    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const categories = await populateCategories(book);
        const reviews = await populateReviews(book);
        res.status(200).json({ ...book._doc, categories:categories, reviews:reviews });

    } catch(error){

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
    const { title, description, author, publishedDate, language, categories, image, type, price } = req.body;



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
                price
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
        const books = await Book.find({ owner: req.user._id });
        const booksWithCategories = await Promise.all(
            books.map(async (book) => {
                const categories = await populateCategories(book);
                return { ...book._doc, categories };
            })
        );
        res.status(200).json(booksWithCategories);
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
        const newReview = new Review({  reviewerId,profilePic,fullName, text, rating})
        await newReview.save();

        book.reviews = [...book.reviews, newReview._id];

        await book.save();


        res.status(200).json({ message: "Review added/updated successfully.", reviews: newReview  });

    } catch (error) {
        console.error("Error adding/updating review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};