// Los paquetes que vende ONLY1, por encima. No es el catálogo: es lo que
// alguien entiende en diez segundos mirando el móvil. El detalle (qué entra,
// qué no, plazos, rondas) va en la propuesta, no aquí.
//
// Salen de cms/data/catalogo/transversales.json (los de ONLY1), lucas.json
// y cris.json. «desde» es texto y sólo se imprime si personas.js pone
// MOSTRAR_PRECIOS en true.

const EMPRESAS = [
  {
    nombre: 'Presencia que capta',
    para: 'Negocio local con clientes que buscan en Google',
    claim: 'Que te encuentren, te reserven y te valoren, sin que tú hagas nada',
    desde: 'desde 697 €',
    puntos: [
      'Web hecha para captar, no para lucir',
      'Reservas con confirmación y recordatorios',
      'Reseñas de Google que se piden solas',
    ],
  },
  {
    nombre: 'Growth System',
    para: 'Quien ya vende y quiere dejar de depender de sí mismo',
    claim: 'El sistema de captación y venta instalado de principio a fin',
    desde: '4.500 €',
    puntos: [
      'Embudo y páginas de captación',
      'CRM con cada cliente y cada paso dentro',
      'Automatizaciones de seguimiento',
      'Formación grabada de todo el sistema',
    ],
  },
  {
    nombre: 'Evergreen Funnel',
    para: 'Formación, coaching y servicios de ticket alto',
    claim: 'Vender todos los meses sin depender de un lanzamiento',
    desde: 'de 2.000 a 3.500 €',
    puntos: [
      'Embudo permanente de captación y venta',
      'Páginas, secuencias y automatizaciones',
      'Una ronda de revisiones por entregable',
    ],
  },
  {
    nombre: 'IA dentro del negocio',
    para: 'Quien pierde clientes por no contestar a tiempo',
    claim: 'Contesta en menos de 60 segundos, a cualquier hora',
    desde: 'desde 1.500 €',
    puntos: [
      'Chatbot con IA entrenado con tu información',
      'Agente que atiende y agenda por WhatsApp',
      'Diagnóstico y plan de implantación',
    ],
  },
  {
    nombre: 'Grand Slam 360',
    para: 'Quien quiere delegarlo todo en un solo sitio',
    claim: 'La agencia entera, con 90 días de soporte incluidos',
    desde: 'de 3.500 a 4.500 €',
    puntos: [
      'Marca, contenido, campañas y sistema',
      'Un solo interlocutor para todo',
      '90 días de soporte después de la entrega',
    ],
  },
];

const CONTENIDO = [
  {
    nombre: 'Estrategia Base',
    para: 'Quien empieza y no sabe qué publicar',
    claim: '12 piezas con la estrategia de marca detrás',
    desde: 'desde 880 €',
    puntos: [
      'Línea estratégica y pilares definidos',
      '12 piezas de contenido',
      'Opción con la gestión operativa incluida',
    ],
  },
  {
    nombre: 'Sistema + Historias de venta',
    para: 'Quien ya publica pero no le entra nadie',
    claim: '24 piezas y el sistema de historias que vende',
    desde: 'desde 1.200 €',
    puntos: [
      '24 piezas de contenido',
      'Sistema de historias de venta',
      'Opción con dos meses de gestión',
    ],
  },
  {
    nombre: 'Dirección Estratégica',
    para: 'Marca personal que ya factura por redes',
    claim: '36 piezas con dirección estratégica continua',
    desde: 'desde 1.400 €',
    puntos: [
      '36 piezas de contenido',
      'Dirección estratégica del contenido',
      'Opción con tres meses de gestión',
    ],
  },
  {
    nombre: 'Producción presencial',
    para: 'Quien tiene poco tiempo y quiere calidad',
    claim: 'Un día de rodaje y sales con el contenido de un mes',
    desde: null,
    puntos: [
      'Jornada de grabación dirigida, con equipo',
      'Edición de todas las piezas del pack',
      'Dirección en plató o en tu propio espacio',
    ],
  },
];

module.exports = { EMPRESAS, CONTENIDO };
