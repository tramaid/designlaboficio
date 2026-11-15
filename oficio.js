/* LAB/OFICIO V5 — Puente entre curso, taller, herramientas y recorridos.
   Se carga en el <head> de cada página, antes que los scripts propios de cada una.
   No reemplaza ninguna lógica existente: lee los datos que ya se guardan y agrega
   orientación (la guía del recorrido), traspasos y referencias cruzadas. */
(()=>{'use strict';
const D=window.OFICIO_DATOS;if(!D)return;
const K={L:'laboratorio-oficio-v2',Q:'laboratorio-quiz-v2',T:'lab-oficio-taller-v1',H:'lab-oficio-herramientas-v1',E:'lab-oficio-estudio-v4',P:'lab-oficio-recorridos-v5',X:'lab-oficio-traspaso'};
const read=k=>{try{const v=JSON.parse(localStorage.getItem(K[k])||'null');return v&&typeof v==='object'?v:{}}catch{return {}}};
const write=(k,v)=>{try{localStorage.setItem(K[k],JSON.stringify(v));return true}catch{return false}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FILE=(location.pathname.split('/').pop()||'index.html');
const pathById=id=>D.PATHS.find(p=>p.id===id);
const snapshot=()=>({L:read('L'),T:read('T'),H:read('H'),E:read('E'),P:read('P')});

/* ---------- Estado de los recorridos ---------- */
function rec(P,id){P.paths??={};const r=P.paths[id]??={};r.closed??={};r.experimentar??={};r.practicar??={};r.evaluar??={};r.aplicar??={};r.evaluar.rubric??={A:{},B:{}};r.evaluar.readings??={};r.evaluar.prediction??={};r.aplicar.checks??=[];return r}
function update(fn){const P=read('P');fn(P);P.updated=Date.now();write('P',P);return P}

/* ---------- Color ---------- */
const hex=c=>{c=String(c||'').trim();if(/^#[0-9a-f]{3}$/i.test(c))c='#'+[...c.slice(1)].map(x=>x+x).join('');return /^#[0-9a-f]{6}$/i.test(c)?c.toUpperCase():null};
function rgb(c){c=hex(c)||'#000000';return [1,3,5].map(i=>parseInt(c.slice(i,i+2),16)/255)}
function lum(c){return rgb(c).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0)}
function contrast(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
function hsl(c){const [r,g,b]=rgb(c),mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return {h,s,l}}

/* ---------- Composiciones del taller ---------- */
function tallerSVG(comp,opt={}){
 const W=800,items=Array.isArray(comp?.items)?comp.items:[],bg=hex(comp?.bg)||'#F2EEE6';
 const out=[`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${opt.size||W}" height="${opt.size||W}"${opt.label?` role="img" aria-label="${esc(opt.label)}"`:''}>`,`<rect width="${W}" height="${W}" fill="${bg}"/>`];
 items.forEach((it,i)=>{
  if(it.type==='rect'){out.push(`<rect data-i="${i}" x="${+it.x||0}" y="${+it.y||0}" width="${Math.max(2,+it.w||0)}" height="${Math.max(2,+it.h||0)}" fill="${hex(it.fill)||'#000000'}"/>`);return}
  const size=+it.size||20,lead=(+it.leading||1.1)*size,fam=it.font==='serif'?'Georgia, serif':'Arial, sans-serif';
  const lines=String(it.text??'').split('\n').map((l,j)=>`<tspan x="${+it.x||0}" dy="${j?lead:0}">${esc(l)}</tspan>`).join('');
  out.push(`<text data-i="${i}" x="${+it.x||0}" y="${+it.y||0}" fill="${hex(it.fill)||'#000000'}" font-family="${fam}" font-size="${size}" font-weight="${+it.weight||700}" letter-spacing="${+it.tracking||0}">${lines}</text>`)});
 if(opt.points&&opt.points.length)opt.points.forEach((p,j)=>out.push(`<g><circle cx="${p.x*8}" cy="${p.y*8}" r="22" fill="#C7472B" stroke="#fff" stroke-width="4"/><text x="${p.x*8}" y="${p.y*8+9}" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#fff">${j+1}</text></g>`));
 out.push('</svg>');return out.join('');
}
function boxes(comp){
 const items=Array.isArray(comp?.items)?comp.items:[];
 const est=it=>{if(it.type==='rect')return {x:+it.x,y:+it.y,w:+it.w,h:+it.h};const size=+it.size||20,lines=String(it.text??'').split('\n'),k=it.font==='serif'?.5:.58;const w=Math.max(...lines.map(l=>l.length))*size*k*((+it.weight||700)>=800?1.06:1);return {x:+it.x,y:+it.y-size*.78,w,h:size*.98+(lines.length-1)*(+it.leading||1.1)*size}};
 if(typeof document==='undefined'||!document.body)return items.map(est);
 const host=document.createElement('div');host.style.cssText='position:absolute;left:-10000px;top:0;width:800px;height:800px;visibility:hidden;pointer-events:none';host.innerHTML=tallerSVG(comp);document.body.appendChild(host);
 const res=items.map((it,i)=>{const el=host.querySelector(`[data-i="${i}"]`);try{const b=el.getBBox();if(b.width||b.height)return {x:b.x,y:b.y,w:b.width,h:b.height}}catch{}return est(it)});
 host.remove();return res;
}
function analyze(comp){
 const items=Array.isArray(comp?.items)?comp.items:[],bg=hex(comp?.bg)||'#F2EEE6',bx=boxes(comp),A=800*800;
 const texts=items.map((it,i)=>({it,b:bx[i],i})).filter(x=>x.it.type==='text'&&String(x.it.text||'').trim());
 const rects=items.map((it,i)=>({it,b:bx[i],i})).filter(x=>x.it.type==='rect');
 const sizes=texts.map(x=>+x.it.size||0).sort((a,b)=>b-a);
 const ratio=sizes.length>1?sizes[0]/Math.max(1,sizes[1]):1;
 const distinct=new Set(sizes.map(Math.round)).size;
 const families=new Set(texts.map(x=>x.it.font==='serif'?'serif':'sans')).size;
 const lefts=[];texts.forEach(x=>{const v=+x.it.x||0;if(!lefts.some(l=>Math.abs(l-v)<=6))lefts.push(v)});
 const edge=texts.filter(x=>x.b.x<32||x.b.y<32||x.b.x+x.b.w>768||x.b.y+x.b.h>768).length;
 const bgLike=r=>r.b.w*r.b.h>=A*.9;
 let cov=0;const N=60;for(let gx=0;gx<N;gx++)for(let gy=0;gy<N;gy++){const px=(gx+.5)*800/N,py=(gy+.5)*800/N;const hit=texts.some(x=>px>=x.b.x&&px<=x.b.x+x.b.w&&py>=x.b.y&&py<=x.b.y+x.b.h)||rects.some(r=>!bgLike(r)&&px>=r.b.x&&px<=r.b.x+r.b.w&&py>=r.b.y&&py<=r.b.y+r.b.h);if(hit)cov++}
 const coverage=cov/(N*N)*100;
 const chroma=items.map((it,i)=>({i,c:hex(it.fill)})).filter(x=>x.c).map(x=>({...x,...hsl(x.c)})).filter(x=>x.s>.35&&x.l>.18&&x.l<.86);
 let accent=0;if(chroma.length){const top=chroma.slice().sort((a,b)=>b.s*(1-Math.abs(b.l-.5))-a.s*(1-Math.abs(a.l-.5)))[0];accent=chroma.filter(x=>{const dh=Math.min(Math.abs(x.h-top.h),360-Math.abs(x.h-top.h));return dh<=14&&Math.abs(x.l-top.l)<=.16}).length}
 let minContrast=21;texts.forEach(x=>{const cx=x.b.x+x.b.w/2,cy=x.b.y+x.b.h/2;let under=bg;rects.filter(r=>r.i<x.i&&cx>=r.b.x&&cx<=r.b.x+r.b.w&&cy>=r.b.y&&cy<=r.b.y+r.b.h).forEach(r=>under=hex(r.it.fill)||under);minContrast=Math.min(minContrast,contrast(hex(x.it.fill)||'#000000',under))});
 if(!texts.length)minContrast=0;
 const imgs=rects.filter(r=>!bgLike(r)).map(r=>Math.max(0,Math.min(800,r.b.x+r.b.w)-Math.max(0,r.b.x))*Math.max(0,Math.min(800,r.b.y+r.b.h)-Math.max(0,r.b.y)));
 const imageArea=imgs.length?Math.max(...imgs)/A*100:0;
 return {ratio,sizes:distinct,families,axes:lefts.length,edge,coverage,accent,minContrast,imageArea,texts:texts.length};
}
function analyzeSystem(s){if(!s)return null;const bg=hex(s.bg)||'#FFFFFF',ink=hex(s.ink)||'#000000',ac=hex(s.accent)||'#C6492C';return {inkBg:contrast(ink,bg),accentBg:contrast(ac,bg),onAccent:Math.max(contrast(ink,ac),contrast(bg,ac))}}
function systemSVG(s,opt={}){
 if(!s)return '';const bg=hex(s.bg)||'#F5F0E6',ink=hex(s.ink)||'#17241F',ac=hex(s.accent)||'#C6492C',sup=hex(s.support)||'#B7BEAF';
 const hf=String(s.headFont||'Georgia').replace(/[<>"]/g,''),bf=String(s.bodyFont||'Arial').replace(/[<>"]/g,'');
 const motif=s.motif==='block'?`<rect x="0" y="0" width="320" height="800" fill="${ac}"/>`:s.motif==='circle'?`<circle cx="640" cy="170" r="110" fill="${ac}"/>`:s.motif==='none'?'':`<rect x="64" y="452" width="260" height="10" fill="${ac}"/>`;
 const x=s.motif==='block'?364:64;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="${opt.size||800}" height="${opt.size||800}"><rect width="800" height="800" fill="${bg}"/>${motif}<text x="${x}" y="200" font-family="${esc(hf)}, Georgia, serif" font-size="${s.motif==='block'?78:96}" font-weight="700" fill="${ink}">${esc(String(s.name||'MARCA').slice(0,10))}</text><text x="${x}" y="300" font-family="${esc(bf)}, Arial, sans-serif" font-size="30" fill="${ink}">${esc(String(s.claim||'').slice(0,34))}</text><rect x="${x}" y="600" width="230" height="74" fill="${ac}"/><text x="${x+26}" y="647" font-family="${esc(bf)}, Arial, sans-serif" font-size="24" font-weight="700" fill="${contrast(bg,ac)>=contrast(ink,ac)?bg:ink}">VER MÁS →</text><rect x="${x+262}" y="600" width="74" height="74" fill="${sup}"/></svg>`;
}

/* ---------- Pruebas de cada estación ---------- */
function testOne(t,m){const v=m?.[t.metric];if(v===undefined||v===null)return {...t,value:null,pass:false};const pass=t.op==='>='?v>=t.v-1e-9:t.op==='<='?v<=t.v+1e-9:Math.abs(v-t.v)<1e-9;return {...t,value:v,pass}}
function tests(spec,m){if(!spec)return [];return (Array.isArray(spec)?spec:[spec]).map(t=>testOne(t,m))}
function testText(t){const M=D.METRICS[t.metric];const op={'>=':'≥','<=':'≤','==':'='}[t.op];const val=t.metric==='coverage'||t.metric==='imageArea'?Math.round(t.v)+' %':t.metric==='ratio'||t.metric==='minContrast'?String(t.v).replace('.',',')+' : 1':String(t.v);return `${M?M.name:t.metric} ${op} ${val}`}
function fmtMetric(k,v){const M=D.METRICS[k];return v===null||v===undefined?'—':M?M.fmt(v):String(v)}

function practiceSource(path,S){
 const pr=path.practicar;
 if(pr.kind==='system'){const sys=(S.E.systems||[]);return {A:sys[1]?{system:sys[1]}:null,B:sys[0]?{system:sys[0]}:null,kind:'system'}}
 const v=(S.T.versions||{})[pr.brief]||{};return {A:v.A?{items:v.A.items,bg:v.A.bg}:null,B:v.B?{items:v.B.items,bg:v.B.bg}:null,kind:'taller'};
}
function versionMetrics(ver,kind){if(!ver)return null;return kind==='system'?analyzeSystem(ver.system):analyze(ver)}
function practiceTests(path,src){const pr=path.practicar;if(src.kind==='system'){const a=src.A?.system,b=src.B?.system;const distinct=!!(a&&b)&&(a.motif!==b.motif||a.rule!==b.rule||a.accent!==b.accent);return {A:[{metric:'saved',label:'Sistema A guardado',pass:!!a}],B:[{metric:'saved',label:'Sistema B guardado',pass:!!b},{metric:'distinct',label:'B cambia el motivo, la regla o el acento respecto de A',pass:distinct}]}}
 return {A:tests(pr.A.test,versionMetrics(src.A,'taller')),B:tests(pr.B.test,versionMetrics(src.B,'taller'))}}

function status(path,S=snapshot()){
 const r=rec(S.P,path.id),out={};
 // 1 Entender
 const plates=path.entender.plates,done=plates.filter(p=>{const [f,id]=p.split('#');return !!(S.L.done||{})[f+':'+id]}).length;
 out.entender={state:done===plates.length?'done':done?'progress':'todo',detail:`${done} de ${plates.length} láminas comprendidas`,count:done,total:plates.length};
 // 2 Experimentar
 const sig=path.experimentar.signal?path.experimentar.signal(S):{ok:true,text:''};const ans=String(r.experimentar.answer||'').trim();
 const exOk=sig.ok&&ans.length>=40;
 out.experimentar={state:exOk?'done':(sig.ok||ans)?'progress':'todo',detail:exOk?'Probaste y registraste lo que viste.':!sig.ok?sig.text:'Falta escribir lo que observaste (40 caracteres o más).',signal:sig,answer:ans};
 // 3 Practicar
 const snap=r.practicar.A&&r.practicar.B;
 let prState='todo',prDetail='Guardá A y B y fijalas en el recorrido.';
 if(snap){const t=practiceTests(path,{A:r.practicar.A,B:r.practicar.B,kind:path.practicar.kind==='system'?'system':'taller'});const all=[...t.A,...t.B];const ok=all.every(x=>x.pass);prState=ok?'done':'progress';prDetail=ok?'El experimento se cumplió en las dos versiones.':`El experimento no se cumplió: ${all.filter(x=>!x.pass).map(x=>x.label||testText(x)).join(' · ')}`}
 else{const src=practiceSource(path,S);if(src.A||src.B){prState='progress';prDetail=`${src.A?'A lista':'A pendiente'} · ${src.B?'B lista':'B pendiente'}. Falta fijarlas en el recorrido.`}}
 out.practicar={state:prState,detail:prDetail};
 // 4 Evaluar
 const crit=[...path.evaluar.criteria,...D.SHARED].map(c=>c.id);const ru=r.evaluar.rubric;const rated=['A','B'].reduce((n,v)=>n+crit.filter(c=>ru[v]?.[c]).length,0);const dec=String(r.evaluar.decision||'').trim();
 const evOk=rated===crit.length*2&&!!r.evaluar.choice&&dec.length>=40;
 out.evaluar={state:evOk?'done':(rated||dec||r.evaluar.choice)?'progress':'todo',detail:evOk?`Elegiste ${r.evaluar.choice} y lo justificaste.`:`Rúbrica ${rated} de ${crit.length*2} · ${r.evaluar.choice?'elección hecha':'falta elegir'} · ${dec.length>=40?'decisión escrita':'falta escribir la decisión'}`,rated,total:crit.length*2};
 // 5 Aplicar
 const ap=r.aplicar,checks=path.aplicar.checks.filter((_,i)=>ap.checks[i]).length,refl=String(ap.reflection||'').trim();
 const apOk=String(ap.piece||'').trim().length>=3&&checks===path.aplicar.checks.length&&refl.length>=60;
 out.aplicar={state:apOk?'done':(ap.piece||checks||refl)?'progress':'todo',detail:apOk?`Aplicado en «${ap.piece}».`:`${String(ap.piece||'').trim()?'Pieza elegida':'Falta elegir la pieza'} · revisión ${checks} de ${path.aplicar.checks.length} · ${refl.length>=60?'reflexión escrita':'falta la reflexión final'}`};
 for(const st of D.STATIONS)if(out[st.id].state!=='done'&&r.closed[st.id])out[st.id].state='closed';
 return out;
}
function progress(path,S){const st=status(path,S);const n=D.STATIONS.filter(s=>['done','closed'].includes(st[s.id].state)).length;const next=D.STATIONS.find(s=>!['done','closed'].includes(st[s.id].state));return {status:st,n,next}}

/* ---------- Destinos de cada estación ---------- */
function stationHref(path,st){
 if(st==='entender'){const L=read('L').done||{};const p=path.entender.plates.find(x=>{const [f,id]=x.split('#');return !L[f+':'+id]})||path.entender.plates[0];return p}
 if(st==='experimentar')return path.experimentar.tool;
 if(st==='practicar')return path.practicar.kind==='system'?path.practicar.tool:'taller.html#'+path.practicar.brief;
 return 'recorridos.html#'+path.id+'/'+st;
}
function resume(S=snapshot()){const a=S.P.active;const path=a&&pathById(a.path);if(!path)return null;const pr=progress(path,S);if(!pr.next)return null;const cur=pr.status[a.station];const st=cur&&!['done','closed'].includes(cur.state)?D.STATIONS.find(s=>s.id===a.station):pr.next;return {path,station:st}}
function activate(pathId,st){update(P=>{P.active={path:pathId,station:st,at:Date.now()}})}

/* ---------- Presets: se aplican antes de que la herramienta lea su estado ---------- */
(function applyPreset(){
 let url;try{url=new URL(location.href)}catch{return}
 const id=url.searchParams.get('aplicar');if(!id)return;
 url.searchParams.delete('aplicar');try{history.replaceState(null,'',url.pathname+(url.search||'')+url.hash)}catch{}
 const path=pathById(id),pr=path?.experimentar?.preset;if(!pr)return;
 const store=read(pr.store);const prev=store[pr.key]===undefined?null:JSON.parse(JSON.stringify(store[pr.key]));
 store[pr.key]={...(store[pr.key]&&typeof store[pr.key]==='object'?store[pr.key]:{}),...pr.value};
 if(!write(pr.store,store))return;
 update(P=>{P.stash??={};P.stash[pr.store+'.'+pr.key]={value:prev,at:Date.now(),label:pr.label,path:id};P.applied={path:id,key:pr.store+'.'+pr.key,label:pr.label,at:Date.now(),file:FILE}});
})();
function restorePreset(key){const P=read('P'),st=P.stash?.[key];if(!st)return;const [store,k]=key.split('.');const S=read(store);if(st.value===null)delete S[k];else S[k]=st.value;write(store,S);update(P=>{delete P.stash[key];if(P.applied?.key===key)delete P.applied});location.reload()}

/* ---------- Traspaso al laboratorio de jerarquía ---------- */
function handoff({svg,source,goal='',path=null,version=null}){
 try{localStorage.setItem(K.X,JSON.stringify({svg,source,goal,path,version,at:Date.now()}))}catch{alert('No se pudo preparar el traspaso: el guardado del navegador está lleno.');return}
 location.href='estudio.html#hierarchy';
}

/* ---------- API pública (la usan recorridos.js y otras páginas) ---------- */
window.OFICIO={D,K,read,write,update,rec,esc,hex,contrast,tallerSVG,systemSVG,analyze,analyzeSystem,tests,testText,fmtMetric,practiceSource,practiceTests,versionMetrics,status,progress,resume,stationHref,activate,handoff,restorePreset,pathById,snapshot};

/* ================== Interfaz ================== */
function el(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild}
const plateName=k=>D.PLATE_NAMES[k]||k;
function pathsForPlate(key){return D.PATHS.filter(p=>p.entender.plates.includes(key))}
function pathsForTool(key){return D.PATHS.map(p=>{const roles=[];if(p.experimentar.tool===key)roles.push('experimentar');if(p.experimentar.support===key)roles.push('apoyo');if(p.practicar.tool===key)roles.push('practicar');if(key==='estudio.html#hierarchy'&&p.practicar.kind!=='system')roles.push('evaluar');if(key==='taller.html'&&p.practicar.brief)roles.push('practicar');return roles.length?{p,roles}:null}).filter(Boolean)}
const ROLE={experimentar:'experimentar',apoyo:'apoyo',practicar:'práctica',evaluar:'evaluación'};

function chipsInModules(){
 if(!D.MODULE_NAMES[FILE])return;
 const P=read('P'),active=P.active&&pathById(P.active.path);
 document.querySelectorAll('.plate').forEach(plate=>{
  const key=FILE+'#'+plate.id,list=pathsForPlate(key);if(!list.length)return;
  const aside=plate.querySelector('.lab-aside');const box=el(`<div class="of-plate-paths"><span class="of-mini">Se trabaja en</span>${list.map(p=>`<a href="recorridos.html#${p.id}">${p.n} · ${esc(p.name)} ↗</a>`).join('')}</div>`);
  if(aside)aside.append(box);else plate.append(box);
  if(active&&list.includes(active)){plate.classList.add('of-in-path');plate.querySelector('.plate-no')?.append(el(`<span class="of-badge">Recorrido ${active.n}</span>`))}
 });
}
function chipsInTools(){
 const host=FILE==='herramientas.html'?'herramientas.html':FILE==='estudio.html'?'estudio.html':null;if(!host)return;
 document.querySelectorAll('section.tool[id^="panel-"]').forEach(sec=>{
  const key=host+'#'+sec.id.replace('panel-','');const list=pathsForTool(key);if(!list.length)return;
  const head=sec.querySelector('.tool-heading');if(!head)return;
  head.after(el(`<div class="of-tool-paths"><span class="of-mini">En los recorridos</span>${list.map(({p,roles})=>`<a href="recorridos.html#${p.id}">${p.n} · ${esc(p.name)} <em>${roles.map(r=>ROLE[r]).join(' · ')}</em></a>`).join('')}</div>`));
 });
}
function tallerExtras(){
 if(FILE!=='taller.html')return;
 const bar=document.querySelector('.versionbar');
 if(bar&&!document.getElementById('ofAnalyze')){
  const b=el(`<button class="tool" id="ofAnalyze" type="button" title="Abrir esta composición en el laboratorio 06">Analizar lectura ↗</button>`);
  b.addEventListener('click',()=>{const T=read('T'),id=T.active||'carvan',work=(T.work||{})[id];if(!work){alert('Mové algún elemento antes de analizar: la composición se guarda al editar.');return}const P=read('P');const path=P.active&&pathById(P.active.path);handoff({svg:tallerSVG(work),source:`Taller · ${D.BRIEF_NAMES[id]||id} · estado actual`,goal:'',path:path?.practicar?.brief===id?path.id:null,version:null})});
  const hint=bar.querySelector('#versionHint');hint?bar.insertBefore(b,hint):bar.append(b);
 }
 const brief=document.querySelector('.brief');if(!brief)return;
 const line=el('<div class="of-brief-paths" id="ofBriefPaths"></div>');brief.querySelector('#briefObjective')?.after(line);
 const paint=()=>{const T=read('T'),id=T.active;const list=D.PATHS.filter(p=>p.practicar.brief===id);line.innerHTML=list.length?`<span class="of-mini">Experimento de recorrido</span>${list.map(p=>`<a href="recorridos.html#${p.id}/practicar">${p.n} · ${esc(p.name)}: A ${esc(p.practicar.A.label)} / B ${esc(p.practicar.B.label)} ↗</a>`).join('')}`:''};
 paint();new MutationObserver(paint).observe(document.getElementById('briefTitle'),{childList:true,characterData:true,subtree:true});
}
function quizLinks(){
 const body=document.getElementById('qbody');if(!body)return;
 const tabsHost=document.getElementById('qtabs');
 const paint=()=>{const cur=+(tabsHost?.querySelector('[aria-selected="true"]')?.dataset.m||1);body.querySelectorAll('.q').forEach((q,i)=>{if(q.querySelector('.of-quiz-link'))return;const wrong=q.querySelector('.opts button.wrong');const why=q.querySelector('.why');if(!wrong||!why)return;const key=D.QUIZ_MAP[cur]?.[i];if(!key)return;const paths=pathsForPlate(key);why.after(el(`<p class="of-quiz-link">Para repasarlo: <a href="${key}">${esc(plateName(key))} ↗</a>${paths.length?` · se practica en <a href="recorridos.html#${paths[0].id}">${paths[0].n} ${esc(paths[0].name)}</a>`:''}</p>`))})};
 new MutationObserver(paint).observe(body,{childList:true});paint();
}
function homeBand(){
 const cover=document.querySelector('.cover');if(!cover||FILE!=='index.html')return;
 const S=snapshot(),P=S.P;
 const cards=D.PATHS.map(p=>{const pr=progress(p,S);return `<a class="of-card" href="recorridos.html#${p.id}"><span class="of-card-n">${p.n}</span><strong>${esc(p.name)}</strong><span class="of-card-q">${esc(p.question)}</span><span class="of-dots" aria-label="${pr.n} de 5 estaciones">${D.STATIONS.map(s=>`<i class="is-${pr.status[s.id].state}" title="${s.name}"></i>`).join('')}</span><span class="of-card-next">${pr.next?`Sigue: ${pr.next.n} · ${pr.next.name}`:'Recorrido completo'}</span></a>`}).join('');
 const rs=resume(S);const act=rs?.path,st=rs?.station;
 const band=el(`<section class="of-home" aria-labelledby="ofHomeTitle"><div class="of-home-head"><div><div class="of-eyebrow">V5 · Recorridos</div><h2 id="ofHomeTitle">Del principio a la pieza real.</h2><p>Seis competencias, cinco estaciones cada una: entender, experimentar, practicar, evaluar y aplicar. Cada paso usa las láminas, el taller y las herramientas que ya tenés, y avanza cuando hay evidencia de que lo hiciste.</p></div>${act?`<a class="of-resume" href="recorridos.html#${act.id}/${st?.id||''}">Seguir: ${act.n} ${esc(act.name)} · ${esc(st?.name||'')} →</a>`:`<a class="of-resume" href="recorridos.html">Ver los recorridos →</a>`}</div><div class="of-cards">${cards}</div></section>`);
 cover.after(band);
}

/* ---------- Guía del recorrido (dock) ---------- */
function pageMatches(href){if(!href)return false;const [f,h]=href.split('#');if(f!==FILE)return false;if(!h)return true;if(FILE==='taller.html')return (read('T').active||'')===h;return location.hash.slice(1)===h}
function dock(){
 if(FILE==='recorridos.html')return;
 const node=el('<aside class="of-dock" aria-label="Guía del recorrido" aria-live="polite"></aside>');document.body.append(node);
 let collapsed=window.innerWidth<700;try{const v=sessionStorage.getItem('of-dock-min');if(v!==null)collapsed=v==='1'}catch{}
 let lastHTML='';
 function render(){
  const S=snapshot(),P=S.P;const applied=P.applied&&P.applied.file===FILE&&Date.now()-P.applied.at<10*60*1000?P.applied:null;
  if(!P.active&&!applied){node.hidden=true;pad();return}
  node.hidden=false;
  const path=P.active&&pathById(P.active.path);const stId=P.active?.station;const st=D.STATIONS.find(s=>s.id===stId);
  let body='';
  if(applied){body+=`<div class="of-applied">Se aplicó la configuración sugerida: <b>${esc(applied.label)}</b>. <button type="button" data-act="undo" data-key="${esc(applied.key)}">Restaurar la anterior</button> <button type="button" data-act="okapplied">Listo</button></div>`}
  if(path&&st){
   const stat=status(path,S)[stId];const here=pageMatches(stationHref(path,stId))||(stId==='experimentar'&&pageMatches(path.experimentar.support))||(stId==='entender'&&path.entender.plates.some(p=>p.split('#')[0]===FILE))||(stId==='evaluar'&&FILE==='estudio.html'&&location.hash==='#hierarchy');
   const mark={done:'Cumplido',closed:'Cerrado',progress:'En curso',todo:'Pendiente'}[stat.state];
   let detail='';
   if(here){
    if(stId==='entender'){const L=S.L.done||{};detail=`<ul class="of-list">${path.entender.plates.map(p=>{const [f,id]=p.split('#');const ok=!!L[f+':'+id];return `<li class="${ok?'ok':''}"><a href="${p}">${esc(plateName(p))}</a> <small>${esc(D.MODULE_NAMES[f])}</small></li>`}).join('')}</ul><p class="of-small">${esc(path.entender.focus)}</p>`}
    if(stId==='experimentar'){const r=rec(P,path.id);detail=`<ol class="of-list of-tasks">${path.experimentar.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ol><p class="of-signal ${stat.signal?.ok?'ok':''}">${esc(stat.signal?.text||'')}</p><p class="of-small">Pregunta para el recorrido: ${esc(path.experimentar.question)}</p>`}
    if(stId==='practicar'){const src=practiceSource(path,S),t=practiceTests(path,src),kind=src.kind;const met=v=>{const m=versionMetrics(src[v],kind);return m?path.practicar.watch.map(k=>`${D.METRICS[k]?.name||k}: <b>${fmtMetric(k,m[k])}</b>`).join(' · '):''};
     detail=`<p class="of-small">${esc(path.practicar.hypothesis)}</p>${['A','B'].map(v=>`<div class="of-ver"><div><b>${v} · ${esc(path.practicar[v].label)}</b> ${src[v]?'<span class="of-pill ok">guardada</span>':'<span class="of-pill">sin guardar</span>'}</div><p>${esc(path.practicar[v].desc)}</p>${src[v]?`<p class="of-met">${met(v)}</p><p class="of-tests">${t[v].map(x=>`<span class="${x.pass?'ok':'no'}">${x.pass?'✓':'✗'} ${esc(x.label||testText(x))}</span>`).join('')}</p>`:''}</div>`).join('')}${src.A&&src.B?`<button type="button" class="of-btn" data-act="fix">Fijar A y B en el recorrido</button>`:`<p class="of-small">${kind==='system'?'Guardá dos sistemas con «Guardar sistema».':'Usá «Guardar A» y «Guardar B» debajo del lienzo.'}</p>`}`}
    if(stId==='evaluar'){const H=S.E.hierarchy||{};const mine=H.handoff&&H.handoff.path===path.id;detail=`<p class="of-small">${mine?`Estás leyendo la versión ${esc(H.handoff.version||'')}. Marcá tres puntos en el orden en que tu ojo los recorre y completá «qué se ve primero». Después volvé al recorrido para registrar la lectura.`:'Abrí la versión A o B desde la estación Evaluar del recorrido para leerla acá.'}</p>`}
   }else{
    detail=`<p class="of-small">${esc(st.verb)}.</p>`;
   }
   body+=`<div class="of-dock-head"><span class="of-eyebrow">Recorrido ${path.n} · ${esc(path.name)}</span><button type="button" class="of-x" data-act="min" aria-label="${collapsed?'Expandir la guía':'Minimizar la guía'}">${collapsed?'+':'–'}</button></div>
   <div class="of-dock-title"><b>${st.n} / 5 · ${esc(st.name)}</b> <span class="of-pill ${stat.state==='done'?'ok':''}">${mark}</span></div>
   ${collapsed?'':`<div class="of-dock-body">${detail}<p class="of-status">${esc(stat.detail)}</p></div>`}
   <div class="of-dock-actions">${here?'':`<a class="of-btn" href="${esc(stationHref(path,stId))}">Ir a este paso →</a>`}<a class="of-btn ghost" href="recorridos.html#${path.id}/${stId}">Volver al recorrido</a>${collapsed?'':`<button type="button" class="of-btn ghost" data-act="leave">Salir</button>`}</div>`;
  }
  if(body!==lastHTML){node.innerHTML=body;lastHTML=body}
  node.classList.toggle('is-min',collapsed);pad();
 }
 function pad(){const h=node.hidden?0:node.offsetHeight+32;const v=h?h+'px':'';if(document.body.style.paddingBottom!==v)document.body.style.paddingBottom=v}
 node.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='min'){collapsed=!collapsed;try{sessionStorage.setItem('of-dock-min',collapsed?'1':'0')}catch{}lastHTML='';render()}
  if(a==='leave'){update(P=>{delete P.active});lastHTML='';render()}
  if(a==='undo')restorePreset(b.dataset.key);
  if(a==='okapplied'){update(P=>{delete P.applied});lastHTML='';render()}
  if(a==='fix'){const S=snapshot(),P=S.P,path=pathById(P.active.path);const src=practiceSource(path,S);if(!src.A||!src.B)return;update(Q=>{const r=rec(Q,path.id);r.practicar.A=JSON.parse(JSON.stringify(src.A));r.practicar.B=JSON.parse(JSON.stringify(src.B));r.practicar.at=Date.now()});b.textContent='Fijadas. Seguí en Evaluar →';setTimeout(()=>{location.href='recorridos.html#'+path.id+'/evaluar'},700)}
 });
 render();setInterval(render,1500);window.addEventListener('storage',render);window.addEventListener('hashchange',()=>{lastHTML='';render()});
}

function boot(){chipsInModules();chipsInTools();tallerExtras();quizLinks();homeBand();dock()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
