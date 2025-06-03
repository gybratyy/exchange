import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {
    getExchangeDetails,
    getUserExchanges,
    initiateExchange,
    updateExchangeStatus,
} from "../controllers/exchange.controller.js";

const router = express.Router();

router.post("/initiate", protectRoute, initiateExchange);
router.put("/:exchangeId/update_status", protectRoute, updateExchangeStatus);
router.get("/user", protectRoute, getUserExchanges);
router.get("/:exchangeId", protectRoute, getExchangeDetails);

export default router;