# Placeholders de assets

Estos archivos **no están incluidos** para evitar binarios en el repositorio. Súbelos a `public/` antes de desplegar:

- `background-castle.jpg`: Fondo principal (1920x1080+ recomendado). Puede ser JPG o PNG.
- `background-castle-vertical.jpg`: Fondo vertical para móviles (1080x1920+ recomendado).
- `confetti.png`: Textura transparente de confeti/destellos.
- `ambient-magic.mp3`: Pista de música ambiental en loop.
- `icons/icon-192.png` y `icons/icon-512.png`: Íconos cuadrados para PWA (PNG). Genera variantes 192px y 512px.

Después de agregar tus archivos, vuelve a construir la app (`npm run build`) para asegurarte de que las rutas funcionan.

El directorio `public/icons/` se mantiene solo con un README para recordar los tamaños requeridos.
