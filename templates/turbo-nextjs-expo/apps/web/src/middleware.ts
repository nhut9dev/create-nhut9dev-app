import { NextResponse } from 'next/server';

export async function middleware(_req: any) {
  return NextResponse.next();
}
