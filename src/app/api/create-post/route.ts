import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connect from '@/utils/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = readerDone;
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  await connect();

  const token = await getToken({ req });

  if (!token || !token.email) {
    return NextResponse.json({ message: 'Non autorisé. Veuillez vous connecter.' }, { status: 401 });
  }

  try {
    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const media = formData.get('media');

    let mediaUrl = '';

    // Vérifiez si 'media' est un fichier
    if (media instanceof File) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, media.name);
      const buffer = await streamToBuffer(media.stream());
      fs.writeFileSync(filePath, buffer);

      mediaUrl = `/uploads/${media.name}`;
    }

    const newPost = new Post({
      title: title as string,
      content: content as string,
      mediaUrl,
      userId: user._id,
    });

    const savedPost = await newPost.save();

    // Populate the userId field to include the user's email
    const populatedPost = await Post.findById(savedPost._id).populate('userId', 'email');

    return NextResponse.json({ message: 'Post créé avec succès', post: populatedPost }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Erreur lors de la création du post', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Erreur inconnue lors de la création du post' }, { status: 500 });
    }
  }
}