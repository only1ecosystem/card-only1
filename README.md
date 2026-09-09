# card.onlyonegrowth.com — Tarjetas digitales only1.

Sitio estático con las tarjetas del equipo. No es una tarjeta de contacto: es
**la presentación comercial de ONLY1 con la cara de quien la entrega**. Jonathan
le pasa el QR a un hotel, el hotel abre, ve cuatro negocios que cambiaron, ve por
dónde va cada paquete y escribe por WhatsApp.

| Ruta | Persona | Rol | WhatsApp | Instagram |
|------|---------|-----|----------|-----------|
| `/jonathan` | Jonathan Galarraga Custodio | CEO | +34 600 22 99 84 | @jg.custodio |
| `/lucas`    | Lucas Espinosa   | Sistemas · Web y CRM | +34 627 914 263 | @soylucasespinosa |
| `/edgar`    | Edgar            | Landings y chatbots  | +34 687 55 78 35 | @edgar.mindset |
| `/carlos`   | Carlos Sieiro    | Audiovisual          | +34 672 854 705 | @carlossieiro |
| `/cristian` | Cristian Mantval | Mensaje y guion      | +34 641 717 324 | @crismantval |

La raíz (`/`) redirige a https://only1ecosystem.com.

⚠️ **Edgar está sin apellido.** En cuanto lo pase, se añade a `personas.js` y se regenera.

## Qué lleva dentro

Las dos caras de ONLY1 en una sola pieza, con un conmutador arriba. La de
**Empresas** es la de partida; **Contenido** es la otra mitad del negocio.

| | Empresas | Contenido |
|---|---|---|
| Cifras | Proyectos · clientes · sectores | Seguidores · reproducciones · piezas |
| Sectores | Chips de los 9 sectores trabajados | — |
| Casos | 4, en formato antes / ahora | — |
| Paquetes | 5 | 4 |
| Cómo funciona | 3 pasos hasta tenerlo montado | 3 pasos hasta publicar |
| Clientes | 10 nombres, con enlace a Instagram el que lo tenga | igual |

**La pieza no lleva imágenes.** Ni capturas de proyecto ni avatares de cliente:
todo es tipografía, hairlines y la cifra en grande. Pesa 32 KB, carga instantánea
con datos móviles y no depende de fotos de terceros.

**Los casos van antes que el catálogo, y se cuentan por lo que ganó el cliente**,
no por lo que entregamos: de dónde venía, en qué ha cambiado y, cuando hay cifra
que se pueda enseñar, esa cifra en grande. La de Zallo Motor está en su propia
ficha de Google.

**Los paquetes van por encima.** Nombre, para quién es y tres o cuatro líneas de
qué entra. Ni «no incluye», ni plazos, ni quién lo lleva dentro: **la tarjeta la
firma ONLY1, no una persona**. El detalle se cierra en la propuesta.

Un solo QR por persona. La cara elegida queda en la URL (`?v=contenido`), así que
un enlace reenviado abre por donde se dejó, y un script en el `<head>` la aplica
antes de pintar para que no haya salto. Sin JavaScript se ve la cara de Empresas
entera: el estado vive en el atributo `data-v` del `<html>`, ya escrito en el HTML.

Al bajar aparece una **barra fija** con «Hablar con \<nombre\>» y guardar contacto:
la pieza mide 5.600 px y el botón no puede quedarse arriba del todo.

## Estructura

```
card-only1/
├── personas.js         # quién: equipo, cifras, sectores, casos, pasos, clientes
├── paquetes.js         # qué se vende, por encima
├── generar.js          # plantilla + generador: node generar.js
├── index.html          # redirección de la raíz
├── vercel.json         # cleanUrls y cabecera de los .vcf
├── <persona>/index.html   # generado
├── <persona>.vcf          # generado
└── _v1/                # las tarjetas de julio, congeladas (redirigidas en Vercel)
```

## Editar

**No se toca el HTML.** Se edita `personas.js` o `paquetes.js` y se ejecuta:

```
node generar.js
```

- **`paquetes.js`** — un objeto por paquete: `nombre`, `para`, `claim`, `desde`
  y `puntos[]`. Salen del catálogo del CRM (`cms/data/catalogo/transversales.json`
  y `cris.json`), resumidos.
- **`personas.js`** — el equipo (con `rol`, `pitch` e `interes` por cara), y lo
  común: `SECTORES`, `CIFRAS`, `CASOS`, `CLIENTES`, `PASOS`.

### Precios

`MOSTRAR_PRECIOS` en `personas.js` está en **false**. Ponlo en `true` y cada
paquete imprime su `desde` junto al nombre («4.500 €», «de 2.000 a 3.500 €»). Es una decisión comercial, no técnica: enseñarlos
filtra a quien no puede pagarlo y quita margen a la llamada.

## Mensaje de WhatsApp

Se compone de tres partes: saludo, contexto del QR e interés de la cara abierta.

| URL | Mensaje |
|-----|---------|
| `/lucas`              | «Hola Lucas, acabo de escanear tu tarjeta. Quiero ver qué podéis hacer por mi negocio.» |
| `/lucas?v=contenido`  | «… acabo de escanear tu tarjeta. Me interesa la parte de contenido.» |
| `/lucas?e=gala`       | «… te escaneé la tarjeta en la Gala. …» |
| `/lucas?e=feria`      | «… te escaneé la tarjeta en la feria. …» |
| `/lucas?e=web`        | «… llego desde vuestra web. …» |

Los dos parámetros se combinan (`?e=gala&v=contenido`). Imprime el QR con el
parámetro del evento y sabrás de dónde viene cada contacto.

## Medición

Con Vercel Analytics, dos eventos: `cara` (Empresas ↔ Contenido) y `whatsapp`
(persona, cara y evento). En local dan 404, que es lo esperado: el
script sólo existe en Vercel.

## Decisiones que no se tocan sin motivo

- **Paleta V2 de [`BRAND.md`](../../BRAND.md)**: noir `#111111`, carbon `#1C1C1C`,
  wine `#520E23`, cream `#FAFAF8`, muted `#6B6B6B`. El bloque de cifras es el
  único macizo en wine. El **wine vivo `#A0223E`** aparece sólo en trazos finos
  (el punto del rol, los checks, la barra del resultado y el tinte de la cabecera):
  el oficial sobre noir no llega a contraste en 1px.
- **Ninguna promesa de resultado.** Ni número de clientes, ni porcentaje de
  conversión. Lo dice el propio catálogo y lo repite la tarjeta.
- **`.vcf` estático**, no generado con `Blob`: Safari iOS ignora el atributo
  `download` en blobs, abre una pestaña en blanco y no guarda nada.
- **44 px de alto táctil** en todo lo pulsable. Verificado en Chromium a 390 y 1440.
- **Nada de «lo lleva Fulano»** en la parte comercial. Quien recibe la tarjeta
  contrata a ONLY1; el reparto interno no es asunto suyo.
- **Ningún enlace que prometa más de lo que hay.** Se quitó el «Ver todo» de los
  casos: llevaba a una página que no enseña más que estos cuatro.

## El QR

`herramientas/qr.js` genera la pieza con el código de cada tarjeta:

```
cd herramientas && npm install
node qr.js                 # los cinco
node qr.js jonathan        # sólo uno
node qr.js jonathan feria  # con el parámetro de evento en el enlace
```

Deja en `qr/` el SVG del código suelto, el HTML de la pieza y dos PNG: uno de
**1080×1350** para enseñar en el móvil o publicar, y otro de **1240×1748** (A6 a
300 ppp, fondo claro) para imprimir. Quedan publicados, así que se pueden abrir
desde el móvil: `card.onlyonegrowth.com/qr/jonathan-pantalla.png`.

El código lleva el isotipo en el centro y el ojo de abajo a la izquierda en wine.
Cuatro cosas que hay que respetar, todas aprendidas a base de que no leyera:

- **Corrección H** (30 %). Es lo que permite tapar el centro con el isotipo.
- **4 módulos de zona de silencio**, dentro del propio SVG.
- **El viewBox va en módulos, no en píxeles.** Dibujado en píxeles el paso queda
  en 22,22 px, los bordes salen difuminados y deja de leerse.
- **Los módulos se tocan.** Con puntos sueltos (radio 0,47 de la celda) quedan
  huecos entre vecinos y no lee; con el módulo redondeado ocupando la celda, sí.

El script **decodifica lo que acaba de generar** y compara con la URL: si no se
lee, o si algún bloque se sale de la pieza, falla y no deja el archivo por bueno.

## Deploy

Proyecto en Vercel con dominio personalizado `card.onlyonegrowth.com`.
Al ser carpetas por persona, Vercel sirve las rutas sin `.html`.

Las capturas de proyecto y los avatares de cliente que había hasta el 09/09/2026
están en la historia de git, junto con la tarjeta `lucas-v2` que los usaba.
