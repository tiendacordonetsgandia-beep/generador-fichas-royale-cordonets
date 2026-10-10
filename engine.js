/* ============================================================
   Motor de generación de fichas — Royale Cordonets
   Analiza la foto de la zapatilla (color real por píxeles) y
   genera: nombre de modelo, descripción para padres, tabla de
   tallas 16-27 en cm y 3 beneficios.
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- 1. Medidas reales ---------- */
  // Largo interior del pie en cm, por talla EU (16 a 27).
  const CM_TALLA = {
    16: 9.6, 17: 10.2, 18: 10.9, 19: 11.5, 20: 12.2,
    21: 12.9, 22: 13.5, 23: 14.2, 24: 14.9, 25: 15.5,
    26: 16.2, 27: 16.9
  };
  // Ancho orientativo del pie (cm), más generoso que en zapatos convencionales.
  const ANCHO_TALLA = {
    16: 6.2, 17: 6.5, 18: 6.7, 19: 6.9, 20: 7.1,
    21: 7.3, 22: 7.5, 23: 7.7, 24: 7.9, 25: 8.1,
    26: 8.3, 27: 8.5
  };
  // Edad orientativa.
  const EDAD = {
    16: '6-9 meses', 17: '9-12 meses', 18: '12-15 meses', 19: '15-18 meses',
    20: '18-21 meses', 21: '21-24 meses', 22: '2 años', 23: '2,5 años',
    24: '3 años', 25: '3,5 años', 26: '4 años', 27: '4-5 años'
  };

  function tablaTallas(desde, hasta) {
    const filas = [];
    for (let t = desde; t <= hasta; t++) {
      filas.push({
        talla: t,
        cm: CM_TALLA[t].toFixed(1).replace('.', ','),
        ancho: ANCHO_TALLA[t].toFixed(1).replace('.', ','),
        edad: EDAD[t]
      });
    }
    return filas;
  }

  /* ---------- 2. Banco de nombres por estilo ---------- */
  const NOMBRES = {
    bota: ['Nube', 'Bruma', 'Cumbre', 'Aneto', 'Alba'],
    botin: ['Copito', 'Arándano', 'Nevado', 'Trufa', 'Canela'],
    sandalia: ['Brisa', 'Marea', 'Verbena', 'Marina', 'Siroco'],
    deportiva: ['Cometa', 'Chispa', 'Trote', 'Saltarín', 'Vuelo'],
    casa: ['Mimos', 'Nido', 'Algodón', 'Siesta', 'Bizcocho'],
    bailarina: ['Pétalo', 'Margarita', 'Lazo', 'Vals', 'Campanilla'],
    zapato: ['Trébol', 'Colmena', 'Paseo', 'Domingo', 'Almendro'],
    generico: ['Paseo', 'Sendero', 'Retoño', 'Farolillo', 'Cordel']
  };

  /* ---------- 3. Banco de descripciones (tono mamá experta) ---------- */
  const DESCRIPCIONES = {
    liso: [
      (n, c) => `Nuestra ${n} es una zapatilla pensada para el pie que aún está creciendo: suela plana, sin drop y lo más fina posible para que el pie sienta el suelo, y horma ancha de puntera redondeada donde los dedos se abren sin apretarse. El acabado en ${c} es de esos que combinan con todo y aguantan el día a día: colegio, parque y recados. Se pone en un momento y el pie va libre, sin costuras que molesten.\n\nA nosotras nos gusta porque respeta el movimiento natural de los pies pequeños: sin sujetar de más, sin deformar y dejando que el tobillo trabaje. Si estás dudando de talla, mide el pie en un folio de talón a dedo más largo y añade 0,7 cm de crecimiento: con eso aciertas seguro.`,
      (n, c) => `${n} nace del gesto más bonito de un pie pequeño: correr sin pensar. Por eso lleva suela flexible que se dobla con el pie, cero amortiguación de más y una puntera ancha que respeta la forma natural. El tono ${c} lo hace fácil de combinar y muy agradecido en el día a día.\n\nEs la zapatilla que ponemos cuando queremos que el pie crezca libre pero con el pie bien protegido de la acera. Ligera, suave en los bordes y con cierre pensado para que ellos mismos puedan ponérsela.`
    ],
    bicolor: [
      (n, c) => `${n} juega con dos tonos, ${c}, para dar ese punto alegre sin renunciar a la comodidad de siempre: horma ancha, suela plana y muy flexible, y cero drop entre talón y antepié. Los dedos tienen sitio para abrirse, que es justo lo que necesita un pie que está aprendiendo a caminar y a correr.\n\nLa piel respira, el forro es suave con los pies que sudan, y el cierre permite ajustarla en segundos cuando salimos corriendo. Una zapatilla bonita por fuera y respetuosa por dentro.`,
      (n, c) => `Esta ${n} es de las que llaman la atención por la calle: combinación de ${c} y un corte sencillo y limpio. Debajo, todo lo bueno del calzado respetuoso: suela sensorial fina, flexión total en la zona del metatarso y espacio real en la puntera.\n\nLa ponemos en el día a día, pero también para esas tardes en las que toca presumir un poquito. Se limpia fácil con un paño húmedo y aguanta el ritmo de un niño de verdad.`
    ],
    metalico: [
      (n, c) => `${n} tiene ese brillo suave del ${c} que hace que cualquier look se vea más arreglado, pero con la estructura de una zapatilla respetuosa: plana, flexible y de horma ancha. Pensada para pies que van a todas partes, con la puntera redondeada y sin refuerzos rígidos que frenen el movimiento del pie.\n\nEs nuestra recomendada para días de celebración y para el día a día, porque el pie sigue trabajando igual de libre aunque la zapatilla sea más de fiesta. El cierre es rápido y sujeta sin apretar.`,
      (n, c) => `Cuando quieres que vaya guapa sin perder nada de salud para sus pies, va esta ${n}: acabado ${c}, suela fina y cero rigidez. Y lo más importante: puntera ancha de verdad, no solo de etiqueta, para que los dedos se coloquen en abanico.\n\nCombínala con todo y olvídate de las prisas: se pone fácil, se ajusta bien y el pie se mantiene libre de costuras y resaltes.`
    ],
    oscuro: [
      (n, c) => `Si buscas algo práctico que no se ensucie al primer paseo, la ${n} en ${c} es tu zapatilla. Y por debajo sigue siendo puro respeto por el pie: suela plana, flexible y muy fina para no perder sensibilidad, horma ancha y cero drop.\n\nNos gusta para el colegio y para los días de lluvia de barro, porque aguanta y se limpia en un minuto con un trapo. El pie sigue libre para moverse, y los dedos tienen el espacio que necesitan para crecer sin apreturas.`,
      (n, c) => `Tonos ${c}, muy socorridos para el invierno y para manchar poco. Esta ${n} mantiene lo esencial del calzado respetuoso: planta sensorial que deja sentir el suelo, flexibilidad de verdad y libertad total en la puntera.\n\nSu forro es suave y abriga lo justo, y el cierre se ajusta solo con tirar. Una zapatilla sin complicaciones para los pies que menos se quejan.`
    ],
    claro: [
      (n, c) => `${n} en ${c} es delicada, luminosa y muy fácil de poner. Lleva lo importante por dentro: suela plana y flexible, cero drop y una horma ancha con la puntera redondeada donde los dedos caben de verdad sin apretarse unos contra otros.\n\nPerfecta para pies que empiezan a dar pasos o que ya no paran. El material es suave al tacto, se limpia con un paño húmedo y mantiene el color después de lavarla un par de veces.`,
      (n, c) => `Una zapatilla clara, alegre y muy ponible: la ${n} en ${c}. Su horma respeta la forma natural del pie, con la puntera más generosa que en el calzado convencional, y la suela no lleva rigideces: se dobla donde se dobla el pie.\n\nIdeal para primavera y verano, con cierre rápido que hasta los más pequeños dominan. El pie va libre y protegido a la vez.`
    ]
  };

  /* ---------- 4. Beneficios ---------- */
  const BENEFICIOS = {
    liso: [
      ['🦶', 'Horma ancha que respeta los dedos', 'La puntera es extra generosa, como el pie: los dedos se abren en abanico sin rozarse, evitando uñas encarnadas y dedos montados.'],
      ['🌿', 'Suela plana, fina y flexible', 'Sin drop ni amortiguación artificial: el pie siente el suelo y los músculos, tendones y ligamentos trabajan como deben.'],
      ['⚡', 'Se pone en segundos', 'Cierre fácil que ellos mismos controlan. Menos peleas por la mañana y un ajuste estable para todo el día.']
    ],
    bicolor: [
      ['🎨', 'Alegre y combinable', 'El contraste de tonos da el toque de color sin que ninguna pieza del zapato se vuelva rígida o estructurada.'],
      ['🦶', 'Puntera redondeada y ancha', 'Los dedos tienen espacio real para moverse, agarrar y empujar, lo que ayuda a que el pie se fortalezca al caminar.'],
      ['💨', 'Materiales que respiran', 'Forro suave y transpirable con costuras mínimas y planas: pensado para pies que sudan y se mueven sin parar.']
    ],
    metalico: [
      ['✨', 'Guapa para ocasiones y para el día a día', 'El acabado metálico viste cualquier look, y la estructura sigue siendo plana y flexible, no un zapato rígido de vestir.'],
      ['🦶', 'Cero drop y flexión total', 'Mismo plano en talón y antepié: la pisada es natural y el pie no se desequilibra hacia delante.'],
      ['🛡️', 'Ajá sin apretar', 'Sujeción ajustable y repartida que da seguridad al andar sin oprimir el empeine, incluso con pie ancho.']
    ],
    oscuro: [
      ['🧺', 'Práctica y fácil de limpiar', 'Un paño húmedo y lista. Se ensucia menos al contacto y es perfecta para colegio y días de barro.'],
      ['🌿', 'Sensorial y sin rigideces', 'Planta fina que deja sentir el suelo: la mejor gimnasia que existe para los pies que están creciendo.'],
      ['🔥', 'Abriga lo justo', 'Forro suave y cálido sin restar libertad al pie, pensado para el fresquito del invierno.']
    ],
    claro: [
      ['☁️', 'Suave como el algodón', 'Materiales agradables al tacto y muy ligeros, sin costuras interiores que marquen ni rocen el pie.'],
      ['🦶', 'Libertad en la puntera', 'Horma ancha desde el primer paso: los dedos no se empujan unos a otros y el pie toma su forma natural.'],
      ['👶', 'Pensada para aprender a andar', 'Suela que se dobla con el pie y no pesa: el peque siente el suelo y gana seguridad en cada paso.']
    ]
  };

  /* ---------- 5. Materiales y consejos ---------- */
  const ROMANOS = ['II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const MATERIALES = ['Piel y serraje de curtición vegetal', 'Forro textil transpirable', 'Suela de goma natural flexible (3 mm)', 'Puntera ancha no estructurada'];
  const CUIDADOS = ['Limpiar con paño húmedo, sin lavadora', 'Secar a la sombra, nunca al radiador', 'Hidratar la piel cada 2-3 semanas', 'No usar secadora'];
  const HECHOS = ['Diseñado en Gandia (Valencia)', 'Horma respetuosa barefoot', 'Talla 16 a 27 de largo interior'];

  /* ---------- 6. Utilidades de color ---------- */
  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function luminancia(r, g, b) { return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); }
  function hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (mx + mn) / 2, d = mx - mn;
    if (d) {
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0));
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return [h, s, l];
  }
  function aHex(r, g, b) {
    return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  /* ---------- 7. Analizador de imagen ---------- */
  async function analizarImagen(src) {
    const img = await cargarImagen(src);
    const W = 140, H = Math.max(60, Math.round(140 * img.height / img.width));
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, W, H);
    const data = ctx.getImageData(0, 0, W, H).data;

    // Cuadrantes: izquierda (donde suele ir el talón), centro, derecha (pico).
    const zonas = { talon: [0, 0.40], centro: [0.30, 0.72], puntera: [0.62, 1] };
    const cubos = new Map();
    const buckets = [];
    const sat = [];

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a < 200) continue;
        const [, s, l] = hsl(r, g, b);
        if (l > 0.955 || l < 0.045) continue;      // fondo blanco / negro duro
        if (s < 0.10) continue;                     // gris neutro (sombra)
        const fx = x / W;
        const zona = fx < zonas.talon[1] ? 'talon' : (fx > zonas.puntera[0] ? 'puntera' : 'centro');
        const key = [r >> 4, g >> 4, b >> 4].join('-');
        let e = cubos.get(key);
        if (!e) { e = { n: 0, r: 0, g: 0, b: 0, s: 0, l: 0, zonas: { talon: 0, centro: 0, puntera: 0 } }; cubos.set(key, e); }
        e.n++; e.r += r; e.g += g; e.b += b; e.s += s; e.l += l; e.zonas[zona]++;
        buckets.push({ r, g, b, s, l, zona });
        sat.push(s);
      }
    }

    const pixeles = buckets.length;
    const cobertura = pixeles / (W * H);
    if (pixeles < 30) {
      return { ok: false, error: 'No he podido distinguir ninguna zapatilla en la foto. Prueba con una imagen sobre fondo blanco o liso y con la zapatilla bien centrada.' };
    }

    const orden = [...cubos.values()].map(e => ({
      n: e.n, r: e.r / e.n, g: e.g / e.n, b: e.b / e.n, s: e.s / e.n, l: e.l / e.n, zonas: e.zonas
    })).sort((a, b) => b.n - a.n);

    const totalCluster = orden.reduce((a, c) => a + c.n, 0);
    const c0 = orden[0], c1 = orden[1], c2 = orden[2];

    // Color principal y secundario (>13% del área coloreada)
    const principal = c0;
    const secundario = (c1 && c1.n / totalCluster > 0.13) ? c1 : null;
    const terciario = (c2 && c2.n / totalCluster > 0.20) ? c2 : null;

    const paleta = [c0, c1, c2, orden[3]].filter(Boolean).map(c => {
      const [h, s, l] = hsl(c.r, c.g, c.b);
      return { hex: aHex(c.r, c.g, c.b), pct: Math.round(c.n / totalCluster * 100), h, s, l };
    });

    // Nombre en español de un color
    function nombreColor(c) {
      const [h, s, l] = hsl(c.r, c.g, c.b);
      const H = h, S = s, L = l;
      if (S < 0.13) return L < 0.30 ? 'negro' : (L < 0.62 ? 'gris marengo' : 'gris claro');
      if (L < 0.12) return 'negro';
      if (L > 0.88 && S < 0.35) return 'blanco roto';
      if ((H < 12 || H >= 345)) return S > 0.55 && L < 0.45 ? 'burdeos' : (L > 0.66 ? 'rosa palo' : 'frambuesa');
      if (H < 22) return L > 0.72 ? 'topo' : (S > 0.55 ? 'teja' : 'chocolate');
      if (H < 40) return L > 0.75 ? 'beige' : (S > 0.6 ? 'naranja mandarina' : 'camel');
      if (H < 55) return S < 0.35 ? 'arena' : (L > 0.7 ? 'mantequilla' : 'mostaza');
      if (H < 70) return S < 0.4 ? 'lino' : 'verde lima';
      if (H < 100) return L < 0.40 ? 'verde bosque' : (L < 0.62 ? 'verde salvia' : 'verde menta');
      if (H < 150) return L > 0.7 ? 'verde menta' : 'verde salvia';
      if (H < 200) return L > 0.68 ? 'turquesa' : 'petróleo';
      if (H < 230) return L > 0.70 ? 'celeste' : (L < 0.38 ? 'azul marino' : 'azul denim');
      if (H < 260) return L > 0.7 ? 'lila claro' : 'azulón';
      if (H < 300) return L > 0.75 ? 'lavanda' : 'uva';
      if (H < 345) return L > 0.72 ? 'rosa chicle' : (S > 0.5 ? 'fucsia' : 'rosa viejo');
      return 'rosa';
    }

    // Brillo / metalizado
    const valores = buckets.map(b => b.l).sort((a, b) => a - b);
    const p10 = valores[Math.floor(valores.length * 0.1)];
    const p90 = valores[Math.floor(valores.length * 0.9)];
    const rango = p90 - p10;
    const satMedia = sat.reduce((a, b) => a + b, 0) / sat.length;
    const claroMedio = buckets.reduce((a, b) => a + b.l, 0) / buckets.length;
    const metalico = rango > 0.34 && satMedia < 0.55;
    const satBaja = satMedia < 0.16;
    const oscuro = claroMedio < 0.36;
    const claro = claroMedio > 0.72;

    // Orientación: ¿hay más color a la izquierda (talón) que a la derecha (dedos)?
    let izq = 0, der = 0;
    buckets.forEach(b => { if (b.zona === 'talon') izq++; else if (b.zona === 'puntera') der++; });
    const orientacion = der >= izq ? 'derecha' : 'izquierda';

    // Cobertura de la zona central → silueta (sandalia = poca superficie)
    const enCentro = buckets.filter(b => b.zona === 'centro').length / pixeles;

    // Color de las suelas habituales (marrón claro / crema) en el tercio inferior
    const abajo = [];
    for (let y = Math.floor(H * 0.72); y < H; y++)
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (data[i + 3] < 200) continue;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const [, s, l] = hsl(r, g, b);
        if (l > 0.955 || l < 0.045 || s < 0.10) continue;
        abajo.push([r, g, b]);
      }
    let suelaCalida = false;
    if (abajo.length > 20) {
      let sr = 0, sg = 0, sb = 0;
      abajo.forEach(p => { sr += p[0]; sg += p[1]; sb += p[2]; });
      sr /= abajo.length; sg /= abajo.length; sb /= abajo.length;
      const [hS] = hsl(sr, sg, sb);
      suelaCalida = hS < 45 || hS > 340;
    }

    return {
      ok: true,
      paleta,
      colorPrincipal: nombreColor(principal),
      colorSecundario: secundario ? nombreColor(secundario) : null,
      colorTerciario: terciario ? nombreColor(terciario) : null,
      hexPrincipal: aHex(principal.r, principal.g, principal.b),
      hexSecundario: secundario ? aHex(secundario.r, secundario.g, secundario.b) : null,
      metalico, satBaja, oscuro, claro, orientacion, suelaCalida,
      cobertura, pixeles,
      tono: metalico ? 'metalico' : (secundario ? 'bicolor' : (oscuro ? 'oscuro' : (claro ? 'claro' : 'liso'))),
      aspect: img.width / img.height
    };
  }

  function cargarImagen(src) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => rej(new Error('No se ha podido abrir la imagen.'));
      img.src = src;
    });
  }

  /* ---------- 8. Generador de la ficha ---------- */
  let contador = 0;
  function generarFicha(a, opciones) {
    const o = opciones || {};
    const tallaMin = 16, tallaMax = 27;
    const estilo = o.estilo || 'bota';
    const maxTalla = o.maxTalla || tallaMax;

    // Nombre: la primera versión va limpia; las siguientes añaden un número romano.
    const lista = NOMBRES[estilo] || NOMBRES.generico;
    const variante = o.serie || 0;
    const sufijo = variante > 0 ? ' ' + ROMANOS[(variante - 1) % ROMANOS.length] : '';
    const nombreBase = o.nombre || (lista[(contador + variante) % lista.length] + sufijo);
    contador++;
    const nombre = 'Modelo ' + nombreBase;

    // Colores en lenguaje natural
    const descColor = a.colorSecundario
      ? `combinación de ${a.colorPrincipal} y ${a.colorSecundario}`
      : a.colorPrincipal;
    const colorCorto = a.colorSecundario ? `${a.colorPrincipal} y ${a.colorSecundario}` : a.colorPrincipal;

    // Párrafo de descripción
    const banco = DESCRIPCIONES[a.tono] || DESCRIPCIONES.liso;
    const semilla = o.semilla === undefined ? 0 : o.semilla;
    const p = banco[Math.abs(semilla) % banco.length];
    const parrafos = p(nombreBase, descColor);
    let descripcion = parrafos + '\n\n' + pie({ semilla: semilla, orientacion: a.orientacion }, colorCorto, estilo);
    if (a.satBaja) {
      descripcion += `\n\nEs un tono ${a.colorPrincipal} que no cansa nunca y que pega con absolutamente todo el armario: el color de la zapatilla que siempre acaba siendo la favorita.`;
    }

    // Beneficios
    const b3 = (BENEFICIOS[a.tono] || BENEFICIOS.liso).slice(0, 3).map(([ic, t, d]) => ({ ic, t, d }));

    // Tabla
    const tabla = tablaTallas(tallaMin, maxTalla);

    return {
      nombre,
      modelo: nombreBase,
      subtitulo: `${estiloNombre(estilo)} barefoot · talla ${tallaMin}-${maxTalla} · ${colorCorto}`,
      descripcion,
      beneficios: b3,
      tallas: tabla,
      materiales: MATERIALES.slice(),
      cuidados: CUIDADOS.slice(),
      hechos: HECHOS.slice(),
      keywords: keywords(estilo, colorCorto, a),
      colorPrincipal: a.colorPrincipal,
      colorSecundario: a.colorSecundario,
      hexPrincipal: a.hexPrincipal,
      hexSecundario: a.hexSecundario,
      tono: a.tono,
      meta: { largoInterior: tabla[tabla.length - 1].cm + ' cm máx.', anchura: tabla[tabla.length - 1].ancho + ' cm máx.' }
    };
  }

  function estiloNombre(e) {
    return ({ bota: 'Botita', botin: 'Botín', sandalia: 'Sandalia', deportiva: 'Zapatilla deportiva',
      casa: 'Zapatilla de casa', bailarina: 'Bailarina', zapato: 'Zapato', generico: 'Zapatilla' })[e] || 'Zapatilla';
  }

  function pie(a, colorCorto, estilo) {
    const orient = a.orientacion === 'derecha' ? 'derecha' : 'izquierda';
    const frases = [
      `Su forma se adapta al pie en ${orient}, con la puntera más ancha y redondeada de lo habitual para que los dedos no se toquen entre sí.`,
      `El corte ${estilo === 'sandalia' ? 'de sandalia' : 'es sencillo y limpio'}, en ${colorCorto}, así que combina con todo sin esfuerzo.`,
      `Pensada para dejarse puesta: sujeción suave en el empeine y talón libre para que el pie trabaje a su ritmo.`,
      `Ligera y sin refuerzos duros, para que la primera impresión sea "no la noto" y la segunda "no me la quiero quitar".`
    ];
    const azar = (a.semilla || 0) * 7 + (a.orientacion === 'derecha' ? 3 : 0) + estilo.length;
    return frases[Math.abs(azar) % frases.length];
  }

  function keywords(estilo, colorCorto, a) {
    const k = ['barefoot', 'calzado respetuoso', 'piel', 'suela flexible', 'horma ancha',
      'pie sano', 'talla ' + 16 + '-' + 27];
    if (estilo === 'sandalia') k.push('sandalia barefoot', 'verano');
    if (estilo === 'bota' || estilo === 'botin') k.push('invierno', 'abrigada');
    if (estilo === 'casa') k.push('zapatilla de casa', 'primeros pasos');
    k.push(colorCorto);
    if (a.metalico) k.push('brillo', 'fiesta');
    if (a.oscuro) k.push('no se ensucia');
    return [...new Set(k)];
  }

  /* ---------- 9. Exportar ---------- */
  global.RC = { CM_TALLA, ANCHO_TALLA, EDAD, tablaTallas, analizarImagen, generarFicha, estiloNombre, NOMBRES, nombreColor: null };

})(typeof window !== 'undefined' ? window : globalThis);
