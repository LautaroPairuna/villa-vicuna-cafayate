// src/components/Habitaciones.tsx (Cafayate)
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Habitaciones as getHabitaciones,
  Habitacion, // TIPADO REUTILIZADO desde lib
} from "@/lib/habitaciones";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useWindowSize } from "@/hooks/useWindowSize";
import Image from "next/image";
import dynamic from "next/dynamic";

const CLOUDBEDS_PROPERTY_CODE = "pY5HV6";

// CloudbedsBookNow como en Salta: import dinámico y sin SSR
const CloudbedsBookNow = dynamic(
  () => import("./CloudbedsBookNow"),
  {
    ssr: false,
    loading: () => null,
  }
);

/* ---------- Traducciones ---------- */
export interface Translations {
  (key: string, options?: Record<string, unknown>): string;
  raw: (key: string) => string;
}

/* ---------- Modal ---------- */
interface HabitacionModalProps {
  habitacion: Habitacion; // ahora puede ser “normal” o “mezcla” con una SubHabitación
  onClose: () => void;
  t: Translations;
}

function HabitacionModal({ habitacion, onClose, t }: HabitacionModalProps) {
  const { width: windowWidth } = useWindowSize();
  const iconSize = windowWidth && windowWidth >= 1024 ? 42 : 32;

  const { categoriaBlack, categoriaWhite } = useMemo(() => {
    const categoriaHTML = t.raw(habitacion.categoria);
    const regex = /<h3>(.*?)<span>(.*?)<\/span><\/h3>?/;
    const match = categoriaHTML.match(regex);
    if (match) return { categoriaBlack: match[1], categoriaWhite: match[2] };
    return { categoriaBlack: categoriaHTML, categoriaWhite: "" };
  }, [habitacion, t]);

  /* ----- carrusel manual ----- */
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(0);
  const totalImages = habitacion.carrusel.length;

  const nextImage = useCallback(() => {
    setDirection(1);
    setCurrentImage((p) => (p === totalImages - 1 ? 0 : p + 1));
  }, [totalImages]);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setCurrentImage((p) => (p === 0 ? totalImages - 1 : p - 1));
  }, [totalImages]);

  useEffect(() => {
    setCurrentImage(0);
    setDirection(0);
  }, [habitacion]);

  const imageVariants = {
    initial: (d: number) => ({ opacity: 0, x: d > 0 ? 50 : -50 }),
    animate: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -50 : 50 }),
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4 overflow-y-auto md:overflow-visible"
      onClick={onClose}
    >
      <div
        className="bg-white 
        pt-4 sm:pt-6 md:pt-8 lg:pt-10 
        pb-2 sm:pb-4 md:pb-6 lg:pb-8 
        px-4 sm:px-8 md:px-12 xl:px-10 2xl:px-20 
        pe-4 sm:pe-6 md:pe-10 lg:pe-16 
        w-full 2xl:max-w-6xl lg:max-w-5xl 
        relative transform transition-transform duration-300 scale-95 animate-fadeIn 
        mt-8 md:mt-0 
        overflow-y-auto md:overflow-visible
        max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Cerrar --- */}
        <button
          className="fixed md:top-6 top-1 left-0 text-xl sm:text-2xl md:text-4xl text-white bg-[#941104] rounded-tr-full rounded-br-full md:px-4 px-2 md:py-3 py-2 flex items-center"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* --- Título categoría --- */}
        <h3
          className={`
            relative md:absolute md:top-[10%] md:left-1/2 md:-translate-x-1/2
            leading-tight md:leading-normal uppercase z-10 w-full text-center
            lg:mt-2 mt-6 font-normal
            ${
              habitacion.categoria === "standard"
                ? "2xl:tracking-[0.62em] xl:tracking-[0.55em] lg:tracking-[0.48em] tracking-[0.18em]"
                : "2xl:tracking-[0.72em] xl:tracking-[0.64em] lg:tracking-[0.62em] tracking-[0.10em]"
            }
            ${
              habitacion.categoria === "departamento"
                ? "md:text-6xl text-4xl"
                : "text-4xl md:text-8xl"
            }
          `}
        >
          <span className="text-black">{categoriaBlack}</span>
          <span className="text-black lg:text-white">{categoriaWhite}</span>
        </h3>

        {/* --- Contenido --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          {/* Texto + amenities */}
          <div
            className={`col-span-1 md:col-span-7 relative 
            ${
              habitacion.categoria === "departamento"
                ? "pt-2 lg:pt-24"
                : "pt-2 lg:pt-36"
            }
          `}
          >
            <h4
              className={`text-2xl uppercase text-gray-700 z-10 w-full text-center lg:mt-4 titulo-habitaciones-nombre
              ${
                habitacion.key === "antesala11"
                  ? "2xl:tracking-[1.45em] lg:tracking-[1.05em] tracking-[.5em]"
                  : "tracking-[.65em]"
              }
              ${
                habitacion.key === "antesala12"
                  ? "2xl:tracking-[1.45em] tracking-[1.05em]"
                  : "tracking-[.65em]"
              }
              ${
                habitacion.key === "balcon"
                  ? "md:tracking-[2.25em] tracking-[.5em]"
                  : "md:tracking-[.65em] tracking-[.5em]"
              }
              ${
                habitacion.key === "triple"
                  ? "md:tracking-[1.45em] tracking-[.5em]"
                  : "md:tracking-[.65em] tracking-[.5em]"
              }
              ${
                habitacion.key === "twin"
                  ? "md:tracking-[1.85em] tracking-[.5em]"
                  : "md:tracking-[.65em] tracking-[.5em]"
              }
              ${
                habitacion.key === "familiar"
                  ? "md:tracking-[1em] tracking-[.5em]"
                  : "md:tracking-[.65em] tracking-[.5em]"
              }
            `}
            >
              {t(`${habitacion.key}.nombre`)}
            </h4>

            <div className="relative mt-2">
              <div
                className={`absolute pointer-events-none z-10 transform -translate-x-1/2 -translate-y-1/2 opacity-35
                ${
                  habitacion.categoria === "departamento"
                    ? "top-[60%] lg:left-[70%] left-[50%] md:w-[850px] w-[350px] lg:h-[400px] md:h-[160px] h-[110px]"
                    : "top-[55%] lg:left-[60%] left-[50%] md:w-[750px] w-[350px] lg:h-[375px] md:h-[160px] h-[110px]"
                }
                ${
                  habitacion.key === "matrimonial"
                    ? "top-[55%] lg:left-[60%] left-[50%] md:w-[750px] w-[350px] lg:h-[375px] md:h-[160px] h-[110px]"
                    : "top-[55%] lg:left-[60%] left-[50%] md:w-[750px] w-[350px] lg:h-[375px] md:h-[160px] h-[110px]"
                } 
              `}
              >
                <Image
                  src="/images/fondo-carta-3.svg"
                  alt="Fondo Carta"
                  fill
                  className="object-contain"
                />
              </div>

              <div
                className={`relative z-10 leading-7
                ${
                  habitacion.categoria === "departamento"
                    ? "2xl:pe-[1rem] lg:pe-[0.5rem]"
                    : "2xl:pe-[1rem] lg:pe-[3.8rem]"
                }
                `}
                style={{ whiteSpace: "pre-line" }}
              >
                <div className="space-y-6">
                  <p
                    className={`text-left
                    ${
                      habitacion.categoria === "departamento"
                        ? "lg:text-lg text-base"
                        : "2xl:text-lg text-base"
                    }`}
                  >
                    {t(`${habitacion.key}.descripcion`)}
                  </p>
                  <p
                    className={`text-left
                    ${
                      habitacion.categoria === "departamento"
                        ? "lg:text-lg text-base"
                        : "2xl:text-lg text-base"
                    }`}
                  >
                    {t(`${habitacion.key}.parrafo_minibar`)}
                  </p>
                </div>
                {/* amenities */}
                <div
                  className={`flex flex-wrap justify-start items-center
                  ${
                    habitacion.key === "matrimonial"
                      ? "md:mt-40 mt-5"
                      : "md:mt-28 mt-5"
                  }`}
                >
                  {habitacion.amenities.map((am, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center mx-auto"
                      style={{
                        width: iconSize,
                        height: iconSize,
                      }}
                    >
                      <Image
                        src={`/images/icons/habitaciones/${am.icono}`}
                        alt={am.nombre}
                        width={iconSize}
                        height={iconSize}
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Carrusel */}
          <div
            className={`relative col-span-1 lg:col-span-5 w-full aspect-[3/4] lg:aspect-[6/9] flex items-end justify-center
            ${
              habitacion.categoria === "departamento"
                ? "md:ps-12 ps-0"
                : "ps-0"
            }
          `}
          >
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
                    src={`/images/habitaciones/${habitacion.folder}/${habitacion.carrusel[currentImage]}`}
                    alt={`Imagen ${currentImage + 1}`}
                    fill
                    className="object-cover"
                    fallbackSrc="/images/placeholder.jpg"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* prev / next */}
            <button
              onClick={prevImage}
              className={`absolute top-1/2 -translate-y-1/2 text-white
              ${
                habitacion.categoria === "departamento" ? "left-14" : "left-4"
              }
            `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className={`absolute top-1/2 -translate-y-1/2 text-white
              ${
                habitacion.categoria === "departamento" ? "right-2" : "right-4"
              }
            `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Componente principal ---------- */
export default function HabitacionesComponent() {
  // state ahora incluye variantKey opcional (como tenías)
  const [selected, setSelected] = useState<{ id: number; variantKey?: string } | null>(null);
  const t = useTranslations("rooms") as Translations;
  const habitaciones = getHabitaciones();

  /* Datos completos para el modal (misma lógica que tenías) */
  const selectedData = useMemo<Habitacion | null>(() => {
    if (!selected) return null;
    const base = habitaciones.find((h) => h.id === selected.id);
    if (!base) return null;

    if (!selected.variantKey) return { ...base };

    const variante = base.variantes?.find((v) => v.key === selected.variantKey);
    if (!variante) return null;

    return {
      ...base,
      ...variante, // sobreescribe key, folder, carrusel, amenities
      categoria: base.categoria,
      imagen: base.imagen,
    };
  }, [selected, habitaciones]);

  /* helpers */
  const handleSelect = useCallback((id: number, variantKey?: string) => {
    setSelected({ id, variantKey });
  }, []);

  const handleCloseModal = useCallback(() => setSelected(null), []);

  /* ---------- render ---------- */
  return (
    <section id="rooms" className="relative bg-white text-black md:px-12 px-6">
      {/* fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block 2xl:w-[1150px] w-[1000px] h-full 2xl:top-28 xl:top-24 2xl:left-56 xl:left-0 z-10">
        <Image
          src="/images/fondo-carta-3-seccion.svg"
          alt="Fondo Carta"
          fill
          className="object-contain opacity-60"
        />
      </div>

      {/* título móvil + vertical */}
      <div className="max-w-[1200px] w-full mx-auto flex flex-col lg:flex-row items-center">
        <div className="relative lg:hidden mb-6">
          <Image
            src="/images/fondo-carta-3-seccion.svg"
            alt="Fondo Carta"
            width={250}
            height={250}
            className="absolute top-[-15%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 object-contain lg:hidden"
          />
          <h2 className="relative text-4xl text-center mt-16">
            {t("titulo")}
          </h2>
        </div>

        <div className="hidden lg:flex w-1/12 items-center justify-center mx-20">
          <h2 className="text-3xl xl:text-4xl 2xl:text-5xl transform -rotate-90 whitespace-nowrap 2xl:tracking-[1em] tracking-[1.2em] text-center mb-10 titulo-menu">
            {t("titulo")}
          </h2>
        </div>

        {/* grid habitaciones */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-20 gap-y-1">
            {habitaciones.map((hab) => {
              // 👇 para antesala usamos por defecto la variante 11
              const defaultVariantKey =
                hab.key === "antesala" ? "antesala11" : undefined;

              return (
                <div
                  key={hab.id}
                  className="relative mx-auto 2xl:max-w-[300px] xl:max-w-[250px] lg:max-w-[350px]"
                >
                  {/* thumbnail + hover como Salta */}
                  <div
                    className="relative 2xl:w-[300px] 2xl:h-[300px] sm:w-[250px] sm:h-[250px] w-[300px] h-[300px] overflow-hidden mx-auto group cursor-pointer"
                    onClick={() => handleSelect(hab.id, defaultVariantKey)}
                  >
                    <Image
                      src={`/images/habitaciones/${hab.imagen}`}
                      alt={t(`${hab.key}.nombre`)}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/35 flex items-center justify-center text-white">
                      <div className="flex items-center gap-2 uppercase tracking-widest">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path d="M10 4a6 6 0 105.293 9.293l3.707 3.707a1 1 0 001.414-1.414l-3.707-3.707A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z" />
                        </svg>
                        <span>{t("ver_mas")}</span>
                      </div>
                    </div>
                  </div>

                  {/* texto + botones + Cloudbeds */}
                  <div className="py-4 text-left">
                    <p className="text-xs text-gray-600">
                      {t(`${hab.key}.detalles`, { default: "" })}
                    </p>
                    <h3 className="text-base mt-2 titulo-habitaciones capitalize tracking-widest">
                      {hab.cantidad} {hab.categoria}{" "}
                      {t(`${hab.key}.nombre`, { default: hab.key })}
                    </h3>

                    {hab.variantes?.length && hab.key !== "antesala" ? (
                      <div className="flex flex-wrap items-center p-0 m-0">
                        {hab.variantes.map((v) => (
                          <button
                            key={v.key}
                            className={`
                              pt-2 text-base titulo-habitaciones relative
                              after:content-['/'] after:mx-3 after:text-black
                              after:inline-block after:align-middle
                              last:after:content-none
                            `}
                            onClick={() => handleSelect(hab.id, v.key)}
                          >
                            {`Ver más`}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {/* Botón de reserva Cloudbeds estilo Salta, variant="rooms" */}
                    <CloudbedsBookNow
                      propertyCode={CLOUDBEDS_PROPERTY_CODE}
                      variant="rooms"
                      roomsButtonClassName="pt-2 text-base transition-all rounded-xl items-center my-0 mx-auto justify-center text-center cursor-pointer titulo-habitaciones"
                      roomsLabel={t(`${hab.key}.boton`)}
                      mode="popup"
                      width="90vw"
                      height="90vh"
                      lang="auto"
                      timeout={4000}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* modal */}
      {selectedData && (
        <HabitacionModal
          habitacion={selectedData}
          onClose={handleCloseModal}
          t={t}
        />
      )}
    </section>
  );
}
