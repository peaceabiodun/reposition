import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;
    const body = await req.json();

    const hash = crypto
      .createHmac('sha512', paystackKey as string)
      .update(JSON.stringify(body))
      .digest('hex');
    if (hash === req.headers.get('x-paystack-signature')) {
      const { data, event } = body;

      if (event === 'charge.success') {
      }
    }
  } catch (err: any) {
    console.log(err);
  }
  return NextResponse.json({ success: true });
}
