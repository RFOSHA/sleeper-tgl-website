import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Instantiated lazily inside the handler so the build doesn't fail without env vars
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  jobTitle?: string;
  industry: string;
  industryOther?: string;
}

export async function POST(req: NextRequest) {
  const body: SignupPayload = await req.json();
  const { firstName, lastName, email, company, jobTitle, industry, industryOther } = body;

  if (!firstName || !lastName || !email || !industry) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const industryDisplay = industry === 'Other' && industryOther ? `Other – ${industryOther}` : industry;

  const supabase = getSupabase();

  // Insert into Supabase
  const { error: dbError } = await supabase.from('signups').insert({
    first_name: firstName,
    last_name: lastName,
    email,
    company: company || null,
    job_title: jobTitle || null,
    industry: industryDisplay,
  });

  if (dbError) {
    console.error('Supabase insert error:', dbError);
    return NextResponse.json({ error: 'Failed to save signup. Please try again.' }, { status: 500 });
  }

  // Send notification email
  await getResend().emails.send({
    from: 'The Giving League <onboarding@resend.dev>',
    to: 'nathan.mcgee49@gmail.com',
    subject: `New Sign-Up: ${firstName} ${lastName}`,
    html: `
      <h2>New Giving League Sign-Up</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;">
        <tr><td><strong>Name</strong></td><td>${firstName} ${lastName}</td></tr>
        <tr><td><strong>Email</strong></td><td>${email}</td></tr>
        <tr><td><strong>Company</strong></td><td>${company || '—'}</td></tr>
        <tr><td><strong>Job Title</strong></td><td>${jobTitle || '—'}</td></tr>
        <tr><td><strong>Industry</strong></td><td>${industryDisplay}</td></tr>
      </table>
    `,
  });

  return NextResponse.json({ ok: true });
}
