export const reseñas = [
  {
    id: 1,
    nombreKey: "desayuno.nombre",
    textoKey: "desayuno.texto",
    // Imagen principal
    imagen: "el-desayuno.webp",
    // Carpeta donde se encuentran las imágenes para esta reseña
    folder: "reseñas-desayuno",
    // Array de imágenes para el carrusel (sin incluir la carpeta)
    carrusel: [
      "desayuno-1.webp",
      "desayuno-2.webp",
      "desayuno-3.webp",
    ],
  },
  {
    id: 2,
    nombreKey: "detalles.nombre",
    textoKey: "detalles.texto",
    imagen: "los-detalles.webp",
    folder: "reseñas-detalles",
    carrusel: [
      "detalles-1.webp",
      "detalles-2.webp",
      "detalles-3.webp",
    ],
  },
  {
    id: 3,
    nombreKey: "personal.nombre",
    textoKey: "personal.texto",
    imagen: "el-personal.webp",
    folder: "reseñas-personal",
    carrusel: [
      "personal-1.webp",
      "personal-2.webp",
      "personal-3.webp",
      "personal-4.webp",
    ],
  },
];

export const reseñasDetalles = {
  1: [
    { comentarioKey: "desayuno.reseñas.0", autor: "Inés y Peter", pais: "EE.UU." },
    { comentarioKey: "desayuno.reseñas.1", autor: "Federica y Daniel", pais: "Francia" },
    { comentarioKey: "desayuno.reseñas.2", autor: "Isabella", pais: "Brasil" },
  ],
  2: [
    { comentarioKey: "detalles.reseñas.0", autor: "Francesco y Andrea", pais: "Italia" },
    { comentarioKey: "detalles.reseñas.1", autor: "Familia Fonzi", pais: "Argentina" },
    { comentarioKey: "detalles.reseñas.2", autor: "Ale, Maru y Conie", pais: "Argentina" },
  ],
  3: [
    { comentarioKey: "personal.reseñas.0", autor: "Helena", pais: "Argentina" },
    { comentarioKey: "personal.reseñas.1", autor: "Familia Rocha", pais: "Brasil" },
    { comentarioKey: "personal.reseñas.2", autor: "Emma y Lorenzo", pais: "Italia" },
  ],
};
