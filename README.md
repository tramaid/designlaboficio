# LAB/OFICIO

Plataforma personal de aprendizaje, experimentación y herramientas para diseño gráfico y dirección de arte. No busca enseñar teoría suelta ni generar diseños automáticos: busca entrenar el ojo y el criterio, con herramientas que además producen archivos útiles para trabajos reales.

Es un sitio estático: HTML, CSS y JavaScript sin dependencias, sin compilación y sin servidor propio. Todo lo que hace la persona (apuntes, avances, composiciones, paletas, evaluaciones) se guarda en su navegador.

## Qué incluye (V5)

- **Curso**: 6 módulos (gráfico, interfaz, editorial, identidad, movimiento y After Effects), 69 láminas interactivas con un cuaderno por lámina y 30 preguntas de repaso.
- **Taller de composición**: 4 encargos editables con versiones A y B, guías y exportación SVG, PNG y JSON.
- **10 herramientas**: retículas, color, escalas tipográficas, combinaciones tipográficas, composición, jerarquía visual, sistemas visuales, encuadre fotográfico, pruebas de logotipos y archivo de referencias.
- **Recorridos**: 6 competencias con 5 estaciones cada una (entender, experimentar, practicar, evaluar y aplicar) que conectan las láminas, el taller y las herramientas en un mismo proceso, con avance basado en evidencia y una bitácora descargable.

El detalle de la arquitectura, las reglas de cada estación y la hoja de ruta están en [SPEC.md](SPEC.md).

## Usarlo

**En línea**: una vez publicado en GitHub Pages, se abre en `https://<usuario>.github.io/<repositorio>/`.

**En la computadora, sin internet**: descargá el repositorio y, en Windows, hacé doble clic en `INICIAR-LAB-OFICIO.bat`. En macOS o Linux, ejecutá `node servidor.js` o `npm start` y abrí `http://127.0.0.1:8765`. También se puede abrir `index.html` directamente, pero algunos navegadores no comparten el guardado entre páginas abiertas como archivo.

## Publicar en GitHub Pages

1. Creá un repositorio en GitHub y subí este contenido a la rama `main`.
2. En el repositorio, entrá a **Settings → Pages** y en **Source** elegí **GitHub Actions**.
3. Cada `push` a `main` corre las pruebas y, si pasan, publica el sitio. El flujo está en `.github/workflows/pages.yml` y también se puede lanzar a mano desde la pestaña **Actions**.

Si preferís no usar Actions, en **Source** podés elegir **Deploy from a branch**, rama `main`, carpeta `/ (root)`. Funciona igual porque el sitio no necesita compilación, pero se publica sin correr las pruebas.

GitHub Pages es gratuito en repositorios públicos. En repositorios privados requiere un plan pago.

### Sobre el guardado al publicar

El sitio publicado es público, pero los datos no viajan a ningún lado: cada persona que lo abra tiene su propio progreso en su propio navegador. Hay dos detalles a tener en cuenta:

- En `github.io`, el guardado del navegador se comparte entre todos los sitios de proyecto de la misma cuenta (`<usuario>.github.io/*`). Todas las claves de LAB/OFICIO empiezan con `laboratorio-` o `lab-oficio-`, así que no chocan con otros proyectos, pero cualquier otro sitio tuyo bajo ese dominio podría leerlas.
- El progreso de la versión local (`127.0.0.1:8765`) y el de la versión publicada son independientes. Para pasar de una a otra, usá **Exportar mi cuaderno** en una e **Importar un cuaderno** en la otra.

## Pruebas

```
npm install
npx playwright install chromium
npm test
```

`npm test` levanta el servidor local, recorre todas las páginas y completa un recorrido entero usando la interfaz real: láminas, configuración sugerida, taller, traspaso al laboratorio de jerarquía, rúbrica, aplicación, bitácora, repaso, respaldo y ancho de teléfono. Falla ante cualquier error de script.

## Estructura

```
index.html              Biblioteca: portada, módulos y repaso
1-grafico.html …        Los 5 módulos de principios
5-motion.html
6-after-effects.html    Módulo 6: After Effects para quien viene de Flash
laboratorio.js / .css   Cuaderno por lámina, progreso y respaldo
taller.html             Taller de composición
herramientas.html/.js   Herramientas 01 a 04
estudio.html/.js        Herramientas 05 a 10
recorridos.html/.js     Recorridos (V5)
oficio-datos.js         Contenido pedagógico de los recorridos
oficio.js / .css        Puente entre páginas: guía, traspasos, mediciones
servidor.js             Servidor local sin dependencias (solo 127.0.0.1)
tests/run.mjs           Pruebas de extremo a extremo
SPEC.md                 Especificación y hoja de ruta
```

## Contenido de práctica

Los casos CARVAN, SENTIDA, HTG y TRAMA del taller son composiciones de estudio con textos y formas. No son artes finales ni recursos oficiales de esas marcas. Hornero, la marca del módulo de identidad, es inventada.
