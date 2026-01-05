# Disney Countdown

Una experiencia mágica en React + TypeScript que cuenta hacia el **25 de febrero de 2026 a las 09:30** (zona horaria configurable, por defecto Europe/Paris). Incluye tema Disney, PWA, animaciones, selector de idioma y opción de música ambiental (accesibles desde el botón de **Ajustes**).

## Configuración

```bash
npm install
npm run dev
```

### Scripts
- `npm run dev`: servidor de desarrollo Vite.
- `npm run build`: compila TypeScript y genera artefactos de producción.
- `npm run preview`: sirve la build generada.
- `npm run lint`: analiza el código con ESLint + Prettier.
- `npm run format`: formatea archivos con Prettier.
- `npm run test`: ejecuta pruebas con Vitest + Testing Library.

## PWA y despliegue
- `public/manifest.json` define nombre, colores e íconos (placeholders en `public/icons/`).
- `public/service-worker.js` añade cache runtime para modo offline/instalable.
- Meta tags para iOS/Android están en `index.html` (theme-color, apple-touch-icon, etc.).
- Para un hosting estático (Netlify, Vercel, GitHub Pages):
  1. Ejecuta `npm run build`.
  2. Sube el contenido de `dist/`.

## Activos que debes agregar tú
El repositorio no incluye binarios de medios (para evitar subir JPG/PNG/MP3). Añádelos manualmente:
- `public/background-castle.jpg`: fondo principal (recomendado 1920x1080 o superior). Puedes usar JPG o PNG.
- `public/confetti.png`: textura de brillo/confeti transparente.
- `public/ambient-magic.mp3`: pista de música ambiental opcional (loop).
- `public/icons/icon-192.png`, `public/icons/icon-512.png`: íconos PWA en PNG cuadrados.

Consulta `public/ASSETS_PLACEHOLDER.md` para un resumen rápido de qué subir.

## Funcionalidades clave
- **Cuenta regresiva animada** con Framer Motion y tema Disney.
- **Zona horaria configurable** (selector con opciones comunes, dentro de Ajustes).
- **Selector de idioma**: Español, Inglés y Francés (dentro de Ajustes).
- **CTA de compartir** usando Web Share API (o copia al portapapeles como fallback) y botón para **descargar en el móvil** (prompt de instalación PWA o indicación de añadir a inicio).
- **Música ambiental** con toggle accesible (dentro de Ajustes).
- **PWA**: manifest, service worker y meta tags para instalación.
- **Notificaciones locales**: solicita permiso al cargar y avisa en hitos de 30 días, 1 día y 1 hora.
- **Accesibilidad**: etiquetas ARIA, contraste alto, navegación con teclado y enlaces de salto al contenido.

## Notificaciones
- El permiso se solicita al cargar la app; el estado se muestra en el chip "Notificaciones".
- Si el permiso está otorgado, se programan recordatorios locales cuando falten 30 días, 1 día y 1 hora (según la zona horaria seleccionada).
- Para probar rápido, cambia temporalmente la fecha objetivo en `src/utils/time.ts` o manipula el reloj del sistema.

## Pruebas
- Lógica de la cuenta regresiva: `src/utils/time.test.ts`.
- Render del componente: `src/components/Countdown.test.tsx`.

## Despliegue estático
1. `npm run build`.
2. Publica la carpeta `dist/` en tu hosting estático.
3. Asegura que `service-worker.js`, `manifest.json` y la carpeta `icons/` estén accesibles desde la raíz del sitio.

## Desarrollo de estilos
- Variables de tema y fondo en `src/styles/theme.css`.
- Los assets se leen desde `public/`, por lo que basta con reemplazarlos sin recompilar.

## Configuración de ESLint/Prettier
- ESLint usa la config plana con TypeScript, React, hooks, JSX a11y y `eslint-config-prettier`.
- Prettier configura comillas simples, `printWidth` 90 y `trailingComma` en objetos/arrays.

## Internacionalización y zona horaria
- Traducciones en `src/i18n.ts`.
- Selección de zona horaria en `src/data/timezones.ts`; agrega más zonas según necesidad.

## Música y accesibilidad
- El botón de música controla `public/ambient-magic.mp3`; si el archivo no existe, la app desactiva el toggle al fallar la reproducción.
- Incluye enlace "Saltar al contador" y aria-labels en inputs, botones y tarjetas.
