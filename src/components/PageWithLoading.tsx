// src/components/PageWithLoading.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import Hero from "./Hero";
import WhatsappLink from "./WhatsappLink";
import Contacto from "./Contacto";

const Nosotros = dynamic(() => import("./Nosotros"));
const Reseñas = dynamic(() => import("./Reseñas"));
const Menu = dynamic(() => import("./Menu"));
const Habitaciones = dynamic(() => import("./Habitaciones"));

function DeferredSection({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{isVisible ? children : null}</div>;
}

export default function PageWithLoading() {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <main>
        <Hero />
        <DeferredSection>
          <Nosotros />
        </DeferredSection>
        <DeferredSection>
          <Reseñas />
        </DeferredSection>
        <DeferredSection>
          <Menu />
        </DeferredSection>
        <DeferredSection>
          <Habitaciones />
        </DeferredSection>
      </main>

      <WhatsappLink />

      <footer>
        <Contacto />
      </footer>
    </>
  );
}
