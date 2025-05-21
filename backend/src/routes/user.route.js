import express from "express";
import { findUserById} from "../controllers/user.controller.js";


const router = express.Router();


router.get('/:id', findUserById);

export default router;
