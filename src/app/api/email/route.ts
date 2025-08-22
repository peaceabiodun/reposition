import { NextResponse } from 'next/server';
import { emailService } from './loops-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await emailService({
      recipient_email: body.recipient_email,
      transactionalId: body.transactionalId,
      dataVariables: body.dataVariables ?? {},
    });
    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to send email', details: err.message },
      { status: 500 }
    );
  }
}
