import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    DEFAULT: 'https://yr.wacs.fr/auth-api.php'
  });
}