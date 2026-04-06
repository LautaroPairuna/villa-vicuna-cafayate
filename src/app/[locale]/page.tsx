// src/app/[locale]/page.tsx
import { setRequestLocale } from "next-intl/server";
import PageWithLoading from "@/components/PageWithLoading";

/* Viewport sin cambios */
export const viewport = { width: "device-width", initialScale: 1 };

/* Metadata global mejorada (solo actualiza canonical) */
export const metadata = {
  title: "Villa Vicuña | Cafayate, Argentina",
  description:
    "El Hotel Villa Vicuña de Cafayate se encuentra a 50 metros de la plaza principal y cuenta con 12 habitaciones decoradas con un elegante estilo español.",
  alternates: {
    canonical: "https://www.villavicunacafayate.com.ar",
  },
};

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PageWithLoading />;
}

/* Static params (sin cambios) */
export function generateStaticParams() {
  return [
    { locale: "es" },
    { locale: "en" },
    { locale: "pt" },
  ];
}

