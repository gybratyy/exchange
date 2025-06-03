import express from 'express';
import {protectRoute} from '../middleware/auth.middleware.js';
import {
    addReview,
    addView,
    createBook,
    createCategory,
    deleteBook,
    disableBook,
    enableBook,
    getAllBooks,
    getBookById,
    getBooksByCategory,
    getCategories,
    getMyBooks,
    getSimilarBooks,
    toggleWishlist,
    updateBook
} from '../controllers/book.controller.js';

const router = express.Router();

router.get('/my-books', protectRoute, getMyBooks);
router.get('/categories', getCategories);

router.post('/create-category', protectRoute, createCategory);
router.post('/create', protectRoute, createBook);

router.post('/:bookId/review', protectRoute, addReview);

router.post('/:bookId/enable', protectRoute, enableBook);
router.post('/:bookId/disable', protectRoute, disableBook);

router.get('/', getAllBooks);

router.get('/:bookId', getBookById);
router.get('/:bookId/view', addView);
router.get('/:bookId/wishlist', protectRoute, toggleWishlist);
router.get('/:bookId/similar', getSimilarBooks);
router.get('/category/:categoryId', getBooksByCategory);
router.post('/update/:bookId', protectRoute, updateBook);
router.delete('/:bookId', protectRoute, deleteBook);

export default router;