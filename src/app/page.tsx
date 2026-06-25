'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const INDUSTRIES = [
  'Accounting/Finance',
  'Agriculture',
  'Architecture',
  'Business Administration',
  'Construction',
  'Education',
  'Engineering',
  'Energy',
  'Healthcare',
  'Hospitality',
  'Information Technology (IT)',
  'Instrumentation & Monitoring (I&M)',
  'Law/Legal',
  'Manufacturing',
  'Marketing',
  'Real Estate',
  'Other',
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  industry: string;
  industryOther: string;
}

const EMPTY_FORM: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  jobTitle: '',
  industry: '',
  industryOther: '',
};

export default function HomePage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('success');
      setForm(EMPTY_FORM);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center space-y-4">
          <Image
            src="/tgl_logo.png"
            alt="The Giving League Logo"
            width={120}
            height={120}
            className="mx-auto rounded-md"
            priority
          />
          <h1 className="text-4xl font-bold">The Giving League</h1>
        </div>

        {/* Story section */}
        <div className="space-y-5 text-gray-300 text-base leading-relaxed">
          <p>
            The Giving League is a passion project of Nate McGee, who wanted to marry his networking
            skills and his love/hate relationship with fantasy football in hopes of making the world
            just a tiny bit better.
          </p>
          <p>
            With the help of some close friends and family, 2024 will be the first year this passion
            project finally takes off.
          </p>

          <div className="border border-purple-700 rounded-lg p-5 bg-gray-900">
            <p className="text-white font-medium text-lg mb-2">The Plan</p>
            <p>
              Get as many professionals to join a massive fantasy football league.{' '}
              <span className="text-purple-400 font-semibold">50% of the buy-in will go to the winner</span>{' '}
              and{' '}
              <span className="text-purple-400 font-semibold">50% will go to Good Sports.</span>
            </p>
          </div>

          <p>
            If you&apos;re not familiar,{' '}
            <span className="text-white font-semibold">Good Sports</span> is a charitable
            organization that drives equitable access in youth sports and physical activity, by
            supporting children in high-need communities to achieve their greatest potential, on the
            field and in life.
          </p>

          <div className="border border-green-700 rounded-lg p-5 bg-gray-900 space-y-2">
            <p className="text-green-400 font-semibold text-lg">The Goal</p>
            <p>
              Raise at least <span className="text-white font-bold">$4,000</span> for Good Sports
              — enough to supply gear to{' '}
              <span className="text-white font-bold">200 kids!</span>
            </p>
            <p className="text-sm text-gray-400">
              With a one-time buy-in of <strong className="text-white">$100</strong>, we need{' '}
              <strong className="text-white">80 participants</strong> to reach that goal. 80
              participants also means the winner takes home{' '}
              <strong className="text-white">$4,000 for themselves!</strong>
            </p>
          </div>

          <p>
            If you&apos;re interested, please fill out the fields below and be on the lookout for
            an email from Nate McGee at{' '}
            <a href="mailto:nathan.mcgee49@gmail.com" className="text-purple-400 underline">
              nathan.mcgee49@gmail.com
            </a>
            , where he&apos;ll explain the rules and answer any questions.
          </p>

          <p>
            Also, if fantasy football isn&apos;t your thing but you still want to donate, feel free
            to do so{' '}
            <Link
              href="https://support.goodsports.org/campaign/thegivingleague"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 underline"
            >
              here
            </Link>
            .
          </p>

          <p className="text-gray-400 italic">Thanks and good luck! &nbsp;–Nate</p>
        </div>

        {/* Sign-up form */}
        <div className="border border-gray-700 rounded-xl p-8 bg-gray-900 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Sign Up</h2>

          {status === 'success' ? (
            <div className="text-center space-y-3 py-8">
              <p className="text-green-400 text-2xl font-bold">You&apos;re in!</p>
              <p className="text-gray-300">
                Thanks for signing up. Keep an eye on your inbox for an email from Nate at{' '}
                <span className="text-purple-400">nathan.mcgee49@gmail.com</span>.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-sm text-gray-400 underline hover:text-white"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="First Name" required>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="John"
                  />
                </Field>
                <Field label="Last Name" required>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Smith"
                  />
                </Field>
              </div>

              <Field label="Email (company or personal)" required>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Company">
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Acme Corp"
                  />
                </Field>
                <Field label="Job Title">
                  <input
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Software Engineer"
                  />
                </Field>
              </div>

              <Field label="Industry" required>
                <select
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="" disabled>Select your industry</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </Field>

              {form.industry === 'Other' && (
                <Field label="Please specify your industry" required>
                  <input
                    name="industryOther"
                    value={form.industryOther}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="e.g. Nonprofit, Government..."
                  />
                </Field>
              )}

              {status === 'error' && (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-60 font-semibold text-white transition"
              >
                {status === 'submitting' ? 'Submitting...' : 'Count Me In!'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 w-full';
