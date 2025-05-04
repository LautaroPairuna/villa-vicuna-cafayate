export const reseñas = [
  {
    id: 1,
    nombreKey: "desayuno.nombre",
    textoKey: "desayuno.texto",
    // Imagen principal
    imagen: "el-desayuno.jpg",
    // Carpeta donde se encuentran las imágenes para esta reseña
    folder: "reseñas-desayuno",
    // Array de imágenes para el carrusel (sin incluir la carpeta)
    carrusel: [
      "desayuno-1.jpg",
      "desayuno-2.jpg",
      "desayuno-3.jpg",
    ],
  },
  {
    id: 2,
    nombreKey: "detalles.nombre",
    textoKey: "detalles.texto",
    imagen: "los-detalles.jpg",
    folder: "reseñas-detalles",
    carrusel: [
      "detalles-1.jpg",
      "detalles-2.jpg",
      "detalles-3.jpg",
    ],
  },
  {
    id: 3,
    nombreKey: "personal.nombre",
    textoKey: "personal.texto",
    imagen: "el-personal.jpg",
    folder: "reseñas-personal",
    carrusel: [
      "personal-1.jpg",
      "personal-2.jpg",
      "personal-3.jpg",
      "personal-4.jpg",
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
