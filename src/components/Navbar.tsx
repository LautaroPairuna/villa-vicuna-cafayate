"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

type LinkItem = { type: "link"; href: string; label: string };
type CloudbedsItem = { type: "cloudbeds"; label: string };
type MenuItem = LinkItem | CloudbedsItem;

const CLOUDBEDS_PROPERTY_CODE = "pY5HV6";

function CloudbedsNavFallback() {
  const t = useTranslations("Navbar");

  return (
    <button className="cb-link-btn align-middle font-medium text-base uppercase">
      {t("bookNavbar")}
    </button>
  );
}

// CloudbedsBookNow dinámico, fuera del bundle principal
const CloudbedsBookNow = dynamic(() => import("./CloudbedsBookNow"), {
  ssr: false,
  loading: () => <CloudbedsNavFallback />,
});

interface NavbarProps {
  onCloudbedsLoaded?: () => void;
  isCloudbedsReady?: boolean;
}

export default function Navbar({ onCloudbedsLoaded, isCloudbedsReady = false, }: NavbarProps) {
  const t = useTranslations("Navbar");
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1280);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Detectar cuando Cloudbeds está listo
  useEffect(() => {
    const checkCloudbedsReady = () => {
      // Verificar si el script de Cloudbeds está cargado
      if (window.CloudbedsBookNow || document.querySelector('script[src*="cloudbeds"]')) {
        console.log("☁️ Cloudbeds detectado como listo");
        onCloudbedsLoaded?.();
        return true;
      }
      return false;
    };

    // Verificar inmediatamente
    if (checkCloudbedsReady()) return;

    // Si no está listo, verificar periódicamente
    const interval = setInterval(() => {
      if (checkCloudbedsReady()) {
        clearInterval(interval);
      }
    }, 100);

    // Timeout de seguridad
    const timeout = setTimeout(() => {
      console.log("☁️ Timeout de Cloudbeds - asumiendo que está listo");
      clearInterval(interval);
      onCloudbedsLoaded?.();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onCloudbedsLoaded]);

  // Quita el segmento del idioma (es|en|pt)
  const getPathWithoutLocale = (path: string) => path.replace(/^\/(es|en|pt)/, "");

  const languages = useMemo(
    () => [
      { lang: "es", flag: "spain-flag.svg", alt: "Español" },
      { lang: "en", flag: "usa-flag.svg", alt: "English" },
      { lang: "pt", flag: "portugues-flag.svg", alt: "Português" },
    ],
    []
  );

  // Menú con Cloudbeds como item dedicado
  const menuItems: MenuItem[] = useMemo(
    () => [
      { type: "link", href: "#about-us", label: t("aboutNavbar") },
      { type: "link", href: "#reviews", label: t("reviewsNavbar") },
      { type: "link", href: "#menu", label: t("menuNavbar") },
      { type: "link", href: "#rooms", label: t("roomsNavbar") },
      { type: "link", href: "#contact", label: t("contactNavbar") },
      { type: "cloudbeds", label: t("bookNavbar") },
    ],
    [t]
  );

  const isExternal = (href: string) => href.startsWith("http");

  return (
    <nav
      className="fixed top-0 left-0 w-full bg-[#e1cd9b] text-black py-2 pe-4 md:ps-16 ps-4 z-40 shadow-md"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/logo-villa-vicuna.svg"
              alt="Villa Vicuña"
              width={120}
              height={120}
              className="w-32 cursor-pointer transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* Menú desktop */}
        {isDesktop && (
          <div className="flex-1 justify-center">
            <ul className="flex items-center justify-center p-0">
              {menuItems.map((item, index) => (
                <React.Fragment key={item.type === "link" ? item.href : "cloudbeds"}>
                  <li className="whitespace-nowrap">
                    {item.type === "link" ? (
                      <a
                        href={item.href}
                        target={isExternal(item.href) ? "_blank" : undefined}
                        rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
                        className="relative group py-1 font-medium text-base transition-colors duration-300 hover:text-gray-800 uppercase"
                      >
                        {item.label}
                        <span className="absolute left-1/2 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0" />
                      </a>
                    ) : (
                      <CloudbedsBookNow
                        propertyCode={CLOUDBEDS_PROPERTY_CODE}
                        label={item.label}
                        buttonClassName="cb-link-btn"
                        mode="popup"
                        width="90vw"
                        height="90vh"
                        lang="auto"
                        timeout={3000}
                        className="align-middle"
                        onLoaded={onCloudbedsLoaded}
                        isGloballyReady={isCloudbedsReady}
                      />
                    )}
                  </li>
                  {index < menuItems.length - 1 && (
                    <li className="flex items-center mx-6">
                      <span className="text-lg">•</span>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        )}

        {/* Idiomas / toggle móvil */}
        <div className="flex items-center gap-x-6">
          {isDesktop ? (
            <div className="flex items-center gap-x-2">
              {languages.map(({ lang, flag, alt }) => (
                <Link key={lang} href={`/${lang}${getPathWithoutLocale(pathname)}`}>
                  <Image
                    src={`/images/icons/${flag}`}
                    alt={alt}
                    width={28}
                    height={28}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <button
              className="text-3xl focus:outline-none flex items-center ml-4"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
          )}
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && !isDesktop && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#e1cd9b] flex flex-col items-center justify-center z-50"
          >
            <button
              className="absolute top-6 right-6 text-3xl focus:outline-none"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              ✖
            </button>

            <ul className="text-xl space-y-6 text-center">
              {menuItems.map((item) => (
                <li key={item.type === "link" ? item.href : "cloudbeds-mobile"}>
                  {item.type === "link" ? (
                    <a
                      href={item.href}
                      target={isExternal(item.href) ? "_blank" : undefined}
                      rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
                      className="relative group font-semibold transition-colors duration-300 hover:text-gray-800 uppercase"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                      <span className="absolute left-1/2 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0" />
                    </a>
                  ) : (
                    <CloudbedsBookNow
                      propertyCode={CLOUDBEDS_PROPERTY_CODE}
                      label={item.label}
                      buttonClassName="cb-link-btn cb-link-btn--nav"
                      mode="popup"
                      width="90vw"
                      height="90vh"
                      lang="auto"
                      timeout={4000}
                      className="align-middle"
                      onLoaded={onCloudbedsLoaded}
                      isGloballyReady={isCloudbedsReady}
                    />
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex space-x-4">
              {languages.map(({ lang, flag, alt }) => (
                <Link key={lang} href={`/${lang}${getPathWithoutLocale(pathname)}`}>
                  <Image
                    src={`/images/icons/${flag}`}
                    alt={alt}
                    width={28}
                    height={28}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
