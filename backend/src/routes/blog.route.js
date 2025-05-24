import express from 'express';
import {protectRoute} from '../middleware/auth.middleware.js';
import {
    createBlog,
    deleteBlog,
    getAllBlogs,
    getBlogById,
    getMyBlogs,
    interact,
    updateBlog
} from "../controllers/blog.controller.js";


const router = express.Router();

router.get('/my-blogs', protectRoute, getMyBlogs);


router.post('/create', protectRoute, createBlog);

router.post('/:id/interact', protectRoute, interact);

router.get('/', getAllBlogs);

router.get('/:id', getBlogById);
router.post('/update/:id', protectRoute, updateBlog);
router.delete('/:id', protectRoute, deleteBlog);

export default router;