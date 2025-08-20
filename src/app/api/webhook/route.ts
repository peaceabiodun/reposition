import { NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { emailService } from '../email/email-service';

// export async function POST(req: Request) {
//   try {
//     const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;
//     const body = await req.json();

//     const hash = crypto
//       .createHmac('sha512', paystackKey as string)
//       .update(JSON.stringify(body))
//       .digest('hex');
//     if (true) {
//       const { data, event } = body;
//       // const { reference } = data;
//       const customerPayload: any = {
//         customer_name: data.metadata.first_name,
//         recipient_email: data.metadata.user_email,
//         template_uuid: process.env.NEXT_CUSTOMER_EMAIL_TEMPLATE_ID,
//       };
//       //'nowreposition@gmail.com'
//       const orderPayload: any = {
//         template_uuid: process.env.NEXT_ORDER_EMAIL_TEMPLATE_ID,
//         recipient_email: 'welcome@re-position.co',
//         template_variables: {
//           product_details: data.metadata.product_details.map(
//             ({ name, price, quantity, size }: any) => `
//             Product name: ${name}
//             Product price: ${price}
//             Quantity: ${quantity}
//             Product size: ${size}
//           `
//           ),
//           customer_name: `${data.metadata.first_name} ${data.metadata.last_name}`,
//           customer_email: data.metadata.user_email,
//           customer_phone_number: data.metadata.phone_number,
//           customer_country: data.metadata.country,
//           customer_address: data.metadata.address,
//         },
//       };

//       if (event === 'charge.success') {
//         const { error } = await supabase
//           .from('orders')
//           .update({ status: 'Paid' })
//           .eq('reference', data.reference);
//         await Promise.all([
//           emailService(customerPayload),
//           emailService(orderPayload),
//         ]);
//       }
//     }
//   } catch (err: any) {
//     console.log(err);
//   }
//   return NextResponse.json({ success: true });
// }

export async function POST(req: Request) {
  try {
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;
    const body = await req.json();

    const hash = crypto
      .createHmac('sha512', paystackKey as string)
      .update(JSON.stringify(body))
      .digest('hex');
    if (true) {
      const { data, event } = body;

      if (event === 'charge.success') {
        console.log('Charge successful, processing payment...');
        // Check the payment type from metadata
        if (data.metadata.payment_type === 'assemble') {
          // TheAssemble email payload
          const assembleEmailPayload: any = {
            recipient_email: data.metadata.user_email,
            template_uuid: process.env.NEXT_THEASSEMBLE_TEMPLATE_ID,
            customer_name: data.metadata.first_name,
            template_variables: {
              name: data.metadata.first_name,
            },
          };

          try {
            await emailService(assembleEmailPayload);
            console.log('Assemble email sent successfully');
          } catch (error) {
            console.error('Error sending assemble email:', error);
          }
        } else {
          // existing e-commerce email logic
          const customerPayload: any = {
            customer_name: data.metadata.first_name,
            recipient_email: data.metadata.user_email,
            template_uuid: process.env.NEXT_CUSTOMER_EMAIL_TEMPLATE_ID,
          };

          const orderPayload: any = {
            template_uuid: process.env.NEXT_ORDER_EMAIL_TEMPLATE_ID,
            recipient_email: 'welcome@re-position.co',
            template_variables: {
              product_details: data.metadata.product_details.map(
                ({ name, price, quantity, size }: any) => `
                Product name: ${name}
                Product price: ${price}
                Quantity: ${quantity}
                Product size: ${size}
              `
              ),
              customer_name: `${data.metadata.first_name} ${data.metadata.last_name}`,
              customer_email: data.metadata.user_email,
              customer_phone_number: data.metadata.phone_number,
              customer_country: data.metadata.country,
              customer_address: data.metadata.address,
            },
          };

          const { error } = await supabase
            .from('orders')
            .update({ status: 'Paid' })
            .eq('reference', data.reference);

          await Promise.all([
            emailService(customerPayload),
            emailService(orderPayload),
          ]);
        }
      }
    }
  } catch (err: any) {
    console.log(err);
  }
  return NextResponse.json({ success: true });
}
