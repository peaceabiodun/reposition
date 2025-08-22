import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, fullName } = body;

    if (!email || !fullName) {
      console.log('Missing required fields:', { email, fullName });
      return NextResponse.json(
        { error: 'Email and full name are required' },
        { status: 400 }
      );
    }

    // Send welcome email to the new member
    const memberEmailResponse = await fetch(
      'https://app.loops.so/api/v1/transactional',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          transactionalId: process.env.LOOPS_ASSEM_MEMBERS_ID,
          dataVariables: {
            full_name: fullName,
          },
        }),
      }
    );

    if (!memberEmailResponse.ok) {
      const errorText = await memberEmailResponse.text();
      console.error(
        'Member email failed:',
        memberEmailResponse.status,
        errorText
      );
      throw new Error(
        `Member email failed: ${memberEmailResponse.status} - ${errorText}`
      );
    }

    // Send admin notification email
    const adminEmailResponse = await fetch(
      'https://app.loops.so/api/v1/transactional',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'welcome@re-position.co',
          transactionalId: process.env.LOOPS_ASSEM_ADMIN_ID,
          dataVariables: {
            full_name: fullName,
            email: email,
            phone_number: body.phoneNumber || 'Not provided',
          },
        }),
      }
    );

    if (!adminEmailResponse.ok) {
      const errorText = await adminEmailResponse.text();
      console.error(
        'Admin email failed:',
        adminEmailResponse.status,
        errorText
      );
      // Don't throw error here as member email was successful
      console.warn('Admin notification failed, but member email was sent');
    }

    return NextResponse.json({
      success: true,
      message: 'Emails sent successfully',
    });
  } catch (error) {
    console.error('Error in send assemble email API route:', error);
    return NextResponse.json(
      {
        error: 'Failed to send emails',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
