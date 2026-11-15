# Potion Sort 🧪✨

Juego de rompecabezas estilo *Water Sort Puzzle* con temática de pociones mágicas, optimizado como juego móvil responsive, con sistema de modales interactivos y sin dependencias externas.

---

## 🌟 Características

- **Diseño tipo juego móvil:** Interfaz vertical a pantalla completa (`100dvh`), sin barras de desplazamiento, con soporte para áreas seguras (`viewport-fit=cover`) y optimizada para gestos táctiles.
- **Sistema de Modales:**
  - **Modal de Pausa / Ajustes:** Acceso desde el icono de ajustes (⚙️) en la cabecera para reiniciar el nivel o continuar.
  - **Modal de Victoria:** Pantalla de nivel completado con trofeo 🏆, estrellas animadas ⭐⭐⭐, registro de movimientos y opción para avanzar al siguiente nivel o reintentar.
- **Efectos y animaciones fluidas:**
  - Animación de elevación al seleccionar un tubo.
  - Simulación física de vertido (*pour*) con curvatura y desplazamiento entre tubos.
  - Chorro de líquido en tiempo real (*stream*) y efecto de oleaje (*slosh*).
  - Danza de celebración de los tubos (*cheer*) al ganar.
- **3 Niveles Progresivos:** Desafíos de clasificación con dificultad creciente.
- **100% Autónomo y Offline:** Sin dependencias externas ni librerías pesadas.
- **Compatible con Sekai:** Incluye versión empaquetada autocontenida (`sekai_bundle.html`) lista para ser ejecutada en la plataforma Sekai.

---

## 🕹️ Cómo Jugar

1. Toca un tubo para levantarlo y seleccionar la poción superior.
2. Toca otro tubo para verterla (puedes verter sobre el mismo color o en un tubo vacío).
3. Ordena todas las pociones para que cada tubo contenga un único color.
4. Completa los 3 niveles con el menor número de movimientos posible.

---

## 📁 Estructura del Proyecto

- `index.html`: Estructura semántica del juego, tablero de tubos y modales.
- `style.css`: Estilos visuales optimizados, diseño responsive y keyframes de animación.
- `script.js`: Motor de lógica del juego, control de turnos, animaciones y niveles.
- `sekai_bundle.html`: Versión standalone autocontenida (HTML + CSS + JS inlined) para Sekai.
