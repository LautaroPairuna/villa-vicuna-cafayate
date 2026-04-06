// src/components/Hero.tsx
"use client";

import Image from "next/image";
import React, { memo } from "react";

const Hero = memo(() => {
  return (
    <section
      className="relative w-full min-h-dvh"
      aria-label="Hero - Bienvenida a Villa Vicuña"
    >
      {/* Fondo de video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero-poster.webp"
        >
          {/* Versión WebM (más eficiente) */}
          <source src="/videos/video-home.webm" type="video/webm" />
          {/* Fallback MP4 */}
          <source src="/videos/video-home-opt.mp4" type="video/mp4" />
          Tu navegador no soporta videos en HTML5.
        </video>
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Contenido centrado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 sm:px-12">
        <div className="mt-6">
          <Image
            src="/images/logo-villa-vicuna-3.svg"
            alt="Isologo Villa Vicuña"
            width={120}
            height={120}
            priority
          />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

export default Hero;
