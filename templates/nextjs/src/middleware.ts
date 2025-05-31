import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  return NextResponse.next();
}
