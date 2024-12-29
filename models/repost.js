// models/repost.js
import mongoose from "mongoose";

const repostSchema = new mongoose.Schema(
  {
    originalPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Référence au modèle "Post"
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Repost = mongoose.models.Repost || mongoose.model("Repost", repostSchema);

export default Repost;
