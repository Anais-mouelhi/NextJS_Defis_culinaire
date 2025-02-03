// /pages/api/get-posts.js

import { NextResponse } from 'next/server';
import connect from '@/utils/db';
import Post from '@/models/Post';

export async function GET() {
  await connect();

  try {
    const posts = await Post.find().populate('userId', 'email');
    console.log(posts); // Vérifiez les données récupérées
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Erreur lors de la récupération des posts', error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: 'Erreur inconnue lors de la récupération des posts' },
        { status: 500 }
      );
    }
  }
}