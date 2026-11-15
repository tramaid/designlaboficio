/* LAB/OFICIO V5 — Página de recorridos: estaciones, tablero de evaluación y bitácora. */
(()=>{'use strict';
const O=window.OFICIO,D=O.D,$=s=>document.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)],esc=O.esc;
const app=$('#app');
const STATE_LABEL={done:'Cumplido',closed:'Cerrado sin evidencia completa',progress:'En curso',todo:'Pendiente'};
const fmtDate=t=>t?new Date(t).toLocaleDateString('es-AR',{day:'numeric',month:'short',year:'numeric'}):'';
function toast(m){const t=$('#rtToast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),3200)}
function save(pathId,fn){O.update(P=>fn(O.rec(P,pathId),P))}
const plateName=k=>D.PLATE_NAMES[k]||k;
const toolName=k=>{const t=D.TOOLS[k];return t?`${t.n} / ${t.name}`:k};
const count=(s,min)=>{const n=String(s||'').trim().length;return `<span class="rt-count ${n>=min?'ok':''}">${n} / ${min} caracteres mínimos</span>`};

/* ---------- Router ---------- */
function route(){const h=decodeURIComponent(location.hash.slice(1));const [pid,st]=h.split('/');const path=O.pathById(pid);if(path)renderPath(path,st);else renderHome();}
window.addEventListener('hashchange',()=>{route();window.scrollTo({top:0})});
const refresh=()=>{const a=document.activeElement;if(a&&['TEXTAREA','INPUT','SELECT'].includes(a.tagName))return;const y=window.scrollY;const open=$$('details.rt-station[open]').map(d=>d.id);route();open.forEach(id=>{const d=document.getElementById(id);if(d)d.open=true});window.scrollTo({top:y})};
window.addEventListener('storage',refresh);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});

/* ---------- Inicio ---------- */
function renderHome(){
 const S=O.snapshot();
 const rows=D.PATHS.map(p=>{const pr=O.progress(p,S);return `<a class="rt-row" href="#${p.id}">
  <span class="rt-row-n">${p.n}</span>
  <span class="rt-row-main"><strong>${esc(p.name)}</strong><span>${esc(p.question)}</span></span>
  <span class="rt-row-st">${D.STATIONS.map(s=>`<span class="rt-st is-${pr.status[s.id].state}"><i></i>${esc(s.name)}</span>`).join('')}</span>
  <span class="rt-row-go">${pr.n===5?'Completo':pr.n?`Seguir: ${esc(pr.next.name)}`:'Empezar'} →</span></a>`}).join('');
 const total=D.PATHS.reduce((n,p)=>n+O.progress(p,S).n,0);
 const rs=O.resume(S);
 app.innerHTML=`<section class="hero wrap rt-hero"><div class="hero-intro"><p class="eyebrow">LAB/OFICIO · Recorridos</p><h1>Del principio<br><span>a la pieza.</span></h1><p>Cada recorrido entrena una competencia en cinco estaciones encadenadas. Estudiás el principio, lo forzás en una herramienta, lo ponés a prueba con un experimento controlado, lo evaluás con algo más que el gusto y lo llevás a un trabajo real.</p></div><div class="hero-side"><span class="big-figure">${String(total).padStart(2,'0')}</span><span class="aside-meta">estaciones cumplidas<br>de ${D.PATHS.length*5}</span></div></section>
 ${rs?`<div class="wrap"><a class="rt-resume" href="#${rs.path.id}/${rs.station.id}"><span>Seguís en</span><b>${rs.path.n} · ${esc(rs.path.name)} — ${esc(rs.station.name)}</b><span>→</span></a></div>`:''}
 <section class="wrap rt-block" aria-labelledby="rtListTitle"><div class="rt-block-head"><h2 id="rtListTitle">Seis competencias</h2><button class="button ghost rt-inline" type="button" id="rtAllLog">Descargar bitácora completa ↓</button></div><div class="rt-rows">${rows}</div></section>
 <section class="wrap rt-block" aria-labelledby="rtMethod"><div class="rt-block-head"><h2 id="rtMethod">Cómo funciona una estación</h2></div>
  <ol class="rt-method">${D.STATIONS.map(s=>`<li><span>${s.n}</span><b>${esc(s.name)}</b><p>${esc({entender:'Las láminas del curso que sostienen el principio. Se cumple cuando las marcás como comprendidas: tus apuntes de cada lámina aparecen en el recorrido.',experimentar:'Una herramienta con una configuración sugerida que podés aplicar y deshacer. Se cumple cuando la herramienta registra que la usaste y escribís qué observaste.',practicar:'Un encargo del taller convertido en experimento: A y B cambian una sola variable. Las versiones se miden y el experimento se cumple o no.',evaluar:'A y B lado a lado con indicadores, tu lectura en el laboratorio de jerarquía y una rúbrica que incluye intención y contexto, no solo apariencia.',aplicar:'Una pieza real tuya, revisada con los criterios del recorrido. Podés adjuntar el antes y el después.'}[s.id])}</p></li>`).join('')}</ol>
  <p class="rt-note">Si una estación no se puede completar con evidencia (por ejemplo, porque todavía no tenés una pieza real para aplicar), podés cerrarla igual. Queda marcada como cerrada, no como cumplida.</p></section>
 <section class="wrap rt-block" aria-labelledby="rtMap"><div class="rt-block-head"><h2 id="rtMap">Mapa del sistema</h2><p>Qué lámina, herramienta y encargo usa cada recorrido.</p></div>
  <div class="rt-mapwrap"><table class="rt-map"><thead><tr><th scope="col">Recorrido</th>${D.STATIONS.map(s=>`<th scope="col">${s.n} · ${esc(s.name)}</th>`).join('')}</tr></thead><tbody>${D.PATHS.map(p=>`<tr><th scope="row"><a href="#${p.id}">${p.n} · ${esc(p.name)}</a></th><td>${p.entender.plates.map(k=>`<a href="${k}">${esc(plateName(k))}</a>`).join('<br>')}</td><td><a href="${p.experimentar.tool}">${esc(toolName(p.experimentar.tool))}</a>${p.experimentar.support?`<br><small>Apoyo: <a href="${p.experimentar.support}">${esc(toolName(p.experimentar.support))}</a></small>`:''}</td><td>${p.practicar.kind==='system'?`<a href="${p.practicar.tool}">${esc(toolName(p.practicar.tool))}</a>`:`<a href="taller.html#${p.practicar.brief}">Taller · ${esc(D.BRIEF_NAMES[p.practicar.brief])}</a>`}<br><small>A: ${esc(p.practicar.A.label)} · B: ${esc(p.practicar.B.label)}</small></td><td>${p.practicar.kind==='system'?'Tablero A/B':`<a href="estudio.html#hierarchy">06 / Jerarquía visual</a>`}<br><small>Rúbrica: ${p.evaluar.criteria.map(c=>esc(c.name)).join(', ')}, intención y contexto</small></td><td>${esc(p.aplicar.prompt.split('(')[0].trim())}</td></tr>`).join('')}</tbody></table></div>
  <p class="rt-note">El módulo 5, Movimiento, todavía no tiene recorrido propio: no hay una herramienta de práctica de animación en la que se pueda medir un experimento. Sus láminas y su cuaderno siguen disponibles en la biblioteca.</p></section>
 <footer class="footer wrap"><span>LAB/OFICIO · V5 · 6 recorridos / 30 estaciones</span><span>Tus avances se guardan en este navegador y entran en el respaldo del cuaderno.</span><a href="index.html">Volver a la biblioteca</a></footer>`;
 $('#rtAllLog').addEventListener('click',()=>downloadLog(D.PATHS));
}

/* ---------- Detalle de un recorrido ---------- */
function renderPath(path,openSt){
 const S=O.snapshot(),r=O.rec(S.P,path.id),st=O.status(path,S),pr=O.progress(path,S);
 const target=D.STATIONS.some(s=>s.id===openSt)?openSt:(pr.next?.id||'entender');
 app.innerHTML=`<section class="wrap rt-path-head">
  <a class="rt-back" href="#">← Todos los recorridos</a>
  <div class="rt-path-title"><div><p class="eyebrow">Recorrido ${path.n} · ${pr.n} de 5 estaciones</p><h1>${esc(path.name)}</h1><p class="rt-question">${esc(path.question)}</p><p class="rt-intro">${esc(path.intro)}</p></div>
  <div class="rt-path-actions"><button class="button dark" type="button" id="rtLog">Descargar bitácora <span>↓</span></button><button class="button ghost" type="button" id="rtReset">Reiniciar este recorrido <span>↺</span></button></div></div>
  <nav class="rt-rail" aria-label="Estaciones">${D.STATIONS.map(s=>`<a href="#${path.id}/${s.id}" class="is-${st[s.id].state}${s.id===target?' is-current':''}"><span>${s.n}</span>${esc(s.name)}<small>${STATE_LABEL[st[s.id].state]}</small></a>`).join('')}</nav>
 </section>
 <div class="wrap rt-stations">${D.STATIONS.map(s=>stationShell(path,s,st[s.id],r,s.id===target)).join('')}</div>
 <footer class="footer wrap"><span>Recorrido ${path.n} · ${esc(path.name)}</span><a href="#">Ver los seis recorridos</a></footer>`;
 for(const s of D.STATIONS){const body=$(`#st-${s.id} .rt-st-body`);({entender,experimentar,practicar,evaluar,aplicar})[s.id](body,path,S,r,st[s.id])}
 $$('.rt-station').forEach(d=>d.addEventListener('toggle',()=>{if(d.open&&location.hash!==`#${path.id}/${d.dataset.st}`)history.replaceState(null,'',`#${path.id}/${d.dataset.st}`)}));
 $$('[data-close]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.close;save(path.id,R=>{R.closed[id]=!R.closed[id]});refresh()}));
 $$('[data-go]').forEach(a=>a.addEventListener('click',()=>O.activate(path.id,a.dataset.go)));
 $('#rtLog').addEventListener('click',()=>downloadLog([path]));
 $('#rtReset').addEventListener('click',()=>{if(!confirm('¿Reiniciar este recorrido? Se borran tus respuestas, las versiones fijadas, la rúbrica y la aplicación de este recorrido. Las láminas, el taller y las herramientas no se tocan.'))return;O.update(P=>{delete P.paths?.[path.id];if(P.active?.path===path.id)delete P.active});route();toast('Recorrido reiniciado')});
 const el=document.getElementById('st-'+target);if(el&&openSt)setTimeout(()=>el.scrollIntoView({block:'start'}),0);
}
function stationShell(path,s,st,r,open){
 return `<details class="rt-station is-${st.state}" id="st-${s.id}" data-st="${s.id}"${open?' open':''}><summary><span class="rt-st-n">${s.n}</span><span class="rt-st-h"><b>${esc(s.name)}</b><small>${esc(s.verb)}</small></span><span class="rt-pill is-${st.state}">${STATE_LABEL[st.state]}</span></summary>
  <div class="rt-st-body"></div>
  <div class="rt-st-foot"><span>${esc(st.detail)}</span>${st.state==='done'?'':`<button type="button" class="button text-button" data-close="${s.id}">${st.state==='closed'?'Reabrir esta estación':'Cerrar sin evidencia completa'}</button>`}</div></details>`;
}

/* 1 · Entender */
function entender(host,path,S){
 const L=S.L.done||{},N=S.L.notes||{};
 host.innerHTML=`<p class="rt-lead">${esc(path.entender.focus)}</p><ol class="rt-plates">${path.entender.plates.map(k=>{const [f,id]=k.split('#'),ok=!!L[f+':'+id],note=String(N[f+':'+id]||'').trim();return `<li class="${ok?'ok':''}"><div><a href="${k}" data-go="entender"><b>${esc(plateName(k))}</b> ↗</a><small>${esc(D.MODULE_NAMES[f])} · ${ok?'comprendida':'pendiente'}</small></div>${note?`<blockquote>${esc(note)}</blockquote>`:`<p class="rt-empty">Sin apunte en el cuaderno de esta lámina.</p>`}</li>`}).join('')}</ol>
 <p class="rt-hint">En cada lámina, usá «Marcar comprendido» del cuaderno. Tus apuntes aparecen acá.</p>`;
}
/* 2 · Experimentar */
function experimentar(host,path,S,r,st){
 const ex=path.experimentar,pre=ex.preset;
 host.innerHTML=`<div class="rt-two"><div><div class="rt-toolcard"><span class="rt-tool-n">${esc(D.TOOLS[ex.tool]?.n||'')}</span><div><b>${esc(D.TOOLS[ex.tool]?.name||ex.tool)}</b>${pre?`<small>Configuración sugerida: ${esc(pre.label)}. Al aplicarla se guarda la anterior y podés restaurarla desde la guía.</small>`:''}</div>
   <div class="rt-tool-actions">${pre?`<a class="button dark" data-go="experimentar" href="${ex.tool.replace('#','?aplicar='+path.id+'#')}">Abrir con la configuración sugerida <span>↗</span></a>`:''}<a class="button ${pre?'ghost':'dark'}" data-go="experimentar" href="${ex.tool}">Abrir la herramienta <span>↗</span></a>${ex.support?`<a class="button ghost" data-go="experimentar" href="${ex.support}">Apoyo: ${esc(toolName(ex.support))} <span>↗</span></a>`:''}</div></div>
  <ol class="rt-tasks">${ex.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></div>
  <div><p class="rt-signal ${st.signal?.ok?'ok':''}"><span>Lo que registra la herramienta</span>${esc(st.signal?.text||'')}</p>
  <label class="rt-field" for="exAnswer">${esc(ex.question)}</label><textarea id="exAnswer" rows="6" placeholder="Escribí lo que viste y qué decidiste, con una variable concreta.">${esc(r.experimentar.answer||'')}</textarea>${count(r.experimentar.answer,40)}</div></div>`;
 const ta=host.querySelector('#exAnswer');ta.addEventListener('input',()=>{save(path.id,R=>{R.experimentar.answer=ta.value;R.experimentar.at=Date.now()});ta.nextElementSibling.outerHTML=count(ta.value,40)});
}
/* 3 · Practicar */
function verPreview(ver,kind,opt={}){if(!ver)return `<div class="rt-noprev">Sin guardar</div>`;return kind==='system'?O.systemSVG(ver.system,{size:'100%'}):O.tallerSVG(ver,{size:'100%',points:opt.points,label:opt.label})}
function metricsTable(path,m,highlight){if(!m)return '';const keys=path.practicar.kind==='system'?['inkBg','accentBg','onAccent']:['ratio','sizes','families','axes','coverage','edge','accent','minContrast','imageArea'];return `<table class="rt-metrics">${keys.map(k=>`<tr class="${highlight.includes(k)?'is-key':''}"><th scope="row" title="${esc(D.METRICS[k]?.why||'')}">${esc(D.METRICS[k]?.name||k)}</th><td>${O.fmtMetric(k,m[k])}</td></tr>`).join('')}</table>`}
function testsList(list){return `<ul class="rt-tests">${list.map(x=>`<li class="${x.pass?'ok':'no'}">${x.pass?'✓':'✗'} ${esc(x.label||O.testText(x))}${x.value!==undefined&&x.value!==null&&x.metric&&D.METRICS[x.metric]?` <small>(${O.fmtMetric(x.metric,x.value)})</small>`:''}</li>`).join('')}</ul>`}
function practicar(host,path,S,r){
 const pr=path.practicar,kind=pr.kind==='system'?'system':'taller';const live=O.practiceSource(path,S),lt=O.practiceTests(path,live);
 const fixed=r.practicar.A&&r.practicar.B;const ft=fixed?O.practiceTests(path,{A:r.practicar.A,B:r.practicar.B,kind}):null;
 const go=kind==='system'?pr.tool:'taller.html#'+pr.brief;
 host.innerHTML=`<p class="rt-lead"><b>Hipótesis:</b> ${esc(pr.hypothesis)}</p>
 <p class="rt-hint">${kind==='system'?'Trabajá en el constructor de sistemas. Guardá un sistema para A, cambialo y guardá otro para B.':`Encargo del taller: <b>${esc(D.BRIEF_NAMES[pr.brief])}</b>. Guardá A, transformala según la consigna de B y guardá B. Las dos versiones llevan los mismos textos: solo cambia la variable del experimento.`}</p>
 <div class="rt-ab">${['A','B'].map(v=>`<div class="rt-abcol"><div class="rt-abhead"><span class="rt-ver">${v}</span><div><b>${esc(pr[v].label)}</b><p>${esc(pr[v].desc)}</p></div></div>
   <div class="rt-prev">${verPreview(live[v],kind,{label:`Versión ${v} actual`})}</div>
   ${live[v]?testsList(lt[v]):'<p class="rt-empty">Todavía no está guardada.</p>'}</div>`).join('')}</div>
 <div class="rt-actions"><a class="button dark" data-go="practicar" href="${go}">${kind==='system'?'Abrir el constructor de sistemas':'Abrir el encargo en el taller'} <span>↗</span></a><button type="button" class="button ghost" id="prFix" ${live.A&&live.B?'':'disabled'}>${fixed?'Volver a fijar con las versiones actuales':'Fijar A y B en el recorrido'} <span>⤓</span></button></div>
 ${fixed?`<div class="rt-fixed"><b>Versiones fijadas el ${fmtDate(r.practicar.at)}.</b> ${ft.A.concat(ft.B).every(x=>x.pass)?'El experimento se cumplió.':'El experimento no se cumplió en todas las condiciones: podés corregir en el taller y volver a fijar, o seguir y discutirlo en la evaluación.'} El taller puede seguir cambiando: la evaluación usa estas copias.</div>`:''}`;
 host.querySelector('#prFix').addEventListener('click',()=>{const L=O.practiceSource(path,O.snapshot());if(!L.A||!L.B)return;if(r.evaluar&&Object.keys(r.evaluar.rubric?.A||{}).length&&!confirm('Ya evaluaste las versiones fijadas antes. ¿Reemplazarlas? La rúbrica se conserva, pero puede quedar desactualizada.'))return;save(path.id,R=>{R.practicar.A=JSON.parse(JSON.stringify(L.A));R.practicar.B=JSON.parse(JSON.stringify(L.B));R.practicar.at=Date.now()});toast('A y B fijadas en el recorrido');location.hash=path.id+'/evaluar';});
}
/* 4 · Evaluar */
function evaluar(host,path,S,r){
 const kind=path.practicar.kind==='system'?'system':'taller',ev=r.evaluar;
 if(!(r.practicar.A&&r.practicar.B)){host.innerHTML=`<p class="rt-empty">Primero fijá A y B en la estación Practicar. La evaluación trabaja sobre esas copias, para que lo que evalúes no cambie mientras seguís probando en el taller.</p><p><a class="button ghost rt-inline" href="#${path.id}/practicar">Ir a Practicar</a></p>`;return}
 const vers={A:r.practicar.A,B:r.practicar.B},T=O.practiceTests(path,{...vers,kind});
 const H=S.E.hierarchy||{},pending=H.handoff&&H.handoff.path===path.id&&H.handoff.version?H.handoff.version:null,pendingOk=pending&&(H.points||[]).length>=1;
 const crit=[...path.evaluar.criteria,...D.SHARED];
 host.innerHTML=`<p class="rt-lead">Primero mirá, después medí, al final decidí. Los indicadores miden geometría y color: sirven para comprobar el experimento, no para decir qué está bien.</p>
 <div class="rt-ab">${['A','B'].map(v=>{const m=O.versionMetrics(vers[v],kind),rd=ev.readings[v];return `<div class="rt-abcol"><div class="rt-abhead"><span class="rt-ver">${v}</span><div><b>${esc(path.practicar[v].label)}</b></div></div>
  <div class="rt-prev">${verPreview(vers[v],kind,{points:rd?.points,label:`Versión ${v} fijada`})}</div>
  ${testsList(T[v])}${metricsTable(path,m,path.practicar.watch)}
  <div class="rt-read">
   <label class="rt-field" for="pred${v}">Antes de analizar: ¿qué debería leerse primero en ${v}?</label><textarea id="pred${v}" rows="2" data-pred="${v}">${esc(ev.prediction[v]||'')}</textarea>
   ${kind==='taller'?`<button type="button" class="button ghost" data-read="${v}">Leer ${v} en el laboratorio 06 <span>↗</span></button>`:''}
   ${pending===v&&pendingOk?`<div class="rt-capture"><b>Hay una lectura de ${v} en el laboratorio 06</b><span>${(H.points||[]).length} marcas${H.first?` · Lo primero: «${esc(H.first)}»`:''}</span><button type="button" class="button dark" data-capture="${v}">Registrar esta lectura <span>⤓</span></button></div>`:''}
   ${rd?`<div class="rt-reading"><span class="of-mini">Lectura registrada · ${fmtDate(rd.at)}</span><p><b>Lo primero que se ve:</b> ${esc(rd.first||'sin anotar')}</p>${rd.notes?`<p>${esc(rd.notes)}</p>`:''}${ev.prediction[v]?`<p class="rt-compare">${esc(compareText(ev.prediction[v],rd.first))}</p>`:''}</div>`:''}
  </div></div>`}).join('')}</div>
 <div class="rt-rubric"><div class="rt-rubric-head"><h3>Rúbrica</h3><p>Marcá en qué nivel está cada versión. Las dos últimas filas son comunes a todos los recorridos: una composición no se evalúa solo por cómo se ve.</p></div>
  ${crit.map(c=>`<fieldset class="rt-crit"><legend><b>${esc(c.name)}</b> <span>${esc(c.q)}</span></legend><div class="rt-levels">${c.levels.map((d,i)=>`<div class="rt-level"><span class="rt-lv">${i+1} · ${esc(D.LEVELS[i])}</span><p>${esc(d)}</p><div class="rt-lvbtns">${['A','B'].map(v=>`<button type="button" aria-pressed="${ev.rubric[v]?.[c.id]===i+1}" data-rate="${v}" data-c="${c.id}" data-l="${i+1}" aria-label="${esc(c.name)}: versión ${v} en nivel ${i+1}">${v}</button>`).join('')}</div></div>`).join('')}</div></fieldset>`).join('')}
 </div>
 <div class="rt-decide"><div><span class="rt-field">Elegís</span><div class="rt-choice">${['A','B'].map(v=>`<button type="button" aria-pressed="${ev.choice===v}" data-choice="${v}">Versión ${v}</button>`).join('')}</div></div>
  <div><label class="rt-field" for="evDecision">¿Por qué? Usá lo que viste en la lectura y en la rúbrica, no solo el gusto.</label><textarea id="evDecision" rows="4">${esc(ev.decision||'')}</textarea>${count(ev.decision,40)}</div></div>`;
 $$('[data-pred]',host).forEach(t=>t.addEventListener('input',()=>save(path.id,R=>{R.evaluar.prediction[t.dataset.pred]=t.value})));
 $$('[data-read]',host).forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.read;O.activate(path.id,'evaluar');const pred=O.read('P').paths?.[path.id]?.evaluar?.prediction?.[v]||'';O.handoff({svg:O.tallerSVG(vers[v]),source:`Recorrido ${path.n} · ${path.name} · versión ${v}`,goal:pred,path:path.id,version:v})}));
 $$('[data-capture]',host).forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.capture,H2=O.read('E').hierarchy||{};save(path.id,R=>{R.evaluar.readings[v]={points:(H2.points||[]).slice(0,3),first:H2.first||'',goal:H2.goal||'',notes:H2.notes||'',at:Date.now()}});O.update(P=>{});const E=O.read('E');if(E.hierarchy){delete E.hierarchy.handoff;O.write('E',E)}toast('Lectura registrada en la versión '+v);refresh()}));
 $$('[data-rate]',host).forEach(b=>b.addEventListener('click',()=>{const {rate:v,c,l}=b.dataset;save(path.id,R=>{R.evaluar.rubric[v]??={};R.evaluar.rubric[v][c]=R.evaluar.rubric[v][c]===+l?undefined:+l});$$(`[data-rate="${v}"][data-c="${c}"]`,host).forEach(x=>x.setAttribute('aria-pressed',String(O.read('P').paths[path.id].evaluar.rubric[v][c]===+x.dataset.l)));updateFoot(path)}));
 $$('[data-choice]',host).forEach(b=>b.addEventListener('click',()=>{save(path.id,R=>{R.evaluar.choice=b.dataset.choice});$$('[data-choice]',host).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));updateFoot(path)}));
 const ta=host.querySelector('#evDecision');ta.addEventListener('input',()=>{save(path.id,R=>{R.evaluar.decision=ta.value});ta.nextElementSibling.outerHTML=count(ta.value,40);updateFoot(path)});
}
function compareText(pred,seen){const n=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9ñ ]/g,' ').split(/\s+/).filter(w=>w.length>3);const a=new Set(n(pred)),b=n(seen);if(!b.length)return 'Completá «qué se ve primero» en el laboratorio para comparar con tu predicción.';const hit=b.filter(w=>a.has(w)).length;return hit?'La lectura coincide en parte con lo que esperabas. Revisá si coincide en el orden, no solo en el elemento.':'Lo que se vio primero no es lo que esperabas. Ese desvío es lo más útil de la evaluación: anotá qué lo provocó.'}
function updateFoot(path){const st=O.status(path,O.snapshot());for(const s of D.STATIONS){const d=document.getElementById('st-'+s.id);if(!d)continue;d.className=`rt-station is-${st[s.id].state}`;d.querySelector('.rt-pill').className=`rt-pill is-${st[s.id].state}`;d.querySelector('.rt-pill').textContent=STATE_LABEL[st[s.id].state];d.querySelector('.rt-st-foot span').textContent=st[s.id].detail}$$('.rt-rail a').forEach((a,i)=>{const s=D.STATIONS[i];a.className=a.className.replace(/is-(done|closed|progress|todo)/,'is-'+st[s.id].state);a.querySelector('small').textContent=STATE_LABEL[st[s.id].state]})}
/* 5 · Aplicar */
async function thumb(file){if(!file||!/^image\/(png|jpeg|webp)$/.test(file.type))throw Error('Formato');if(file.size>25*1024*1024)throw Error('Tamaño');const u=URL.createObjectURL(file);try{const im=new Image();im.src=u;await im.decode();const k=Math.min(1,900/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);return c.toDataURL('image/jpeg',.74)}finally{URL.revokeObjectURL(u)}}
function aplicar(host,path,S,r){
 const ap=r.aplicar;
 host.innerHTML=`<p class="rt-lead">${esc(path.aplicar.prompt)}</p>
 <div class="rt-two"><div>
  <label class="rt-field" for="apPiece">Pieza real</label><input id="apPiece" type="text" maxlength="120" value="${esc(ap.piece||'')}" placeholder="Por ejemplo: placa de ofertas de fin de semana">
  <label class="rt-field" for="apClient">Cliente o proyecto</label><input id="apClient" type="text" maxlength="120" value="${esc(ap.client||'')}">
  <label class="rt-field" for="apSupport">Soporte</label><select id="apSupport">${['','Impreso','Pantalla / web','Redes sociales','Vía pública / LED','Packaging','Otro'].map(o=>`<option value="${esc(o)}"${(ap.support||'')===o?' selected':''}>${o||'Elegí un soporte'}</option>`).join('')}</select>
  <fieldset class="rt-checks"><legend class="rt-field">Revisión antes de entregar</legend>${path.aplicar.checks.map((c,i)=>`<label><input type="checkbox" data-check="${i}"${ap.checks[i]?' checked':''}> ${esc(c)}</label>`).join('')}</fieldset>
 </div><div>
  <div class="rt-images">${['before','after'].map(k=>`<div class="rt-img"><span class="rt-field">${k==='before'?'Antes (opcional)':'Después (opcional)'}</span>${ap[k]?`<img src="${ap[k]}" alt="${k==='before'?'Pieza antes':'Pieza después'}"><button type="button" class="button text-button" data-rmimg="${k}">Quitar imagen</button>`:`<label class="button ghost filebutton">Cargar PNG, JPG o WebP <span>↑</span><input type="file" accept="image/png,image/jpeg,image/webp" data-img="${k}" hidden></label>`}</div>`).join('')}</div>
  <p class="rt-hint">Las imágenes se reducen a 900 px y se guardan en este navegador. Entran en la bitácora y en el respaldo del cuaderno.</p>
  <label class="rt-field" for="apRefl">¿Qué cambió en la pieza por lo que aprendiste en este recorrido? ¿Qué harías distinto la próxima vez?</label><textarea id="apRefl" rows="6">${esc(ap.reflection||'')}</textarea>${count(ap.reflection,60)}
 </div></div>`;
 for(const [id,k] of [['apPiece','piece'],['apClient','client']])host.querySelector('#'+id).addEventListener('input',e=>{save(path.id,R=>{R.aplicar[k]=e.target.value});updateFoot(path)});
 host.querySelector('#apSupport').addEventListener('change',e=>save(path.id,R=>{R.aplicar.support=e.target.value}));
 $$('[data-check]',host).forEach(c=>c.addEventListener('change',()=>{save(path.id,R=>{R.aplicar.checks[+c.dataset.check]=c.checked});updateFoot(path)}));
 const ta=host.querySelector('#apRefl');ta.addEventListener('input',()=>{save(path.id,R=>{R.aplicar.reflection=ta.value});ta.nextElementSibling.outerHTML=count(ta.value,60);updateFoot(path)});
 $$('[data-img]',host).forEach(inp=>inp.addEventListener('change',async()=>{const f=inp.files?.[0];if(!f)return;try{const data=await thumb(f);let ok=true;O.update(P=>{O.rec(P,path.id).aplicar[inp.dataset.img]=data});const back=O.read('P').paths?.[path.id]?.aplicar?.[inp.dataset.img];if(back!==data){ok=false}toast(ok?'Imagen guardada':'El guardado del navegador está lleno: descargá la bitácora y quitá imágenes de otros recorridos.');refreshStation(path,'aplicar')}catch{toast('No se pudo usar esa imagen. Probá con PNG, JPG o WebP de menos de 25 MB.')}}));
 $$('[data-rmimg]',host).forEach(b=>b.addEventListener('click',()=>{save(path.id,R=>{delete R.aplicar[b.dataset.rmimg]});refreshStation(path,'aplicar')}));
}
function refreshStation(path,id){const S=O.snapshot(),r=O.rec(S.P,path.id),st=O.status(path,S);const host=$(`#st-${id} .rt-st-body`);({aplicar,evaluar,practicar,experimentar,entender})[id](host,path,S,r,st[id]);updateFoot(path)}

/* ---------- Bitácora exportable ---------- */
function logHTML(paths){
 const S=O.snapshot(),now=new Date();
 const sec=paths.map(path=>{const r=O.rec(S.P,path.id),st=O.status(path,S),kind=path.practicar.kind==='system'?'system':'taller',ev=r.evaluar,ap=r.aplicar;const L=S.L.done||{},N=S.L.notes||{};
  const crit=[...path.evaluar.criteria,...D.SHARED];
  const vers=r.practicar.A&&r.practicar.B?{A:r.practicar.A,B:r.practicar.B}:null;const T=vers?O.practiceTests(path,{...vers,kind}):null;
  return `<section class="path"><p class="eb">Recorrido ${path.n}</p><h2>${esc(path.name)}</h2><p class="q">${esc(path.question)}</p>
  <table class="sum">${D.STATIONS.map(s=>`<tr><th>${s.n} · ${s.name}</th><td class="${st[s.id].state}">${STATE_LABEL[st[s.id].state]}</td><td>${esc(st[s.id].detail)}</td></tr>`).join('')}</table>
  <h3>1 · Entender</h3><ul>${path.entender.plates.map(k=>{const [f,id]=k.split('#'),n=String(N[f+':'+id]||'').trim();return `<li><b>${esc(plateName(k))}</b> (${esc(D.MODULE_NAMES[f])}) · ${L[f+':'+id]?'comprendida':'pendiente'}${n?`<blockquote>${esc(n)}</blockquote>`:''}</li>`}).join('')}</ul>
  <h3>2 · Experimentar · ${esc(toolName(path.experimentar.tool))}</h3><p class="lbl">${esc(path.experimentar.question)}</p><p>${esc(r.experimentar.answer||'Sin respuesta.')}</p>
  <h3>3 · Practicar</h3><p class="lbl">Hipótesis</p><p>${esc(path.practicar.hypothesis)}</p>
  ${vers?`<div class="ab">${['A','B'].map(v=>{const m=O.versionMetrics(vers[v],kind);return `<div><p class="lbl">${v} · ${esc(path.practicar[v].label)}</p>${kind==='system'?O.systemSVG(vers[v].system,{size:'100%'}):O.tallerSVG(vers[v],{size:'100%',points:ev.readings[v]?.points})}<ul class="t">${T[v].map(x=>`<li class="${x.pass?'ok':'no'}">${x.pass?'✓':'✗'} ${esc(x.label||O.testText(x))}</li>`).join('')}</ul><table class="m">${Object.keys(m||{}).filter(k=>D.METRICS[k]).map(k=>`<tr><th>${esc(D.METRICS[k].name)}</th><td>${O.fmtMetric(k,m[k])}</td></tr>`).join('')}</table></div>`}).join('')}</div>`:'<p>Versiones sin fijar.</p>'}
  <h3>4 · Evaluar</h3>${['A','B'].map(v=>ev.readings[v]||ev.prediction[v]?`<p class="lbl">Lectura de ${v}</p><p>Predicción: ${esc(ev.prediction[v]||'—')}<br>Lo primero que se vio: ${esc(ev.readings[v]?.first||'—')}${ev.readings[v]?.notes?`<br>${esc(ev.readings[v].notes)}`:''}</p>`:'').join('')}
  <table class="rub"><tr><th>Criterio</th><th>A</th><th>B</th></tr>${crit.map(c=>`<tr><th>${esc(c.name)}</th>${['A','B'].map(v=>{const l=ev.rubric?.[v]?.[c.id];return `<td>${l?`${l} · ${esc(D.LEVELS[l-1])}<br><small>${esc(c.levels[l-1])}</small>`:'—'}</td>`}).join('')}</tr>`).join('')}</table>
  <p class="lbl">Decisión${ev.choice?`: versión ${ev.choice}`:''}</p><p>${esc(ev.decision||'Sin decisión escrita.')}</p>
  <h3>5 · Aplicar</h3><p><b>${esc(ap.piece||'Sin pieza')}</b>${ap.client?` · ${esc(ap.client)}`:''}${ap.support?` · ${esc(ap.support)}`:''}</p>
  ${ap.before||ap.after?`<div class="ab">${['before','after'].map(k=>ap[k]?`<div><p class="lbl">${k==='before'?'Antes':'Después'}</p><img src="${ap[k]}" alt=""></div>`:'').join('')}</div>`:''}
  <ul>${path.aplicar.checks.map((c,i)=>`<li>${ap.checks?.[i]?'✓':'·'} ${esc(c)}</li>`).join('')}</ul><p>${esc(ap.reflection||'')}</p></section>`}).join('');
 return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bitácora · LAB/OFICIO</title><style>
 body{margin:0;background:#f0eee8;color:#1b201e;font:16px/1.55 Georgia,'Source Serif 4',serif}main{max-width:900px;margin:0 auto;padding:48px 24px 80px}
 h1{font:900 56px/.9 Arial,sans-serif;letter-spacing:-.05em;margin:8px 0 6px}h2{font:900 40px/1 Arial,sans-serif;letter-spacing:-.04em;margin:4px 0}h3{font:800 18px Arial,sans-serif;margin:28px 0 8px;padding-top:12px;border-top:1px solid #cbd0c8}
 .eb,.lbl{font:600 11px/1.4 'DM Mono',Consolas,monospace;letter-spacing:.07em;text-transform:uppercase;color:#ca4a2a;margin:14px 0 4px}.q{font-size:20px;margin:6px 0 16px}
 .path{background:#faf9f5;border:1px solid #cbd0c8;padding:28px;margin-top:28px;break-before:page}table{border-collapse:collapse;width:100%;font:14px/1.4 Arial,sans-serif;margin:8px 0}th,td{text-align:left;vertical-align:top;border-bottom:1px solid #dcdfd7;padding:6px 8px}
 .sum td.done{color:#1c7a45;font-weight:700}.sum td.closed{color:#8a6d1f;font-weight:700}blockquote{margin:6px 0 4px;padding-left:12px;border-left:2px solid #cbd0c8;color:#4b524c}
 .ab{display:grid;grid-template-columns:1fr 1fr;gap:18px}.ab svg,.ab img{width:100%;height:auto;display:block;border:1px solid #cbd0c8}.t{list-style:none;padding:0;font:13px Arial,sans-serif}.t .ok{color:#1c7a45}.t .no{color:#b33a1e}.m{font-size:12.5px}
 small{color:#606961}@media(max-width:640px){.ab{grid-template-columns:1fr}h1{font-size:40px}}@media print{body{background:#fff}.path{border:0;padding:0}}
 </style></head><body><main><p class="eb">LAB/OFICIO · Bitácora de criterio</p><h1>${paths.length===1?esc(paths[0].name):'Recorridos'}</h1><p>${now.toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'})}. Registro de decisiones: lo que se estudió, lo que se probó, cómo se evaluó y dónde se aplicó.</p>${sec}</main></body></html>`;
}
function downloadLog(paths){const S=O.snapshot();const list=paths.length>1?paths.filter(p=>O.progress(p,S).n||Object.keys(S.P.paths?.[p.id]||{}).length):paths;if(!list.length){toast('Todavía no hay avances para incluir en la bitácora');return}const html=logHTML(list);const blob=new Blob([html],{type:'text/html;charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=list.length===1?`lab-oficio-bitacora-${list[0].id}.html`:'lab-oficio-bitacora-completa.html';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);toast('Bitácora descargada')}

route();
})();
