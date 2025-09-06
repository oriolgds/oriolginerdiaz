---
title: "DocAI"
description: "Aplicación móvil de médico personal con IA para consultas de salud rápidas y seguras"
pubDate: 2025-09-06
image: "/images/projects/docai.png"
tags: ["Flutter", "Android", "iOS", "Supabase", "OpenAI", "ChatGPT", "Salud"]
github: "https://github.com/oriolgds/docai"
playStore: "https://play.google.com/apps/testing/com.oriolgds.doky"
url: "https://docai.is-best.net/"
featured: true
---

# DocAI

Aplicación de asistencia médica impulsada por IA que ofrece chat inteligente, historial de conversaciones y presets de salud, con backend en Supabase e integración con OpenAI.

## Características

- Interfaz de chat médico con IA (wrapper de ChatGPT) para consultas sobre síntomas, tratamientos y orientación básica.  
- Presets predefinidos (Medicamentos y Medicina Natural) para acelerar consultas con información de dosis, efectos secundarios e interacciones.  
- Historial de chats con opciones de consulta y gestión para recuperar conversaciones anteriores.  
- Perfil y suscripciones con planes gratuito/premium, límites de consultas y preferencias personales.  
- Autenticación por email y gestión de sesiones con Supabase, más pantalla de login minimalista.  
- UI minimalista en blanco y negro con enfoque moderno y limpio para mejor legibilidad.  
- Multilenguaje (ES/EN) y accesibilidad con compatibilidad para lectores de pantalla y alto contraste.  
- Soporte offline para historial local y sincronización al reconectar.  
- Privacidad y seguridad con cifrado y aviso claro de que no sustituye a un médico; alineado con GDPR/HIPAA.

## Tecnologías utilizadas

- Flutter para desarrollo multiplataforma (iOS y Android).  
- Supabase para autenticación, base de datos y sincronización en tiempo real.  
- OpenAI API mediante wrapper para respuestas contextuales en el chat.  
- Manejo de estado con Provider/Riverpod y almacenamiento local con SharedPreferences.  
- HTTP/Dio para llamadas a API y arquitectura tipo MVC adaptada a Flutter.
