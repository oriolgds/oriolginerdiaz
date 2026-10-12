---
title: "RadarCAT"
description: "La aplicación meteorológica más avanzada de Catalunya: radar XRAD en tiempo real, 27 fotogramas HD, satélite EUMETSAT MTG y capas vectoriales ICGC."
pubDate: 2026-03-20
image: "/images/projects/radarcat.png"
tags: ["React", "TypeScript", "Tailwind CSS", "Meteorología", "GIS", "Open Data", "Meteocat"]
url: "https://radarcat.pages.dev/"
github: "https://github.com/oriolgds/radarcat"
playStore: "https://play.google.com/store/apps/details?id=cat.radarcat.app"
instagram: "https://www.instagram.com/radarcat_ai/?hl=es"
x: "https://x.com/radarcat_AI"
featured: true
---

# RadarCAT

**RadarCAT** es la aplicación meteorológica de vanguardia diseñada para Catalunya, ofreciendo una experiencia en tiempo real, interactiva y de máxima fidelidad con datos abiertos de fuentes oficiales.

Permite observar la evolución de las precipitaciones fotograma a fotograma con una resolución sin precedentes, integrando la red de radares de **Meteocat**, el satélite de nueva generación **EUMETSAT MTG** y la cartografía vectorial del **ICGC**.

---

## Características principales

- **27 fotogramas HD consecutivos**: Animación fluida de alta resolución (0.5 km/px) que permite seguir con precisión la trayectoria e intensidad de las tormentas.
- **Scrubbing temporal interactivo**: Control total mediante línea temporal para avanzar, retroceder e inspeccionar cada instante de la precipitación.
- **Satélite EUMETSAT MTG con filtro «Només Núvols»**: Comparador espectral dinámico con 16 canales FCI que aísla las estructuras convectivas eliminando el relieve terrestre y el mar.
- **Clasificación de hidrometeoros con polarización dual**: Algoritmos capaces de diferenciar lluvia líquida, cota dinámica de nieve y núcleos convectivos severos con riesgo de granizo/pedrisco (>2 cm).
- **Lluvia acumulada comarcal en 1 toque**: Integración matemática en tiempo real para consultar los litros por metro cuadrado ($l/m^2$) acumulados e intensidad en cualquiera de las comarcas catalanas.
- **Capas vectoriales oficiales del ICGC**: Delimitaciones comarcales, municipales, toponimia nítida a cualquier nivel de zoom y relieve orográfico 3D.
- **Privacidad y soberanía de datos**: Sin registro, sin publicidad y con procesamiento de geolocalización 100% en el dispositivo (Open Data directo de Meteocat, ICGC y EUMETSAT).

---

## Tecnologías utilizadas

- **Frontend & Visualización**: React, TypeScript, Tailwind CSS y componentes vectoriales interactivos.
- **Optimización y Rendimiento**: Renderizado acelerado por hardware para scrubbing y reproducción ultrafluida de fotogramas.
- **Fuentes de datos meteorológicos**:
  - **Servei Meteorològic de Catalunya (Meteocat)**: Red de 4 radares duales XRAD (Vallirana, La Panadella, Puig d'Arques y Puig Bernat).
  - **Agencia Europea EUMETSAT**: Satélite Meteosat Third Generation (MTG).
  - **ICGC**: Base cartográfica vectorial y toponimia oficial 1:5.000.
- **Multiplataforma**: Web App (Cloudflare Pages), Android (Google Play Store) y próxima versión para iOS.
