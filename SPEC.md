# LAB/OFICIO — Especificación

Versión del documento: V5 (estado actual) y V6 (hoja de ruta). Noviembre de 2026.

## 1. Propósito

LAB/OFICIO es una plataforma personal para aprender a diseñar mejor: entrenar el ojo, desarrollar criterio visual y contar con herramientas prácticas para trabajos reales de diseño gráfico y dirección de arte.

Cada parte de la plataforma cumple tres funciones. La primera es **enseñar**: explicar los principios que intervienen en una decisión. La segunda es **permitir experimentar**: modificar variables, comparar alternativas y observar sus consecuencias. La tercera es **producir**: generar recursos y archivos útiles para trabajos reales.

El criterio central es que una composición no se evalúa solo por su apariencia. También importan la jerarquía, el contexto, la intención comunicacional, el sistema visual y su adecuación al proyecto. Por eso la plataforma mide y compara, pero nunca da un veredicto estético automático.

## 2. Principios de diseño del producto

Estas reglas valen para cualquier cambio futuro.

1. **No romper lo que existe.** Ninguna versión nueva quita funciones ni cambia el formato de datos guardados de forma incompatible. Las migraciones son aditivas.
2. **Profundidad antes que cantidad.** No se agregan módulos o herramientas para aumentar el número. Una función nueva tiene que conectarse con el ciclo entender → experimentar → practicar → evaluar → aplicar.
3. **Evidencia, no clics.** El avance se registra a partir de lo que la persona hizo en las herramientas (versiones guardadas, configuraciones cambiadas, textos escritos), no por marcar casillas.
4. **Medir no es juzgar.** Los indicadores comprueban si un experimento se hizo y describen geometría y color. Siempre se presentan como indicadores, junto a una rúbrica que la persona completa.
5. **Local y privado.** Sin cuentas, sin servidores propios y sin envío de datos. Las imágenes se procesan en el navegador.
6. **Sin dependencias de ejecución.** HTML, CSS y JavaScript sin compilación. Las fuentes de Google son opcionales: sin conexión todo funciona con fuentes del sistema.
7. **Idioma y tono.** Español rioplatense con voseo, frases directas, nombres de cosas como las reconoce quien diseña. Sin itálicas como acento tipográfico: el énfasis se hace con peso, color o tracking.
8. **Accesible.** Navegable con teclado, foco visible, contraste AA en textos, respeto por `prefers-reduced-motion`, sin desborde horizontal a 390 px de ancho.

## 3. Estado actual (V5)

### 3.1 Páginas

| Página | Contenido | Script propio |
|---|---|---|
| `index.html` | Biblioteca: portada, módulos, banda de recorridos, repaso de 30 preguntas | inline + `laboratorio.js` |
| `1-grafico.html` a `5-motion.html` | 5 módulos de principios, 58 láminas interactivas | inline + `laboratorio.js` |
| `6-after-effects.html` | Módulo 6: After Effects para quien viene de Flash, 11 láminas que simulan herramientas del programa (keyframes por propiedad, Graph Editor, parenting, Trim Paths, track mattes, Animators de texto, expressions, exportación y atajos) con un ejercicio en After Effects por lámina | inline + `laboratorio.js` |
| `taller.html` | Taller de composición: 4 encargos, lienzo SVG 800 × 800, versiones A/B | inline |
| `herramientas.html` | Herramientas 01 a 04 | `herramientas.js` |
| `estudio.html` | Herramientas 05 a 10 | `estudio.js` |
| `recorridos.html` | Recorridos: lista, estaciones, evaluación, bitácora | `recorridos.js` |

Todas las páginas cargan en el `<head>`, antes que sus scripts propios, `oficio-datos.js` y `oficio.js` (y `oficio.css`). El orden importa: `oficio.js` aplica configuraciones sugeridas antes de que cada herramienta lea su estado.

### 3.2 Herramientas

| N.º | Herramienta | Página y ancla | Produce |
|---|---|---|---|
| 01 | Generador de retículas | `herramientas.html#grid` | Guías SVG y PNG |
| 02 | Laboratorio de color | `herramientas.html#color` | ASE, CSS, JSON |
| 03 | Escalas tipográficas | `herramientas.html#type` | CSS, JSON |
| 04 | Combinaciones tipográficas | `herramientas.html#pair` | CSS, JSON, comparación A/B |
| 05 | Laboratorio de composición | `estudio.html#compose` | SVG, PNG, JSON |
| 06 | Jerarquía visual | `estudio.html#hierarchy` | Plancha PNG, notas JSON |
| 07 | Constructor de sistemas visuales | `estudio.html#system` | CSS, JSON, mini guía HTML |
| 08 | Encuadre y fotografía | `estudio.html#crop` | PNG, JPG, parámetros JSON |
| 09 | Banco de pruebas de logotipos | `estudio.html#logo` | Plancha PNG, informe JSON |
| 10 | Archivo de referencias | `estudio.html#refs` | Plancha PNG, JSON |

### 3.3 Datos guardados

Todo vive en `localStorage`. Cada clave pertenece a un único dueño, que es quien la escribe. Las demás páginas solo la leen, salvo las excepciones indicadas.

| Clave | Dueño | Forma |
|---|---|---|
| `laboratorio-oficio-v2` | `laboratorio.js` | `{notes:{"archivo:lámina":texto}, done:{…:bool}, fav:{…:bool}, last:{file,anchor,name,module}}` |
| `laboratorio-quiz-v2` | `index.html` | `{"1":[índice o null × 5], … "5":[…]}` |
| `lab-oficio-taller-v1` | `taller.html` | `{active, work:{encargo:{items,bg}}, versions:{encargo:{A:{items,bg},B:{items,bg}}}, reflections:{encargo:texto}, review:{encargo:[bool]}}` |
| `lab-oficio-herramientas-v1` | `herramientas.js` | `{grid, palette:{colors[5],name,origin}, saved:[paleta], type:{family,base,ratio,leading,measure}, pair, pairSaved:[], pairSlots:{A,B}}` |
| `lab-oficio-estudio-v4` | `estudio.js` | `{compose, hierarchy:{points:[{x,y} en %], first, goal, notes, marks, source, handoff}, system, systems:[], crop, logo, refs:[]}` |
| `lab-oficio-recorridos-v5` | `oficio.js` y `recorridos.js` | ver 3.6 |
| `lab-oficio-traspaso` | `oficio.js` escribe, `estudio.js` consume y borra | `{svg, source, goal, path, version, at}`, vence a los 15 minutos |
| `lab-oficio-ae-v1` | `6-after-effects.html` | `{proyecto:{"grupo-ítem":bool}, atajos:{atajo:aciertos}, racha:número, lottie:{recurso:bool}}`. Las notas y las láminas comprendidas del módulo 6 viven en `laboratorio-oficio-v2`, como en los otros módulos. |

Excepciones de escritura cruzada, todas iniciadas por la persona: aplicar o restaurar una configuración sugerida escribe la subclave correspondiente de `lab-oficio-herramientas-v1` o `lab-oficio-estudio-v4`, y registrar una lectura borra `hierarchy.handoff` en `lab-oficio-estudio-v4`.

Un elemento del taller es `{type:'rect', id, x, y, w, h, fill}` o `{type:'text', id, x, y, text, size, fill, weight, font:'sans'|'serif', leading, tracking}`, en coordenadas de un lienzo de 800 × 800. En los textos, `y` es la línea base de la primera línea.

### 3.4 Respaldo

**Exportar mi cuaderno** (en `index.html`) descarga un JSON con `version: 4` y las claves `learning`, `quiz`, `workshop`, `tools`, `labs`, `paths` y `ae`. La clave `ae` es opcional: los respaldos anteriores, que no la tienen, se siguen importando igual. La importación acepta las versiones 2, 3 y 4. Una versión nueva del respaldo tiene que seguir aceptando todas las anteriores.

### 3.5 Recorridos

Hay seis recorridos definidos en `oficio-datos.js`: Jerarquía y lectura, Espacio, alineación y retícula, Tipografía con intención, Color como función, Imagen y encuadre, e Identidad como sistema. El módulo 5, Movimiento, todavía no tiene recorrido (ver 6.5).

Cada recorrido tiene cinco estaciones. Una estación puede estar **pendiente**, **en curso**, **cumplida** (con la evidencia requerida) o **cerrada** (la persona la dio por terminada sin la evidencia completa). Las estaciones se pueden hacer en cualquier orden. La sugerida es la primera que no esté cumplida ni cerrada.

| Estación | Qué hace la persona | Se cumple cuando |
|---|---|---|
| 1 Entender | Estudia entre 4 y 6 láminas puntuales. Sus apuntes del cuaderno se muestran en el recorrido. | Todas las láminas del recorrido están marcadas como comprendidas. |
| 2 Experimentar | Usa una herramienta, opcionalmente con una configuración sugerida, y sigue tres consignas. | La herramienta registra el uso (señal propia de cada recorrido) y la respuesta escrita tiene 40 caracteres o más. |
| 3 Practicar | Resuelve un encargo del taller como experimento controlado: A y B cambian una sola variable. Fija las dos versiones en el recorrido. | A y B están fijadas y cumplen sus condiciones medibles. |
| 4 Evaluar | Compara A y B con indicadores, escribe una predicción, lee cada versión en la herramienta 06, completa la rúbrica y decide. | La rúbrica está completa para A y B (5 criterios cada una), hay una elección y la decisión tiene 40 caracteres o más. |
| 5 Aplicar | Lleva el principio a una pieza real, con revisión final y antes/después opcionales. | Tiene nombre de pieza, todos los puntos de revisión marcados y una reflexión de 60 caracteres o más. |

La rúbrica tiene tres criterios propios del recorrido y dos comunes a todos (Intención y Contexto), cada uno con cuatro niveles descritos: Inicial, En desarrollo, Logrado y Con criterio.

Señales de la estación Experimentar:

| Recorrido | Herramienta | Señal |
|---|---|---|
| Jerarquía | 03 Escalas | La razón de la escala es distinta de 1,25 (el valor inicial). |
| Espacio | 01 Retículas | La retícula cambió de formato, columnas, filas o márgenes. |
| Tipografía | 04 Combinaciones | Hay versiones A y B guardadas en el comparador. |
| Color | 02 Color | Hay al menos una paleta propia guardada. |
| Imagen | 08 Encuadre | El encuadre cambió de proporción, zoom, foco o área de texto. |
| Identidad | 09 Logotipos | El logo en prueba tiene nombre y anotaciones de 20 caracteres o más. |

Experimentos de la estación Practicar:

| Recorrido | Encargo | A | B |
|---|---|---|---|
| Jerarquía | CARVAN | Nivel 1 / nivel 2 ≥ 2 | Nivel 1 / nivel 2 ≤ 1,4 |
| Espacio | TRAMA | Un solo eje de alineación | Superficie ocupada ≤ 35 % |
| Tipografía | SENTIDA | 2 familias y ≤ 3 tamaños | 1 familia y ≤ 3 tamaños |
| Color | HTG | Acento en 1 elemento y contraste mínimo ≥ 4,5 | Acento en 3 elementos o más |
| Imagen | SENTIDA | Área de imagen ≥ 45 % | Área de imagen ≤ 25 % |
| Identidad | 07 Sistemas | Penúltimo sistema guardado | Último sistema guardado, distinto de A en motivo, regla o acento |

Las versiones fijadas son copias. El taller puede seguir cambiando sin alterar lo que se evalúa. Dos recorridos pueden usar el mismo encargo (Tipografía e Imagen usan SENTIDA) gracias a esas copias.

### 3.6 Estado de los recorridos

```
lab-oficio-recorridos-v5 = {
  active:  {path, station, at},            // estación en la que está trabajando la persona
  applied: {path, key, label, at, file},   // última configuración sugerida aplicada
  stash:   {"H.type": {value, at, label, path}, …},  // valor anterior, para restaurar
  paths: {
    <id>: {
      closed:       {<estación>: bool},
      experimentar: {answer, at},
      practicar:    {A, B, at},             // copias: {items,bg} o {system}
      evaluar: {
        prediction: {A, B},
        readings:   {A: {points, first, goal, notes, at}, B: …},
        rubric:     {A: {<criterio>: 1-4}, B: …},
        choice:     "A" | "B",
        decision
      },
      aplicar: {piece, client, support, checks:[bool], reflection, before, after}  // imágenes en JPEG de hasta 900 px
    }
  },
  updated
}
```

### 3.7 Indicadores

Se calculan en `oficio.js` (`analyze`) sobre las composiciones del taller. Las cajas de texto se miden con `getBBox` en un SVG oculto y, si no se puede, se estiman.

| Indicador | Cálculo |
|---|---|
| Nivel 1 / nivel 2 | Tamaño del texto más grande dividido por el del segundo más grande (por elemento, no por tamaños distintos: dos textos iguales dan 1). |
| Tamaños de texto | Cantidad de cuerpos distintos, redondeados a enteros. |
| Familias | Cantidad de familias en uso (serif, sans). |
| Ejes de alineación | Bordes izquierdos distintos entre textos, con 6 px de tolerancia. |
| Superficie ocupada | Muestreo de 60 × 60 puntos: porcentaje cubierto por cajas de texto o formas que no son fondo (una forma es fondo si cubre el 90 % del lienzo o más). |
| Textos al borde | Textos a menos de 32 px de un borde. |
| Usos del acento | Elementos cuyo color está a 14° de tono y 0,16 de luminosidad del color más saturado de la pieza (saturación > 0,35). |
| Contraste mínimo | El peor contraste WCAG entre un texto y la forma que tiene detrás en su centro, o el fondo. |
| Área de imagen | La forma más grande que no es fondo, como porcentaje del lienzo. |

Para los sistemas visuales: contraste entre tinta y fondo, entre acento y fondo, y el mejor contraste de texto posible sobre el acento.

### 3.8 Puente entre páginas (`oficio.js`)

- **Guía del recorrido.** Panel fijo abajo a la derecha que aparece cuando hay una estación activa. En la página de la estación muestra la consigna y el estado medido en vivo (se refresca cada 1,5 segundos y ante cambios de almacenamiento). En las demás páginas muestra un acceso al paso. Se puede minimizar y en pantallas de menos de 700 px arranca minimizada. Agrega relleno inferior al `body` para no tapar controles.
- **Configuraciones sugeridas.** Un enlace con `?aplicar=<recorrido>` escribe la configuración sugerida antes de que cargue la herramienta, guarda el valor anterior en `stash` y quita el parámetro de la dirección. La guía ofrece restaurarla.
- **Traspaso a la herramienta 06.** El taller («Analizar lectura») y la estación Evaluar escriben `lab-oficio-traspaso`. Al abrir `estudio.html`, la herramienta 06 lo consume, rasteriza el SVG, carga la predicción en «objetivo», limpia las marcas y registra de qué recorrido y versión viene.
- **Referencias cruzadas.** Cada lámina indica en qué recorridos se trabaja; cada herramienta, en qué recorridos y estaciones se usa; cada encargo del taller, qué experimento le corresponde. En el repaso, una respuesta incorrecta enlaza la lámina que lo enseña.
- **API pública.** `window.OFICIO` expone, entre otras, `read`, `update`, `status`, `progress`, `resume`, `analyze`, `tallerSVG`, `systemSVG`, `practiceSource`, `practiceTests`, `activate` y `handoff`.
- **Enlaces profundos.** `taller.html#<encargo>` abre ese encargo. `recorridos.html#<recorrido>/<estación>` abre esa estación.

### 3.9 Bitácora

Desde cada recorrido, o para todos a la vez, se descarga un HTML autónomo con apuntes, respuesta del experimento, versiones A y B con sus marcas de lectura e indicadores, rúbrica, decisión y aplicación con imágenes. Está preparado para imprimir.

## 4. Deuda técnica conocida

- **Límite de almacenamiento.** `localStorage` suele permitir unos 5 MB por origen. Las imágenes de Aplicar y las miniaturas de Referencias son lo que más ocupa. Cuando una escritura falla, se avisa, pero no hay un indicador de espacio usado.
- **Renderizador duplicado.** `oficio.js` (`tallerSVG`) replica el dibujo de `taller.html` (`renderSvg`). Cualquier propiedad nueva de los elementos del taller tiene que agregarse en los dos.
- **Mediciones dependientes de la fuente.** `getBBox` mide con la fuente que tenga cargada el navegador. Sin Google Fonts, las cajas cambian unos pocos píxeles; los umbrales están elegidos con margen para eso.
- **Diálogos nativos.** El V4 usa `confirm()` y `alert()` en algunos casos. Funcionan, pero sería mejor reemplazarlos por confirmaciones dentro de la página.
- **Tema oscuro.** Las páginas del curso responden al tema del sistema; taller, herramientas y recorridos son solo claros.

## 5. Convenciones de desarrollo

- Un cambio no se da por terminado sin `npm test` en verde. Las funciones nuevas suman su propia prueba en `tests/run.mjs`.
- Claves nuevas de almacenamiento con prefijo `lab-oficio-` y sufijo de versión (`-v6`). Nunca se renombra una clave existente.
- El contenido pedagógico (consignas, rúbricas, umbrales) vive en archivos de datos, separado de la lógica.
- Los scripts nuevos no modifican la lógica interna de páginas existentes salvo con cambios mínimos, documentados en el CHANGELOG.

## 6. Hoja de ruta V6

Orden sugerido: 6.1 y 6.2 primero, porque juntos cierran el círculo entre el trabajo propio, el trabajo de otros y el criterio. Después 6.3 y 6.4, que dependen de que haya datos acumulados. 6.5 es independiente. 6.6 conviene antes de un uso intensivo con imágenes.

### 6.1 Encargos propios en el taller

**Objetivo.** Practicar sobre briefs reales, no solo sobre los cuatro encargos de ejemplo.

**Comportamiento.** En el taller, un botón «Nuevo encargo» abre un formulario: nombre, cliente, formato (cuadrado 1:1, vertical 4:5, historia 9:16, horizontal 3:2), objetivo, «qué tiene que leerse primero», textos reales (de 1 a 6, cada uno con un rol: titular, bajada, dato, llamado, firma) y un área de imagen opcional. Se genera un encargo con una composición inicial neutra (textos apilados a la izquierda, todos en el mismo tamaño) para que la jerarquía la construya la persona. Los encargos propios aparecen en la lista junto a los de ejemplo, se pueden editar y borrar, y usan las mismas versiones A/B, notas, revisión y exportaciones.

**Lienzo no cuadrado.** Hoy el taller trabaja en 800 × 800. Los encargos propios necesitan otras proporciones: el lienzo pasa a `800 × alto` según el formato, y `tallerSVG`, `analyze` y el traspaso se adaptan a un `viewBox` variable. Los encargos existentes siguen en 800 × 800.

**Recorridos.** En la estación Practicar, un selector permite usar el encargo de ejemplo o uno propio. El experimento A/B y sus condiciones no cambian. En Evaluar, la predicción se precarga con el «qué tiene que leerse primero» del brief.

**Datos.** En `lab-oficio-taller-v1`: `custom:[{id, name, client, format, w, h, objective, first, texts:[{role,text}], image:bool, created}]`. Los identificadores empiezan con `propio-`. En `lab-oficio-recorridos-v5`: `paths.<id>.practicar.brief` cuando se elige un encargo propio.

**Criterios de aceptación.**
- Se puede crear un encargo propio con formato 4:5, guardar A y B, exportar SVG y PNG con la proporción correcta y analizarlo en la herramienta 06.
- Los cuatro encargos de ejemplo siguen funcionando igual, con sus datos previos intactos.
- Un recorrido puede completar Practicar y Evaluar con un encargo propio.
- Borrar un encargo propio pide confirmación en la página y no borra copias ya fijadas en recorridos.
- El respaldo incluye los encargos propios.

**Fuera de alcance.** Importar imágenes reales dentro del lienzo del taller (para eso está la herramienta 08). Plantillas de diseño terminadas.

### 6.2 Análisis de referencias con la rúbrica

**Objetivo.** Entrenar el ojo desarmando trabajo ajeno con los mismos criterios con que se evalúa el propio.

**Comportamiento.** En el archivo de referencias (herramienta 10), cada referencia tiene una acción «Analizar». Abre la referencia en la herramienta 06 (por el mismo mecanismo de traspaso) y, al volver, un panel permite elegir un recorrido y completar su rúbrica para esa pieza, más dos campos: «qué operación visual la hace funcionar» y «qué sería un error copiar». Las lecturas y rúbricas de referencias quedan guardadas con la referencia.

**Recorridos.** En la estación Entender aparece una sección opcional «Mirar trabajo de otros»: lista las referencias analizadas con la rúbrica de ese recorrido y sugiere analizar al menos una. No es requisito para cumplir la estación.

**Datos.** En `lab-oficio-estudio-v4`: `refs[i].analysis = {path, rubric:{criterio:nivel}, operation, avoid, reading:{points, first}, at}`.

**Criterios de aceptación.**
- Una referencia del archivo se puede abrir en la herramienta 06, marcar tres puntos y volver con la lectura registrada en la referencia.
- La rúbrica de la referencia usa exactamente los criterios del recorrido elegido.
- Las referencias analizadas aparecen en la estación Entender del recorrido correspondiente y en la bitácora.
- La exportación JSON del archivo de referencias incluye el análisis.

**Fuera de alcance.** Comparación automática entre la referencia y el trabajo propio.

### 6.3 Repaso espaciado

**Objetivo.** Que lo aprendido se retenga. Hoy las láminas marcadas para revisar, los errores del repaso y las estaciones cerradas sin evidencia quedan quietos.

**Comportamiento.** Una cola de repaso en la biblioteca, «Para hoy», arma de 3 a 5 tarjetas a partir de tres fuentes: láminas marcadas «Volver a revisar», preguntas respondidas mal y estaciones cerradas sin evidencia. Cada tarjeta propone una consigna breve y distinta de la original (por ejemplo, «Encontrá en tu archivo de referencias una pieza que use este principio y nombrá cómo»), enlaza a la lámina o la estación y se resuelve con «Lo tengo», «Más o menos» u «Otra vez». El siguiente repaso de esa tarjeta se programa a 1, 3, 7, 14 y 30 días según la respuesta: «Lo tengo» avanza un intervalo, «Más o menos» lo repite y «Otra vez» vuelve al primero.

**Datos.** Clave nueva `lab-oficio-repaso-v6`: `{cards:{<id>:{source, ref, step, due, history:[{at, answer}]}}}`. Las consignas de repaso viven en un archivo de datos, con al menos dos por lámina incluida en los recorridos.

**Criterios de aceptación.**
- Marcar una lámina «Volver a revisar» crea su tarjeta. Desmarcarla la retira.
- Una pregunta mal respondida crea una tarjeta que enlaza la lámina del mapa de repaso.
- Las fechas respetan los intervalos. Se puede simular el paso del tiempo en las pruebas.
- Sin tarjetas pendientes, la sección muestra cuándo vence la próxima.

**Fuera de alcance.** Notificaciones fuera del navegador.

### 6.4 Mapa de criterio

**Objetivo.** Ver la evolución del criterio por competencia y decidir qué practicar.

**Comportamiento.** Cada vez que se cumple Evaluar, se guarda un intento: recorrido, fecha, niveles de la rúbrica para la versión elegida y si el experimento se cumplió. Un recorrido completo se puede volver a hacer sin perder los intentos anteriores: «Repetir recorrido» archiva el estado actual y empieza uno nuevo. En la página de recorridos, una sección «Tu criterio» muestra por competencia el último nivel promedio, la diferencia con el intento anterior y la cantidad de intentos, y cada criterio de rúbrica con su historial. Se dibuja con SVG propio, sin bibliotecas.

**Datos.** En `lab-oficio-recorridos-v5`: `attempts:[{path, at, choice, rubric:{criterio:nivel}, experimentOk, applied:bool}]` y `archive:{<id>:[estado anterior]}`.

**Criterios de aceptación.**
- Repetir un recorrido conserva el intento anterior en la bitácora y en el mapa.
- El mapa se lee sin color (los niveles se distinguen por posición y etiqueta).
- Con un solo intento, el mapa no muestra tendencias.

**Fuera de alcance.** Puntajes globales, medallas o rankings.

### 6.5 Recorrido de Movimiento

**Objetivo.** Completar el módulo 5 con el mismo ciclo que los demás.

**Herramienta nueva: 11 Tiempos y curvas** (`estudio.html#motion`). Una línea de tiempo con hasta cuatro elementos (titular, precio, imagen, logo). Para cada elemento se define el inicio, la duración, la propiedad que se anima (posición, escala, opacidad) y la curva (editor bezier con valores preestablecidos). Se reproduce, se puede ver cuadro a cuadro a 24, 30 o 60 cuadros por segundo y muestra el desfase entre elementos. Exporta CSS (`@keyframes` y `transition`), JSON de parámetros y una tira de cuadros en PNG.

**Recorrido 07, Movimiento con sentido.** Entender: Timing y spacing, Editor de curvas, Anticipación, Escalonamiento y Tipografía cinética. Experimentar: herramienta 11 con configuración sugerida (cuatro elementos, todos a la vez, curva lineal). Practicar: un experimento A/B sobre la entrada de una placa de oferta. A: escalonado de 60 a 120 ms y curva de salida suave. B: todo simultáneo y lineal. Condiciones medibles: desfase entre elementos, duración total y tipo de curva. Evaluar: indicadores (duración total, desfase medio, tiempo hasta que el precio es legible), rúbrica con criterios propios (Orden de aparición, Peso y curva, Legibilidad en movimiento) más Intención y Contexto. Aplicar: una animación real, por ejemplo una placa para pantalla LED.

**Criterios de aceptación.**
- La herramienta 11 guarda sus parámetros en `lab-oficio-estudio-v4.motion` y respeta `prefers-reduced-motion` (muestra cuadros fijos en lugar de reproducir).
- El recorrido 07 cumple las mismas reglas de estaciones que los demás y aparece en la biblioteca, el mapa del sistema y la bitácora.
- El CSS exportado reproduce la misma animación que se ve en la herramienta.

### 6.6 Guardado en una carpeta

**Objetivo.** Superar el límite del navegador y tener los datos como archivos propios.

**Comportamiento.** En navegadores que soportan la File System Access API (Chrome y Edge de escritorio), la biblioteca ofrece «Guardar en una carpeta»: la persona elige una carpeta y la plataforma escribe ahí un `cuaderno.json` y las imágenes como archivos separados, cada vez que cambia algo (con una demora de 2 segundos) y al cerrar. En los demás navegadores sigue el respaldo manual actual. Un indicador muestra el espacio usado en `localStorage` y avisa al pasar el 80 %.

**Criterios de aceptación.**
- Con la carpeta conectada, borrar los datos del sitio y reconectar la carpeta restaura todo.
- Sin soporte de la API, la opción no aparece y nada deja de funcionar.
- El formato de `cuaderno.json` es el mismo que el del respaldo.

### 6.7 Fuera del alcance de la V6

Generadores automáticos de diseño, evaluación estética automática, cuentas de usuario, sincronización en la nube y compartir públicamente el progreso. Todo eso contradice los principios de la sección 2 o necesita un servidor.

## 7. Publicación

El sitio se publica en GitHub Pages con el flujo `.github/workflows/pages.yml`: en cada `push` a `main` corre `npm test` y, si pasa, publica los archivos `.html`, `.css` y `.js` de la raíz. Los enlaces son todos relativos, así que funciona en la subcarpeta del repositorio (`<usuario>.github.io/<repositorio>/`). El README explica la configuración y las implicancias del guardado en `github.io`.
