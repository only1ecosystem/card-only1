// Datos de las tarjetas. Se edita esto y se ejecuta `node generar.js`.
// El alcance de cada servicio vive en servicios.js.
// tel: sin signos, como lo pide wa.me. ig: usuario sin arroba.
// Cada persona tiene dos caras: e = empresas, c = contenido.

// Se enseña el precio «desde» de cada servicio en la tarjeta.
// Por defecto no: el precio va en la propuesta, después de la llamada.
const MOSTRAR_PRECIOS = false;

const SECTORES = [
  'Inmobiliaria', 'Automoción', 'Bienestar', 'Clínicas',
  'Formación', 'Fitness', 'Marca personal',
];

const CIFRAS = {
  e: [
    ['Proyectos ejecutados', '15+'],
    ['Sectores distintos', '7'],
    ['Webs y sistemas en marcha', '20+'],
  ],
  c: [
    ['Seguidores generados', '80K+'],
    ['Reproducciones orgánicas', '3M'],
    ['Piezas producidas', '500+'],
  ],
};

// Casos con captura real de la web publicada, contados por lo que ganó el
// cliente y no por lo que entregamos nosotros.
//   antes    — de dónde venía
//   despues  — en qué ha cambiado su día a día
//   metrica  — la cifra grande. Sólo se pone si se puede enseñar: la de Zallo
//              está en su propia ficha de Google. Donde falta, el caso se
//              imprime igual, sin el número. ⚠️ Faltan las de Ana María y
//              Mile Wellness: en cuanto Lucas las tenga, van aquí.
const CASOS = [
  {
    nombre: 'Ana María Rentería',
    sector: 'Inmobiliaria de lujo',
    img: 'proy-anamaria.jpg',
    alt: 'Web de Ana María Rentería: villa de lujo sobre el mar con el titular «No necesitas ver más propiedades»',
    metrica: null,
    metricaPie: null,
    antes: 'Enseñaba propiedades una a una por WhatsApp, a compradores de medio mundo.',
    despues: 'El comprador filtra solo, en su idioma, y pide consulta privada ya decidido. Ella entra a la llamada cuando el cliente vale la pena.',
  },
  {
    nombre: 'Zallo Motor',
    sector: 'Taller mecánico · Bilbao',
    img: 'proy-zallomotor.jpg',
    alt: 'Web de Zallo Motor: el taller de Bilbao por dentro con coches en el elevador',
    metrica: '4,9★',
    metricaPie: 'con 108 reseñas en Google',
    antes: 'Un taller de barrio que dependía del boca a boca del vecino.',
    despues: 'Hoy la cita entra desde el móvil, por llamada o WhatsApp, y la ficha de Google es su mejor comercial.',
  },
  {
    nombre: 'Mile Wellness',
    sector: 'Bienestar',
    img: 'proy-milewellness.jpg',
    alt: 'Web de Mile Wellness: masaje con aceite y el titular «Tu bienestar es tu mejor inversión»',
    metrica: null,
    metricaPie: null,
    antes: 'Cada cita costaba una conversación, y los huecos libres se quedaban vacíos.',
    despues: 'El cliente reserva, recibe el recordatorio y aparece. La agenda se llena sin cruzar un mensaje.',
  },
  {
    nombre: 'Tomás Gracia',
    sector: 'Formación · Marca personal',
    img: 'proy-tomas.jpg',
    alt: 'Landing de Tomás Gracia para el evento online Desata tu poder invencible',
    metrica: 'Objetivo',
    metricaPie: 'de plazas cubierto',
    antes: 'Un evento en directo que había que llenar en cuestión de días.',
    despues: 'Landing y campaña montadas a tiempo: llegó al número de inscritos que se había puesto.',
  },
];

const CLIENTES = [
  ['tomasgraciaoficial', 'cli-tomas.jpg', 'Tomás Gracia'],
  ['inigoo00', 'cli-inigo.jpg', 'Íñigo'],
  ['leyretorres_', 'cli-leyre.jpg', 'Leyre Torres'],
  ['repa.movement', 'cli-repa.jpg', 'Repa Movement'],
  ['bryanmoralesk', 'cli-bryan.jpg', 'Bryan Morales'],
  ['erikymonika.salsadancers', 'cli-erikymonika.jpg', 'Erik y Monika'],
];

const PASOS = {
  e: [
    ['Llamada de 30 minutos', 'Nos cuentas por dónde entran hoy tus clientes y dónde se te caen.'],
    ['Propuesta cerrada', 'Qué entra, qué no entra y en cuántos días. Precio cerrado, sin horas abiertas.'],
    ['Se monta y se entrega', 'Lo dejamos funcionando y te enseñamos a usarlo. El mantenimiento es opcional.'],
  ],
  c: [
    ['Llamada de 30 minutos', 'Qué quieres contar, a quién y con cuánto tiempo cuentas tú.'],
    ['Guion y calendario', 'Antes de encender la cámara está escrito lo que se va a publicar.'],
    ['Rodaje y entrega', 'Un día de grabación, las piezas editadas y listas para publicar.'],
  ],
};

const EQUIPO = [
  {
    slug: 'jonathan',
    nombre: 'Jonathan',
    apellidos: 'Galarraga Custodio',
    apellidoVcf: 'Galarraga Custodio',
    tel: '34600229984',
    ig: 'jg.custodio',
    titulo: 'CEO',
    e: {
      rol: 'CEO · Estrategia',
      pitch: 'Miro tu negocio, te digo dónde se escapa el dinero y montamos el sistema que lo cierra. <b>No asesoramos: lo dejamos funcionando.</b>',
      interes: 'Quiero ver qué podéis hacer por mi negocio.',
    },
    c: {
      rol: 'CEO · Marca personal',
      pitch: 'Tu cara es el activo. <b>Posicionamiento, mensaje y plan de publicación</b> para que te llamen a ti y no a tu competencia.',
      interes: 'Me interesa la parte de contenido y marca personal.',
    },
  },
  {
    slug: 'lucas',
    nombre: 'Lucas',
    apellidos: 'Espinosa',
    apellidoVcf: 'Espinosa',
    tel: '34627914263',
    ig: 'soylucasespinosa',
    titulo: 'Co-fundador · Sistemas',
    e: {
      rol: 'Sistemas · Web y CRM',
      pitch: 'Web, reservas, reseñas y automatizaciones. <b>El sistema trabaja cuando tú ya has cerrado.</b>',
      interes: 'Quiero ver qué podéis hacer por mi negocio.',
    },
    c: {
      rol: 'Contenido · Edición',
      pitch: 'Edición y formato. <b>Piezas que se entienden en tres segundos</b>, no vídeos bonitos que nadie termina.',
      interes: 'Me interesa la parte de contenido.',
    },
  },
  {
    slug: 'edgar',
    nombre: 'Edgar',
    apellidos: '',
    apellidoVcf: '',
    tel: '34687557835',
    ig: 'edgar.mindset',
    titulo: 'Co-fundador · Contenido',
    e: {
      rol: 'Landings y chatbots',
      pitch: 'Landings que convierten y <b>chatbots que atienden a tus clientes</b> a la hora a la que tú ya no puedes.',
      interes: 'Quiero ver qué podéis hacer por mi negocio.',
    },
    c: {
      rol: 'Contenido · Redes',
      pitch: 'Contenido para redes de principio a fin: <b>idea, pieza y publicación.</b> Tú apareces, del resto nos ocupamos.',
      interes: 'Me interesa la parte de contenido.',
    },
  },
  {
    slug: 'carlos',
    nombre: 'Carlos',
    apellidos: 'Sieiro',
    apellidoVcf: 'Sieiro',
    tel: '34672854705',
    ig: 'carlossieiro',
    titulo: 'Co-fundador · Audiovisual',
    e: {
      rol: 'Audiovisual · Producción',
      pitch: 'Vídeo de empresa: <b>producto, marca y evento.</b> Grabado en tu sitio y entregado listo para publicar.',
      interes: 'Quiero ver qué podéis hacer por mi negocio.',
    },
    c: {
      rol: 'Cámara · Grabación',
      pitch: 'Cámara y edición. <b>Reels, entrevistas y podcast</b> grabados donde estés, sin montar un plató.',
      interes: 'Me interesa la parte de contenido.',
    },
  },
  {
    slug: 'cristian',
    nombre: 'Cristian',
    apellidos: 'Mantval',
    apellidoVcf: 'Mantval',
    tel: '34641717324',
    ig: 'crismantval',
    titulo: 'Co-fundador · Guion',
    e: {
      rol: 'Mensaje · Guion',
      pitch: 'Qué dices, en qué orden y por qué. <b>El mensaje va antes que la cámara</b>, y ahí se gana o se pierde la venta.',
      interes: 'Quiero ver qué podéis hacer por mi negocio.',
    },
    c: {
      rol: 'Guion · Storytelling',
      pitch: 'Ganchos, estructura y storytelling. <b>El guion es el 80% del reel</b>; lo demás es montaje.',
      interes: 'Me interesa la parte de contenido.',
    },
  },
];

module.exports = { MOSTRAR_PRECIOS, SECTORES, CIFRAS, CASOS, CLIENTES, PASOS, EQUIPO };
