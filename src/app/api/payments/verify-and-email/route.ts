import { NextResponse } from 'next/server';
import { sendLoopsTransactional } from '@/lib/loops';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const LOOPS_CUSTOMER_TEMPLATE_ID = process.env.LOOPS_ORDER_CONFIRMATION_ID!;
const LOOPS_ORDER_TEMPLATE_ID = process.env.LOOPS_ORDER_ALERT_ID!;

// Ensure Node runtime in Next.js App Router
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { reference, orderPayload } = await req.json();

    // 1) Verify the transaction with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
        cache: 'no-store',
      }
    );

    if (!verifyRes.ok) {
      const text = await verifyRes.text().catch(() => '');
      return NextResponse.json(
        { error: `Verify failed: ${text}` },
        { status: 400 }
      );
    }

    const { data: vr } = await verifyRes.json();
    if (vr?.status !== 'success') {
      return NextResponse.json(
        { error: 'Transaction not successful' },
        { status: 400 }
      );
    }

    const items = orderPayload?.product_details ?? [];
    const customerEmail = orderPayload?.user_email;
    const productDetailsText = items
      .map(
        (p: any) =>
          `• ${p.name} — ${p.quantity} x ₦${Number(p.price).toLocaleString()}${
            p.size ? ` (Size: ${p.size})` : ''
          }`
      )
      .join('\n');

    const customerVars = {
      customer_name: `${orderPayload?.first_name ?? ''} ${
        orderPayload?.last_name ?? ''
      }`.trim(),
      product_details: productDetailsText,
    };

    const internalVars = {
      customer_name: `${orderPayload?.first_name} ${orderPayload?.last_name}`,
      customer_email: orderPayload?.user_email,
      customer_phone_number: orderPayload?.phone_number,
      customer_country: orderPayload?.country,
      customer_address: orderPayload?.address,
      order_reference: reference,
      amount_paid: orderPayload?.amount_paid,
      product_details: productDetailsText,
      beverage: orderPayload?.beverage,
    };

    try {
      await sendLoopsTransactional({
        transactionalId: LOOPS_CUSTOMER_TEMPLATE_ID,
        email: customerEmail,
        dataVariables: customerVars,
      });
    } catch (e) {
      console.error('Customer email failed:', e);
      throw e;
    }

    try {
      await sendLoopsTransactional({
        transactionalId: LOOPS_ORDER_TEMPLATE_ID,
        email: 'welcome@re-position.co',
        dataVariables: internalVars,
      });
    } catch (e) {
      console.error('Internal email failed:', e);
      throw e;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('verify-and-email error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Internal error' },
      { status: 500 }
    );
  }
}
