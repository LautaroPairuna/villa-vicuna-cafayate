// src/components/PageWithLoading.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "./LoadingScreen";
import Navbar from "./Navbar";
import Hero from "./Hero";
import WhatsappLink from "./WhatsappLink";
import Contacto from "./Contacto";

const Nosotros = dynamic(() => import("./Nosotros"), { ssr: false });
const Reseñas = dynamic(() => import("./Reseñas"), { ssr: false });
const Menu = dynamic(() => import("./Menu"), { ssr: false });
const Habitaciones = dynamic(() => import("./Habitaciones"), { ssr: false });

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
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isLoadingVisible, setIsLoadingVisible] = useState(true);

  // Tiempo mínimo para que el loader no haga "flash"
  const [minLoadingTime, setMinLoadingTime] = useState(false);

  // Timer de tiempo mínimo (800ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTime(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Timeout de seguridad (6s) para evitar pantalla infinita
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setIsHeroLoaded(true);
      setIsLoadingVisible(false);
      setTimeout(() => setShowContent(true), 200);
    }, 6000);

    return () => clearTimeout(safetyTimer);
  }, []);

  // Cuando Hero está listo + tiempo mínimo cumplido → revelar sitio
  useEffect(() => {
    if (isHeroLoaded && minLoadingTime) {
      setIsLoadingVisible(false);

      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 200);

      return () => clearTimeout(contentTimer);
    }
  }, [isHeroLoaded, minLoadingTime]);

  const handleHeroLoaded = () => {
    setIsHeroLoaded(true);
  };

  return (
    <>
      {/* Contenido principal que se revela gradualmente */}
      <div
        className={`transition-opacity duration-1000 ease-in-out ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <header>
          <Navbar />
        </header>

        <main>
          <Hero onLoaded={handleHeroLoaded} />
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
      </div>

      {/* Pantalla de carga superpuesta */}
      {!showContent && <LoadingScreen isVisible={isLoadingVisible} />}
    </>
  );
}
