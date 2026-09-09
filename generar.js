// Genera las tarjetas del equipo.
//   node generar.js
// Lee personas.js (quién y qué se ha conseguido) y paquetes.js (qué se vende)
// y escribe <slug>/index.html y <slug>.vcf para cada persona.
const fs = require('fs');
const path = require('path');
const { MOSTRAR_PRECIOS, SECTORES, CIFRAS, CASOS, CLIENTES, PASOS, EQUIPO } = require('./personas.js');
const { EMPRESAS, CONTENIDO } = require('./paquetes.js');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── bloques ────────────────────────────────────────────────────────────────

const chips = () => SECTORES.map((s) => `<span class="chip">${esc(s)}</span>`).join('');

// «80K+» se parte en 80 y K+: el número manda y el sufijo acompaña.
const cifras = (cara) => CIFRAS[cara].map(([t, n]) => {
  const m = String(n).match(/^([\d.,]+)(.*)$/);
  const num = m ? m[1] : n;
  const suf = m ? m[2] : '';
  return `
        <div>
          <dd>${esc(num)}${suf ? `<i>${esc(suf)}</i>` : ''}</dd>
          <dt>${esc(t)}</dt>
        </div>`;
}).join('');

const paquetes = (lista) => lista.map((s, i) => `
        <article class="pk">
          <div class="pk-top">
            <span class="idx">${String(i + 1).padStart(2, '0')}</span>
            <h3>${esc(s.nombre)}</h3>
            ${MOSTRAR_PRECIOS && s.desde ? `<span class="pk-precio">${esc(s.desde)}</span>` : ''}
          </div>
          <p class="pk-claim">${esc(s.claim)}</p>
          <ul class="pk-lista">${s.puntos.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          <p class="pk-para"><span>Para</span> ${esc(s.para)}</p>
        </article>`).join('');

const casos = () => CASOS.map((c) => `
      <article class="caso">
        <div class="caso-img">
          <img src="/assets/${c.img}" width="640" height="400" loading="lazy" decoding="async" alt="${esc(c.alt)}">
          <span class="caso-sector">${esc(c.sector)}</span>
        </div>
        <h3>${esc(c.nombre)}</h3>
        ${c.metrica ? `
        <p class="caso-metrica"><b>${esc(c.metrica)}</b> ${esc(c.metricaPie || '')}</p>` : ''}
        <dl class="caso-cambio">
          <dt>Antes</dt><dd>${esc(c.antes)}</dd>
          <dt>Ahora</dt><dd class="ahora">${esc(c.despues)}</dd>
        </dl>
      </article>`).join('');

const pasos = (cara) => PASOS[cara].map(([t, d], i) => `
        <li>
          <span class="paso-n">${i + 1}</span>
          <div><h3>${esc(t)}</h3><p>${esc(d)}</p></div>
        </li>`).join('');

const clientes = () => CLIENTES.map(([nom, ig]) => (ig
  ? `
        <a class="cli" href="https://instagram.com/${ig}">${esc(nom)}</a>`
  : `
        <span class="cli">${esc(nom)}</span>`)).join('');

// ── la pieza ───────────────────────────────────────────────────────────────

function html(p) {
  const completo = p.apellidos ? `${p.nombre} ${p.apellidos}` : p.nombre;
  const h1 = p.apellidos ? `${esc(p.nombre)}<br>${esc(p.apellidos)}` : esc(p.nombre);

  return `<!DOCTYPE html>
<html lang="es" data-v="e">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(completo)} · only1.</title>
<meta name="description" content="${esc(p.titulo)} en only1. Webs, reservas, reseñas y contenido para negocios. Bilbao.">
<meta name="theme-color" content="#111111">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='%23FAFAF8'/%3E%3Cpath d='M176.46 147.78L149.68 147.78L149.68 99.94L229.76 99.94L229.76 290L176.46 290L176.46 147.78Z' fill='%23111111'/%3E%3Ccircle cx='265' cy='275' r='22' fill='%23520E23'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  /* ─────────────────────────────────────────────────────────────
     only1. · tarjeta digital · BRAND.md V2
     Dos caras en una pieza: data-v="e" (empresas) y data-v="c"
     (contenido). El estado vive en <html>, así que sin JS se ve la
     cara de empresas entera.
     Wine: el bloque de cifras es el único macizo de la pieza. El vivo
     (#A0223E) sólo en trazos finos, porque el oficial sobre noir no
     llega a contraste.
     ───────────────────────────────────────────────────────────── */
  :root{
    --noir:#111111;   --noir:oklch(17.6% 0.006 8);
    --carbon:#1C1C1C; --carbon:oklch(23.2% 0.008 8);
    --wine:#520E23;
    --wine-vivo:#A0223E;
    --cream:#FAFAF8;
    --muted:#6B6B6B;  --muted:oklch(53% 0.008 8);
    --muted-alto:#9A9A9A;
    --line:rgba(250,250,248,.09);
    --line-strong:rgba(250,250,248,.18);
    --xs:8px; --sm:16px; --md:24px; --lg:32px; --xl:48px; --xxl:72px;
    --ease:cubic-bezier(.16,1,.3,1);
  }

  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{-webkit-text-size-adjust:100%}
  body{
    background:var(--noir); color:var(--cream);
    font-family:"Poppins",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
    -webkit-font-smoothing:antialiased;
    line-height:1.6;
    display:flex; justify-content:center;
    padding-bottom:calc(78px + env(safe-area-inset-bottom));
  }
  .card{
    position:relative; width:100%; max-width:430px;
    padding:max(var(--md),env(safe-area-inset-top)) var(--md) var(--lg);
  }
  /* el aire de arriba, teñido: da profundidad sin meter otra superficie */
  .card::before{
    content:""; position:absolute; inset:0 0 auto; height:420px; z-index:-1;
    background:radial-gradient(120% 100% at 50% 0,rgba(160,34,62,.20),transparent 62%);
  }
  a{color:inherit;text-decoration:none}
  img{display:block;max-width:100%}
  button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
  :focus-visible{outline:2px solid var(--cream);outline-offset:3px}

  .label{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--muted-alto)}
  .idx{font-size:10px;font-weight:700;color:var(--muted);letter-spacing:2px;flex:none;font-variant-numeric:tabular-nums}

  [data-v="e"] .v-c{display:none}
  [data-v="c"] .v-e{display:none}

  /* ── cabecera ──────────────────────────────────────────────── */
  .top{display:flex;align-items:baseline;justify-content:space-between;padding-bottom:var(--md);border-bottom:1px solid var(--line)}
  .wordmark{font-size:22px;font-weight:800;letter-spacing:-.04em;line-height:1}

  /* ── conmutador ────────────────────────────────────────────── */
  .switch{display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-top:var(--md);padding:3px;border:1px solid var(--line-strong);border-radius:3px}
  .switch button{
    height:44px;border-radius:2px;
    font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted-alto);
    transition:background-color .3s var(--ease),color .3s var(--ease);
  }
  .switch button[aria-pressed="true"]{background:var(--cream);color:var(--noir)}
  @media (hover:hover){.switch button[aria-pressed="false"]:hover{color:var(--cream)}}

  /* ── hero ──────────────────────────────────────────────────── */
  .hero{padding:var(--lg) 0 0}
  .name{font-size:clamp(40px,12.5vw,54px);font-weight:800;letter-spacing:-.045em;line-height:.97;text-wrap:balance}
  .role{margin-top:14px;display:flex;align-items:center;gap:9px}
  .role::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--wine-vivo);flex:none}
  .pitch{margin-top:var(--md);font-size:17px;line-height:1.5;max-width:33ch;text-wrap:pretty}
  .pitch b{font-weight:700}

  .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:var(--md)}
  .chip{
    font-size:10.5px;font-weight:600;letter-spacing:.04em;color:var(--muted-alto);
    border:1px solid var(--line-strong);border-radius:999px;padding:5px 11px;
  }

  /* ── acciones ──────────────────────────────────────────────── */
  .actions{display:flex;flex-direction:column;gap:10px;margin-top:var(--lg)}
  .btn{
    display:flex;align-items:center;justify-content:center;gap:10px;
    height:56px;border-radius:3px;font-size:15px;font-weight:700;letter-spacing:-.01em;
    transition:transform .35s var(--ease),background-color .25s var(--ease),border-color .25s var(--ease);
  }
  .btn:active{transform:scale(.98)}
  .btn svg{width:19px;height:19px;flex:none}
  .btn-main{background:var(--cream);color:var(--noir)}
  .btn-alt{border:1px solid var(--line-strong);color:var(--cream)}
  @media (hover:hover){
    .btn-main:hover{background:#fff}
    .btn-alt:hover{border-color:var(--cream)}
  }

  /* ── cifras · el único bloque macizo ───────────────────────── */
  .figures{
    position:relative;overflow:hidden;
    margin:var(--xl) calc(var(--md) * -1) 0;padding:26px var(--md) 28px;
    background:linear-gradient(163deg,#5E1129 0%,#520E23 46%,#3B0A19 100%);
  }
  /* filo de luz arriba: separa la banda del noir sin meter otra línea */
  .figures::before{
    content:"";position:absolute;inset:0 0 auto;height:1px;
    background:linear-gradient(90deg,transparent,rgba(250,250,248,.34),transparent);
  }
  /* halo en la esquina, para que el macizo no sea plano */
  .figures::after{
    content:"";position:absolute;top:-55%;left:-12%;width:75%;height:170%;
    background:radial-gradient(closest-side,rgba(160,34,62,.6),transparent);
    pointer-events:none;
  }
  .figures > *{position:relative;z-index:1}
  .fg-head{display:flex;align-items:center;gap:12px}
  .fg-head::after{content:"";flex:1;height:1px;background:rgba(250,250,248,.20)}
  .figures .label{color:rgba(250,250,248,.66);white-space:nowrap}
  .figures dl{display:grid;grid-template-columns:repeat(3,1fr);margin-top:22px}
  .figures dl > div{padding-left:14px;border-left:1px solid rgba(250,250,248,.17)}
  .figures dl > div:first-child{padding-left:0;border-left:0}
  .figures dd{
    font-size:clamp(30px,9.4vw,38px);font-weight:800;letter-spacing:-.05em;line-height:.95;
    font-variant-numeric:tabular-nums;
  }
  .figures dd i{
    font-style:normal;font-size:.56em;font-weight:700;letter-spacing:-.02em;
    color:rgba(250,250,248,.6);margin-left:1px;
  }
  .figures dt{font-size:10px;font-weight:600;color:rgba(250,250,248,.64);line-height:1.35;margin-top:10px}

  /* ── secciones ─────────────────────────────────────────────── */
  section{padding-top:var(--xxl)}
  .sec-head{display:flex;align-items:baseline;justify-content:space-between;gap:var(--sm)}
  .sec-tit{font-size:26px;font-weight:800;letter-spacing:-.035em;line-height:1.1;margin-top:10px;text-wrap:balance}
  .sec-sub{font-size:13.5px;color:var(--muted-alto);line-height:1.5;margin-top:10px;max-width:34ch}
  .sec-head a{padding:14px 0;margin:-14px 0}

  /* ── paquetes ──────────────────────────────────────────────── */
  .pks{display:flex;flex-direction:column;gap:12px;margin-top:var(--md)}
  .pk{
    background:var(--carbon);border:1px solid var(--line);border-radius:4px;
    padding:20px;transition:border-color .3s var(--ease);
  }
  @media (hover:hover){.pk:hover{border-color:var(--line-strong)}}
  .pk-top{display:flex;align-items:baseline;gap:11px}
  .pk-top .idx{color:var(--wine-vivo)}
  .pk-top h3{flex:1;font-size:19px;font-weight:800;letter-spacing:-.03em;line-height:1.15}
  .pk-precio{font-size:11.5px;font-weight:700;color:var(--muted-alto);white-space:nowrap}
  .pk-claim{font-size:14px;line-height:1.45;margin-top:8px;color:var(--cream);text-wrap:pretty}
  .pk-lista{list-style:none;margin-top:16px}
  .pk-lista li{position:relative;padding-left:19px;font-size:13px;color:var(--muted-alto);line-height:1.5;margin-bottom:6px}
  .pk-lista li::before{
    content:"";position:absolute;left:1px;top:8px;width:8px;height:4.5px;
    border-left:1.5px solid var(--wine-vivo);border-bottom:1.5px solid var(--wine-vivo);
    transform:rotate(-45deg);
  }
  .pk-para{
    font-size:11.5px;color:var(--muted);line-height:1.5;
    margin-top:16px;padding-top:13px;border-top:1px solid var(--line);
  }
  .pk-para span{font-weight:700;letter-spacing:1.5px;text-transform:uppercase;font-size:9.5px;color:var(--muted)}

  .nota{font-size:11.5px;color:var(--muted);line-height:1.55;margin-top:var(--md)}

  /* ── casos · lo que cambió en su negocio ───────────────────── */
  .casos{display:flex;flex-direction:column;gap:var(--xl);margin-top:var(--md)}
  .caso-img{position:relative}
  /* height:auto es obligatorio: el atributo height del <img> fija la
     altura y aspect-ratio sólo actúa con una dimensión en auto. */
  .caso-img img{
    width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;object-position:top center;
    background:var(--carbon);filter:saturate(.94);
  }
  .caso-sector{
    position:absolute;left:10px;bottom:10px;
    font-size:9.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
    background:rgba(17,17,17,.82);color:var(--cream);
    border:1px solid var(--line-strong);border-radius:999px;padding:5px 10px;
    backdrop-filter:blur(6px);
  }
  .caso h3{font-size:19px;font-weight:800;letter-spacing:-.03em;line-height:1.2;margin-top:18px}
  /* la cifra es lo único que se lee a un metro de distancia */
  .caso-metrica{display:flex;align-items:baseline;gap:9px;margin-top:12px;flex-wrap:wrap}
  .caso-metrica b{
    font-size:38px;font-weight:800;letter-spacing:-.045em;line-height:1;
    color:var(--wine-vivo);font-variant-numeric:tabular-nums;
  }
  .caso-metrica{font-size:12px;color:var(--muted-alto);line-height:1.4}
  .caso-cambio{margin-top:16px;display:grid;grid-template-columns:auto 1fr;gap:6px var(--sm)}
  .caso-cambio dt{
    font-size:9.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
    color:var(--muted);padding-top:5px;
  }
  .caso-cambio dd{font-size:13.5px;color:var(--muted-alto);line-height:1.5}
  .caso-cambio .ahora{color:var(--cream)}

  /* ── cómo funciona ─────────────────────────────────────────── */
  .pasos{list-style:none;margin-top:var(--md);border-top:1px solid var(--line)}
  .pasos li{display:grid;grid-template-columns:auto 1fr;gap:var(--sm);padding:20px 0;border-bottom:1px solid var(--line)}
  .paso-n{
    font-size:30px;font-weight:800;line-height:.9;letter-spacing:-.04em;
    color:transparent;-webkit-text-stroke:1.2px var(--muted);
  }
  .pasos h3{font-size:15.5px;font-weight:700;letter-spacing:-.02em;line-height:1.3}
  .pasos p{font-size:13px;color:var(--muted-alto);line-height:1.5;margin-top:4px}

  /* ── clientes · nombres, sin fotos de terceros ─────────────── */
  .avatars{display:flex;flex-wrap:wrap;gap:8px;margin-top:var(--md)}
  .cli{
    display:flex;align-items:center;min-height:44px;padding:0 15px;
    font-size:13.5px;font-weight:600;letter-spacing:-.01em;color:var(--cream);
    background:var(--carbon);border:1px solid var(--line);border-radius:999px;
    transition:border-color .25s var(--ease),transform .35s var(--ease);
  }
  /* los que tienen Instagram llevan el punto; los demás, no */
  a.cli::after{content:"";width:5px;height:5px;border-radius:50%;background:var(--wine-vivo);margin-left:9px}
  a.cli:active{transform:scale(.96)}
  @media (hover:hover){a.cli:hover{border-color:var(--line-strong)}}

  /* ── enlaces + pie ─────────────────────────────────────────── */
  .links{display:flex;flex-wrap:wrap;gap:0 var(--md);margin-top:var(--xl);padding-top:12px;border-top:1px solid var(--line)}
  /* el padding es lo que da los 44px táctiles; de ahí que el gap vertical sea 0 */
  .links a{padding:12px 0;font-size:13px;font-weight:500;color:var(--muted-alto);transition:color .25s var(--ease)}
  .links a:active{color:var(--cream)}
  @media (hover:hover){.links a:hover{color:var(--cream)}}

  footer{margin-top:var(--md);font-size:11px;color:var(--muted);line-height:1.7}
  footer b{color:var(--cream);font-weight:500}

  /* ── barra fija · aparece cuando el botón del hero se va ───── */
  .barra{
    position:fixed;left:50%;bottom:0;z-index:5;
    width:100%;max-width:430px;
    display:grid;grid-template-columns:1fr auto;gap:10px;
    padding:12px var(--md) calc(12px + env(safe-area-inset-bottom));
    background:rgba(17,17,17,.86);backdrop-filter:blur(14px) saturate(1.2);
    border-top:1px solid var(--line-strong);
    transform:translate(-50%,120%);transition:transform .45s var(--ease);
  }
  .barra.on{transform:translate(-50%,0)}
  .barra .btn{height:52px}
  .barra .btn-alt{width:52px}
  .barra .btn-alt span{display:none}

  /* ── entrada escalonada · sólo opacity y transform ─────────── */
  .rise{opacity:0;transform:translateY(14px);animation:rise .9s var(--ease) forwards}
  @keyframes rise{to{opacity:1;transform:none}}
  .d1{animation-delay:.05s}.d2{animation-delay:.12s}.d3{animation-delay:.19s}
  .d4{animation-delay:.26s}.d5{animation-delay:.33s}
  @media (prefers-reduced-motion:reduce){
    .rise{animation:none;opacity:1;transform:none}
    .btn,.pk,.avatars a,.links a,.switch button,.barra{transition:none}
  }
</style>
<script>
  // Antes de pintar: la cara que pide la URL (?v=contenido), para que no salte.
  (function(){
    var v = new URLSearchParams(location.search).get('v') || '';
    if (v.charAt(0) === 'c') document.documentElement.dataset.v = 'c';
  }());
</script>
</head>
<body>
<main class="card">

  <header class="top rise d1">
    <div class="wordmark">only1.</div>
    <span class="label">Bilbao</span>
  </header>

  <div class="switch rise d1">
    <button type="button" data-cara="e" aria-pressed="true">Empresas</button>
    <button type="button" data-cara="c" aria-pressed="false">Contenido</button>
  </div>

  <div class="hero">
    <h1 class="name rise d2">${h1}</h1>
    <p class="role label rise d2 v-e">${esc(p.e.rol)}</p>
    <p class="role label rise d2 v-c">${esc(p.c.rol)}</p>
    <p class="pitch rise d3 v-e">${p.e.pitch}</p>
    <p class="pitch rise d3 v-c">${p.c.pitch}</p>

    <div class="chips rise d3 v-e">${chips()}</div>

    <div class="actions rise d4" id="acciones">
      <a class="btn btn-main" id="wa" href="https://wa.me/${p.tel}">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1.1.1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.2.3-.3.5l-.5.5c-.2.2-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.3.1.4.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1l1.7.8c.3.1.5.2.5.4.1.1.1.6-.1 1.1Z"/></svg>
        Hablar por WhatsApp
      </a>
      <!-- .vcf estático: Safari iOS ignora el atributo download en blobs -->
      <a class="btn btn-alt" href="/${p.slug}.vcf">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
        Guardar contacto
      </a>
    </div>
  </div>

  <section class="figures rise d5">
    <p class="fg-head"><span class="label">Lo que llevamos hecho</span></p>
    <dl class="v-e">${cifras('e')}
    </dl>
    <dl class="v-c">${cifras('c')}
    </dl>
  </section>

  <section class="v-e">
    <span class="label">Lo que hemos cambiado</span>
    <h2 class="sec-tit">Cómo estaban antes y cómo están ahora</h2>
    <div class="casos">${casos()}
    </div>
  </section>

  <section>
    <div class="v-e">
      <span class="label">Qué hacemos</span>
      <h2 class="sec-tit">Cinco formas de trabajar con nosotros</h2>
      <p class="sec-sub">Por encima, para que veas por dónde va. El detalle se cierra en la propuesta, con precio y plazo por escrito.</p>
      <div class="pks">${paquetes(EMPRESAS)}
      </div>
      <p class="nota">Si lo tuyo no encaja en ninguno, se hace a medida. Lo que no hacemos es prometer un número de clientes.</p>
    </div>
    <div class="v-c">
      <span class="label">Qué hacemos</span>
      <h2 class="sec-tit">Contenido con estrategia detrás, no vídeos sueltos</h2>
      <p class="sec-sub">Por encima, para que veas por dónde va. El detalle se cierra en la propuesta, con precio y plazo por escrito.</p>
      <div class="pks">${paquetes(CONTENIDO)}
      </div>
      <p class="nota">La grabación puede ser presencial o la haces tú: cambia el precio, no la estrategia.</p>
    </div>
  </section>

  <section>
    <span class="label">Cómo funciona</span>
    <h2 class="sec-tit">De la llamada a tenerlo funcionando</h2>
    <ol class="pasos v-e">${pasos('e')}
    </ol>
    <ol class="pasos v-c">${pasos('c')}
    </ol>
  </section>

  <section>
    <span class="label">Algunos clientes</span>
    <div class="avatars">${clientes()}
    </div>
  </section>

  <nav class="links">
    <a href="https://instagram.com/${p.ig}">Instagram</a>
    <a href="https://instagram.com/onlyonegrowth">@onlyonegrowth</a>
    <a href="https://only1ecosystem.com">only1ecosystem.com</a>
  </nav>

  <footer>
    <b>Donde el 1% ya está.</b><br>
    ONLY1 S.L. · Bilbao · ${esc(completo)}
  </footer>

</main>

<div class="barra" id="barra">
  <a class="btn btn-main" id="wa2" href="https://wa.me/${p.tel}">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1.1.1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.2.3-.3.5l-.5.5c-.2.2-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.3.1.4.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1l1.7.8c.3.1.5.2.5.4.1.1.1.6-.1 1.1Z"/></svg>
    Hablar con ${esc(p.nombre)}
  </a>
  <a class="btn btn-alt" href="/${p.slug}.vcf" aria-label="Guardar contacto">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
    <span>Guardar contacto</span>
  </a>
</div>

<script>
  (function () {
    var NOMBRE = ${JSON.stringify(p.nombre)};
    var TEL = ${JSON.stringify(p.tel)};
    var SLUG = ${JSON.stringify(p.slug)};
    var INTERES = { e: ${JSON.stringify(p.e.interes)}, c: ${JSON.stringify(p.c.interes)} };

    // El mensaje se adapta al evento del QR: /${p.slug}?e=gala
    var eventos = {
      gala:  'te escaneé la tarjeta en la Gala',
      feria: 'te escaneé la tarjeta en la feria',
      web:   'llego desde vuestra web'
    };
    var qs = new URLSearchParams(location.search);
    var ev = qs.get('e');
    var contexto = eventos[ev] || 'acabo de escanear tu tarjeta';

    var raiz = document.documentElement;
    var was = [document.getElementById('wa'), document.getElementById('wa2')];
    var tabs = [].slice.call(document.querySelectorAll('.switch button'));

    function pintar(cara) {
      raiz.dataset.v = cara;
      tabs.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cara === cara)); });
      var href = 'https://wa.me/' + TEL + '?text=' +
        encodeURIComponent('Hola ' + NOMBRE + ', ' + contexto + '. ' + INTERES[cara]);
      was.forEach(function (a) { a.href = href; });
    }

    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        pintar(b.dataset.cara);
        // La cara elegida queda en la URL: quien reenvíe el enlace la conserva.
        qs.set('v', b.dataset.cara === 'c' ? 'contenido' : 'empresas');
        history.replaceState(null, '', location.pathname + '?' + qs);
        if (window.va) window.va('event', { name: 'cara', data: { persona: SLUG, cara: b.dataset.cara } });
      });
    });

    pintar(raiz.dataset.v === 'c' ? 'c' : 'e');

    // La barra fija entra cuando el botón del hero deja de verse.
    var barra = document.getElementById('barra');
    var acciones = document.getElementById('acciones');
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (e) {
        barra.classList.toggle('on', !e[0].isIntersecting);
      }, { rootMargin: '-10px 0px 0px 0px' }).observe(acciones);
    }

    // Vercel Analytics: cuántos escanean vs cuántos abren WhatsApp
    was.forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.va) window.va('event', { name: 'whatsapp', data: { persona: SLUG, cara: raiz.dataset.v, evento: ev || 'directo' } });
      });
    });
  }());
</script>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
`;
}

function vcf(p) {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${p.apellidoVcf};${p.nombre};;;`,
    `FN:${p.apellidos ? p.nombre + ' ' + p.apellidos : p.nombre}`,
    'ORG:only1.',
    `TITLE:${p.titulo}`,
    `TEL;TYPE=CELL,VOICE:+${p.tel}`,
    'URL:https://only1ecosystem.com',
    'NOTE:only1. Webs, reservas, resenas y contenido para negocios. Bilbao.',
    'END:VCARD',
    '',
  ].join('\r\n');
}

for (const p of EQUIPO) {
  const doc = html(p);
  fs.mkdirSync(path.join(__dirname, p.slug), { recursive: true });
  fs.writeFileSync(path.join(__dirname, p.slug, 'index.html'), doc, 'utf8');
  fs.writeFileSync(path.join(__dirname, `${p.slug}.vcf`), vcf(p), 'utf8');
  console.log(`  /${p.slug}  ${(Buffer.byteLength(doc, 'utf8') / 1024).toFixed(1)} KB`);
}
console.log(`\n${EQUIPO.length} tarjetas · ${EMPRESAS.length} paquetes de empresa · ${CONTENIDO.length} de contenido · precios ${MOSTRAR_PRECIOS ? 'VISIBLES' : 'ocultos'}`);
