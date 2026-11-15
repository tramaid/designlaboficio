(()=>{'use strict';
const $=id=>document.getElementById(id), KEY='lab-oficio-herramientas-v1';
const formats=[
 {id:'ig45',name:'Instagram · vertical 4:5',w:1080,h:1350,cols:6,rows:1,gap:20,mx:6,my:6,base:24,why:'El formato 4:5 suele beneficiarse de márgenes generosos. Reservá un área dominante antes de distribuir detalles.'},
 {id:'ig11',name:'Instagram · cuadrado 1:1',w:1080,h:1080,cols:6,rows:1,gap:20,mx:7,my:7,base:24,why:'La simetría del cuadrado puede volverse previsible. Usá la grilla para sostener una asimetría deliberada.'},
 {id:'story',name:'Historia / Reel · 9:16',w:1080,h:1920,cols:6,rows:1,gap:24,mx:7,my:11,base:24,why:'En historias, la interfaz de la plataforma puede tapar contenido. La guía del 5% es orientativa, no representa todas las zonas ocupadas por botones.'},
 {id:'web',name:'Web · escritorio 1440',w:1440,h:900,cols:12,rows:1,gap:24,mx:5,my:8,base:8,why:'En web, una retícula de doce columnas ofrece combinaciones flexibles. No fuerces doce columnas de texto: el ancho de lectura manda.'},
 {id:'mobile',name:'Web · móvil 390',w:390,h:844,cols:4,rows:1,gap:16,mx:5,my:5,base:8,why:'En móvil, cuatro columnas y márgenes constantes simplifican la relación entre texto, imágenes y controles.'},
 {id:'banner',name:'Banner HTG · 3:2',w:1536,h:1024,cols:8,rows:1,gap:24,mx:5,my:7,base:16,why:'La foto y el titular necesitan territorios claros. Una imagen muy contrastada puede competir con el mensaje.'},
 {id:'a4',name:'Editorial · A4 a 300 ppp',w:2480,h:3508,cols:6,rows:8,gap:40,mx:9,my:8,base:34,why:'Las dimensiones son una aproximación A4 a 300 ppp. Para imprimir, configurá en el documento las unidades, los perfiles y el sangrado que pida la imprenta.'},
 {id:'led',name:'LED CARVAN · 3072 × 256',w:3072,h:256,cols:12,rows:1,gap:16,mx:2,my:8,base:16,why:'En una marquesina panorámica hay que diseñar según las caras físicas y la curva. Esta grilla es una base geométrica, no reemplaza el mapa de la pantalla.'}
];
const curated=[
 {name:'Óxido editorial',kind:'Tierra / papel',why:'El fondo cálido y la tinta oscura sostienen la lectura; el óxido se reserva para títulos, marcas o llamados puntuales.',colors:['#F1EDE4','#1B211C','#AAB4A1','#C45131','#D7B885']},
 {name:'Azul de biblioteca',kind:'Cultura / precisión',why:'El azul profundo construye autoridad sin convertirse en negro. El coral introduce un punto de tensión muy controlado.',colors:['#F1F2F0','#142E42','#9CB4C1','#E97551','#D6C7AD']},
 {name:'Vino y sal',kind:'Gastronomía / relato',why:'Más editorial que gastronómica: un borgoña opaco y un acento rojizo. Necesita fotografía cuidada para no caer en un cliché.',colors:['#F7F1F0','#432636','#D4B2B8','#A64C57','#E4CDB5']},
 {name:'Oliva mineral',kind:'Materia / oficio',why:'Una combinación poco estridente. El contraste depende del verde casi negro, no de saturar los tonos de apoyo.',colors:['#F2F1E9','#243126','#B7BD9E','#8B4C2F','#DAD9C6']},
 {name:'Rosa de concreto',kind:'Belleza / artesanía',why:'Un sistema cálido con fricción: rosa empolvado sin dulzura excesiva y un tono vino para jerarquías.',colors:['#F7F0EE','#392A31','#BEA6A8','#B14D6A','#DED1C7']},
 {name:'Tinta eléctrica',kind:'Noche / tecnología',why:'La inversión fondo oscuro y tinta marfil altera el ritmo. El naranja actúa mejor como señal, no como superficie dominante.',colors:['#111A22','#F5F3E9','#63748A','#DA5D3C','#CBB58E']},
 {name:'Mostaza y petróleo',kind:'Arquitectura / objetos',why:'Una estructura sobria donde el mostaza sustituye el acento rojo habitual. Es útil para sistemas con mucha fotografía.',colors:['#F4F1E8','#112F35','#99B5A8','#C88F2B','#D5CAB1']},
 {name:'Rojo tipográfico',kind:'Afiche / impacto',why:'Dos protagonistas: tinta casi negra y rojo. El resto no debería competir. La jerarquía nace del contraste y de la escala.',colors:['#FFF8EE','#1B1B18','#A5AAA5','#E03C27','#F0BEAA']}
];
const roles=['Fondo','Tinta','Soporte','Acento','Detalle'];const cssRoles=['fondo','tinta','soporte','acento','detalle'];
const defaults={grid:{preset:'ig45',w:1080,h:1350,cols:6,rows:1,gap:20,mx:6,my:6,base:24,modular:true,baseline:false,thirds:false,center:false,safe:true},palette:{colors:curated[0].colors.slice(),name:curated[0].name,origin:0},saved:[],type:{family:'mix',base:16,ratio:1.25,leading:1.55,measure:62},pair:{preset:0,display:'Cormorant Garamond',body:'DM Sans',customDisplay:'',customBody:'',displayWeight:600,bodyWeight:400,tracking:-0.04,leading:1.55,context:'editorial',usePalette:false,eyebrow:'CUADERNOS DE COMPOSICIÓN / 01',headline:'El oficio de mirar.',text:'Diseñar es ordenar relaciones, no decorar superficies. Cada letra toma posición frente a las demás.',name:'Contraste editorial'},pairSaved:[],pairSlots:{A:null,B:null}};
const clone=x=>JSON.parse(JSON.stringify(x));const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));const num=(v,alt,min,max)=>{let n=Number(v);return Number.isFinite(n)?clamp(n,min,max):alt};
let state=clone(defaults);try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved==='object'){
 if(saved.grid)Object.assign(state.grid,saved.grid);if(saved.palette&&Array.isArray(saved.palette.colors)&&saved.palette.colors.length===5)state.palette=saved.palette;if(Array.isArray(saved.saved))state.saved=saved.saved.filter(p=>p&&Array.isArray(p.colors)&&p.colors.length===5).slice(0,30);if(saved.type)Object.assign(state.type,saved.type);if(saved.pair&&typeof saved.pair==='object')Object.assign(state.pair,saved.pair);if(Array.isArray(saved.pairSaved))state.pairSaved=saved.pairSaved.filter(p=>p&&p.pair&&typeof p.pair==='object').slice(0,30);if(saved.pairSlots&&typeof saved.pairSlots==='object')state.pairSlots={A:saved.pairSlots.A||null,B:saved.pairSlots.B||null};
}}catch{}
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
let toastTimer=0;function notice(message){$('toast').textContent=message;$('toast').classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('on'),2800)}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1800)}
function saveText(contents,name,mime='text/plain'){download(new Blob([contents],{type:mime+';charset=utf-8'}),name)}
async function copy(contents){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(contents)}else{const el=document.createElement('textarea');el.value=contents;el.style.position='fixed';el.style.opacity='0';document.body.append(el);el.select();if(!document.execCommand('copy'))throw Error('clipboard');el.remove()}notice('Copiado al portapapeles')}catch{notice('No se pudo copiar. Usá la descarga alternativa.')}}
// Tabs, accesibles por teclado y por enlace profundo.
const tabs=[...document.querySelectorAll('[role=tab][data-view]')];function selectTab(key,updateHash=true){if(!['grid','color','type','pair'].includes(key))key='grid';for(const b of tabs){const on=b.dataset.view===key;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;$('panel-'+b.dataset.view).hidden=!on;}if(updateHash){try{history.replaceState(null,'','#'+key)}catch{location.hash=key}}}
tabs.forEach((b,i)=>{b.addEventListener('click',()=>selectTab(b.dataset.view));b.addEventListener('keydown',evt=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(evt.key))return;evt.preventDefault();let next=evt.key==='Home'?0:evt.key==='End'?tabs.length-1:(i+(evt.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].focus();selectTab(tabs[next].dataset.view)})});window.addEventListener('hashchange',()=>selectTab(location.hash.slice(1),false));selectTab(location.hash.slice(1),false);
// ---------- RETÍCULAS ----------
const gridInputs={w:'gridWidth',h:'gridHeight',cols:'gridCols',rows:'gridRows',gap:'gridGutter',mx:'gridMX',my:'gridMY',base:'gridBaseline',modular:'gridModular',baseline:'gridBase',thirds:'gridThirds',center:'gridCenter',safe:'gridSafe'};
$('gridPreset').innerHTML=formats.map(f=>`<option value="${f.id}">${f.name}</option>`).join('')+'<option value="custom">Personalizado / a medida</option>';
function showGridControls(){const g=state.grid;$('gridPreset').value=g.preset||'ig45';for(const [prop,id] of Object.entries(gridInputs)){$(id).type==='checkbox'?$(id).checked=!!g[prop]:$(id).value=g[prop]}}
function gridSpec(){const g=state.grid;let w=Math.round(num(g.w,1080,100,10000)),h=Math.round(num(g.h,1350,100,10000)),cols=Math.round(num(g.cols,6,1,24)),rows=Math.round(num(g.rows,1,1,30));let mx=num(g.mx,6,0,40)/100*w,my=num(g.my,6,0,40)/100*h;let usable=w-2*mx,gap=Math.min(num(g.gap,20,0,500),(usable-10)/Math.max(1,cols-1));return {...g,w,h,cols,rows,mx,my,gap,base:Math.round(num(g.base,24,4,200)),cw:(usable-(cols-1)*gap)/cols,ih:h-2*my};}
const round=n=>Number(n.toFixed(3));
function guideSVG(preview=false){const s=gridSpec(),{w,h,cols,rows,gap,cw,ih,mx,my}=s;const line=Math.max(1,Math.min(w,h)/450),a=[],R=n=>round(n);
 a.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Retícula de ${cols} columnas para ${w} por ${h} píxeles">`);
 if(preview){a.push(`<rect width="${w}" height="${h}" fill="#f9f8f5"/>`);const t=Math.max(8,Math.min(w,h)/38);a.push(`<text x="${R(mx+cw*.25)}" y="${R(my+ih*.22)}" font-family="Arial,sans-serif" font-weight="800" font-size="${R(t*1.5)}" fill="#27322f" opacity=".14">ESPACIO</text><text x="${R(mx+cw*.25)}" y="${R(my+ih*.32)}" font-family="Arial,sans-serif" font-size="${R(t*.85)}" fill="#27322f" opacity=".22">estudio / composición</text>`)}
 a.push(`<g fill="none" stroke="#2b96ba" stroke-width="${R(line)}" opacity=".85">`);
 a.push(`<rect x="${R(mx)}" y="${R(my)}" width="${R(w-2*mx)}" height="${R(ih)}" />`);
 if(s.modular){for(let i=0;i<cols;i++){let x=mx+i*(cw+gap);a.push(`<rect x="${R(x)}" y="${R(my)}" width="${R(cw)}" height="${R(ih)}" stroke-opacity=".6" />`)}if(rows>1){for(let j=1;j<rows;j++){const y=my+ih*j/rows;a.push(`<line x1="${R(mx)}" y1="${R(y)}" x2="${R(w-mx)}" y2="${R(y)}" stroke-opacity=".4" />`)}}}a.push('</g>');
 if(s.baseline){a.push(`<g fill="none" stroke="#4f90ac" stroke-width="${R(line*.6)}" opacity=".4">`);const step=s.base;for(let y=my+step;y<h-my;y+=step)a.push(`<line x1="${R(mx)}" y1="${R(y)}" x2="${R(w-mx)}" y2="${R(y)}" />`);a.push('</g>')}
 if(s.thirds){a.push(`<g fill="none" stroke="#a46a35" stroke-width="${R(line*1.35)}" stroke-dasharray="${R(line*6)} ${R(line*6)}" opacity=".75">`);for(let k=1;k<=2;k++)a.push(`<line x1="${R(w*k/3)}" y1="0" x2="${R(w*k/3)}" y2="${h}"/><line x1="0" y1="${R(h*k/3)}" x2="${w}" y2="${R(h*k/3)}"/>`);a.push('</g>')}
 if(s.center){a.push(`<g stroke="#555f5a" fill="none" stroke-width="${R(line)}" stroke-dasharray="${R(line*3)} ${R(line*5)}"><line x1="${w/2}" x2="${w/2}" y1="0" y2="${h}"/><line x1="0" x2="${w}" y1="${h/2}" y2="${h/2}"/></g>`)}
 if(s.safe){a.push(`<rect x="${R(w*.05)}" y="${R(h*.05)}" width="${R(w*.9)}" height="${R(h*.9)}" fill="none" stroke="#dc542f" stroke-width="${R(line*1.65)}" stroke-dasharray="${R(line*9)} ${R(line*5)}"/>`)}
 a.push('</svg>');return a.join('')}
function drawGrid(){const s=gridSpec();$('guidePreview').innerHTML=guideSVG(true);$('guideSize').textContent=`${s.w} × ${s.h} px`;$('guideStats').textContent=`${s.cols} columnas · medianil ${round(s.gap)} px · columna ${round(s.cw)} px`;$('gridAdvice').textContent=formats.find(f=>f.id===state.grid.preset)?.why||'La retícula funciona cuando responde a una jerarquía y no a una moda.';persist()}
$('gridPreset').addEventListener('change',e=>{const f=formats.find(f=>f.id===e.target.value);if(!f)return;Object.assign(state.grid,{preset:f.id,w:f.w,h:f.h,cols:f.cols,rows:f.rows,gap:f.gap,mx:f.mx,my:f.my,base:f.base});showGridControls();drawGrid()});
for(const [prop,id] of Object.entries(gridInputs))$(id).addEventListener('input',e=>{state.grid[prop]=e.target.type==='checkbox'?e.target.checked:Number(e.target.value);if(['w','h','cols','rows','gap','mx','my','base'].includes(prop)){state.grid.preset='custom';$('gridPreset').value='custom'}drawGrid()});
$('exportGridSVG').addEventListener('click',()=>{const s=gridSpec();saveText(guideSVG(false),`lab-reticula-${s.w}x${s.h}.svg`,'image/svg+xml');notice('SVG transparente descargado')});
$('exportGridPNG').addEventListener('click',()=>{const s=gridSpec(),svg=guideSVG(false),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'})),img=new Image();img.onload=()=>{try{const c=document.createElement('canvas');c.width=s.w;c.height=s.h;const ctx=c.getContext('2d');if(!ctx)throw Error('canvas');ctx.clearRect(0,0,s.w,s.h);ctx.drawImage(img,0,0);c.toBlob(b=>{if(b){download(b,`lab-reticula-${s.w}x${s.h}.png`);notice('PNG transparente descargado')}else notice('No se pudo crear el PNG; usá SVG')},'image/png')}catch{notice('No se pudo crear el PNG; usá SVG')}URL.revokeObjectURL(url)};img.onerror=()=>{URL.revokeObjectURL(url);notice('Este navegador no pudo convertir el SVG')};img.src=url});
showGridControls();drawGrid();
// ---------- COLOR ----------
const validHex=s=>/^#[\da-fA-F]{6}$/.test(String(s||''));const rgb=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const lum=c=>{const v=rgb(c).map(x=>x/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));return v[0]*.2126+v[1]*.7152+v[2]*.0722};const contrast=(a,b)=>{const [hi,lo]=[lum(a),lum(b)].sort((x,y)=>y-x);return(hi+.05)/(lo+.05)};
function bars(colors){return '<div class="color-bars">'+colors.map(x=>`<span style="background:${validHex(x)?x:'#888888'}"></span>`).join('')+'</div>'}
function choosePalette(i){const p=curated[i];if(!p)return;state.palette={colors:p.colors.slice(),name:p.name,origin:i};$('paletteName').value=p.name;renderPalette();persist()}
function renderPaletteChoices(){const target=$('paletteChoices');target.replaceChildren();curated.forEach((p,i)=>{let b=document.createElement('button');b.type='button';b.className='choice';b.setAttribute('aria-pressed',String(state.palette.origin===i));b.innerHTML=bars(p.colors);const t=document.createElement('strong');t.textContent=p.name;const sm=document.createElement('small');sm.textContent=p.kind;b.append(t,sm);b.addEventListener('click',()=>choosePalette(i));target.append(b)})}
function renderPaletteControls(){const target=$('colorControls');target.replaceChildren();state.palette.colors.forEach((c,i)=>{const item=document.createElement('div');item.className='color-item';const color=document.createElement('input');color.type='color';color.value=validHex(c)?c:'#ffffff';color.setAttribute('aria-label','Editar '+roles[i]);const label=document.createElement('label');label.textContent=roles[i];const hex=document.createElement('input');hex.type='text';hex.value=c.toUpperCase();hex.maxLength=7;hex.setAttribute('aria-label','Código hexadecimal de '+roles[i]);label.append(hex);const button=document.createElement('button');button.textContent='COPIAR';button.type='button';button.setAttribute('aria-label','Copiar '+c);button.addEventListener('click',()=>copy(state.palette.colors[i]));const change=v=>{if(!validHex(v))return;state.palette.colors[i]=v.toUpperCase();state.palette.origin=-1;color.value=v;hex.value=v.toUpperCase();updatePalette();persist()};color.addEventListener('input',e=>change(e.target.value));hex.addEventListener('change',e=>{if(validHex(e.target.value))change(e.target.value);else{hex.value=state.palette.colors[i];notice('Ingresá un hexadecimal de seis dígitos, por ejemplo #D84E2D')}});item.append(color,label,button);target.append(item)})}
function renderPalette(){renderPaletteChoices();renderPaletteControls();updatePalette();renderSaved()}
function updatePalette(){const c=state.palette.colors;renderPaletteChoices();const v=$('paletteCanvas');v.style.backgroundColor=c[0];v.style.color=c[1];v.querySelector('.palette-kicker').style.color=c[3];v.querySelector('h3 em').style.color=c[3];v.querySelector('.palette-cta').style.backgroundColor=c[3];v.querySelector('.palette-cta').style.color=contrast(c[3],c[1])>=contrast(c[3],c[0])?c[1]:c[0];v.querySelector('.palette-mast').style.borderBottom='1px solid '+c[2];v.querySelector('.palette-foot').style.borderTop='1px solid '+c[2];v.querySelector('.palette-foot').style.paddingTop='16px';$('paletteCurrentName').textContent=state.palette.name||'Paleta en edición';$('paletteAdvice').textContent=curated[state.palette.origin]?.why||'Una paleta se evalúa aplicada a contenidos. Probá superficies extensas, textos largos y acentos antes de darla por cerrada.';updateContrast();persist()}
function updateContrast(){const c=state.palette.colors;const i=Number($('contrastText').value),j=Number($('contrastBg').value),r=contrast(c[i],c[j]);$('contrastRatio').textContent=r.toFixed(2).replace('.',',')+':1';const normal=r>=4.5,large=r>=3;$('contrastNormal').textContent='Texto normal: '+(normal?'AA aprobado':'AA insuficiente');$('contrastNormal').className=normal?'pass':'fail';$('contrastLarge').textContent='Texto grande: '+(large?'AA aprobado':'AA insuficiente');$('contrastLarge').className=large?'pass':'fail'}
for(const id of ['contrastText','contrastBg']){$(id).innerHTML=roles.map((s,i)=>`<option value="${i}">${s}</option>`).join('');$(id).addEventListener('change',updateContrast)}$('contrastText').value='1';$('contrastBg').value='0';
function renderSaved(){const target=$('savedPaletteList');target.replaceChildren();if(!state.saved.length){const p=document.createElement('p');p.className='empty-note';p.textContent='Todavía no guardaste ninguna. Elegí una combinación, ajustala y guardá tu versión.';target.append(p);return}state.saved.forEach((entry,i)=>{const el=document.createElement('div');el.className='saved-entry';const b=document.createElement('button');b.textContent='Abrir';b.type='button';b.addEventListener('click',()=>{state.palette={name:entry.name,colors:entry.colors.slice(),origin:-1};$('paletteName').value=entry.name;renderPalette();notice('Paleta cargada')});const remove=document.createElement('button');remove.textContent='Borrar';remove.type='button';remove.addEventListener('click',()=>{state.saved.splice(i,1);renderSaved();persist()});const strong=document.createElement('strong');strong.textContent=entry.name;el.innerHTML=bars(entry.colors);el.prepend(strong);el.append(b,remove);target.append(el)})}
$('paletteName').value=state.palette.name;
$('paletteName').addEventListener('input',e=>{state.palette.name=e.target.value.slice(0,45);$('paletteCurrentName').textContent=state.palette.name||'Paleta sin nombre';persist()});
$('savePalette').addEventListener('click',()=>{const name=($('paletteName').value||'Paleta sin nombre').trim().slice(0,45);state.palette.name=name;const entry={name,colors:state.palette.colors.slice()};state.saved.unshift(entry);state.saved=state.saved.slice(0,30);renderSaved();persist();notice('Paleta guardada en este navegador')});
function colorCSS(){const c=state.palette.colors;return `/* LAB/OFICIO · ${state.palette.name||'Paleta'} */\n:root {\n`+cssRoles.map((k,i)=>`  --color-${k}: ${c[i]};`).join('\n')+'\n}\n'}
$('exportColorsCSS').addEventListener('click',()=>copy(colorCSS()));$('exportColorsJSON').addEventListener('click',()=>{const data={name:state.palette.name,colors:Object.fromEntries(cssRoles.map((key,i)=>[key,state.palette.colors[i]]))};saveText(JSON.stringify(data,null,2)+'\n','lab-paleta.json','application/json');notice('JSON descargado')});
function ase(colors){const names=roles;const blocks=colors.map((c,i)=>({c,name:names[i]})),len=12+blocks.reduce((tot,b)=>tot+6+2+(b.name.length+1)*2+4+12+2,0);const buffer=new ArrayBuffer(len),d=new DataView(buffer);let p=0;const u16=n=>{d.setUint16(p,n,false);p+=2};const u32=n=>{d.setUint32(p,n,false);p+=4};const f32=n=>{d.setFloat32(p,n,false);p+=4};for(const ch of 'ASEF')d.setUint8(p++,ch.charCodeAt(0));u16(1);u16(0);u32(blocks.length);for(const b of blocks){u16(1);u32(2+(b.name.length+1)*2+4+12+2);u16(b.name.length+1);for(const ch of b.name)u16(ch.charCodeAt(0));u16(0);for(const ch of 'RGB ')d.setUint8(p++,ch.charCodeAt(0));rgb(b.c).forEach(x=>f32(x/255));u16(2)}if(p!==len)throw Error('ASE: tamaño inesperado');return new Blob([buffer],{type:'application/octet-stream'})}
$('exportASE').addEventListener('click',()=>{try{download(ase(state.palette.colors),'lab-paleta.ase');notice('Muestras ASE descargadas')}catch{notice('No se pudo generar el ASE. Usá JSON o CSS')}});
renderPalette();
// ---------- TIPOGRAFÍA ----------
const typeMap={family:'typeFamily',base:'typeBase',ratio:'typeRatio',leading:'typeLeading',measure:'typeMeasure'};
function typeValues(){const t=state.type;const base=num(t.base,16,14,22),ratio=num(t.ratio,1.25,1.125,1.5),leading=num(t.leading,1.55,1.2,1.9),measure=num(t.measure,62,35,85);return {family:t.family,base,ratio,leading,measure,steps:[-1,0,1,2,3,4].map(i=>Math.round(base*Math.pow(ratio,i)*100)/100)}}
function showTypeControls(){for(const [k,id] of Object.entries(typeMap))$(id).value=state.type[k]}
function drawType(){const t=typeValues();$('baseValue').textContent=t.base+' px';$('leadingValue').textContent=t.leading.toFixed(2).replace('.',',');$('measureValue').textContent=t.measure+' ch';$('typeMeta').textContent=`BASE ${t.base} / RAZÓN ${t.ratio}`;const stage=$('typeStage');stage.style.setProperty('--type-body',t.steps[1]+'px');const serif=t.family==='serif'||t.family==='mix';$('specimenDisplay').style.fontFamily=serif?'var(--serif)':'var(--sans)';$('specimenDisplay').style.fontWeight=serif?'600':'900';$('specimenDisplay').style.fontSize=`clamp(29px, ${Math.min(t.steps[5],112)}px, 16vw)`;$('specimenTitle').style.fontFamily=serif?'var(--serif)':'var(--sans)';$('specimenTitle').style.fontSize=`${t.steps[4]}px`;$('specimenSubtitle').style.fontFamily=t.family==='sans'?'var(--sans)':'var(--serif)';$('specimenSubtitle').style.fontSize=`${t.steps[2]}px`;$('specimenBody').style.fontFamily=t.family==='serif'?'var(--serif)':'var(--sans)';$('specimenBody').style.fontSize=t.base+'px';$('specimenBody').style.lineHeight=t.leading;$('specimenBody').style.maxWidth=t.measure+'ch';$('typeScaleList').innerHTML=t.steps.map((n,i)=>`<div class="scale-cell"><small>${['-1','0 / base','+1','+2','+3','+4'][i]}</small><strong>${n.toFixed(2)} px</strong></div>`).join('');persist()}
function typeCSS(){const t=typeValues();return `/* LAB/OFICIO · escala modular */\n:root {\n`+t.steps.map((n,i)=>`  --font-${i===0?'xs':['','body','small-title','subtitle','title','display'][i]}: ${n.toFixed(2)}px;`).join('\n')+`\n  --line-height-body: ${t.leading};\n  --measure-body: ${t.measure}ch;\n}\n/* Fuente base: ${t.base}px · proporción: ${t.ratio} */\n`}
for(const [k,id] of Object.entries(typeMap))$(id).addEventListener('input',e=>{state.type[k]=k==='family'?e.target.value:Number(e.target.value);drawType()});
$('copyTypeCSS').addEventListener('click',()=>copy(typeCSS()));$('exportTypeJSON').addEventListener('click',()=>{const t=typeValues();saveText(JSON.stringify({base:t.base,ratio:t.ratio,lineHeight:t.leading,measureCh:t.measure,sizesPx:{xs:t.steps[0],body:t.steps[1],level1:t.steps[2],level2:t.steps[3],level3:t.steps[4],display:t.steps[5]}},null,2)+'\n','lab-escala-tipografica.json','application/json');notice('Tokens tipográficos descargados')});
showTypeControls();drawType();
// ---------- COMBINACIONES TIPOGRÁFICAS ----------
const pairFonts=[
 {name:'Cormorant Garamond',kind:'serif',use:'display',weights:[400,500,600,700]},
 {name:'DM Sans',kind:'sans',use:'text',weights:[400,500,600,700,800]},
 {name:'Archivo',kind:'sans',use:'both',weights:[400,500,600,700,800,900]},
 {name:'Source Serif 4',kind:'serif',use:'text',weights:[400,500,600,700]},
 {name:'Space Grotesk',kind:'sans',use:'display',weights:[400,500,600,700]},
 {name:'IBM Plex Sans',kind:'sans',use:'text',weights:[400,500,600,700]},
 {name:'Fraunces',kind:'serif',use:'display',weights:[400,500,600,700,800,900]},
 {name:'Manrope',kind:'sans',use:'text',weights:[400,500,600,700,800]},
 {name:'Bebas Neue',kind:'display',use:'display',weights:[400]},
 {name:'Libre Baskerville',kind:'serif',use:'text',weights:[400,700]},
 {name:'Bodoni Moda',kind:'serif',use:'display',weights:[400,500,600,700,800,900]},
 {name:'Outfit',kind:'sans',use:'text',weights:[400,500,600,700,800]},
 {name:'Barlow Condensed',kind:'display',use:'display',weights:[400,500,600,700,800]},
 {name:'Inter',kind:'sans',use:'text',weights:[400,500,600,700,800,900]},
 {name:'IBM Plex Serif',kind:'serif',use:'text',weights:[400,500,600,700]}
];
const pairCurated=[
 {name:'Contraste editorial',style:'Editorial / cultura',display:'Cormorant Garamond',body:'DM Sans',dw:600,bw:400,tracking:-.045,
  idea:'La serif aporta una cadencia caligráfica y contraste en los titulares; la sans baja la temperatura para que el párrafo no compita. La distancia entre funciones es deliberada.',
  caution:'Cormorant pierde firmeza en tamaños pequeños. Reservala para títulos; no la fuerces en etiquetas ni instrucciones.',tip:'La pareja se sostiene con mucho aire y poca ornamentación.'},
 {name:'Sistema contemporáneo',style:'Identidad / instituciones',display:'Archivo',body:'Source Serif 4',dw:800,bw:400,tracking:-.045,
  idea:'Una sans de estructura sólida organiza las jerarquías y una serif diseñada para lectura sostiene los contenidos extensos. Contraste claro sin volver estridente el sistema.',
  caution:'Si dejás títulos y párrafos con tamaños parecidos, el contraste de familias no alcanza para producir jerarquía.',tip:'Funciona bien cuando hay títulos breves y relatos de cierta extensión.'},
 {name:'Tecnología con carácter',style:'Digital / interfaz',display:'Space Grotesk',body:'IBM Plex Sans',dw:600,bw:400,tracking:-.045,
  idea:'Dos sans pueden convivir si ocupan roles distintos: Space Grotesk produce presencia formal; IBM Plex Sans introduce regularidad y claridad en párrafos e interfaces.',
  caution:'Son relativamente cercanas. El vínculo depende de la escala, el peso y la distribución, no solo del nombre de las fuentes.',tip:'Probá usar titulares cortos, datos destacados y etiquetas sobrias.'},
 {name:'Materia y cercanía',style:'Oficio / gastronomía',display:'Fraunces',body:'Manrope',dw:700,bw:400,tracking:-.04,
  idea:'Fraunces tiene un dibujo reconocible y una expresividad que contrasta con la geometría discreta de Manrope. El resultado puede ser artesanal sin recurrir a ornamentos.',
  caution:'Si sumás ilustraciones retro, texturas y colores vintage, la personalidad de Fraunces puede producir un exceso de nostalgia.',tip:'Dejale a Fraunces las frases importantes y a Manrope el trabajo silencioso.'},
 {name:'Impacto con lectura',style:'Afiche / promociones',display:'Bebas Neue',body:'Libre Baskerville',dw:400,bw:400,tracking:.015,
  idea:'Una display estrecha y de mucha altura concentra impacto; una serif tradicional introduce pausas y densidad editorial en la lectura. Buen desacuerdo entre las formas.',
  caution:'Bebas Neue es de caja alta y no sirve para componer párrafos. Tampoco conviene apretar demasiado su tracking.',tip:'Usá un titular realmente grande. Evitá que el texto descriptivo compita con él.'},
 {name:'Contraste de moda',style:'Dirección de arte / moda',display:'Bodoni Moda',body:'Outfit',dw:600,bw:400,tracking:-.055,
  idea:'Bodoni Moda ofrece contraste de trazos, verticalidad y tensión; Outfit estabiliza la lectura con un dibujo más uniforme. La foto y el espacio blanco son parte del sistema.',
  caution:'Los filetes de Bodoni pueden fallar en tamaños chicos, fondos complejos o soportes de baja resolución.',tip:'Reducí la cantidad de pesos y respetá el espacio entre elementos.'},
 {name:'Información urgente',style:'Deporte / retail',display:'Barlow Condensed',body:'Inter',dw:800,bw:400,tracking:-.02,
  idea:'La condensada permite titulares densos sin ocupar toda la superficie; Inter conserva legibilidad en precios, detalles e información funcional.',
  caution:'Condensar todo el sistema vuelve cansadora la lectura. Mantené Barlow Condensed fuera de bloques largos.',tip:'Probá el cartel a distancia y revisá la jerarquía antes de agregar recursos.'},
 {name:'Familia de voces',style:'Editorial / lectura',display:'IBM Plex Serif',body:'IBM Plex Sans',dw:600,bw:400,tracking:-.04,
  idea:'Dos ramas de la misma superfamilia comparten proporciones y espíritu de dibujo. El contraste es moderado, pero el sistema gana cohesión y facilidad de mantenimiento.',
  caution:'La afinidad puede producir monotonía. Necesitás diferencia real de tamaño, interlineado o peso para separar los niveles.',tip:'Es una buena opción cuando importa más la continuidad que el gesto expresivo.'}
];
const pairFontByName=name=>pairFonts.find(f=>f.name===name);
const pairSafeName=name=>String(name||'').replace(/[^\p{L}\p{N} ._\-]/gu,'').trim().slice(0,64);
function pairEffective(p,role){const custom=pairSafeName(role==='display'?p.customDisplay:p.customBody);return custom||p[role]||'Arial'}
function pairFallback(name){const info=pairFontByName(name);return info&&info.kind==='serif'?'Georgia,serif':'Arial,sans-serif'}
function pairCSSFamily(name){return '"'+pairSafeName(name).replaceAll('"','')+'", '+pairFallback(name)}
const pairFontNameOptions=pairFonts.map(f=>`<option value="${f.name}">${f.name} · ${f.kind==='display'?'display':f.kind}</option>`).join('');
$('pairDisplayFont').innerHTML=pairFontNameOptions;$('pairBodyFont').innerHTML=pairFontNameOptions;
let lastPairFonts='';
function pairLoadFonts(){
 const p=state.pair;
 const candidates=[p,...['A','B'].map(letter=>state.pairSlots[letter]).filter(Boolean)];
 const names=[...new Set(candidates.flatMap(item=>[item.customDisplay?'':item.display,item.customBody?'':item.body]).filter(Boolean))];
 const signature=names.join('|');if(signature===lastPairFonts)return;lastPairFonts=signature;
 const families=[...new Set(names)].map(name=>{const f=pairFontByName(name);return f?'family='+encodeURIComponent(f.name).replace(/%20/g,'+')+':wght@'+f.weights.join(';'):''}).filter(Boolean);
 let el=$('pairGoogleFonts');if(!families.length){if(el)el.remove();return}
 if(!el){el=document.createElement('link');el.id='pairGoogleFonts';el.rel='stylesheet';document.head.append(el)}
 el.href='https://fonts.googleapis.com/css2?'+families.join('&')+'&display=swap';
}
function pairPreviewColors(p){if(!p.usePalette)return ['#F3EFE6','#20251F','#B24C30'];return [state.palette.colors[0],state.palette.colors[1],state.palette.colors[3]]}
function pairApplyStyle(stage,p){
 const head=pairEffective(p,'display'),body=pairEffective(p,'body');
 const colors=pairPreviewColors(p);
 stage.style.setProperty('--pair-font-head',pairCSSFamily(head));stage.style.setProperty('--pair-font-body',pairCSSFamily(body));
 stage.style.setProperty('--pair-head-weight',p.displayWeight);stage.style.setProperty('--pair-body-weight',p.bodyWeight);
 stage.style.setProperty('--pair-head-tracking',num(p.tracking,-.04,-.1,.12)+'em');stage.style.setProperty('--pair-body-leading',num(p.leading,1.55,1.2,2));
 stage.style.setProperty('--pair-bg',colors[0]);stage.style.setProperty('--pair-ink',colors[1]);stage.style.setProperty('--pair-accent',colors[2]);
}
function pairSelectedWeights(selectId,name,current){
 const info=pairFontByName(name);const weights=info?info.weights:[400,500,600,700,800,900];
 const select=$(selectId);select.replaceChildren();weights.forEach(w=>{const op=document.createElement('option');op.value=w;op.textContent=String(w);select.append(op)});
 const value=weights.includes(Number(current))?Number(current):weights.reduce((a,b)=>Math.abs(b-Number(current))<Math.abs(a-Number(current))?b:a,weights[0]);
 select.value=String(value);return value;
}
function pairRenderControls(){
 const p=state.pair;
 $('pairDisplayFont').value=p.display;$('pairBodyFont').value=p.body;
 $('pairDisplayCustom').value=p.customDisplay||'';$('pairBodyCustom').value=p.customBody||'';
 p.displayWeight=pairSelectedWeights('pairDisplayWeight',p.customDisplay?'':p.display,p.displayWeight);
 p.bodyWeight=pairSelectedWeights('pairBodyWeight',p.customBody?'':p.body,p.bodyWeight);
 $('pairTracking').value=num(p.tracking,-.04,-.1,.12);$('pairLeading').value=num(p.leading,1.55,1.2,2);
 $('pairContext').value=p.context;$('pairUsePalette').checked=!!p.usePalette;
 $('pairEyebrow').value=p.eyebrow;$('pairHeadline').value=p.headline;$('pairText').value=p.text;$('pairName').value=p.name||'';
}
function pairRenderPresets(){
 const holder=$('pairPresets');holder.replaceChildren();
 pairCurated.forEach((data,i)=>{
  const btn=document.createElement('button');btn.type='button';btn.className='pair-preset';btn.setAttribute('aria-pressed',String(state.pair.preset===i));
  const n=document.createElement('span');n.className='pair-preset-num';n.textContent=String(i+1).padStart(2,'0')+' / '+data.style;
  const center=document.createElement('div'),title=document.createElement('strong'),desc=document.createElement('small');title.textContent=data.name;desc.textContent=data.display+' / '+data.body;center.append(title,desc);
  const base=document.createElement('div');base.className='pair-preset-fonts';base.textContent='ELEGIR ESTA RELACIÓN ↗';btn.append(n,center,base);
  btn.addEventListener('click',()=>{Object.assign(state.pair,{preset:i,display:data.display,body:data.body,customDisplay:'',customBody:'',displayWeight:data.dw,bodyWeight:data.bw,tracking:data.tracking,name:data.name});pairRenderControls();pairRender();notice('Combinación cargada')});holder.append(btn);
 });
}
function pairReview(p){
 if(p.customDisplay||p.customBody)return {title:'Fuentes propias / contraste por evaluar',idea:'La vista previa muestra la relación en escala y contexto. Con fuentes instaladas, compará la altura de x, el ancho de las letras y la densidad del texto. No hay un puntaje automático que sustituya esa lectura.',caution:'La vista previa solo es fiel si ambas fuentes están instaladas o activadas en esta computadora. Revisá también los pesos realmente disponibles.',tip:'Tomá una captura a tamaño real y probá la pareja en un párrafo largo.'};
 const indexed=pairCurated[p.preset];if(indexed&&indexed.display===p.display&&indexed.body===p.body)return {title:indexed.name,idea:indexed.idea,caution:indexed.caution,tip:indexed.tip};
 const a=pairFontByName(p.display),b=pairFontByName(p.body);
 if(p.display===p.body)return {title:'Una familia, dos funciones',idea:'La unidad formal puede ser una buena decisión. Construí diferencias reales de tamaño, peso y espacio para separar los niveles; no necesitás dos familias por obligación.',caution:'Cuando todo tiene el mismo peso visual, la jerarquía desaparece aunque los tamaños cambien.',tip:'Probá un título extremo y un párrafo contenido.'};
 if(a?.kind==='display'&&b?.use==='display')return {title:'Dos voces dominantes',idea:'Ambas familias reclaman protagonismo. Puede funcionar en un afiche expresivo, pero la lectura sostenida queda sin una voz silenciosa.',caution:'Evitá usar la segunda display como fuente de párrafos extensos.',tip:'Cambiá la fuente de lectura por una diseñada para texto.'};
 if(b?.use==='display')return {title:'Una display en texto corrido',idea:'La combinación ofrece un contraste formal, pero el rol asignado a la segunda fuente es frágil.',caution:'Las display suelen perder legibilidad o ritmo en párrafos. Evaluá otra familia para lectura.',tip:'Probá la legibilidad con un texto de más de seis líneas.'};
 if(a?.kind==='serif'&&b?.kind==='sans')return {title:'Contraste serif / sans',idea:'Las diferencias entre terminaciones y construcción facilitan separar titular y texto. La calidad de la pareja depende también de proporciones, pesos, escala y tono.',caution:'No todas las serif y sans comparten una temperatura visual compatible. Revisá el contraste de trazo y la altura de x.',tip:'Una distribución de roles clara suele pesar más que la moda de la fuente.'};
 if(a?.kind==='sans'&&b?.kind==='serif')return {title:'Estructura y lectura',idea:'Una sans en titulares suele dar dirección clara y una serif puede aportar ritmo en texto largo. Probá la medida de línea y el interlineado: ahí se decide buena parte de la lectura.',caution:'Los detalles finos pueden perderse en cuerpos pequeños o sobre fondos complejos.',tip:'Contrastá no solo el dibujo, también el ancho de las líneas.'};
 return {title:'Contraste por construir',idea:'La relación tipográfica necesita una jerarquía de roles. Revisá la escala, las proporciones y la textura de cada bloque, no solamente si los nombres de las fuentes combinan.',caution:'Dos familias muy cercanas y con pesos similares pueden confundirse en lugar de complementarse.',tip:'Si las dos quieren ser protagonistas, decidí cuál tiene que retroceder.'};
}
function pairRender(){
 const p=state.pair;pairLoadFonts();pairRenderPresets();
 const stage=$('pairStage');stage.className='pair-stage context-'+(['editorial','web','poster'].includes(p.context)?p.context:'editorial');pairApplyStyle(stage,p);
 $('pairSampleEyebrow').textContent=p.eyebrow||' ';$('pairSampleHeadline').textContent=p.headline||' ';$('pairSampleBody').textContent=p.text||' ';
 $('pairPreviewNames').textContent=pairEffective(p,'display')+' + '+pairEffective(p,'body');
 $('pairDisplayName').textContent=pairEffective(p,'display');$('pairBodyName').textContent=pairEffective(p,'body');
 const displayStyle=$('pairDisplayChars').style,bodyStyle=$('pairBodyChars').style;
 displayStyle.fontFamily=pairCSSFamily(pairEffective(p,'display'));displayStyle.fontWeight=p.displayWeight;
 bodyStyle.fontFamily=pairCSSFamily(pairEffective(p,'body'));bodyStyle.fontWeight=p.bodyWeight;
 $('pairTrackingValue').textContent=(Number(p.tracking)>0?'+':'')+Number(p.tracking).toFixed(2).replace('.',',')+' em';
 $('pairLeadingValue').textContent=Number(p.leading).toFixed(2).replace('.',',');
 const review=pairReview(p);$('pairVerdictTitle').textContent=review.title;$('pairWhy').textContent=review.idea;$('pairCaution').textContent=review.caution;$('pairHint').textContent='PRUEBA → '+review.tip;
 pairRenderSlots();pairRenderSaved();persist();
}
function pairChangeFont(role){
 const p=state.pair;p[role]=$('pair'+(role==='display'?'Display':'Body')+'Font').value;
 const customField=role==='display'?'pairDisplayCustom':'pairBodyCustom';p[role==='display'?'customDisplay':'customBody']=pairSafeName($(customField).value);
 p[role==='display'?'displayWeight':'bodyWeight']=pairSelectedWeights(role==='display'?'pairDisplayWeight':'pairBodyWeight',p[role==='display'?'customDisplay':'customBody']?'':p[role],p[role==='display'?'displayWeight':'bodyWeight']);
 p.preset=-1;pairRender();
}
$('pairDisplayFont').addEventListener('change',()=>pairChangeFont('display'));$('pairBodyFont').addEventListener('change',()=>pairChangeFont('body'));
for(const [id,role] of [['pairDisplayCustom','display'],['pairBodyCustom','body']])$(id).addEventListener('input',e=>{state.pair[role==='display'?'customDisplay':'customBody']=pairSafeName(e.target.value);state.pair.preset=-1;pairSelectedWeights(role==='display'?'pairDisplayWeight':'pairBodyWeight',state.pair[role==='display'?'customDisplay':'customBody']?'':state.pair[role],state.pair[role==='display'?'displayWeight':'bodyWeight']);pairRender()});
for(const [id,k,type] of [['pairDisplayWeight','displayWeight','num'],['pairBodyWeight','bodyWeight','num'],['pairTracking','tracking','num'],['pairLeading','leading','num'],['pairContext','context','str'],['pairEyebrow','eyebrow','str'],['pairHeadline','headline','str'],['pairText','text','str'],['pairName','name','str']])$(id).addEventListener('input',e=>{state.pair[k]=type==='num'?Number(e.target.value):e.target.value;pairRender()});
$('pairUsePalette').addEventListener('change',e=>{state.pair.usePalette=e.target.checked;pairRender()});
function pairStoreSlot(letter){state.pairSlots[letter]=clone(state.pair);pairRender();notice('Alternativa '+letter+' guardada')}
$('pairSaveA').addEventListener('click',()=>pairStoreSlot('A'));$('pairSaveB').addEventListener('click',()=>pairStoreSlot('B'));
function pairRenderSlots(){
 const host=$('pairComparison');host.replaceChildren();
 for(const letter of ['A','B']){
  const p=state.pairSlots[letter];if(!p){const placeholder=document.createElement('div');placeholder.className='pair-compare-card';placeholder.innerHTML=`<div class="pair-compare-top"><span>${letter} / SIN GUARDAR</span></div><p>Fijá una alternativa para comparar con el mismo contenido.</p>`;host.append(placeholder);continue}
  const card=document.createElement('div');card.className='pair-compare-card';
  const top=document.createElement('div');top.className='pair-compare-top';const badge=document.createElement('span');badge.textContent=letter+' / '+(p.name||'Versión');const load=document.createElement('button');load.type='button';load.textContent='Recuperar ↗';load.addEventListener('click',()=>{state.pair=clone(p);pairRenderControls();pairRender();notice('Versión '+letter+' recuperada')});top.append(badge,load);
  const heading=document.createElement('h4');heading.textContent=state.pair.headline||'El oficio de mirar.';heading.style.fontFamily=pairCSSFamily(pairEffective(p,'display'));heading.style.fontWeight=p.displayWeight;heading.style.letterSpacing=num(p.tracking,-.04,-.1,.12)+'em';
  const body=document.createElement('p');body.textContent=state.pair.text||'Una prueba de lectura.';body.style.fontFamily=pairCSSFamily(pairEffective(p,'body'));body.style.fontWeight=p.bodyWeight;body.style.lineHeight=p.leading;
  const fonts=document.createElement('small');fonts.textContent=pairEffective(p,'display')+' / '+pairEffective(p,'body');card.append(top,heading,body,fonts);host.append(card);
 }
}
function pairRenderSaved(){const holder=$('pairSavedList');holder.replaceChildren();if(!state.pairSaved.length){const empty=document.createElement('p');empty.className='empty-note';empty.textContent='Todavía no guardaste combinaciones.';holder.append(empty);return}
 state.pairSaved.forEach((saved,i)=>{const el=document.createElement('div');el.className='pair-saved-entry';const meta=document.createElement('div');meta.className='pair-saved-meta';const name=document.createElement('strong');name.textContent=saved.name;const fonts=document.createElement('small');fonts.textContent=pairEffective(saved.pair,'display')+' / '+pairEffective(saved.pair,'body');meta.append(name,fonts);const open=document.createElement('button');open.type='button';open.textContent='Abrir';open.addEventListener('click',()=>{state.pair=clone(saved.pair);pairRenderControls();pairRender();notice('Combinación cargada')});const remove=document.createElement('button');remove.type='button';remove.textContent='Borrar';remove.addEventListener('click',()=>{state.pairSaved.splice(i,1);pairRenderSaved();persist()});el.append(meta,open,remove);holder.append(el)})
}
$('pairSave').addEventListener('click',()=>{const name=(state.pair.name||'Combinación sin nombre').trim().slice(0,55)||'Combinación sin nombre';state.pair.name=name;state.pairSaved.unshift({name,pair:clone(state.pair)});state.pairSaved=state.pairSaved.slice(0,30);pairRenderSaved();persist();notice('Combinación guardada en este navegador')});
function pairCSS(){const p=state.pair;const d=pairEffective(p,'display'),b=pairEffective(p,'body');const imports=[...new Set([p.customDisplay?'':p.display,p.customBody?'':p.body])].filter(Boolean).map(name=>{const f=pairFontByName(name);return f?'family='+encodeURIComponent(f.name).replace(/%20/g,'+')+':wght@'+f.weights.join(';'):''}).filter(Boolean);
 const importLine=imports.length?`@import url('https://fonts.googleapis.com/css2?${imports.join('&')}&display=swap');\n`:'/* Fuentes instaladas localmente: verificá su disponibilidad en el equipo de destino. */\n';
 return `/* LAB/OFICIO · ${(p.name||'combinación').replace(/[\r\n*\/]/g,'')} */\n${importLine}:root {\n  --font-display: ${pairCSSFamily(d)};\n  --font-texto: ${pairCSSFamily(b)};\n  --peso-display: ${p.displayWeight};\n  --peso-texto: ${p.bodyWeight};\n  --tracking-display: ${num(p.tracking,-.04,-.1,.12)}em;\n  --interlineado-texto: ${num(p.leading,1.55,1.2,2)};\n}\n.titulo {font-family:var(--font-display);font-weight:var(--peso-display);letter-spacing:var(--tracking-display);line-height:.95;}\n.parrafo {font-family:var(--font-texto);font-weight:var(--peso-texto);line-height:var(--interlineado-texto);}\n`;
}
$('pairExportCSS').addEventListener('click',()=>{saveText(pairCSS(),'lab-combinacion-tipografica.css','text/css');notice('CSS descargado')});
$('pairExportJSON').addEventListener('click',()=>{const p=state.pair;saveText(JSON.stringify({name:p.name,display:{family:pairEffective(p,'display'),weight:p.displayWeight,trackingEm:Number(p.tracking)},body:{family:pairEffective(p,'body'),weight:p.bodyWeight,lineHeight:Number(p.leading)},context:p.context,palette:p.usePalette?'paleta-del-laboratorio':null},null,2)+'\n','lab-combinacion-tipografica.json','application/json');notice('JSON descargado')});
try{pairRenderControls();pairRender()}catch(e){console.error('Error en combinación tipográfica',e)}
})();
