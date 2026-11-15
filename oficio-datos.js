/* LAB/OFICIO V5 — Recorridos: datos pedagógicos.
   Cada recorrido entrena una competencia en cinco estaciones encadenadas.
   Las pruebas usan los datos que ya guardan el curso, el taller y las herramientas. */
(()=>{'use strict';
const LEVELS=['Inicial','En desarrollo','Logrado','Con criterio'];

const SHARED=[
 {id:'intencion',name:'Intención',q:'¿La forma responde a lo que la pieza tiene que lograr?',levels:[
  'No queda claro qué tiene que lograr la pieza.',
  'El objetivo se intuye, pero la forma no lo refuerza.',
  'La forma responde al objetivo.',
  'Cada decisión formal se puede justificar por el objetivo.']},
 {id:'contexto',name:'Contexto',q:'¿Funciona en su soporte real?',levels:[
  'Se pensó solo para la pantalla de quien diseña.',
  'Se consideró el soporte, pero no cómo se ve ahí.',
  'Funciona en su soporte: tamaño, distancia y tiempo de lectura.',
  'Se probó en el soporte real o en una simulación honesta.']}
];

const STATIONS=[
 {id:'entender',n:'1',name:'Entender',verb:'Estudiar el principio en las láminas'},
 {id:'experimentar',n:'2',name:'Experimentar',verb:'Mover variables en una herramienta y observar'},
 {id:'practicar',n:'3',name:'Practicar',verb:'Un experimento controlado: dos versiones, una variable'},
 {id:'evaluar',n:'4',name:'Evaluar',verb:'Comparar con indicadores, lectura y rúbrica'},
 {id:'aplicar',n:'5',name:'Aplicar',verb:'Transferir a una pieza real'}
];

const TOOLS={
 'herramientas.html#grid':{n:'01',name:'Generador de retículas'},
 'herramientas.html#color':{n:'02',name:'Laboratorio de color'},
 'herramientas.html#type':{n:'03',name:'Escalas tipográficas'},
 'herramientas.html#pair':{n:'04',name:'Combinaciones tipográficas'},
 'estudio.html#compose':{n:'05',name:'Laboratorio de composición'},
 'estudio.html#hierarchy':{n:'06',name:'Jerarquía visual'},
 'estudio.html#system':{n:'07',name:'Constructor de sistemas visuales'},
 'estudio.html#crop':{n:'08',name:'Encuadre y fotografía'},
 'estudio.html#logo':{n:'09',name:'Banco de pruebas de logotipos'},
 'estudio.html#refs':{n:'10',name:'Archivo de referencias'},
 'taller.html':{n:'T',name:'Taller de composición'}
};

/* Métricas disponibles sobre composiciones del taller (ver oficio.js → analyze):
   ratio (nivel 1 / nivel 2), sizes (tamaños distintos), families, axes (ejes izquierdos),
   coverage (% ocupado), edge (elementos pegados al borde), accent (usos del acento),
   minContrast (contraste mínimo de texto), imageArea (% del área de imagen). */
const METRICS={
 ratio:{name:'Nivel 1 / nivel 2',fmt:v=>v.toFixed(2).replace('.',',')+' : 1',why:'Cuánto más grande es el texto principal que el siguiente.'},
 sizes:{name:'Tamaños de texto',fmt:v=>String(v),why:'Cantidad de cuerpos tipográficos distintos.'},
 families:{name:'Familias',fmt:v=>String(v),why:'Familias tipográficas en uso.'},
 axes:{name:'Ejes de alineación',fmt:v=>String(v),why:'Bordes izquierdos distintos entre los textos (tolerancia 6 px).'},
 coverage:{name:'Superficie ocupada',fmt:v=>Math.round(v)+' %',why:'Proporción del lienzo cubierta por texto o formas que no son fondo.'},
 edge:{name:'Textos al borde',fmt:v=>String(v),why:'Textos a menos de 32 px del borde del lienzo.'},
 accent:{name:'Usos del acento',fmt:v=>String(v),why:'Elementos que usan el color más saturado de la pieza.'},
 minContrast:{name:'Contraste mínimo',fmt:v=>v.toFixed(2).replace('.',',')+' : 1',why:'El texto con peor contraste contra lo que tiene detrás.'},
 inkBg:{name:'Tinta / fondo',fmt:v=>v.toFixed(2).replace('.',',')+' : 1',why:'Contraste entre el color de texto y el fondo del sistema.'},
 accentBg:{name:'Acento / fondo',fmt:v=>v.toFixed(2).replace('.',',')+' : 1',why:'Cuánto se despega el acento del fondo.'},
 onAccent:{name:'Texto sobre acento',fmt:v=>v.toFixed(2).replace('.',',')+' : 1',why:'El mejor contraste posible de texto (tinta o fondo) apoyado sobre el acento.'},
 imageArea:{name:'Área de imagen',fmt:v=>Math.round(v)+' %',why:'Proporción del lienzo que ocupa el bloque de imagen más grande.'}
};

const PATHS=[
{
 id:'jerarquia',n:'01',name:'Jerarquía y lectura',
 question:'¿Qué se lee primero, qué después y qué puede esperar?',
 intro:'La jerarquía no es tamaño: es orden de lectura. Se construye combinando escala, peso, color, posición y aire, y se verifica mirando la pieza como la vería alguien apurado.',
 entender:{plates:['1-grafico.html#jerarquia','1-grafico.html#contraste','1-grafico.html#recorrido','3-editorial.html#anatomia'],
  focus:'Leé las cuatro láminas buscando una sola cosa: cuántos recursos distintos existen para decir «esto primero». Marcá cada lámina como comprendida cuando puedas nombrar dos.'},
 experimentar:{tool:'herramientas.html#type',
  preset:{store:'H',key:'type',label:'Base 18 px · razón 1,5 · interlineado 1,45',value:{family:'mix',base:18,ratio:1.5,leading:1.45,measure:62}},
  tasks:['Con base 18 px, compará la razón 1,125 con la 1,5. Anotá en cuál el subtítulo se confunde con el texto.',
   'Volvé a 1,5 y subí el interlineado a 1,7. ¿La jerarquía se debilita o solo cambia la mancha de la página?',
   'Elegí la razón que usarías para una placa vista a dos metros y la que usarías para una web. ¿Son la misma?'],
  question:'¿Qué razón elegiste para la placa, y qué viste que te convenció?',
  signal:S=>{const t=S.H.type||{};const moved=t.ratio&&Number(t.ratio)!==1.25;return {ok:!!moved,text:t.ratio?`Escala actual: base ${t.base} px, razón ${String(t.ratio).replace('.',',')}`:'Todavía no abriste la herramienta.'}}},
 practicar:{brief:'carvan',
  hypothesis:'Si la escala no alcanza para separar niveles, ¿pueden hacerlo el peso, el color y el aire?',
  A:{label:'Jerarquía por escala',desc:'El nivel 1 mide al menos el doble que el nivel 2. Primero decidí cuál es el nivel 1: el producto o el precio.',test:{metric:'ratio',op:'>=',v:2}},
  B:{label:'Escala contenida',desc:'Ningún texto supera 1,4 veces al siguiente. La jerarquía tiene que salir del peso, el color, la posición y el espacio.',test:{metric:'ratio',op:'<=',v:1.4}},
  watch:['ratio','sizes','minContrast']},
 evaluar:{criteria:[
  {id:'orden',name:'Orden de lectura',q:'¿Se lee en el orden buscado?',levels:['Dos o más elementos compiten por el primer lugar.','Hay un primer nivel, pero el segundo y el tercero se confunden.','Los tres niveles se distinguen sin esfuerzo.','El orden coincide con el objetivo comercial y se sostiene reducida y desenfocada.']},
  {id:'recursos',name:'Recursos de contraste',q:'¿Con qué se construye cada nivel?',levels:['Todo se resuelve con tamaño.','Se suma un segundo recurso, aplicado de forma pareja.','Cada nivel combina escala, peso o color de manera distinta.','Los recursos son pocos y cada uno cumple una función explicable.']},
  {id:'distancia',name:'Lectura a distancia',q:'¿Qué queda en miniatura?',levels:['En miniatura no se reconoce el mensaje.','Se lee el nivel 1, pero no se entiende la oferta.','Se leen producto y precio.','En miniatura y en gris se entiende la oferta en menos de dos segundos.']}]},
 aplicar:{prompt:'Elegí una pieza real con varios niveles de información (una placa de oferta, un banner, un flyer) y rehacé su jerarquía con lo que probaste.',
  checks:['Escribí el orden de lectura buscado antes de mover nada.','Comprobé la pieza reducida al 25 % y desenfocada.','Usé como máximo tres niveles tipográficos.','Lo más importante para el cliente es lo primero que se lee, no lo más grande por costumbre.']}
},
{
 id:'espacio',n:'02',name:'Espacio, alineación y retícula',
 question:'¿Qué relación tiene cada elemento con los demás y con el borde?',
 intro:'El espacio no es lo que sobra entre las cosas: es lo que las agrupa, las separa y les da peso. La retícula vuelve esas decisiones repetibles de una pieza a la siguiente.',
 entender:{plates:['1-grafico.html#alineacion','1-grafico.html#proximidad','1-grafico.html#espacio','1-grafico.html#grilla','3-editorial.html#reticula','2-web.html#espaciado'],
  focus:'Estas láminas hablan de lo mismo desde tres soportes. Buscá la regla común: la distancia comunica pertenencia, y el borde también es un elemento.'},
 experimentar:{tool:'herramientas.html#grid',support:'estudio.html#compose',
  preset:{store:'H',key:'grid',label:'Instagram 4:5 · 6 columnas × 4 filas · márgenes 8 % · línea base',value:{preset:'ig45',w:1080,h:1350,cols:6,rows:4,gap:20,mx:8,my:8,base:24,modular:true,baseline:true,thirds:false,center:false,safe:true}},
  tasks:['Con la retícula 4:5, pasá de 6 a 5 columnas. ¿Qué anchos de bloque aparecen que antes no podías usar?',
   'Duplicá el margen lateral y mirá cómo cambia el valor percibido de una pieza con pocos elementos.',
   'En el laboratorio de composición, compará la disposición asimétrica con la modular. ¿Cuál usa mejor el vacío?'],
  question:'¿Qué margen y cuántas columnas elegirías para un afiche con muy pocos elementos, y por qué?',
  signal:S=>{const g=S.H.grid||{};const moved=g.preset&&(g.preset!=='ig45'||Number(g.cols)!==6||Number(g.mx)!==6||Number(g.rows)!==1);return {ok:!!moved,text:g.cols?`Retícula actual: ${g.cols} columnas × ${g.rows} filas, márgenes ${g.mx} %`:'Todavía no abriste la herramienta.'}}},
 practicar:{brief:'trama',
  hypothesis:'¿El vacío construye identidad, o solo deja la pieza incompleta?',
  A:{label:'Un solo eje',desc:'Todos los textos comparten el mismo borde izquierdo. La tensión sale de la escala y del vacío, no de la dispersión.',test:{metric:'axes',op:'<=',v:1}},
  B:{label:'Vacío dominante',desc:'Los elementos ocupan como máximo el 35 % del lienzo. Ubicá el vacío donde trabaje: arriba, al costado o en el centro.',test:{metric:'coverage',op:'<=',v:35}},
  watch:['axes','coverage','edge']},
 evaluar:{criteria:[
  {id:'proximidad',name:'Relaciones de proximidad',q:'¿El espacio agrupa?',levels:['Los espacios son parejos y nada se agrupa.','Hay grupos, pero el espacio dentro y entre grupos es parecido.','El espacio entre grupos es claramente mayor que dentro de ellos.','Las distancias forman un sistema: se repiten y se pueden medir.']},
  {id:'ejes',name:'Ejes y alineación',q:'¿Qué bordes ordenan la pieza?',levels:['Cada elemento tiene su propio borde.','Hay un eje principal con excepciones sin motivo.','Uno o dos ejes ordenan la pieza.','Las excepciones al eje son pocas y deliberadas.']},
  {id:'vacio',name:'Función del vacío',q:'¿Qué hace el espacio libre?',levels:['El vacío parece un hueco sin resolver.','El vacío acompaña, pero no aporta.','El vacío le da peso al elemento principal.','El vacío es parte del mensaje: sin él, la pieza diría otra cosa.']}]},
 aplicar:{prompt:'Tomá una pieza real con muchos elementos (una ficha de producto, una placa con datos, una página de catálogo) y reconstruila sobre una retícula exportada desde la herramienta 01.',
  checks:['Exporté la retícula y la usé como guía en mi programa de diseño.','Definí un margen y una distancia entre grupos, y las repetí.','Quité al menos un elemento que solo rellenaba.','Puedo explicar por qué cada elemento está donde está.']}
},
{
 id:'tipografia',n:'03',name:'Tipografía con intención',
 question:'¿Qué dice la letra antes de que se lea el texto?',
 intro:'Elegir tipografía es elegir un tono y un sistema de roles. Una buena combinación no se mide por lo linda que es cada fuente, sino por lo clara que es la relación entre ellas.',
 entender:{plates:['1-grafico.html#tipografia','2-web.html#fluida','3-editorial.html#composicion','3-editorial.html#capitular','4-identidad.html#tipografia'],
  focus:'Separá dos preguntas que suelen mezclarse: qué tono tiene una fuente y qué rol cumple en la pieza. Las láminas de composición y de sistema tipográfico responden la segunda.'},
 experimentar:{tool:'herramientas.html#pair',support:'herramientas.html#type',
  tasks:['Elegí dos parejas con intenciones opuestas y guardalas como A y B en el comparador.',
   'Escribí un titular real de un cliente en la prueba y mirá cuál de las dos lo sostiene sin forzar el tono.',
   'Subí y bajá el tracking del titular. Anotá el punto donde deja de verse como titular y empieza a verse como logo.'],
  question:'¿Qué diferencia de tono hay entre tu A y tu B? Explicala sin decir «más moderna» ni «más linda».',
  signal:S=>{const p=S.H.pairSlots||{};const ok=!!(p.A&&p.B);return {ok,text:ok?`Comparador: A ${p.A.display||''} / B ${p.B.display||''}`:(p.A||p.B?'Guardaste una sola versión en el comparador.':'Todavía no guardaste A y B en el comparador.')}}},
 practicar:{brief:'sentida',
  hypothesis:'¿Hace falta una segunda familia para separar roles, o alcanza con tamaño, peso y mayúsculas?',
  A:{label:'Dos familias con roles',desc:'Serif solo en el titular y sans en todo lo demás. Como máximo tres tamaños de texto.',test:[{metric:'families',op:'==',v:2},{metric:'sizes',op:'<=',v:3}]},
  B:{label:'Una sola familia',desc:'Toda la pieza en una familia. La diferencia de roles sale del tamaño, el peso y las mayúsculas. Como máximo tres tamaños.',test:[{metric:'families',op:'==',v:1},{metric:'sizes',op:'<=',v:3}]},
  watch:['families','sizes','ratio']},
 evaluar:{criteria:[
  {id:'roles',name:'Roles tipográficos',q:'¿Se distingue qué hace cada texto?',levels:['No se distingue qué texto cumple qué función.','El titular se distingue; la información secundaria, no.','Cada rol tiene un estilo propio y constante.','Los roles se reconocen incluso sin leer el contenido.']},
  {id:'tono',name:'Tono',q:'¿La letra acompaña al producto?',levels:['La tipografía contradice el producto.','La tipografía es neutra: no suma ni resta.','La tipografía acompaña el tono del producto.','La tipografía construye el tono por sí misma.']},
  {id:'economia',name:'Economía',q:'¿Sobra algún estilo?',levels:['Hay más de cuatro tamaños o estilos sin función.','Hay estilos de más, pero se nota una intención.','Tres tamaños o menos, todos con función.','No se puede quitar nada sin perder información.']}]},
 aplicar:{prompt:'Elegí una pieza real con titular, texto y datos (un posteo de producto, una tarjeta, un menú) y definí su sistema tipográfico antes de componerla.',
  checks:['Escribí los roles (titular, bajada, dato, llamado) antes de elegir fuentes.','Probé con el texto real del cliente, no con un texto de muestra.','Verifiqué la licencia de las fuentes para el uso que va a tener.','Usé como máximo dos familias y tres tamaños.']}
},
{
 id:'color',n:'04',name:'Color como función',
 question:'¿Qué trabajo hace cada color?',
 intro:'Un color no está para decorar: señala, agrupa, separa o jerarquiza. Si no se puede decir qué trabajo hace, sobra. Y si la pieza solo funciona en color, todavía no funciona.',
 entender:{plates:['1-grafico.html#color','1-grafico.html#contraste','2-web.html#accesibilidad','4-identidad.html#paleta','4-identidad.html#versiones'],
  focus:'Leé buscando roles, no armonías: fondo, tinta, soporte, acento. La lámina de accesibilidad da el límite que no se negocia.'},
 experimentar:{tool:'herramientas.html#color',
  preset:{store:'H',key:'palette',label:'Paleta «Rojo tipográfico» para editar',value:{colors:['#FFF8EE','#1B1B18','#A5AAA5','#E03C27','#F0BEAA'],name:'Rojo tipográfico',origin:7}},
  tasks:['Partí de la paleta sugerida y asigná un rol a cada color: fondo, tinta, soporte, acento, detalle.',
   'Bajá la luminosidad del acento hasta que el texto blanco encima pase AA. Anotá cuánto cambió el color.',
   'Guardá tu versión como paleta propia.'],
  question:'¿Qué tuviste que resignar del acento para que pase el contraste, y valió la pena?',
  signal:S=>{const n=(S.H.saved||[]).length;return {ok:n>0,text:n?`${n} paleta${n>1?'s':''} guardada${n>1?'s':''}.`:'Todavía no guardaste una paleta propia.'}}},
 practicar:{brief:'htg',
  hypothesis:'¿Qué le pasa a la acción principal cuando el color de acento deja de ser exclusivo?',
  A:{label:'Acento exclusivo',desc:'El acento aparece solo en la acción principal, y todos los textos tienen un contraste de 4,5:1 o más contra su fondo.',test:[{metric:'accent',op:'==',v:1},{metric:'minContrast',op:'>=',v:4.5}]},
  B:{label:'Acento repartido',desc:'El mismo acento aparece en tres elementos o más (por ejemplo, título, línea y botón). El resto queda igual que en A.',test:{metric:'accent',op:'>=',v:3}},
  watch:['accent','minContrast','ratio']},
 evaluar:{criteria:[
  {id:'funcion',name:'Función del color',q:'¿Cada color tiene un trabajo?',levels:['Los colores no tienen un rol identificable.','El acento tiene un rol, pero aparece donde no corresponde.','Cada color cumple un rol constante.','Quitar cualquier color cambiaría el significado de la pieza.']},
  {id:'contraste',name:'Contraste y legibilidad',q:'¿Se lee todo?',levels:['Hay textos que no pasan 3:1.','Los títulos pasan; el texto chico, no.','Todo el texto pasa AA.','Todo pasa AA y la pieza funciona también en grises.']},
  {id:'accion',name:'Señal de acción',q:'¿Se reconoce qué hacer?',levels:['No se distingue qué es accionable.','La acción se distingue solo por el color.','La acción se distingue por color y forma.','La acción se reconoce en grises, reducida y de un vistazo.']}]},
 aplicar:{prompt:'Tomá una pieza real con una acción o un dato clave (un botón de compra, un precio, un horario) y revisá su color con una regla: un rol por color.',
  checks:['Escribí el rol de cada color de la pieza.','Verifiqué el contraste del texto en el laboratorio de color.','Revisé la pieza en grises.','El acento aparece solo donde tiene que señalar algo.']}
},
{
 id:'imagen',n:'05',name:'Imagen y encuadre',
 question:'¿Qué parte de la imagen cuenta la historia, y dónde queda lugar para el texto?',
 intro:'Una fotografía no se coloca: se encuadra. Elegir el recorte, el punto de foco y el área para el texto es tan decisivo como elegir la imagen.',
 entender:{plates:['1-grafico.html#proporcion','1-grafico.html#equilibrio','3-editorial.html#pliego','3-editorial.html#portada'],
  focus:'Mirá estas láminas pensando en una foto concreta de un cliente. La pregunta es siempre la misma: qué peso tiene la imagen frente al texto, y dónde se apoya cada uno.'},
 experimentar:{tool:'estudio.html#crop',support:'estudio.html#refs',
  preset:{store:'E',key:'crop',label:'Recorte 4:5 · foco al centro · tercios y área segura',value:{ratio:'4:5',zoom:1,x:50,y:50,textSide:'none',thirds:true,safe:true}},
  tasks:['Cargá una foto real de un cliente y recortala en 4:5 y en 9:16 sin cambiar de foto. Anotá qué se pierde en cada una.',
   'Llevá el foco a un tercio y reservá un costado para el texto. ¿La imagen sigue contando lo mismo?',
   'En Referencias, archivá una portada o un posteo que resuelva bien la relación entre imagen y texto.'],
  question:'¿Qué recorte elegirías para un posteo y cuál para una historia, y qué decidió la diferencia?',
  signal:S=>{const c=S.E.crop||{};const moved=c.ratio&&(Number(c.zoom)!==1||Number(c.x)!==50||Number(c.y)!==50||c.ratio!=='4:5'||c.textSide!=='none');return {ok:!!moved,text:c.ratio?`Encuadre actual: ${c.ratio}, zoom ${String(c.zoom).replace('.',',')}, foco ${c.x} / ${c.y}`:'Todavía no abriste el laboratorio.'}}},
 practicar:{brief:'sentida',
  hypothesis:'¿Cuánto lugar necesita una foto para ser protagonista sin anular el mensaje?',
  A:{label:'La foto manda',desc:'El área de imagen ocupa el 45 % del lienzo o más. El texto acompaña y no se superpone a la imagen.',test:{metric:'imageArea',op:'>=',v:45}},
  B:{label:'El texto manda',desc:'El área de imagen ocupa el 25 % del lienzo o menos, y el titular es el texto más grande.',test:{metric:'imageArea',op:'<=',v:25}},
  watch:['imageArea','coverage','ratio']},
 evaluar:{criteria:[
  {id:'protagonismo',name:'Protagonismo',q:'¿Quién manda?',levels:['No queda claro si manda la imagen o el texto.','Uno manda, pero el otro compite.','Uno manda y el otro acompaña.','La relación responde al objetivo del cliente.']},
  {id:'encuadre',name:'Encuadre',q:'¿El recorte cuenta lo importante?',levels:['El recorte corta lo importante o deja aire sin sentido.','El recorte funciona en un solo formato.','El foco cae en un punto fuerte y el recorte respira.','El encuadre se sostiene en formatos distintos sin perder el sentido.']},
  {id:'convivencia',name:'Convivencia entre imagen y texto',q:'¿El texto tiene su lugar?',levels:['El texto queda sobre zonas cargadas de la imagen.','El texto se lee, pero tapa información de la foto.','El texto ocupa un área tranquila.','El área del texto está prevista desde el encuadre.']}]},
 aplicar:{prompt:'Elegí una foto real de un cliente y preparala para dos formatos (por ejemplo, posteo 4:5 e historia 9:16) con su texto.',
  checks:['Recorté la misma foto en dos formatos sin deformarla.','El foco quedó cerca de un punto fuerte de la retícula de tercios.','Reservé el área de texto antes de escribir el texto.','No inventé ni alteré el contenido de la foto.']}
},
{
 id:'identidad',n:'06',name:'Identidad como sistema',
 question:'¿Qué hace que una pieza se reconozca como de la marca aunque no tenga el logo?',
 intro:'Una identidad es un conjunto de reglas que sobrevive fuera del manual: en 16 píxeles, a una tinta, en una historia hecha apurado. Este recorrido prueba primero el signo y después el sistema.',
 entender:{plates:['4-identidad.html#tipos','4-identidad.html#reduccion','4-identidad.html#resguardo','4-identidad.html#versiones','4-identidad.html#aplicaciones'],
  focus:'Separá dos niveles: el signo (que tiene que resistir tamaños y tintas) y el sistema (que tiene que resistir manos distintas). Las primeras cuatro láminas son del signo; la última, del sistema.'},
 experimentar:{tool:'estudio.html#logo',support:'estudio.html#refs',
  tasks:['Cargá el logo real de un cliente y miralo a 16 y 32 píxeles, en gris y en silueta.',
   'Marcá en el checklist solo lo que realmente pasa, y escribí qué versión alternativa haría falta.',
   'En Referencias, archivá un sistema de identidad que resuelva bien sus aplicaciones.'],
  question:'¿Qué parte del signo se pierde primero al reducirlo, y qué harías con eso?',
  signal:S=>{const l=S.E.logo||{};const ok=!!(l.name&&String(l.notes||'').trim().length>=20);return {ok,text:l.name?`Logo en prueba: ${l.name}${ok?' · con anotaciones':' · faltan anotaciones'}`:'Todavía no cargaste un logo con nombre y anotaciones.'}}},
 practicar:{tool:'estudio.html#system',kind:'system',
  hypothesis:'¿El acento funciona como señal o como superficie? Son dos identidades distintas con los mismos colores.',
  A:{label:'Acento como señal',desc:'El acento aparece solo en detalles y llamados. Guardá el sistema con «Guardar sistema».',test:null},
  B:{label:'Acento como superficie',desc:'El acento ocupa fondos y bloques grandes. Cambiá el motivo y la regla, y guardá el sistema otra vez. Se toman los dos sistemas guardados más recientes: el anterior como A, el último como B.',test:null},
  watch:['inkBg','accentBg','onAccent']},
 evaluar:{criteria:[
  {id:'reconocimiento',name:'Reconocimiento',q:'¿Se reconoce sin el logo?',levels:['Sin el logo, la pieza podría ser de cualquier marca.','Se reconoce por un solo recurso.','Se reconoce por dos o más recursos combinados.','Se reconoce en un fragmento de la pieza.']},
  {id:'resistencia',name:'Resistencia del signo',q:'¿Aguanta tamaños y tintas?',levels:['El signo no funciona en tamaño chico ni a una tinta.','Funciona en un solo contexto.','Tiene versiones previstas para tamaño y fondo.','Las versiones están definidas con reglas medibles.']},
  {id:'reglas',name:'Reglas del sistema',q:'¿Otra persona podría aplicarlo?',levels:['No hay reglas escritas.','Las reglas describen gustos, no decisiones.','Las reglas dicen qué hacer y qué no.','Otra persona podría aplicar el sistema sin preguntar.']}]},
 aplicar:{prompt:'Elegí una marca real con la que trabajes y escribí tres reglas del sistema que alguien más pudiera aplicar sin consultarte.',
  checks:['Probé el logo real en tamaño mínimo y a una tinta.','Escribí la regla de uso del acento.','Escribí qué no se hace (al menos un uso incorrecto).','Probé el sistema en una pieza que no fuera el manual.']}
}
];

/* Repaso → lámina que lo enseña (módulo, índice de pregunta). */
const QUIZ_MAP={
 1:['1-grafico.html#jerarquia','1-grafico.html#proximidad','1-grafico.html#proporcion','1-grafico.html#color','1-grafico.html#tipografia'],
 2:['2-web.html#fitts','2-web.html#hick','2-web.html#feedback','2-web.html#movimiento','2-web.html#convenciones'],
 3:['3-editorial.html#canon','3-editorial.html#anatomia','3-editorial.html#sangrado','3-editorial.html#composicion','3-editorial.html#pliego'],
 4:['4-identidad.html#tipos','4-identidad.html#resguardo','4-identidad.html#construccion','4-identidad.html#voz','4-identidad.html#tipografia'],
 5:['5-motion.html#timing','5-motion.html#curvas','5-motion.html#squash','5-motion.html#ritmo','5-motion.html#cinetica']
};

const PLATE_NAMES={};
[['1-grafico.html','jerarquia:Jerarquía,contraste:Contraste,alineacion:Alineación,proximidad:Proximidad,ritmo:Repetición y ritmo,equilibrio:Equilibrio,espacio:Espacio negativo,proporcion:Proporción,gestalt:Gestalt,color:Color,tipografia:Tipografía,grilla:Grilla,recorrido:Recorrido visual'],
 ['2-web.html','affordance:Affordance,estados:Estados,fitts:Ley de Fitts,hick:Ley de Hick,divulgacion:Divulgación progresiva,responsive:Responsive,espaciado:Sistema de espaciado,fluida:Tipografía fluida,feedback:Feedback y espera,movimiento:Movimiento,accesibilidad:Accesibilidad,convenciones:Convenciones'],
 ['3-editorial.html','canon:Canon de página,margenes:Márgenes,pliego:Doble página,reticula:Retícula modular,anatomia:Anatomía de una nota,composicion:Composición del párrafo,lineabase:Línea base,paginacion:Ritmo de paginación,capitular:Entradas de texto,sangrado:Sangrado y corte,portada:Portada'],
 ['4-identidad.html','tipos:Tipos de marca,reduccion:Reducción,resguardo:Área de resguardo,versiones:Versiones de color,incorrectos:Usos incorrectos,construccion:Construcción y óptica,paleta:Sistema cromático,tipografia:Sistema tipográfico,patron:Elementos gráficos,voz:Voz y tono,aplicaciones:Aplicaciones'],
 ['5-motion.html','timing:Timing y spacing,curvas:Editor de curvas,squash:Squash y stretch,anticipacion:Anticipación,superposicion:Superposición,arcos:Arcos,escalonado:Escalonamiento,keyframes:Fotogramas clave,ritmo:Ritmo y música,cinetica:Tipografía cinética,transiciones:Transiciones']
].forEach(([file,list])=>list.split(',').forEach(pair=>{const [id,name]=pair.split(':');PLATE_NAMES[file+'#'+id]=name}));
const MODULE_NAMES={'1-grafico.html':'Gráfico','2-web.html':'Interfaz','3-editorial.html':'Editorial','4-identidad.html':'Identidad','5-motion.html':'Movimiento'};

const BRIEF_NAMES={carvan:'Oferta en dos segundos',sentida:'Emoción sin decorado',htg:'Un clic antes de pensar',trama:'El carácter del vacío'};

window.OFICIO_DATOS={version:5,LEVELS,SHARED,STATIONS,TOOLS,METRICS,PATHS,QUIZ_MAP,PLATE_NAMES,MODULE_NAMES,BRIEF_NAMES};
})();
