import Report from '../models/report.model.js';
import Book from '../models/book.model.js';
import Blog from '../models/blog.model.js';

export const createReport = async (req, res) => {
    try {
        const {resourceId, resourceType, reportCategory, text} = req.body;
        const reporterId = req.user._id;


        const Model = resourceType === 'Book' ? Book : Blog;
        if (!Model) {
            return res.status(400).json({message: "Invalid resource type provided."});
        }

        const resource = await Model.findById(resourceId);
        if (!resource) {
            return res.status(404).json({message: `${resourceType} not found.`});
        }

        const newReport = new Report({
            reporterId,
            resourceId,
            resourceType,
            reportCategory,
            text
        });

        await newReport.save();

        resource.reports.push(newReport._id);
        await resource.save();

        res.status(201).json({message: "Report submitted successfully.", report: newReport});

    } catch (error) {
        console.error("Error in createReport controller:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};
