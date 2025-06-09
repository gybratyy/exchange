import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
      preferences:{
        type: Object,
        default: {},
          required: true,
      },
      telegramId: {
        type: String,
        default: "",
      },
      country:{
        type: String,
        default: "Kazakhstan",
          required: true,
      },
        city:{
            type: String,
            default: "Astana",
            required: true,
        },
      wishlist: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Book",
          required: false,
          default: [],
      },
      role: {
          type: String,
          enum: ["user", "moderator", "admin"],
          default: "user",
          required: true,
      }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
