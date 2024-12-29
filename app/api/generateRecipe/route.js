import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simulated database (remplacez ceci par une vraie base de données)
const recipeDatabase = {};

function getCurrentWeekKey() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber}`;
}

export async function POST(req) {
  try {
    const weekKey = getCurrentWeekKey();

    // Vérifier si des recettes existent pour cette semaine
    if (recipeDatabase[weekKey]) {
      return new Response(
        JSON.stringify({ recipes: recipeDatabase[weekKey] }),
        { status: 200 }
      );
    }

    // Générer les recettes si elles n'existent pas
    const prompt = `Create 3 unique and detailed recipes inspired by different world cuisines. Each recipe should include the country name, title, ingredients, and instructions. Format the output clearly as follows:
      Recipe 1:
      Country: [Country Name]
      Title: [Recipe Name]
      Ingredients: [List ingredients here]
      Instructions: [List instructions here]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const recipeText = completion.choices[0].message.content.trim();
    const recipes = recipeText
      .split("Recipe")
      .slice(1)
      .map((section) => {
        const country = section.match(/Country: ([^\n]+)/)?.[1] || "Unknown";
        const title = section.match(/Title: ([^\n]+)/)?.[1] || "Unknown";
        const ingredients = section
          .match(/Ingredients:([\s\S]*?)Instructions:/)?.[1]
          .trim()
          .split("\n")
          .filter((i) => i) || [];
        const instructions = section
          .match(/Instructions:([\s\S]*)/)?.[1]
          .trim()
          .split("\n")
          .filter((i) => i) || [];

        return { country, title, ingredients, instructions };
      });

    // Sauvegarder dans la base de données simulée
    recipeDatabase[weekKey] = recipes;

    return new Response(JSON.stringify({ recipes }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Server error." }), { status: 500 });
  }
}
