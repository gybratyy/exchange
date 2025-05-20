import User from "../models/user.model.js";


export const findUserById = async (req, res) => {
    const { id: userId} = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ id:user._id, fullName:user.fullName, telegramId:user.telegramId});

    } catch(error){

    }
}
