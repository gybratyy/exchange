import Exchange from "../models/exchange.model.js";
import Book from "../models/book.model.js";
import {getReceiverSocketId, io} from "../lib/socket.js";


export const initiateExchange = async (req, res) => {
    try {
        const {receiverBookId, initiatorBookId} = req.body;
        const initiatorUserId = req.user._id;

        const receiverBook = await Book.findById(receiverBookId);
        if (!receiverBook) {
            return res.status(404).json({message: "Receiver's book not found."});
        }

        const newExchange = new Exchange({
            initiatorUser: initiatorUserId,
            receiverUser: receiverBook.owner,
            initiatorBook: initiatorBookId,
            receiverBook: receiverBookId,
            status: "pending_agreement",
        });

        await newExchange.save();

        const populatedExchange = await Exchange.findById(newExchange._id)
            .populate("initiatorUser", "fullName profilePic email _id")
            .populate("receiverUser", "fullName profilePic email _id")
            .populate("initiatorBook", "title image author")
            .populate("receiverBook", "title image author");

        const receiverSocketId = getReceiverSocketId(receiverBook.owner.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new_exchange_proposal", populatedExchange);
            io.to(receiverSocketId).emit("notification", {
                type: 'exchange',
                title: `New exchange request from ${populatedExchange.initiatorUser.fullName}`,
                user: populatedExchange.initiatorUser
            });
        }

        res.status(201).json(populatedExchange);
    } catch (error) {
        console.error("Error in initiateExchange:", error.message);
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
};


export const updateExchangeStatus = async (req, res) => {
    try {
        const {exchangeId} = req.params;
        const {status} = req.body;
        const userId = req.user._id;

        const exchange = await Exchange.findById(exchangeId).populate("initiatorBook").populate("receiverBook");

        if (!exchange) {
            return res.status(404).json({message: "Exchange not found."});
        }

        const isInitiator = exchange.initiatorUser.toString() === userId.toString();
        const isReceiver = exchange.receiverUser.toString() === userId.toString();

        if (!isInitiator && !isReceiver) {
            return res.status(403).json({message: "You are not part of this exchange."});
        }

        const oldStatus = exchange.status;


        switch (status) {
            case "agreed_pending_confirmation":
                if (oldStatus !== "pending_agreement") {
                    return res.status(400).json({message: `Cannot agree to an exchange that is not in 'pending_agreement' state. Current state: ${oldStatus}`});
                }

                exchange.status = "agreed_pending_confirmation";
                await Book.updateMany(
                    {_id: {$in: [exchange.initiatorBook._id, exchange.receiverBook._id]}},
                    {status: "in_exchange", isActive: false}
                );

                break;

            case "completed":
                if (oldStatus !== "agreed_pending_confirmation") {
                    return res.status(400).json({message: `Cannot complete an exchange that is not in 'agreed_pending_confirmation' state. Current state: ${oldStatus}`});
                }

                exchange.status = "completed";
                await Book.updateMany(
                    {_id: {$in: [exchange.initiatorBook._id, exchange.receiverBook._id]}},
                    {status: "exchanged", isActive: false}
                );
                break;

            case "cancelled_by_initiator":
                if (!isInitiator) return res.status(403).json({message: "Only the initiator can cancel this way."});
                if (oldStatus === "completed" || oldStatus.startsWith("cancelled")) {
                    return res.status(400).json({message: `Cannot cancel an exchange that is already '${oldStatus}'.`});
                }
                exchange.status = "cancelled_by_initiator";
                await Book.updateMany(
                    {_id: {$in: [exchange.initiatorBook._id, exchange.receiverBook._id]}},
                    {status: "available", isActive: true} // Make books available again
                );
                break;

            case "cancelled_by_receiver":
                if (!isReceiver) return res.status(403).json({message: "Only the receiver can cancel this way."});
                if (oldStatus === "completed" || oldStatus.startsWith("cancelled")) {
                    return res.status(400).json({message: `Cannot cancel an exchange that is already '${oldStatus}'.`});
                }
                exchange.status = "cancelled_by_receiver";
                await Book.updateMany(
                    {_id: {$in: [exchange.initiatorBook._id, exchange.receiverBook._id]}},
                    {status: "available", isActive: true} // Make books available again
                );
                break;

            case "declined":
                if (!isReceiver) return res.status(403).json({message: "Only the receiver can decline the initial proposal."});
                if (oldStatus !== "pending_agreement") {
                    return res.status(400).json({message: `Cannot decline an exchange that is not in 'pending_agreement' state. Current state: ${oldStatus}`});
                }
                exchange.status = "declined";

                break;

            default:
                return res.status(400).json({message: "Invalid target status provided."});
        }

        await exchange.save();

        const populatedExchange = await Exchange.findById(exchange._id)
            .populate("initiatorUser", "fullName profilePic email")
            .populate("receiverUser", "fullName profilePic email")
            .populate("initiatorBook", "title image author status isActive")
            .populate("receiverBook", "title image author status isActive");


        const initiatorSocketId = getReceiverSocketId(exchange.initiatorUser._id.toString());
        const receiverSocketId = getReceiverSocketId(exchange.receiverUser._id.toString());

        if (initiatorSocketId) {
            io.to(initiatorSocketId).emit("exchange_status_updated", populatedExchange);
        }
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("exchange_status_updated", populatedExchange);
        }

        const notificationRecipientId = exchange.initiatorUser.toString() === userId.toString()
            ? exchange.receiverUser.toString()
            : exchange.initiatorUser.toString();

        const notificationRecipientSocketId = getReceiverSocketId(notificationRecipientId);

        if (notificationRecipientSocketId) {
            io.to(notificationRecipientSocketId).emit("notification", {
                type: 'exchange_update',
                title: `Exchange status updated to: ${status.replace(/_/g, ' ')}`,
                user: req.user
            });
        }

        res.status(200).json(populatedExchange);
    } catch (error) {
        console.error("Error in updateExchangeStatus:", error.message);
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
};

export const getUserExchanges = async (req, res) => {
    try {
        const userId = req.user._id;
        const exchanges = await Exchange.find({
            $or: [{initiatorUser: userId}, {receiverUser: userId}],
        })
            .populate("initiatorUser", "fullName profilePic email")
            .populate("receiverUser", "fullName profilePic email")
            .populate("initiatorBook", "title image author status isActive")
            .populate("receiverBook", "title image author status isActive")
            .sort({updatedAt: -1});

        res.status(200).json(exchanges);
    } catch (error) {
        console.error("Error in getUserExchanges:", error.message);
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
};


export const getExchangeDetails = async (req, res) => {
    try {
        const {exchangeId} = req.params;
        const userId = req.user._id;

        const exchange = await Exchange.findById(exchangeId)
            .populate("initiatorUser", "fullName profilePic email")
            .populate("receiverUser", "fullName profilePic email")
            .populate("initiatorBook")
            .populate("receiverBook");

        if (!exchange) {
            return res.status(404).json({message: "Exchange not found."});
        }

        if (exchange.initiatorUser._id.toString() !== userId.toString() && exchange.receiverUser._id.toString() !== userId.toString()) {
            return res.status(403).json({message: "You are not authorized to view this exchange."});
        }

        res.status(200).json(exchange);
    } catch (error) {
        console.error("Error in getExchangeDetails:", error.message);
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
};