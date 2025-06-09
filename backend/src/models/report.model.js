import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'resourceType'
    },
    resourceType: {
        type: String,
        required: true,
        enum: ["Book", "Blog", "Review"]
    },
    reportCategory: {
        type: String,
        enum: ["Spam", "Inappropriate Content", "Harassment", "Copyright Infringement", "Other"],
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "resolved", "escalated"],
        default: "active",
        required: true
    },
    assignedModerator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    resolutionNotes: {
        type: String,
        default: ''
    },
}, {timestamps: true});

const Report = mongoose.model("Report", reportSchema);

export default Report;
