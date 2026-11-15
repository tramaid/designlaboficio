// Pruebas de extremo a extremo de LAB/OFICIO.
// Levanta servidor.js, recorre todas las páginas y completa el recorrido 01
// (Jerarquía y lectura) usando la interfaz real. Falla si hay errores de script
// o si alguna conexión entre páginas deja de funcionar.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || 8799);
const B = `http://127.0.0.1:${PORT}/`;
const out = mkdtempSync(join(tmpdir(), 'lab-oficio-'));
const results = [];
const check = async (name, fn) => {
  try { await fn(); results.push(['ok', name]); console.log('✓', name); }
  catch (e) { results.push(['fail', name, e.message]); console.log('✗', name, '\n  ', e.message.split('\n')[0]); }
};

const server = spawn(process.execPath, ['servidor.js'], { cwd: root, env: { ...process.env, PORT: String(PORT) }, stdio: 'pipe' });
await new Promise((ok, no) => { server.stdout.on('data', d => String(d).includes('iniciado') && ok()); server.on('error', no); setTimeout(() => no(new Error('El servidor no arrancó')), 8000); });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 }, acceptDownloads: true });
await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(`${page.url()} :: ${e.message}`));
page.on('dialog', d => d.accept());
const store = key => page.evaluate(k => JSON.parse(localStorage.getItem(k) || '{}'), key);

try {
  await check('Todas las páginas cargan sin errores de script', async () => {
    for (const f of ['index.html', '1-grafico.html', '2-web.html', '3-editorial.html', '4-identidad.html', '5-motion.html', 'taller.html', 'herramientas.html', 'estudio.html', 'recorridos.html', 'recorridos.html#identidad/practicar']) {
      await page.goto(B + f, { waitUntil: 'load' }); await page.waitForTimeout(300);
    }
    assert.deepEqual(errors, []);
  });

  await check('Entender: las láminas marcadas cuentan en el recorrido', async () => {
    await page.goto(B + 'recorridos.html#jerarquia/entender'); await page.waitForTimeout(200);
    await page.click('#st-entender a[data-go]'); await page.waitForLoadState('load'); await page.waitForTimeout(300);
    assert.ok(await page.locator('.of-dock').isVisible(), 'la guía no aparece en la lámina');
    for (const id of ['jerarquia', 'contraste', 'recorrido']) await page.locator(`#${id} .lab-done`).click();
    await page.goto(B + '3-editorial.html#anatomia'); await page.waitForTimeout(300);
    await page.locator('#anatomia .lab-done').click();
    await page.goto(B + 'recorridos.html#jerarquia/entender'); await page.waitForTimeout(300);
    assert.match(await page.locator('#st-entender .rt-pill').innerText(), /cumplido/i);
  });

  await check('Experimentar: la configuración sugerida se aplica y se puede restaurar', async () => {
    await page.goto(B + 'herramientas.html?aplicar=jerarquia#type'); await page.waitForTimeout(500);
    assert.equal((await store('lab-oficio-herramientas-v1')).type.ratio, 1.5);
    assert.equal(await page.locator('#typeRatio').inputValue(), '1.5');
    await page.click('.of-applied [data-act=undo]'); await page.waitForLoadState('load'); await page.waitForTimeout(300);
    assert.notEqual((await store('lab-oficio-herramientas-v1')).type?.ratio, 1.5);
    await page.goto(B + 'herramientas.html?aplicar=jerarquia#type'); await page.waitForTimeout(400);
    await page.goto(B + 'recorridos.html#jerarquia/experimentar'); await page.waitForTimeout(200);
    await page.fill('#exAnswer', 'Para la placa elegí razón 1,5: con 1,125 el subtítulo y el texto se leían como un mismo bloque.');
    await page.reload(); await page.waitForTimeout(300);
    assert.match(await page.locator('#st-experimentar .rt-pill').innerText(), /cumplido/i);
  });

  await check('Practicar: el taller mide A y B y la guía las fija', async () => {
    await page.goto(B + 'recorridos.html#jerarquia/practicar'); await page.waitForTimeout(200);
    await page.click('#st-practicar a.button.dark'); await page.waitForLoadState('load'); await page.waitForTimeout(500);
    assert.match(await page.locator('#briefTitle').innerText(), /lectura a distancia/i);
    await page.click('#saveA');
    await page.evaluate(() => {
      const T = JSON.parse(localStorage.getItem('lab-oficio-taller-v1'));
      const w = T.work.carvan, A = structuredClone(w), Bv = structuredClone(w);
      A.items.find(i => i.text?.startsWith('ASADO')).size = 120; A.items.find(i => i.text?.startsWith('$')).size = 52;
      Bv.items.forEach(i => { if (i.type === 'text') i.size = Math.max(40, Math.min(56, i.size)); });
      T.versions.carvan = { A, B: Bv }; localStorage.setItem('lab-oficio-taller-v1', JSON.stringify(T));
    });
    await page.waitForTimeout(1800);
    assert.match(await page.locator('.of-dock').innerText(), /2,31 : 1/);
    await page.click('.of-dock [data-act=fix]'); await page.waitForURL(/recorridos/); await page.waitForTimeout(300);
    assert.match(await page.locator('#st-practicar .rt-pill').innerText(), /cumplido/i);
  });

  await check('Evaluar: traspaso al laboratorio 06, lectura registrada y rúbrica', async () => {
    await page.fill('#predA', 'ASADO ESPECIAL, después el precio');
    await page.click('[data-read=A]'); await page.waitForURL(/estudio/); await page.waitForTimeout(1200);
    assert.match(await page.locator('#hImageStatus').innerText(), /versión A/);
    assert.equal(await page.locator('#hGoal').inputValue(), 'ASADO ESPECIAL, después el precio');
    await page.locator('#hOriginal').scrollIntoViewIfNeeded();
    const box = await page.locator('#hOriginal').boundingBox();
    for (const [x, y] of [[.3, .38], [.3, .7], [.2, .12]]) await page.mouse.click(box.x + box.width * x, box.y + box.height * y);
    await page.fill('#hFirst', 'ASADO ESPECIAL, la palabra grande');
    await page.goto(B + 'recorridos.html#jerarquia/evaluar'); await page.waitForTimeout(400);
    await page.click('[data-capture=A]'); await page.waitForTimeout(400);
    assert.match(await page.locator('.rt-reading').first().innerText(), /la palabra grande/);
    for (const c of ['orden', 'recursos', 'distancia', 'intencion', 'contexto']) {
      await page.click(`[data-rate=A][data-c=${c}][data-l="3"]`); await page.click(`[data-rate=B][data-c=${c}][data-l="2"]`);
    }
    await page.click('[data-choice=A]');
    await page.fill('#evDecision', 'Elijo A: en la lectura el producto se vio primero y el precio segundo, como buscaba.');
    await page.waitForTimeout(200);
    assert.match(await page.locator('#st-evaluar .rt-pill').innerText(), /cumplido/i);
  });

  await check('Aplicar y bitácora descargable', async () => {
    await page.locator('#st-aplicar summary').click();
    await page.fill('#apPiece', 'Placa de ofertas de fin de semana');
    for (let i = 0; i < 4; i++) await page.check(`[data-check="${i}"]`);
    await page.fill('#apRefl', 'Antes agrandaba el precio por costumbre. Ahora decido el nivel 1 según el objetivo y lo pruebo reducido y en gris.');
    const png = join(out, 'muestra.png'); await page.screenshot({ path: png });
    await page.setInputFiles('[data-img=before]', png); await page.waitForTimeout(600);
    assert.match(await page.locator('#st-aplicar .rt-pill').innerText(), /cumplido/i);
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#rtLog')]);
    const file = join(out, dl.suggestedFilename()); await dl.saveAs(file);
    assert.match(readFileSync(file, 'utf8'), /Bitácora de criterio/);
  });

  await check('Taller: «Analizar lectura» envía la composición actual', async () => {
    await page.goto(B + 'taller.html#htg'); await page.waitForTimeout(400);
    await page.click('#saveA');
    await page.click('#ofAnalyze'); await page.waitForURL(/estudio/); await page.waitForTimeout(1200);
    assert.match(await page.locator('#hImageStatus').innerText(), /Un clic antes de pensar/);
  });

  await check('Repaso: una respuesta incorrecta enlaza la lámina que la enseña', async () => {
    await page.goto(B + 'index.html'); await page.waitForTimeout(300);
    await page.locator('#qbody .opts button').first().click();
    assert.match(await page.locator('.of-quiz-link').first().innerText(), /Jerarquía/);
  });

  await check('Respaldo del cuaderno incluye los recorridos', async () => {
    const [bk] = await Promise.all([page.waitForEvent('download'), page.click('#labExport')]);
    const file = join(out, 'respaldo.json'); await bk.saveAs(file);
    const data = JSON.parse(readFileSync(file, 'utf8'));
    assert.equal(data.version, 4); assert.ok(data.paths?.paths?.jerarquia);
  });

  await check('Ancho de teléfono sin desborde horizontal', async () => {
    const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await m.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    const mp = await m.newPage();
    for (const u of ['index.html', 'recorridos.html', 'recorridos.html#jerarquia/evaluar']) {
      await mp.goto(B + u); await mp.waitForTimeout(300);
      assert.equal(await mp.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, u);
    }
    await m.close();
  });

  await check('Sin errores de script durante todo el recorrido', async () => assert.deepEqual(errors, []));
} finally {
  await browser.close();
  server.kill();
}
const failed = results.filter(r => r[0] === 'fail');
writeFileSync(join(out, 'resultado.json'), JSON.stringify(results, null, 2));
console.log(`\n${results.length - failed.length} de ${results.length} pruebas pasaron.`);
process.exit(failed.length ? 1 : 0);
