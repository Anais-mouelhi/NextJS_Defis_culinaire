import Recipe from "../models/Recipe.js";
import connect from "./db.js";

export const saveRecipesToDB = async (recipes) => {
  await connect();
  try {
    await Recipe.insertMany(recipes);
    console.log("Recettes sauvegardées avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
  }
};
