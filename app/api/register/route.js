// Exemple de code pour l'API d'inscription (backend)
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // Récupère les données envoyées
    const { name, email, password } = await req.json();

    // Vérification que tous les champs sont remplis
    if (!email || !name || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Connexion à MongoDB
    await connectMongoDB();
    console.log("MongoDB connected");

    // Vérification si un utilisateur avec le même email existe déjà
    const existingUser = await User.findOne({ email });
    console.log("Existing user check:", existingUser);

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 400 }
      );
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // Création de l'utilisateur sans 'username'
    const newUser = await User.create({ name, email, password: hashedPassword });
    console.log("User created:", newUser);

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Error during registration." },
      { status: 500 }
    );
  }
}
