import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  country: { type: String, required: true },  // Ajout du champ pour le pays d'origine
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  expirationDate: { type: Date, required: true }, // La date d'expiration de la recette
});

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
