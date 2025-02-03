import mongoose from "mongoose";

const { Schema } = mongoose;

const historySchema = new Schema({
  email: { type: String, required: true },  // Utiliser l'email de l'utilisateur
  titre: { type: String, required: true },
  pays: { type: String, required: true },
  date: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.History || mongoose.model("History", historySchema);
