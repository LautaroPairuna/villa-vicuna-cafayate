"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import Slider from "react-slick";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { reseñas, reseñasDetalles } from "../lib/reseñas";
import { motion, AnimatePresence } from "framer-motion";
import { ImageWithFallback } from "@/components/ImageWithFallback";

// -----------------------------------------------------------------------------
// Tipos e Interfaces
// -----------------------------------------------------------------------------
export interface ReseñaItem {
  id: number;
  nombreKey: string;
  textoKey: string;
  imagen: string;
  folder: string;
  carrusel: string[];
}

export interface ReseñaDetalle {
  comentarioKey: string;
  autor: string;
  pais: string;
}

export interface Translations {
  (key: string, options?: Record<string, unknown>): string;
  raw: (key: string) => string;
}

// -----------------------------------------------------------------------------
// Funciones Helper
// -----------------------------------------------------------------------------
function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]+>/g, "");
}

function splitTitle(raw: string): { part1: string; part2: string; full: string } {
  const regexH3 = /<h3><span>(.*?)<\/span>(.*?)<\/h3>?/;
  let match = raw.match(regexH3);
  if (match) {
    return { part1: match[1], part2: match[2], full: match[1] + match[2] };
  }
  const regexSpan = /^(.*?)<span>(.*?)<\/span>?$/;
  match = raw.match(regexSpan);
  if (match) {
    return { part1: match[1], part2: match[2], full: match[1] + match[2] };
  }
  return { part1: raw, part2: "", full: raw };
}

function calculateTrackingBase(text: string): number {
  const length = text.length;
  if (length <= 8) return 0.48;
  if (length <= 11) return 0.73;
  if (length <= 12) return .65;
  if (length <= 15) return 0.65;
  return 0.4;
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{ width?: number; height?: number }>({});
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

// -----------------------------------------------------------------------------
// Componente Modal de Reseñas
// -----------------------------------------------------------------------------
interface ReseñasModalProps {
  selectedReseña: ReseñaItem;
  onClose: () => void;
}

function ReseñasModal({ selectedReseña, onClose }: ReseñasModalProps) {
  const tGlobal = useTranslations() as Translations;
  const { width } = useWindowSize();
  const locale = useLocale();

  const detalles: ReseñaDetalle[] = useMemo(() => {
    const data = (reseñasDetalles as Record<string, ReseñaDetalle[]>)[
      String(selectedReseña.id)
    ];
    return data ?? [];
  }, [selectedReseña.id]);

  const rawTitle = useMemo(() => tGlobal.raw(selectedReseña.nombreKey), [
    tGlobal,
    selectedReseña.nombreKey,
  ]);
  const { part1, part2, full } = useMemo(() => splitTitle(rawTitle), [rawTitle]);

  const computedTracking = useMemo(() => {
    // calcula el tracking “base” según la longitud
    let baseTracking = calculateTrackingBase(full);
  
    // si es desayuno y portugués, lo reducimos un poco más
    if (locale === "pt" && selectedReseña.folder === "reseñas-desayuno") {
      baseTracking *= 0.6;  // ajusta el factor a tu gusto
    }

    if (locale === "en" && selectedReseña.folder === "reseñas-detalles") {
      baseTracking *= 1;  // ajusta el factor a tu gusto
    }

    if (locale === "en" && selectedReseña.folder === "reseñas-desayuno") {
      baseTracking *= 0.85;  // ajusta el factor a tu gusto
    }
  
    // luego aplicas el factor según el ancho
    const factor =
      width && width < 768
        ? 0.3
        : width && width < 1024
        ? 0.6
        : 1.15;
  
    return baseTracking * factor;
  }, [full, width, locale, selectedReseña.folder]);

  // Slider de comentarios (con react-slick, se deja como estaba)
  const commentsSliderSettings = useMemo(() => ({
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
    centerMode: false,
    variableWidth: false,
    centerPadding: "20px",
  }), []);

  // Estado y funciones para el carrusel de imágenes (manual)
  const [currentImage, setCurrentImage] = useState(0);
  // Para animar la dirección de la transición: 1 => next, -1 => prev
  const [direction, setDirection] = useState(0);
  const totalImages = selectedReseña.carrusel.length;

  const nextImage = useCallback(() => {
    setDirection(1);
    setCurrentImage((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  }, [totalImages]);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setCurrentImage((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  }, [totalImages]);

  // Resetea la imagen actual al cambiar la reseña
  useEffect(() => {
    setCurrentImage(0);
    setDirection(0);
  }, [selectedReseña]);

  const overlayVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }), []);

  const modalVariants = useMemo(() => ({
    hidden: { scale: 0.9, y: 50, opacity: 0 },
    visible: { scale: 1, y: 0, opacity: 1 },
    exit: { scale: 0.9, y: 50, opacity: 0 },
  }), []);

  // Variantes para animar la transición de imágenes
  const imageVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 50 : -50,
    }),
    animate: { opacity: 1, x: 0 },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -50 : 50,
    }),
  };

  const titleClassName = useMemo(() => {
    // Clases comunes a todos los casos
    const base = [
      "relative",
      "lg:absolute",
      "lg:left-1/2",
      "lg:-translate-x-1/2",
      "uppercase",
      "z-10",
      "w-full",
      "text-center",
      "mt-8",
      "sm:mt-6",
      "lg:mt-0",
      "lg:ms-4",
      "ms-0",
      "text-black",
    ].join(" ");

    // 1) Caso Portugués
    if (locale === "pt") {
      return `${base} lg:top-[13%] text-4xl lg:text-[3.9rem]`;
    }
    // 2) Caso “reseñas-desayuno”
    if (selectedReseña.folder === "reseñas-desayuno") {
      return `${base} lg:top-[15%] text-3xl sm:text-4xl lg:text-6xl`;
    }
    // 3) Por defecto
    return `${base} lg:top-[15%] text-3xl sm:text-4xl lg:text-6xl`;
  }, [locale, selectedReseña.folder]);

  const paragraphClassName = useMemo(() => {
    const base = ["relative", "z-10", "text-left", "mt-2"].join(" ");
  
    // 1) Portugués + desayuno: reducimos el margin-top en pantallas grandes
    if (locale === "pt" && selectedReseña.folder === "reseñas-desayuno") {
      return `${base} tracking-[0.08rem] leading-6 lg:mt-12 text-base`;
    }
  
    // 2) Solo desayuno
    if (selectedReseña.folder === "reseñas-desayuno") {
      return `${base} tracking-[0.08rem] leading-7 lg:mt-20 text-base`;
    }
  
    // 3) Por defecto
    return `${base} tracking-[0.08rem] leading-7 lg:mt-16 lg:text-lg text-base`;
  }, [locale, selectedReseña.folder]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center px-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white 
          pt-4 sm:pt-6 md:pt-8 lg:pt-10 
          pb-2 sm:pb-4 md:pb-6 lg:pb-8 
          px-4 sm:px-8 md:px-12 lg:px-14
          max-w-md lg:max-w-5xl 
          overflow-y-auto
          max-h-[90vh]
          relative transform lg:overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* --- Cerrar --- */}
          <button
            className="absolute md:top-6 top-1 left-0 text-xl sm:text-2xl md:text-4xl text-white bg-[#941104] rounded-tr-full rounded-br-full md:px-4 px-2 md:py-3 py-2 flex items-center"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <h3
            className={titleClassName}
            style={{ letterSpacing: `${computedTracking}em` }}
          >
            <span className="whitespace-nowrap">{part1}</span>
            <span className="whitespace-nowrap lg:text-white text-black">{part2}</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 text-black lg:gap-4">
            <div className={`flex flex-col col-span-1 lg:col-span-7 pt-2 
              ${
                selectedReseña.folder === "reseñas-desayuno"
                  ? "lg:pt-16 relative lg:pe-[2rem]"  // valor para desayuno
                  : "lg:pt-16 relative lg:pe-[1rem]"  // valor por defecto
              }`}>
              <div className={`absolute  inset-0 pointer-events-none z-10 flex justify-center items-center lg:w-[800px] w-[250px] h-[250px]
                  ${
                    selectedReseña.folder === "reseñas-desayuno"
                      ? "lg:top-[78%] top-[12%] lg:-left-[5%] left-[15%]"  // valor para desayuno
                      : "lg:top-[78%] top-[15%] lg:-left-[5%] left-[20%]"  // valor por defecto
                  }
                  ${
                    selectedReseña.folder === "reseñas-personal"
                      ? "lg:top-[78%] top-[20%] lg:-left-[5%] left-[15%]"  // valor para desayuno
                      : "lg:top-[78%] top-[15%] lg:-left-[5%] left-[15%]"  // valor por defecto
                  }
                `}>
                <Image
                  src="/images/fondo-carta-5.svg"
                  alt="Personal Review Background"
                  fill
                  className="object-contain opacity-55"
                />
              </div>
              <p
                className={paragraphClassName}
                style={{ whiteSpace: "pre-line" }}
              >
                {tGlobal(selectedReseña.textoKey)}
              </p>
              <div className="mt-6 relative z-10 w-full overflow-hidden mb-4">
                <Slider {...commentsSliderSettings}>
                  {detalles.map((detalle, i) => {
                    const countrySlug = detalle.pais
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/\./g, '');
                    const flagSrc = `/images/icons/habitaciones/ico-${countrySlug}.png`;
                    const starsSrc = `/images/icons/ico-five-stars.svg`;

                    return (
                      <div key={i} className="px-2">
                        {/* Contenedor relativo */}
                        <div className="relative bg-[#f6f0e1] bg-opacity-70 rounded-2xl pb-6 pt-12 px-4">

                          {/* 1) Bandera en la esquina superior derecha */}
                          <div className="absolute top-3 right-3">
                            <Image
                              src={flagSrc}
                              alt={detalle.pais}
                              width={32}
                              height={32}
                            />
                          </div>

                          {/* 2) Texto de la reseña */}
                          <p className="text-lg leading-6 resenas-texto mb-2 text-left">
                            {tGlobal(detalle.comentarioKey)}
                          </p>

                          {/* 3) Autor + estrellas, alineados a la derecha */}
                          <div className="flex items-center justify-end space-x-2 mb-2">
                            <span className="text-lg font-semibold resenas-texto">{detalle.autor}</span>
                            <Image
                              src={starsSrc}
                              alt="5 estrellas"
                              width={80}
                              height={20}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </Slider>
              </div>
            </div>

            {/* Carrusel de imágenes manual con animación */}
            <div className="relative col-span-1 lg:col-span-5 w-full aspect-[3/4] lg:aspect-[6/9] flex items-center justify-center">
              <div className="relative w-full h-full overflow-hidden">
                <AnimatePresence custom={direction}>
                  <motion.div
                    key={currentImage}
                    className="absolute inset-0"
                    custom={direction}
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                  >
                    <ImageWithFallback
                      src={`/images/reseñas/${selectedReseña.folder}/${selectedReseña.carrusel[currentImage]}`}
                      alt={`Imagen ${currentImage + 1}`}
                      fill
                      className="object-cover"
                      fallbackSrc="/images/placeholder.jpg"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Botón Prev con SVG */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white flex items-center justify-center transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {/* Botón Next con SVG */}
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white flex items-center justify-center transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}



// -----------------------------------------------------------------------------
// Componente de Tarjeta (sin modificar el src)
// -----------------------------------------------------------------------------
interface ReseñaCardProps {
  reseña: ReseñaItem;
  onClick: (id: number) => void;
}

function ReseñaCard({ reseña, onClick }: ReseñaCardProps) {
  const tGlobal = useTranslations() as Translations;
  const cardTitle = useMemo(() => stripHtmlTags(tGlobal.raw(reseña.nombreKey)), [tGlobal, reseña.nombreKey]);
  const handleClick = useCallback(() => onClick(reseña.id), [onClick, reseña.id]);

  return (
    <div
      className="relative bg-white shadow-lg overflow-hidden cursor-pointer aspect-square"
      onClick={handleClick}
    >
      <Image
        src={`/images/reseñas/${reseña.imagen}`}
        alt={cardTitle}
        width={500}
        height={500}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-0 right-0 text-white text-center">
        <p className="text-xl font-semibold px-3 py-1 inline-block rounded-lg">
          &quot;{cardTitle}&quot;
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Componente Principal
// -----------------------------------------------------------------------------
export default function ReseñasSection() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const tReseñas = useTranslations("reseñas");
  const locale = useLocale(); // <-- aquí capturas el idioma actual

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedReseña = useMemo(
    () => reseñas.find(item => item.id === selectedId) ?? null,
    [selectedId]
  );

  const handleCardClick = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedId(null);
  }, []);

  // Computamos clases condicionales según locale
  const titleClassName = useMemo(() => {
    const base = "mb-8 ms-5 font-base text-center";
    if (locale === "pt") {
      return `${base} text-4xl lg:text-6xl 2xl:text-6xl tracking-[0.3em]`;
    }
    // por defecto
    return `${base} text-4xl lg:text-6xl 2xl:text-6xl tracking-[0.60em]`;
  }, [locale]);

  return (
    <section id="reviews" className="relative lg:pt-36 pt-10 pb-10 px-5 bg-white text-black">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="absolute -top-[9%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] pointer-events-none -z-10 sm:-top-[8%] sm:w-[350px] sm:h-[350px] md:-top-[30%] md:w-[450px] md:h-[450px] lg:-top-[33%] lg:w-[775px] lg:h-[600px]">
          <Image
            src="/images/fondo-carta-1.svg"
            alt="Fondo Carta 1"
            fill
            className="object-contain"
          />
        </div>
        <h2 className={titleClassName}>
          {tReseñas("titulo")}
        </h2>
        <p className="text-xl leading-7 tracking-[0.03em]">{tReseñas("descripcion")}</p>
        <p className="text-xl leading-7 tracking-[0.03em]">{tReseñas("gracias")}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-5">
          {reseñas.map(reseña => (
            <ReseñaCard key={reseña.id} reseña={reseña} onClick={handleCardClick} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {mounted && selectedReseña && (
          <ReseñasModal selectedReseña={selectedReseña} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </section>
  );
}
