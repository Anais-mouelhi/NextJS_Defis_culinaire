import { NextResponse } from "next/server";
import connect from "@/utils/db";
import RecipePost from "@/models/RecipePost";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

// Définition du type de session adapté à votre configuration
type SessionType = {
  user?: {
    email?: string;
  } | null;
} | null;

export const POST = async (request: Request) => {
  const session = await getServerSession(authOptions) as SessionType;

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title, content, imageUrl, videoUrl } = await request.json();

  if (!title || !content) {
    return new NextResponse("Title and content are required", { status: 400 });
  }

  try {
    await connect();

    const newPost = new RecipePost({
      title,
      content,
      imageUrl,
      videoUrl,
      userEmail: session.user.email,
    });

    await newPost.save();
    return new NextResponse("Post created successfully", { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new NextResponse("Error creating post", { status: 500 });
  }
};