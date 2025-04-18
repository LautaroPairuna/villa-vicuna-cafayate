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
      key: "matrimonial",
      imagen: "standard-matrimonial.jpg",
      folder: "habitaciones-matrimonial",
      carrusel: ["matrimonial-1.jpg", "matrimonial-2.jpg", "matrimonial-3.jpg"],
      amenities: [
        { nombre: "wifi", icono: "ico-wifi.svg" },
        { nombre: "shampoo", icono: "ico-shampoo.svg" },
        { nombre: "caja-fuerte", icono: "ico-caja-fuerte.svg" },
        { nombre: "ducha", icono: "ico-ducha.svg" },
        { nombre: "aire", icono: "ico-aire.svg" },
        { nombre: "tetera", icono: "ico-tetera.svg" },
        { nombre: "minibar", icono: "ico-minibar.svg" },
      ],
    },
    {
      id: 2,
      categoria: "standard",
      key: "twin",
      imagen: "standard-thin.jpg",
      folder: "habitaciones-thin",
      carrusel: ["thin-1.png", "thin-2.jpeg", "thin-3.jpeg", "thin-4.jpeg"],
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
      key: "triple",
      imagen: "standard-mat-triple.jpg",
      folder: "habitaciones-triple",
      carrusel: ["triple-1.png", "triple-2.png", "triple-3.png"],
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
      id: 4,
      categoria: "superior",
      key: "antesala",                     // SEGUIRÁ SIENDO EL TEXTO DE LA CARD
      imagen: "superior-antesala.jpg",
      folder: "habitaciones-antesala",     // thumb genérico (opcional)
      carrusel: [],                        // puede dejarse vacío
      amenities: [],                       // idem
      variantes: [
        {
          slug: "11",
          key: "antesala11",
          folder: "antesala-11",
          carrusel: ["11-1.jpg", "11-2.jpg", "11-3.jpg"],
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
          slug: "12",
          key: "antesala12",
          folder: "antesala-12",
          carrusel: ["12-1.jpg", "12-2.jpg", "12-3.jpg"],
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
      ],
    },
    {
      id: 5,
      categoria: "superior",
      key: "balcon",
      imagen: "superior-balcon.jpg",
      folder: "habitaciones-balcon",
      carrusel: ["balcon-1.png", "balcon-2.jpeg", "balcon-3.jpeg"],
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
      key: "familiar",
      imagen: "departamento.jpg",
      folder: "habitaciones-departamento",
      carrusel: ["departamento-1.png", "departamento-2.png", "departamento-3.png"],
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
  ];
}
