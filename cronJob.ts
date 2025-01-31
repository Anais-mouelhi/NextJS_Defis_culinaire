import 'dotenv/config'; // Charger les variables d'environnement depuis le fichier .env
import { schedule } from 'node-cron';
import { generateRecipes } from './src/utils/generateRecipes';
import { saveRecipesToDB } from './src/utils/saveRecipes';
import Recipe from './src/models/Recipe';  
import dbConnect from './src/utils/db';

// Vérification de la clé API OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY manquante ou vide dans le fichier .env');
  process.exit(1); 
} else {
  console.log('✅ OPENAI_API_KEY chargée avec succès');
}

// Planification de la tâche cron tous les dimanches à minuit (correct: '0 0 * * 0')
schedule('0 0 * *  0', async () => {
  console.log('🔄 Début de la mise à jour hebdomadaire des recettes...');

  try {
    await dbConnect();

    // Supprimer toutes les anciennes recettes avant d'en ajouter de nouvelles
    const deleteResult = await Recipe.deleteMany({});
    console.log(`🗑️ ${deleteResult.deletedCount} anciennes recettes supprimées.`);

    // Générer 3 nouvelles recettes uniques
    const recipesSet = new Set();
    let recipes: any[] = []; 

    while (recipes.length < 3) {
      const newRecipes = await generateRecipes();

      newRecipes.forEach(recipe => {
        if (!recipesSet.has(recipe.titre) && recipes.length < 3) {
          recipesSet.add(recipe.titre);
          recipes.push(recipe);
        }
      });
    }

    // Sauvegarder les nouvelles recettes dans la base de données
    await saveRecipesToDB(recipes);
    console.log('✅ 3 nouvelles recettes sauvegardées avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la tâche cron :', error);
  }
});
