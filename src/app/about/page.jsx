import React from 'react';

const About = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          About Tech Market
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Building the next generation curated hardware catalog for engineers, digital nomads, and creators worldwide.
        </p>
      </div>

      {/* Intro Image/Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            Curating Only the Best
          </h2>
          <p className="text-zinc-650 dark:text-zinc-350 leading-relaxed mb-6">
            Tech Market started with a simple belief: finding high-quality tech gear shouldn&apos;t require scrolling through thousands of unverified listings. We handpick every single laptop, phone, mechanical keyboard, and audio accessory on our platform to ensure they meet our rigorous performance standards.
          </p>
          <p className="text-zinc-650 dark:text-zinc-350 leading-relaxed">
            Whether you are compiling massive codebases, designing digital art, or mixing audio, our catalog is curated to give you maximum computing power, sleek ergonomics, and long-term durability.
          </p>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-zinc-100 dark:border-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80"
            alt="Tech workspace"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Core values */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-16">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-zinc-100 p-8 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Uncompromised Quality</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We test all products for performance and durability. If it&apos;s not good enough for our developers, it doesn&apos;t make it to our catalog.
            </p>
          </div>
          <div className="bg-white border border-zinc-100 p-8 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Community First</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We shape our collection around feedback from the coding and creative communities, adding and removing products based on real-world reviews.
            </p>
          </div>
          <div className="bg-white border border-zinc-100 p-8 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Open Transparency</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Full specifications, real-time reviews, and transparent pricing. No hidden fees or bait-and-switch advertising.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;