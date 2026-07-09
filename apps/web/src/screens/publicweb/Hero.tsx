import { ArrowRight, Anchor } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-slate-900 text-white">
      {/* Background ambient glow for a premium tech feel */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-900"></div>
      
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:py-40 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Discover the Majesty of the <span className="text-amber-500">Deep Blue</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Join our expert crew for an unforgettable luxury whale watching experience. Powered by real-time marine telemetry, premium vessels, and guaranteed sightings.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a 
              href="#" 
              className="flex items-center gap-2 rounded-md bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 transition-all"
            >
              Book Your Voyage <ArrowRight size={18} />
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 text-sm font-semibold leading-6 text-slate-200 hover:text-amber-500 transition-colors"
            >
              Explore Our Fleet <Anchor size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}