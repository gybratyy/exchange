import Report from '../models/report.model.js';
import User from '../models/user.model.js';
import Book from '../models/book.model.js';
import Blog from '../models/blog.model.js';


export const getReports = async (req, res) => {
    try {
        const {status} = req.query;
        const filter = status ? {status} : {};
        const reports = await Report.find(filter)
            .populate('reporterId', 'fullName email')
            .populate('assignedModerator', 'fullName')
            .sort({createdAt: -1});
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({message: "Failed to fetch reports."});
    }
};

export const claimReport = async (req, res) => {
    try {
        const {reportId} = req.params;
        const moderatorId = req.user._id;

        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({message: "Report not found."});
        }

        if (report.assignedModerator) {
            // If the report is already claimed by someone else
            if (report.assignedModerator.toString() !== moderatorId.toString()) {
                const assignedMod = await User.findById(report.assignedModerator).select('fullName');
                return res.status(409).json({message: `Report already claimed by ${assignedMod ? assignedMod.fullName : 'another moderator'}.`});
            }
        }

        report.assignedModerator = moderatorId;
        await report.save();

        const populatedReport = await Report.findById(reportId)
            .populate('reporterId', 'fullName email')
            .populate('assignedModerator', 'fullName');

        res.status(200).json({message: "Report claimed successfully.", report: populatedReport});
    } catch (error) {
        console.error("Error claiming report:", error);
        res.status(500).json({message: "Failed to claim report."});
    }
};


export const updateReportStatus = async (req, res) => {
    try {
        const {reportId} = req.params;
        const {status, resolutionNotes} = req.body;
        const moderatorId = req.user._id;

        const validStatuses = ["resolved", "escalated"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({message: "Invalid status provided."});
        }

        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({message: "Report not found."});
        }

        report.status = status;
        report.resolutionNotes = resolutionNotes || '';

        report.assignedModerator = report.assignedModerator || moderatorId;
        await report.save();

        res.status(200).json({message: "Report status updated.", report});
    } catch (error) {
        res.status(500).json({message: "Failed to update report."});
    }
};


export const deleteContent = async (req, res) => {
    try {
        const {resourceType, resourceId} = req.params;
        const Model = resourceType === 'Book' ? Book : Blog;

        await Model.findByIdAndDelete(resourceId);
        await Report.updateMany({resourceId}, {
            status: 'resolved',
            resolutionNotes: `Content deleted by admin ${req.user.fullName}.`
        });

        res.status(200).json({message: `${resourceType} and all associated reports have been handled.`});
    } catch (error) {
        res.status(500).json({message: "Failed to delete content."});
    }
};


export const updateUserRole = async (req, res) => {
    try {
        const {userId} = req.params;
        const {role} = req.body;

        const validRoles = ["user", "moderator", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({message: "Invalid role specified."});
        }

        const user = await User.findByIdAndUpdate(userId, {role}, {new: true}).select('-password');
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        res.status(200).json({message: "User role updated.", user});
    } catch (error) {
        res.status(500).json({message: "Failed to update user role."});
    }
};
