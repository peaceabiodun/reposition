import { NextResponse } from 'next/server';
import { emailService } from './email-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await emailService(body);
    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { error: 'Failed to send email', details: err.message },
      { status: 500 }
    );
  }
}
