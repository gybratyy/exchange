import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    getAllBooks,
    getBookById,
    createCategory,
    createBook,
    updateBook,
    getMyBooks, getCategories
} from '../controllers/book.controller.js';

const router = express.Router();

router.get('/my-books', protectRoute, getMyBooks);
router.get('/categories', getCategories);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/create-category', protectRoute, createCategory);
router.post('/create', protectRoute, createBook);
router.post('/update/:id', protectRoute, updateBook);

export default router;