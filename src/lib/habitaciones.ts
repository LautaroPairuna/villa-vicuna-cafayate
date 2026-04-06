// lib/habitaciones.ts
"use client";

// ---------- tipos ----------
export interface Amenity {
  nombre: string;
  icono: string;
}

export interface SubHabitacion {
  /** sufijo identificador: "11", "12", "101", etc.  */
  slug: string;
  /** clave de traducción individual: ej. "antesala11" */
  key: string;
  /** carpeta donde están sus fotos */ 
  folder: string;
  carrusel: string[];
  amenities: Amenity[];
}

export interface Habitacion {
  id: number;
  cantidad: string;
  categoria: string;   // standard | superior | departamento…
  key: string;         // clave base (para la tarjeta)
  imagen: string;      // thumb mostrado en el grid
  folder: string;      // carpeta “genérica” (opcional si hay variantes)
  carrusel: string[];
  amenities: Amenity[];
  /** variantes opcionales que comparten la misma card */
  variantes?: SubHabitacion[];
}

// ---------- datos ----------
export function Habitaciones(): Habitacion[] {
  return [
    {
      id: 1,
      categoria: "standard",
      cantidad: "2",
      key: "matrimonial",
      imagen: "standard-matrimonial.webp",
      folder: "habitaciones-matrimonial",
      carrusel: ["matrimonial-1.webp", "matrimonial-2.webp", "matrimonial-3.webp"],
      amenities: [
        { nombre: "wifi", icono: "ico-wifi.svg" },
        { nombre: "shampoo", icono: "ico-shampoo.svg" },
        { nombre: "caja-fuerte", icono: "ico-caja-fuerte.svg" },
        { nombre: "banera", icono: "ico-banera.svg" },
        { nombre: "smart-tv", icono: "ico-smart-tv.svg" },
        { nombre: "aire", icono: "ico-aire.svg" },
        { nombre: "tetera", icono: "ico-tetera.svg" },
        { nombre: "minibar", icono: "ico-minibar.svg" },
      ],
    },
    {
      id: 2,
      categoria: "standard",
      cantidad: "4",
      key: "twin",
      imagen: "standard-thin.webp",
      folder: "habitaciones-thin",
      carrusel: ["thin-1.webp", "thin-2.webp", "thin-3.webp"],
      amenities: [
        { nombre: "wifi", icono: "ico-wifi.svg" },
        { nombre: "aire", icono: "ico-aire.svg" },
        { nombre: "shampoo", icono: "ico-shampoo.svg" },
        { nombre: "caja-fuerte", icono: "ico-caja-fuerte.svg" },
        { nombre: "smart-tv", icono: "ico-smart-tv.svg" },
        { nombre: "minibar", icono: "ico-minibar.svg" },
        { nombre: "ducha", icono: "ico-ducha.svg" },
        { nombre: "tetera", icono: "ico-tetera.svg" },
      ],
    },
    {
      id: 3,
      categoria: "standard",
      cantidad: "2",
      key: "triple",
      imagen: "standard-mat-triple.webp",
      folder: "habitaciones-triple",
      carrusel: ["triple-1.webp", "triple-2.webp", "triple-3.webp"],
      amenities: [
        { nombre: "wifi", icono: "ico-wifi.svg" },
        { nombre: "aire", icono: "ico-aire.svg" },
        { nombre: "shampoo", icono: "ico-shampoo.svg" },
        { nombre: "caja-fuerte", icono: "ico-caja-fuerte.svg" },
        { nombre: "smart-tv", icono: "ico-smart-tv.svg" },
        { nombre: "minibar", icono: "ico-minibar.svg" },
        { nombre: "banera", icono: "ico-banera.svg" },
        { nombre: "tetera", icono: "ico-tetera.svg" },
      ],
    },
    {
      id: 4,
      categoria: "superior",
      cantidad: "2",
      key: "antesala",                     // SEGUIRÁ SIENDO EL TEXTO DE LA CARD
      imagen: "superior-antesala.webp",
      folder: "habitaciones-antesala",     // thumb genérico (opcional)
      carrusel: [],                        // puede dejarse vacío
      amenities: [],                       // idem
      variantes: [
        {
          slug: "11",
          key: "antesala11",
          folder: "antesala-11",
          carrusel: ["11-1.webp", "11-2.webp", "11-3.webp", "11-4.webp"],
          amenities: [
            { nombre: "wifi", icono: "ico-wifi.svg" },
            { nombre: "aire", icono: "ico-aire.svg" },
            { nombre: "smart-tv", icono: "ico-smart-tv.svg" },
            { nombre: "shampoo", icono: "ico-shampoo.svg" },
            { nombre: "caja-fuerte", icono: "ico-caja-fuerte.svg" },
            { nombre: "minibar", icono: "ico-minibar.svg" },
            { nombre: "bata", icono: "ico-bata.svg" },
            { nombre: "banera", icono: "ico-banera.svg" },
            { nombre: "tetera", icono: "ico-tetera.svg" },
          ],
        },
        {
          slug: "12",
          key: "antesala12",
          folder: "antesala-12",
          carrusel: ["12-1.webp", "12-2.webp", "12-3.webp", "12-4.webp"],
          amenities: [
            { nombre: "wifi", icono: "ico-wifi.svg" },
            { nombre: "aire", icono: "ico-aire.svg" },
            { nombre: "smart-tv", icono: "ico-smart-tv.svg" },
            { nombre: "shampoo", icono: "ico-shampoo.svg" },
            { nombre: "caja-fuerte", icono: "ico-caja-fuerte.svg" },
            { nombre: "minibar", icono: "ico-minibar.svg" },
            { nombre: "bata", icono: "ico-bata.svg" },
            { nombre: "banera", icono: "ico-banera.svg" },
            { nombre: "tetera", icono: "ico-tetera.svg" },
          ],
        },
      ],
    },
    {
      id: 5,
      categoria: "superior",
      cantidad: "1",
      key: "balcon",
      imagen: "superior-balcon.webp",
      folder: "habitaciones-balcon",
      carrusel: ["balcon-1.webp", "balcon-2.webp", "balcon-3.webp", "balcon-4.webp"],
      amenities: [
        { nombre: "wifi", icono: "ico-wifi.svg" },
        { nombre: "aire", icono: "ico-aire.svg" },
        { nombre: "smart-tv", icono: "ico-smart-tv.svg" },
        { nombre: "shampoo", icono: "ico-shampoo.svg" },
        { nombre: "caja-fuerte", icono: "ico-caja-fuerte.svg" },
        { nombre: "minibar", icono: "ico-minibar.svg" },
        { nombre: "bata", icono: "ico-bata.svg" },
        { nombre: "ducha", icono: "ico-ducha.svg" },
        { nombre: "tetera", icono: "ico-tetera.svg" },
      ],
    },
    {
      id: 6,
      categoria: "departamento",
      cantidad: "1",
      key: "familiar",
      imagen: "departamento.webp",
      folder: "habitaciones-departamento",
      carrusel: ["departamento-1.webp", "departamento-2.webp", "departamento-3.webp", "departamento-4.webp"],
      amenities: [
        { nombre: "wifi", icono: "ico-wifi.svg" },
        { nombre: "aire", icono: "ico-aire.svg" },
        { nombre: "smart-tv", icono: "ico-smart-tv.svg" },
        { nombre: "shampoo", icono: "ico-shampoo.svg" },
        { nombre: "caja-fuerte", icono: "ico-caja-fuerte.svg" },
        { nombre: "minibar", icono: "ico-minibar.svg" },
        { nombre: "ducha", icono: "ico-ducha.svg" },
        { nombre: "tetera", icono: "ico-tetera.svg" },
      ],
    },
  ];
}
