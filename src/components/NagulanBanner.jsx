import React from 'react';
import { Scissors, Phone, Sparkles } from 'lucide-react';

export const NagulanBanner = ({
  customUrl = '',
  compact = false,
  printable = false,
  className = '',
}) => {
  if (customUrl) {
    return (
      <div className={`w-full flex items-center justify-center overflow-hidden ${className}`}>
        <img
          src={customUrl}
          alt="NAGULAN Unisex Salon Banner"
          className="w-full max-h-36 object-contain rounded-lg shadow-sm"
        />
      </div>
    );
  }

  // Official Brand Banner Component
  return (
    <div
      className={`w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-black via-charcoal-900 to-black text-white border border-charcoal-800 shadow-xl select-none ${
        compact ? 'p-3 md:p-4' : printable ? 'p-4' : 'p-5 md:p-7'
      } ${className}`}
    >
      {/* Decorative Gold & Charcoal Grid Lines */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* Brand Identity & Logo Emblem */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-charcoal-800 to-black border-2 border-gold-500 flex items-center justify-center shadow-lg shrink-0">
            <Scissors className="w-6 h-6 md:w-7 md:h-7 text-gold-500 transform -rotate-45" />
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="font-serif tracking-widest text-2xl md:text-3xl font-extrabold uppercase bg-gradient-to-r from-white via-gray-100 to-gold-400 bg-clip-text text-transparent">
                NAGULAN
              </h1>
              <span className="text-xs md:text-sm font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-charcoal-800 border border-gold-500/40 text-gold-400">
                UNISEX SALON
              </span>
            </div>

            <p className="text-xs md:text-sm tracking-widest text-gray-300 font-medium mt-1 flex items-center justify-center md:justify-start gap-1.5">
              <span>HAIR</span>
              <span className="text-gold-500">•</span>
              <span>SKIN</span>
              <span className="text-gold-500">•</span>
              <span>BEAUTY</span>
              <span className="text-gold-500">•</span>
              <span>MAKEUP</span>
            </p>
          </div>
        </div>

        {/* Franchise & Contact Ribbon */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-charcoal-800/80 border border-gold-500/30 text-xs md:text-sm text-gray-200">
            <Phone className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
            <span>Franchise Enquiry:</span>
            <a
              href="tel:9789961617"
              className="font-bold text-gold-400 tracking-wider hover:underline"
            >
              97899 61617
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>ISO Certified Premium Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NagulanBanner;
