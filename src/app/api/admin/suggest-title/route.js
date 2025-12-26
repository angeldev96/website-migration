import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// Helper to verify admin user
async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user || user.role !== 'ADMIN') return null;
    return user;
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, content } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const prompt = `You are an SEO expert for a Jewish job board in Brooklyn called "Yiddish Jobs".
Your goal is to suggest 3 highly optimized, catchy, and SEO-friendly titles for a blog post.
The target audience is the Orthodox Jewish community in Boro Park, Williamsburg, and Flatbush.
Keywords to consider: Jewish jobs, Brooklyn, Boro Park, Yiddish, Kosher workplace, Frum employment, Shomer Shabbos.

Current Title: "${title}"
Content Summary: "${content.substring(0, 500)}..."

Return ONLY a JSON array of 3 strings. No other text.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Failed to call Gemini API' }, { status: 500 });
    }

    const json = await res.json();
    let raw = json.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    
    // Clean up potential markdown code blocks
    raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const suggestions = JSON.parse(raw);

    return NextResponse.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Error suggesting title:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
