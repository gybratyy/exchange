import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    getAllBooks,
    getBookById,
    createCategory,
    createBook,
    updateBook,
    getMyBooks,
    getCategories,
    deleteBook,
    addReview,
    addView,
    enableBook,
    disableBook,
    getBooksByCategory
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

router.get('/:id', getBookById);
router.get('/:bookId/view', addView);
router.get('/category/:categoryId', getBooksByCategory);
router.post('/update/:id', protectRoute, updateBook);
router.delete('/:id', protectRoute, deleteBook);

export default router;