import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10 text-center">
        <Image
          src="/tgl_logo.png"
          alt="The Giving League Logo"
          width={140}
          height={140}
          className="mx-auto rounded-md"
          priority
        />

        <h1 className="text-4xl font-bold">Welcome to The Giving League</h1>
        <p className="text-lg text-gray-300">
          A fantasy football league committed to giving back.
        </p>

        <section className="border border-gray-800 rounded-lg p-6 bg-gray-900 shadow-lg text-left">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">Commissioner Notes</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-200">
            <li>Welcome to the new Home Page of The Giving League! Here you can see how you stack up against your league mates anytime you want!</li>
            <li>Don't worry, the weekly recaps will still be a big part of the league.</li>
            <li>We're at 88% of league dues submitted. For the non-payers.... prepare to be publicly shamed.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
