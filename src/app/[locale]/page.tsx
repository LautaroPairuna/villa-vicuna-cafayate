// src/app/[locale]/page.tsx
import { setRequestLocale } from "next-intl/server";
import PageWithLoading from "@/components/PageWithLoading";

/* Viewport sin cambios */
export const viewport = { width: "device-width", initialScale: 1 };


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

