import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { supabase } from '@/lib/supabase';

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
      const { reference } = data;

      if (event === 'charge.success') {
        const { error } = await supabase
          .from('orders')
          .update({ status: 'Paid' })
          .eq('reference', reference);
      }
    }
  } catch (err: any) {
    console.log(err);
  }
  return NextResponse.json({ success: true });
}
