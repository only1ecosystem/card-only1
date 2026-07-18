# card.onlyonegrowth.com — Tarjetas digitales only1.

Sitio estático con las tarjetas de contacto del equipo. Cada persona vive en su propia ruta limpia:

| Ruta | Persona | WhatsApp |
|------|---------|----------|
| `/lucas`    | Lucas Espinosa   | +34 627 914 263 |
| `/carlos`   | Carlos Sieiro    | +34 672 854 705 |
| `/cristian` | Cristian Mantval | +34 641 717 324 |

La raíz (`/`) redirige a https://only1ecosystem.com.

## Estructura

```
card-only1/
├── index.html          # redirección de la raíz
├── vercel.json         # cleanUrls + trailingSlash:false
├── lucas/index.html
├── carlos/index.html
└── cristian/index.html
```

Cada tarjeta es HTML autocontenido (CSS y JS inline; solo carga Google Fonts). No requiere build.

## Deploy

Proyecto en Vercel con dominio personalizado `card.onlyonegrowth.com`.
Al ser carpetas por persona, Vercel sirve automáticamente `/lucas`, `/carlos` y `/cristian` sin `.html`.

## Editar una tarjeta

El pitch, el teléfono de WhatsApp, el Instagram y los clientes están en el HTML de cada persona.
El nombre para "Guardar contacto" (vCard) está en el objeto `C` al final del archivo.
