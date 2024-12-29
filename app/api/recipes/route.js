import axios from "axios";

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Récupérer les zones géographiques
export async function GET(request) {
  try {
    const response = await axios.get(`${API_BASE_URL}/list.php?a=list`);
    const areas = response.data.meals.map(area => area.strArea);
    return new Response(JSON.stringify({ areas }), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des zones :", error);
    return new Response("Erreur lors de la récupération des zones", { status: 500 });
  }
}

// Récupérer les recettes par zone
export async function POST(request) {
  try {
    const { area } = await request.json();
    const response = await axios.get(`${API_BASE_URL}/filter.php`, {
      params: { a: area },
    });

    const recipes = response.data.meals.map(meal => ({
      title: meal.strMeal,
      image: meal.strMealThumb,
      source: `https://www.themealdb.com/meal/${meal.idMeal}`,
      url: `https://www.themealdb.com/meal/${meal.idMeal}`,
    }));

    return new Response(JSON.stringify({ recipes }), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes :", error);
    return new Response("Erreur lors de la récupération des recettes", { status: 500 });
  }
}
