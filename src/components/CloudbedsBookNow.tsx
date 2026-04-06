// src/components/CloudbedsBookNow.tsx
"use client";

import React, { useMemo, useEffect, useState } from "react";
import Image from "next/image";

type CommonYesNo = "si" | "no";
type Mode = "estándar" | "ventana emergente" | "standard" | "popup";
type Lang = "auto" | "es" | "en" | "pt" | string;
type Variant = "nav" | "contact" | "rooms";

type CloudbedsBookNowProps = React.HTMLAttributes<HTMLElement> & {
  propertyCode: string;

  // Navbar / Rooms: texto visible
  label?: string;
  fallbackText?: string;

  buttonClassName?: string; // class-name del WC
  width?: string;
  height?: string;
  lang?: Lang;
  currency?: string;

  disableCssTitleReset?: CommonYesNo;
  hideCustomHeader?: CommonYesNo;
  hideCustomFooter?: CommonYesNo;
  hidePropertyInfo?: CommonYesNo;
  ignoreSearchParams?: CommonYesNo;
  mode?: Mode;
  timeout?: number;

  variant?: Variant;

  // Variant "contact": tu botón visible (icon + texto opcional)
  contactButtonClassName?: string;
  contactIconSrc?: string;
  contactIconSize?: number;
  contactAriaLabel?: string;
  contactLabel?: string;

  // Variant "rooms": botón textual en habitaciones
  roomsButtonClassName?: string;
  roomsLabel?: string;

  directUrlFallback?: string;

  // Estado global de carga sincronizada (por si en el futuro lo compartís)
  isGloballyReady?: boolean;

  // Callback cuando el WC está listo
  onLoaded?: () => void;
};

/*──────────────── CONSTANTES / LOADER GLOBAL ────────────────*/
const scriptSrc =
  "https://static1.cloudbeds.com/booking-engine/latest/static/js/immersive-experience/cb-immersive-experience.js";

let cloudbedsScriptPromise: Promise<void> | null =
  (globalThis as unknown as { __cbScriptPromise?: Promise<void> }).__cbScriptPromise ?? null;

let cloudbedsLoadStarted: boolean =
  (globalThis as unknown as { __cbLoadStarted?: boolean }).__cbLoadStarted ?? false;

async function ensureCloudbedsLoaded(ms: number = 5000): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // Si ya está registrado el WC, listo
  if (
    "customElements" in window &&
    window.customElements.get("cb-book-now-button")
  ) {
    return true;
  }

  const existing = document.querySelector(
    `script[src="${scriptSrc}"]`
  ) as HTMLScriptElement | null;

  if (!existing && !cloudbedsLoadStarted) {
    cloudbedsLoadStarted = true;
    (globalThis as unknown as { __cbLoadStarted?: boolean }).__cbLoadStarted = true;

    const s = document.createElement("script");
    s.id = "cb-immersive-experience";
    s.src = scriptSrc;
    s.async = true;
    s.crossOrigin = "anonymous";
    // ⚠️ DOMINIO CAFAYATE
    s.setAttribute("data-domain", "villavicunacafayate.com.ar");

    cloudbedsScriptPromise = new Promise<void>((resolve, reject) => {
      s.onload = () => {
        // Doble verificación: esperar a que el Custom Element esté realmente registrado
        if ("customElements" in window) {
          window.customElements.whenDefined("cb-book-now-button").then(() => {
            resolve();
          }).catch(() => resolve()); // Fallback si falla el whenDefined
        } else {
          resolve();
        }
      };
      s.onerror = () => {
        cloudbedsLoadStarted = false; // Permitir reintento si falla
        (globalThis as unknown as { __cbLoadStarted?: boolean }).__cbLoadStarted = false;
        reject(new Error("cloudbeds script error"));
      };
    });

    (globalThis as unknown as { __cbScriptPromise?: Promise<void> }).__cbScriptPromise =
      cloudbedsScriptPromise;

    document.head.appendChild(s);
  }

  if (existing && !cloudbedsScriptPromise) {
    cloudbedsScriptPromise = new Promise<void>((resolve) => {
      if (
        "customElements" in window &&
        window.customElements.get("cb-book-now-button")
      ) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => resolve(), { once: true });
    });

    (globalThis as unknown as { __cbScriptPromise?: Promise<void> }).__cbScriptPromise =
      cloudbedsScriptPromise;
  }

  try {
    if (!cloudbedsScriptPromise) cloudbedsScriptPromise = Promise.resolve();
    await Promise.race([
      cloudbedsScriptPromise,
      new Promise((resolve) => setTimeout(resolve, ms)),
    ]);
  } catch {
    // ignoramos, se comprueba luego
  }

  if (
    "customElements" in window &&
    typeof window.customElements.whenDefined === "function"
  ) {
    try {
      await Promise.race([
        window.customElements.whenDefined("cb-book-now-button"),
        new Promise((resolve) => setTimeout(resolve, ms)),
      ]);
    } catch {
      // ignoramos
    }
  }

  return !!(
    "customElements" in window &&
    window.customElements.get("cb-book-now-button")
  );
}

/*──── helper: creación segura del Web Component ────*/
const createSafeWebComponent = (props: Record<string, unknown>) => {
  try {
    if (typeof window === "undefined") return null;
    if (!("customElements" in window)) return null;

    const ctor = window.customElements.get("cb-book-now-button");
    if (!ctor || typeof ctor !== "function") return null;

    return React.createElement("cb-book-now-button", props);
  } catch (error) {
    console.warn("Error creating Web Component:", error);
    return null;
  }
};

/*──────────────── COMPONENTE ────────────────*/
export default function CloudbedsBookNow({
  propertyCode,
  className,
  buttonClassName,
  label,
  fallbackText,
  width,
  height,
  lang = "auto",
  currency,
  disableCssTitleReset,
  hideCustomHeader,
  hideCustomFooter,
  hidePropertyInfo,
  ignoreSearchParams,
  mode = "popup",
  timeout = 5000,

  variant = "nav",
  contactButtonClassName,
  contactIconSrc = "/images/icons/ico-reservar.svg",
  contactIconSize = 64,
  contactAriaLabel = "Reservar ahora",
  contactLabel,
  roomsButtonClassName,
  roomsLabel,

  directUrlFallback,
  isGloballyReady,
  onLoaded,
  ...rest
}: CloudbedsBookNowProps) {
  const [isComponentReady, setIsComponentReady] = useState(false);

  // Carga proactiva al montar el primer componente
  useEffect(() => {
    const triggerLoad = () => {
      void ensureCloudbedsLoaded(timeout);
      window.removeEventListener("scroll", triggerLoad);
      window.removeEventListener("mousemove", triggerLoad);
      window.removeEventListener("touchstart", triggerLoad);
    };

    // Delay de 2s para no interferir con el LCP/FCP inicial
    const idleTimer = setTimeout(() => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => void ensureCloudbedsLoaded(timeout));
      } else {
        void ensureCloudbedsLoaded(timeout);
      }
    }, 2000);

    // O en la primera interacción (scroll, mousemove, touch)
    window.addEventListener("scroll", triggerLoad, { once: true, passive: true });
    window.addEventListener("mousemove", triggerLoad, { once: true, passive: true });
    window.addEventListener("touchstart", triggerLoad, { once: true, passive: true });

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("scroll", triggerLoad);
      window.removeEventListener("mousemove", triggerLoad);
      window.removeEventListener("touchstart", triggerLoad);
    };
  }, [timeout]);

  const fallbackUrl =
    directUrlFallback || `https://hotels.cloudbeds.com/${propertyCode}`;

  const effectiveLabel =
    typeof label !== "undefined"
      ? label
      : typeof roomsLabel !== "undefined"
      ? roomsLabel
      : fallbackText;

  const effectiveButtonClassName = buttonClassName || roomsButtonClassName;

  const wcAttrs = useMemo(() => {
    const attrs: Record<string, unknown> = {
      "property-code": propertyCode,
      ...(buttonClassName ? { "class-name": buttonClassName } : {}),
      ...(effectiveLabel !== undefined ? { label: effectiveLabel } : {}),
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
      ...(lang ? { lang } : {}),
      ...(currency ? { currency } : {}),
      ...(disableCssTitleReset
        ? { "disable-css-title-reset": disableCssTitleReset }
        : {}),
      ...(hideCustomHeader ? { "hide-custom-header": hideCustomHeader } : {}),
      ...(hideCustomFooter ? { "hide-custom-footer": hideCustomFooter } : {}),
      ...(hidePropertyInfo ? { "hide-property-info": hidePropertyInfo } : {}),
      ...(ignoreSearchParams
        ? { "ignore-search-params": ignoreSearchParams }
        : {}),
      ...(mode ? { mode } : {}),
      ...(typeof timeout === "number" ? { timeout } : {}),
    };
    return attrs;
  }, [
    propertyCode,
    buttonClassName,
    effectiveLabel,
    width,
    height,
    lang,
    currency,
    disableCssTitleReset,
    hideCustomHeader,
    hideCustomFooter,
    hidePropertyInfo,
    ignoreSearchParams,
    mode,
    timeout,
  ]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (typeof window === "undefined") return;

      void ensureCloudbedsLoaded(timeout);

      if (!("customElements" in window)) return;

      const already =
        window.customElements.get("cb-book-now-button") !== undefined;

      if (already) {
        if (!cancelled) {
          setIsComponentReady(true);
          onLoaded?.();
        }
        return;
      }

      const hasWhenDefined =
        typeof window.customElements.whenDefined === "function";
      if (!hasWhenDefined) return;

      try {
        await window.customElements.whenDefined("cb-book-now-button");
        if (!cancelled) {
          const registered =
            window.customElements.get("cb-book-now-button") !== undefined;
          if (registered) {
            setIsComponentReady(true);
            onLoaded?.();
          }
        }
      } catch (error) {
        console.warn("Error waiting for Cloudbeds component:", error);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [onLoaded, timeout]);

  const readyFlag = isComponentReady || !!isGloballyReady;

  /*──────────────── NAV ────────────────*/
  if (variant === "nav") {
    try {
      // Intentar forzar carga al montar el componente si no está listo
      useEffect(() => {
        if (!isComponentReady) {
          void ensureCloudbedsLoaded(timeout);
        }
      }, [isComponentReady, timeout]);

      const componentRegistered =
        typeof window !== "undefined" &&
        "customElements" in window &&
        window.customElements.get("cb-book-now-button") !== undefined;

      if (componentRegistered || readyFlag) {
        const wc = createSafeWebComponent({
          ...wcAttrs,
          class: className,
          ...rest,
        });
        if (wc) return wc;
      }

      return (
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${effectiveButtonClassName || ""} ${className || ""}`}
          onPointerEnter={() => {
            void ensureCloudbedsLoaded(timeout);
          }}
          onFocus={() => {
            void ensureCloudbedsLoaded(timeout);
          }}
          {...rest}
        >
          {effectiveLabel}
        </a>
      );
    } catch (error) {
      console.warn("Error in nav variant:", error);
      return (
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${effectiveButtonClassName || ""} ${className || ""}`}
          {...rest}
        >
          {effectiveLabel}
        </a>
      );
    }
  }

  /*──────────────── CONTACT ────────────────*/
  if (variant === "contact") {
    const isReady = () => {
      try {
        const scriptLoaded =
          typeof document !== "undefined" &&
          document.querySelector('script[src*="cloudbeds"]') !== null;
        const componentRegistered =
          typeof window !== "undefined" &&
          "customElements" in window &&
          window.customElements.get("cb-book-now-button") !== undefined;
        return (scriptLoaded && componentRegistered) || readyFlag;
      } catch (error) {
        console.warn("Error in isReady check:", error);
        return false;
      }
    };

    const minSide = Math.max(44, (contactIconSize ?? 64) + 16);

    const wcNoLabel: Record<string, unknown> = { ...wcAttrs };
    delete wcNoLabel["label"];

    return (
      <div
        className={`relative inline-flex w-full justify-center items-center ${
          className || ""
        }`}
        onClickCapture={(e) => {
          if (!isReady()) {
            void ensureCloudbedsLoaded(timeout).then((ok) => {
              if (!ok) {
                e.preventDefault();
                e.stopPropagation();
                window.open(fallbackUrl, "_blank", "noopener,noreferrer");
              }
            });
          }
        }}
        onPointerEnter={() => {
          void ensureCloudbedsLoaded(timeout);
        }}
        onTouchStart={() => {
          void ensureCloudbedsLoaded(timeout);
        }}
        onFocus={() => {
          void ensureCloudbedsLoaded(timeout);
        }}
        {...rest}
      >
        <div className="relative">
          <button
            type="button"
            aria-label={contactAriaLabel}
            className={contactButtonClassName}
            style={{
              minWidth: contactIconSrc ? `${minSide}px` : undefined,
              minHeight: contactIconSrc ? `${minSide}px` : undefined,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {contactIconSrc ? (
              <Image
                src={contactIconSrc}
                alt=""
                width={contactIconSize}
                height={contactIconSize}
              />
            ) : null}
            {typeof contactLabel === "string" ? (
              <span className={contactIconSrc ? "ml-2" : undefined}>
                {contactLabel}
              </span>
            ) : null}
          </button>

          <div className="absolute inset-0 z-10">
            {(() => {
              const wc = createSafeWebComponent({
                ...wcNoLabel,
                "aria-hidden": "true",
                tabIndex: -1,
                className: "cb-overlay-invisible",
                style: {
                  opacity: 0.001,
                  pointerEvents: "auto",
                  touchAction: "manipulation",
                  background: "transparent",
                  color: "transparent",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0",
                  left: "0",
                  margin: "0",
                  padding: "0",
                  border: "none",
                  outline: "none",
                  display: "block",
                  zIndex: "10",
                },
              });

              return (
                wc || (
                  <div
                    className="cb-overlay-invisible"
                    style={{
                      opacity: 0,
                      pointerEvents: "none",
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                )
              );
            })()}
          </div>
        </div>
      </div>
    );
  }

  /*──────────────── ROOMS ────────────────*/
  if (variant === "rooms") {
    const ready = () => {
      try {
        const scriptLoaded =
          typeof document !== "undefined" &&
          document.querySelector('script[src*="cloudbeds"]') !== null;
        const componentRegistered =
          typeof window !== "undefined" &&
          "customElements" in window &&
          window.customElements.get("cb-book-now-button") !== undefined;
        return (scriptLoaded && componentRegistered) || readyFlag;
      } catch {
        return false;
      }
    };

    const visibleLabel =
      typeof roomsLabel === "string"
        ? roomsLabel
        : typeof label === "string"
        ? label
        : "Reservar";

    const btnClass = roomsButtonClassName || buttonClassName || "";

    const wcNoLabel: Record<string, unknown> = { ...wcAttrs };
    delete wcNoLabel["label"];

    return (
      <div
        className={`relative inline-flex ${className || ""}`}
        onClickCapture={(e) => {
          if (!ready()) {
            void ensureCloudbedsLoaded(timeout).then((ok) => {
              if (!ok) {
                e.preventDefault();
                e.stopPropagation();
                window.open(fallbackUrl, "_blank", "noopener,noreferrer");
              }
            });
          }
        }}
        onPointerEnter={() => {
          void ensureCloudbedsLoaded(timeout);
        }}
        onTouchStart={() => {
          void ensureCloudbedsLoaded(timeout);
        }}
        onFocus={() => {
          void ensureCloudbedsLoaded(timeout);
        }}
        {...rest}
      >
        <button
          type="button"
          aria-label={visibleLabel}
          className={btnClass}
        >
          {visibleLabel}
        </button>

        <div className="absolute inset-0 z-10">
          {(() => {
            const wc = createSafeWebComponent({
              ...wcNoLabel,
              "aria-hidden": "true",
              tabIndex: -1,
              className: "cb-overlay-invisible",
              style: {
                opacity: 0.001,
                pointerEvents: "auto",
                touchAction: "manipulation",
                background: "transparent",
                color: "transparent",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: "0",
                left: "0",
                margin: "0",
                padding: "0",
                border: "none",
                outline: "none",
                display: "block",
                zIndex: "10",
              },
            });

            return (
              wc || (
                <div
                  className="cb-overlay-invisible"
                  style={{
                    opacity: 0,
                    pointerEvents: "none",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              )
            );
          })()}
        </div>
      </div>
    );
  }

  // Fallback genérico si llega un variant raro
  return (
    <a
      href={fallbackUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${effectiveButtonClassName || ""} ${className || ""}`}
      {...rest}
    >
      {effectiveLabel}
    </a>
  );
}
