import mongoose from "mongoose";
const { Schema } = mongoose;

const RecipeSchema =new Schema({
  pays: { type: String, required: true },
  titre: { type: String, required: true },
  ingredients: { type: [String], required: true },
  etapes: { type: [String], required: true },
  photo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);
