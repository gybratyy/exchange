import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {protectAdmin, protectModerator} from "../middleware/admin.middleware.js";
import {
    getReports,
    updateReportStatus,
    deleteContent,
    updateUserRole, claimReport
} from "../controllers/admin.controller.js";

const router = express.Router();


router.get("/reports", protectRoute, protectModerator, getReports);
router.put("/reports/:reportId/status", protectRoute, protectModerator, updateReportStatus);
router.put("/reports/:reportId/claim", protectRoute, claimReport)
router.delete("/content/:resourceType/:resourceId", protectRoute, protectAdmin, deleteContent);
router.put("/users/:userId/role", protectRoute, protectAdmin, updateUserRole);


export default router;
