// Genera la pieza con el QR de cada tarjeta, con la marca de only1.
//
//   cd herramientas && npm install
//   node qr.js               → todos
//   node qr.js jonathan      → sólo esa persona
//   node qr.js jonathan feria → con el parámetro de evento en el enlace
//
// Escribe en ../qr/: el SVG del código suelto, el HTML de la pieza y, si
// encuentra Playwright, el PNG para pantalla (1080×1350) y el de imprimir
// (A6 a 300 ppp). Sin Playwright deja el HTML: se abre y se imprime a PDF.
//
// El código va en corrección H (30 %), que es lo que permite tapar el centro
// con el isotipo sin que deje de leerse. Al terminar se decodifica el PNG y
// se compara con la URL: si no coincide, el script falla.

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { EQUIPO } = require('../personas.js');

const BASE = 'https://card.onlyonegrowth.com';
const SALIDA = path.join(__dirname, '..', 'qr');

const NOIR = '#111111';
const CREAM = '#FAFAF8';
const WINE = '#520E23';

// ── el código ──────────────────────────────────────────────────────────────

// Módulos redondos y ojos con marco: se lee igual y deja de parecer un QR
// de generador gratuito. El hueco central lo tapa el isotipo.
const QUIETA = 4;                 // módulos de zona de silencio. Sin ella el
                                  // lector no encuentra el código, por muy
                                  // bien dibujado que esté.

// El viewBox va en módulos, no en píxeles: un módulo es una unidad y el
// navegador escala al tamaño final. Dibujarlo directamente en píxeles deja
// el paso de módulo en 22,22 px, los bordes salen difuminados y el código
// deja de leerse. Comprobado: así no lee, en unidades sí.
function qrSvg(texto, lado) {
  const qr = QRCode.create(texto, { errorCorrectionLevel: 'H' });
  const n = qr.modules.size;
  const datos = qr.modules.data;
  const total = n + QUIETA * 2;
  const p = 1;                    // un módulo, una unidad
  const off = QUIETA;
  // Módulo redondeado que ocupa la celda entera. Probado: con puntos sueltos
  // (radio 0,47) quedan huecos entre módulos vecinos y el código deja de
  // leerse; tocándose, lee en todas las variantes.
  const rx = 0.35;

  const enOjo = (x, y) => (
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7)
  );

  // el isotipo tapa el centro: esos módulos no se dibujan
  const hueco = Math.round(n * 0.18);
  const desde = Math.floor((n - hueco) / 2);
  const hasta = desde + hueco;
  const enHueco = (x, y) => x >= desde && x < hasta && y >= desde && y < hasta;

  let puntos = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!datos[y * n + x]) continue;
      if (enOjo(x, y) || enHueco(x, y)) continue;
      puntos += `<rect x="${off + x}" y="${off + y}" width="1" height="1" rx="${rx}"/>`;
    }
  }

  // Los tres ojos: marco de 7×7 con anillo de 1 módulo y núcleo de 3×3.
  // El trazo de SVG va centrado en el contorno, así que el rect se mete
  // medio módulo hacia dentro; si no, el anillo cae medio módulo fuera de
  // su sitio y el lector no reconoce el patrón.
  const ojo = (cx, cy, color) => {
    const x = off + cx + 0.5;
    const y = off + cy + 0.5;
    const g = 6;
    return `
    <g>
      <rect x="${x}" y="${y}" width="${g}" height="${g}"
            rx="1" fill="none" stroke="${color}" stroke-width="1"/>
      <rect x="${off + cx + 2}" y="${off + cy + 2}" width="3" height="3"
            rx="0.7" fill="${color}"/>
    </g>`;
  };

  const iso = hueco * 0.92;
  const isoXY = (total - iso) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${lado}" height="${lado}" shape-rendering="geometricPrecision">
    <rect width="${total}" height="${total}" fill="${CREAM}"/>
    <g fill="${NOIR}">${puntos}</g>
    ${ojo(0, 0, NOIR)}
    ${ojo(n - 7, 0, NOIR)}
    ${ojo(0, n - 7, WINE)}
    <g transform="translate(${isoXY.toFixed(3)} ${isoXY.toFixed(3)}) scale(${(iso / 400).toFixed(6)})">
      <circle cx="200" cy="200" r="200" fill="${NOIR}"/>
      <path d="M176.460 147.780L149.680 147.780L149.680 99.940L229.760 99.940L229.760 290L176.460 290L176.460 147.780Z" fill="${CREAM}"/>
      <circle cx="265" cy="275" r="22" fill="${WINE}"/>
    </g>
  </svg>`;
}

// ── la pieza ───────────────────────────────────────────────────────────────

function pieza(p, url, svg, { ancho, alto, imprimir }) {
  const completo = p.apellidos ? `${p.nombre} ${p.apellidos}` : p.nombre;
  const visible = url.replace('https://', '');
  const fondo = imprimir ? CREAM : NOIR;
  const tinta = imprimir ? NOIR : CREAM;
  const suave = imprimir ? '#6B6B6B' : '#9A9A9A';

  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{
    width:${ancho}px;height:${alto}px;background:${fondo};color:${tinta};
    font-family:"Poppins",sans-serif;-webkit-font-smoothing:antialiased;
    display:flex;flex-direction:column;align-items:center;
    padding:${Math.round(alto * 0.045)}px ${Math.round(ancho * 0.07)}px;
    position:relative;overflow:hidden;
  }
  ${imprimir ? '' : `body::before{
    content:"";position:absolute;inset:0 0 auto;height:52%;
    background:radial-gradient(120% 100% at 50% 0,rgba(160,34,62,.30),transparent 64%);
  }`}
  .marco{position:relative;display:flex;flex-direction:column;align-items:center;width:100%;height:100%}
  .top{display:flex;align-items:baseline;justify-content:space-between;width:100%}
  .wordmark{font-size:${Math.round(ancho * 0.062)}px;font-weight:800;letter-spacing:-.04em;line-height:1}
  .label{font-size:${Math.round(ancho * 0.019)}px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${suave}}
  .codigo{
    margin-top:${Math.round(alto * 0.035)}px;padding:${Math.round(ancho * 0.035)}px;
    background:${CREAM};border-radius:${Math.round(ancho * 0.028)}px;
    /* en la version de imprimir el codigo va sobre papel cream: sin un
       marco que lo delimite, el lector no encuentra donde empieza */
    ${imprimir ? `border:3px solid ${NOIR};` : `box-shadow:0 30px 90px rgba(0,0,0,.45);`}
  }
  .codigo svg{display:block;width:${Math.round(ancho * 0.60)}px;height:${Math.round(ancho * 0.60)}px}
  .escanea{
    margin-top:${Math.round(alto * 0.028)}px;
    font-size:${Math.round(ancho * 0.021)}px;font-weight:700;letter-spacing:3px;text-transform:uppercase;
    color:${suave};display:flex;align-items:center;gap:10px;
  }
  .escanea::before,.escanea::after{content:"";width:${Math.round(ancho * 0.05)}px;height:1px;background:${imprimir ? '#D8D5D0' : 'rgba(250,250,248,.22)'}}
  .nombre{
    margin-top:${Math.round(alto * 0.022)}px;text-align:center;
    font-size:${Math.round(ancho * 0.058)}px;font-weight:800;letter-spacing:-.04em;line-height:1.05;
  }
  .rol{
    margin-top:${Math.round(alto * 0.016)}px;
    font-size:${Math.round(ancho * 0.021)}px;font-weight:700;letter-spacing:3px;text-transform:uppercase;
    color:${suave};display:flex;align-items:center;gap:10px;
  }
  .rol::before{content:"";width:${Math.round(ancho * 0.011)}px;height:${Math.round(ancho * 0.011)}px;border-radius:50%;background:#A0223E}
  .pie{
    margin-top:auto;width:100%;padding-top:${Math.round(alto * 0.022)}px;
    border-top:1px solid ${imprimir ? '#E4E2DE' : 'rgba(250,250,248,.12)'};
    display:flex;align-items:baseline;justify-content:space-between;
    font-size:${Math.round(ancho * 0.021)}px;color:${suave};
  }
  .pie b{color:${tinta};font-weight:700}
</style></head>
<body><div class="marco">
  <div class="top">
    <div class="wordmark">only1.</div>
    <span class="label">Bilbao</span>
  </div>

  <div class="codigo">${svg}</div>
  <div class="escanea">Escanea y hablamos</div>

  <div class="nombre">${completo.replace(' ', '<br>')}</div>
  <div class="rol">${p.e.rol}</div>

  <div class="pie">
    <span><b>${visible}</b></span>
    <span>Donde el 1% ya está.</span>
  </div>
</div></body></html>`;
}

// ── verificación ───────────────────────────────────────────────────────────

async function comprobar(png, esperado) {
  const jsQR = require('jsqr');
  const { PNG } = require('pngjs');
  const img = PNG.sync.read(fs.readFileSync(png));
  const leido = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
  if (!leido) throw new Error(`el QR de ${path.basename(png)} no se puede leer`);
  if (leido.data !== esperado) throw new Error(`${path.basename(png)} apunta a ${leido.data} y no a ${esperado}`);
  return true;
}

// ── ejecución ──────────────────────────────────────────────────────────────

(async () => {
  const [quien, evento] = process.argv.slice(2);
  const lista = quien ? EQUIPO.filter((p) => p.slug === quien) : EQUIPO;
  if (!lista.length) throw new Error(`no hay nadie con el slug «${quien}»`);
  fs.mkdirSync(SALIDA, { recursive: true });

  let navegador = null;
  try {
    const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
    navegador = await chromium.launch();
  } catch {
    console.log('  (sin Playwright: se deja el HTML, sin PNG)\n');
  }

  for (const p of lista) {
    const url = `${BASE}/${p.slug}${evento ? `?e=${evento}` : ''}`;
    const sufijo = evento ? `-${evento}` : '';

    fs.writeFileSync(path.join(SALIDA, `${p.slug}${sufijo}.svg`), qrSvg(url, 1000), 'utf8');

    // primero el código solo: si falla aquí, el problema es el código y no
    // el tamaño al que lo pone la pieza
    if (navegador) {
      const ctx = await navegador.newContext({ viewport: { width: 1400, height: 1400 } });
      const pag = await ctx.newPage();
      await pag.setContent(`<body style="margin:0">${qrSvg(url, 1400)}</body>`);
      await pag.waitForTimeout(200);
      const solo = path.join(SALIDA, `.check-codigo.png`);
      await pag.screenshot({ path: solo });
      await ctx.close();
      await comprobar(solo, url);
      fs.unlinkSync(solo);
    }

    for (const [nombre, medidas] of Object.entries({
      pantalla: { ancho: 1080, alto: 1350, imprimir: false },
      imprimir: { ancho: 1240, alto: 1748, imprimir: true },
    })) {
      const svg = qrSvg(url, 1000);
      const doc = pieza(p, url, svg, medidas);
      const html = path.join(SALIDA, `${p.slug}${sufijo}-${nombre}.html`);
      fs.writeFileSync(html, doc, 'utf8');

      if (!navegador) continue;
      const ctx = await navegador.newContext({ viewport: { width: medidas.ancho, height: medidas.alto } });
      const pag = await ctx.newPage();
      await pag.setContent(doc, { waitUntil: 'networkidle' });
      await pag.waitForTimeout(600);
      const png = path.join(SALIDA, `${p.slug}${sufijo}-${nombre}.png`);
      await pag.screenshot({ path: png });

      // Se comprueba la caja del código recortada, no la pieza entera: el
      // resto de la maqueta (el nombre a 90 px) despista al decodificador,
      // que busca patrones cuadrados por toda la imagen. Lo que escanea una
      // cámara es este recorte.
      const recorte = path.join(SALIDA, `.check-${nombre}.png`);
      await pag.locator('.codigo').screenshot({ path: recorte });

      // que no se salga nada: el pie es lo primero que se cae si el nombre
      // ocupa dos líneas
      const desbordes = await pag.evaluate((limite) => [...document.querySelectorAll('.marco > *')]
        .filter((el) => el.getBoundingClientRect().bottom > limite)
        .map((el) => el.className), medidas.alto - Math.round(medidas.alto * 0.045) + 2);
      await ctx.close();
      if (desbordes.length) throw new Error(`en ${nombre} se sale: ${desbordes.join(', ')}`);
      await comprobar(recorte, url);
      fs.unlinkSync(recorte);
      console.log(`  ${path.basename(png).padEnd(30)} ${medidas.ancho}×${medidas.alto}  → ${url}  ✓ se lee`);
    }
  }

  if (navegador) await navegador.close();
  console.log(`\n${lista.length} ${lista.length === 1 ? 'pieza' : 'piezas'} en qr/`);
})();
