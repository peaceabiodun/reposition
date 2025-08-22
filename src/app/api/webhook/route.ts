import { NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { sendLoopsTransactional } from '@/lib/loops';

// IMPORTANT: use a **server** env var (not NEXT_PUBLIC)
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: Request) {
  try {
    // Read raw body for HMAC verification
    const raw = await req.text();
    const signature = req.headers.get('x-paystack-signature') || '';

    if (!PAYSTACK_SECRET) {
      console.error('Missing PAYSTACK_SECRET_KEY');
      return NextResponse.json(
        { error: 'Server misconfigured' },
        { status: 500 }
      );
    }

    const computedHash = crypto
      .createHmac('sha512', PAYSTACK_SECRET)
      .update(raw)
      .digest('hex');
    if (computedHash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { data, event } = JSON.parse(raw);
    if (event !== 'charge.success') {
      return NextResponse.json({ ok: true }); // ignore other events
    }

    // Common details from metadata
    const md = data?.metadata || {};

    // Persist order status
    await supabase
      .from('orders')
      .update({ status: 'Paid' })
      .eq('reference', data.reference);

    const items = md.product_details || [];
    const productDetailsText = items
      .map(
        ({ name, price, quantity, size }: any) =>
          `• ${name} — ${quantity} x ₦${Number(price).toLocaleString()}${
            size ? ` (Size: ${size})` : ''
          }`
      )
      .join('\n');

    // Build dataVariables for both templates
    const customerVars = {
      customer_name: `${md.first_name ?? ''} ${md.last_name ?? ''}`.trim(),

      orderReference: data.reference,
      totalPaid: (data.amount / 100).toFixed(2),

      product_details: productDetailsText,
    };

    const internalVars = {
      customer_name: `${md.first_name ?? ''} ${md.last_name ?? ''}`.trim(),
      customer_email: md.user_email,
      customer_phone_number: md.phone_number,
      customer_country: md.country,
      customer_address: md.address,
      order_reference: data.reference,
      amount_paid: (data.amount / 100).toFixed(2),

      product_details: productDetailsText,
    };

    // Assemble vs eCommerce split (kept from your logic)
    if (md.payment_type === 'assemble') {
      const transactionalId = process.env.LOOPS_ASSEM_MEMBERS_ID!;
      await sendLoopsTransactional({
        transactionalId,
        email: md.user_email,
        dataVariables: { name: md.first_name },
      });
    } else {
      // Send both emails via Loops Transactional
      const customerTemplateId = process.env.LOOPS_ORDER_CONFIRMATION_ID!;
      const internalTemplateId = process.env.LOOPS_ORDER_ALERT_ID!;

      await Promise.all([
        sendLoopsTransactional({
          transactionalId: customerTemplateId,
          email: md.user_email,
          dataVariables: customerVars,
        }),
        sendLoopsTransactional({
          transactionalId: internalTemplateId,
          email: 'welcome@re-position.co',
          dataVariables: internalVars,
        }),
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handling failed' },
      { status: 500 }
    );
  }
}
