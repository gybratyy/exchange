import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema(
    {
        initiatorUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        initiatorBook: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        receiverBook: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        status: {
            type: String,
            enum: [
                "pending_agreement",
                "agreed_pending_confirmation",
                "completed",
                "cancelled_by_initiator",
                "cancelled_by_receiver",
                "declined",
            ],
            default: "pending_agreement",
            required: true,
        },

    },
    {timestamps: true}
);

const Exchange = mongoose.model("Exchange", exchangeSchema);

export default Exchange;