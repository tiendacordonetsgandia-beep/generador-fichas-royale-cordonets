/* ============================================================
   Interfaz del generador de fichas — Royale Cordonets
   ============================================================ */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const CLAVE = 'rc_catalogo_v1';

  let actual = null;      // ficha en pantalla
  let fotoActual = null;  // dataURL de la foto
  let analisis = null;    // resultado del análisis de imagen
  let catalogo = [];
  let contadorNombre = 0;

  /* ---------- Catálogo persistente ---------- */
  function cargarCatalogo() {
    try { catalogo = JSON.parse(localStorage.getItem(CLAVE) || '[]'); }
    catch (e) { catalogo = []; }
  }
  function guardarCatalogo() {
    try { localStorage.setItem(CLAVE, JSON.stringify(catalogo)); } catch (e) { /* cuota llena */ }
    pintarCatalogo();
  }

  /* ---------- Avisos ---------- */
  function avisar(el, texto, tipo) {
    el.textContent = texto;
    el.classList.add('on');
    el.style.background = tipo === 'error' ? '#FBE3E3' : '';
    el.style.borderColor = tipo === 'error' ? '#F0C2C2' : '';
  }
  function limpiarAviso(el) { el.classList.remove('on'); el.style.background = ''; el.style.borderColor = ''; }

  /* ---------- Carga de imagen ---------- */
  const drop = $('drop'), file = $('file');

  drop.addEventListener('click', () => file.click());
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault(); drop.classList.remove('over');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) leerArchivo(e.dataTransfer.files[0]);
  });
  file.addEventListener('change', () => { if (file.files[0]) leerArchivo(file.files[0]); });

  function leerArchivo(f) {
    if (!/^image\//.test(f.type)) { avisar($('aviso'), 'Ese archivo no es una imagen. Sube una foto (JPG, PNG, WEBP o HEIC convertido).', 'error'); return; }
    const r = new FileReader();
    r.onload = () => {
      fotoActual = r.result;
      $('preview').src = fotoActual;
      $('preview').style.display = 'block';
      $('vacio').style.display = 'none';
      $('btnGenerar').disabled = false;
      limpiarAviso($('aviso'));
      generar();
    };
    r.readAsDataURL(f);
  }

  /* ---------- Generar ---------- */
  $('btnGenerar').addEventListener('click', generar);

  // Cambia el nombre y la redacción manteniendo el estilo, la talla y la foto.
  $('btnOtra').addEventListener('click', () => {
    if (!analisis) return;
    contadorNombre++;
    regenerarConAjustes(contadorNombre);
    avisar($('avisoFicha'), 'He generado otra versión del texto: nombre, descripción y beneficios nuevos. Pulsa otra vez si quieres más opciones.');
  });

  $('btnLimpiar').addEventListener('click', () => {
    analisis = null; fotoActual = null; actual = null; contadorNombre = 0;
    file.value = '';
    $('preview').removeAttribute('src');
    $('preview').style.display = 'none';
    $('vacio').style.display = '';
    $('tonos').innerHTML = '';
    $('resultado').style.display = 'none';
    $('btnGenerar').disabled = true;
    $('btnOtra').disabled = true;
    $('btnLimpiar').disabled = true;
    limpiarAviso($('aviso')); limpiarAviso($('avisoFicha'));
    $('drop').scrollIntoView({ behavior: 'smooth' });
  });

  async function generar() {
    if (!fotoActual) return;
    $('cargando').classList.add('on');
    $('btnGenerar').disabled = true;
    limpiarAviso($('aviso'));
    try {
      const a = await RC.analizarImagen(fotoActual);
      if (!a.ok) {
        avisar($('aviso'), a.error, 'error');
        $('btnGenerar').disabled = false;
        return;
      }
      analisis = a;
      contadorNombre = 0;
      const estilo = $('fEstilo').value;
      const max = parseInt($('fMax').value, 10);
      const f = RC.generarFicha(a, { estilo, maxTalla: max, semilla: 0 });
      f.imagen = fotoActual;
      actual = f;

      pintarTonos(a);
      pintarFicha(f);
      pintarEditor(f);
      $('resultado').style.display = 'grid';
      $('btnOtra').disabled = false;
      $('btnLimpiar').disabled = false;
      avisar($('avisoFicha'),
        `Color detectado: ${a.colorPrincipal}${a.colorSecundario ? ' + ' + a.colorSecundario : ''} · estilo ${a.tono}${a.metalico ? ' con brillo' : ''}. Revisa el texto y ajústalo a tu gusto.`);
    } catch (e) {
      avisar($('aviso'), 'Ha habido un problema al analizar la foto: ' + e.message, 'error');
    } finally {
      $('cargando').classList.remove('on');
      $('btnGenerar').disabled = false;
    }
  }

  /* ---------- Paleta detectada ---------- */
  function pintarTonos(a) {
    $('tonos').innerHTML = a.paleta.slice(0, 4).map(p =>
      `<span class="tono"><i style="background:${p.hex}"></i>${p.hex} · ${p.pct}%</span>`).join('');
  }

  /* ---------- Ficha ---------- */
  function pintarFicha(f) {
    $('vNombre').textContent = f.nombre;
    $('vSubtitulo').textContent = f.subtitulo;
    $('vDescripcion').innerHTML = f.descripcion.split('\n\n').map(p => `<p>${esc(p)}</p>`).join('');

    $('vBeneficios').innerHTML = f.beneficios.map(b =>
      `<li><span class="ic">${b.ic}</span><span><b>${esc(b.t)}</b><br>${esc(b.d)}</span></li>`).join('');

    $('vTabla').querySelector('tbody').innerHTML = f.tallas.map(t =>
      `<tr><td><b>${t.talla}</b></td><td>${t.cm} cm</td><td>${t.ancho} cm</td><td>${t.edad}</td></tr>`).join('');

    $('vMateriales').innerHTML = f.materiales.map(m => `<span>${esc(m)}</span>`).join('') +
      f.cuidados.map(c => `<span>${esc(c)}</span>`).join('');

    $('vKeywords').innerHTML = f.keywords.map(k => `<span>#${esc(k)}</span>`).join('');

    if (f.imagen) { $('vImagen').src = f.imagen; $('vImagenWrap').style.display = 'block'; }
  }

  /* ---------- Editor ---------- */
  function pintarEditor(f) {
    $('fNombre').value = f.nombre;
    $('fSubtitulo').value = f.subtitulo;
    $('fDescripcion').value = f.descripcion;
  }

  $('fNombre').addEventListener('input', () => { $('vNombre').textContent = $('fNombre').value; actual.nombre = $('fNombre').value; });
  $('fSubtitulo').addEventListener('input', () => { $('vSubtitulo').textContent = $('fSubtitulo').value; actual.subtitulo = $('fSubtitulo').value; });
  $('fDescripcion').addEventListener('input', () => {
    actual.descripcion = $('fDescripcion').value;
    $('vDescripcion').innerHTML = actual.descripcion.split('\n\n').map(p => `<p>${esc(p)}</p>`).join('');
  });

  $('fEstilo').addEventListener('change', () => { if (analisis) { contadorNombre = 0; regenerarConAjustes(0); } });
  $('fMax').addEventListener('change', () => { if (analisis) regenerarConAjustes(contadorNombre); });

  function regenerarConAjustes(variante) {
    const v = variante === undefined ? contadorNombre : variante;
    const f = RC.generarFicha(analisis, {
      estilo: $('fEstilo').value,
      maxTalla: parseInt($('fMax').value, 10),
      serie: v,
      semilla: v
    });
    f.imagen = fotoActual;
    actual = f;
    pintarFicha(f);
    pintarEditor(f);
  }

  /* ---------- Acciones ---------- */
  $('btnCopiar').addEventListener('click', async () => {
    if (!actual) return;
    const texto = fichaATexto(actual);
    try {
      await navigator.clipboard.writeText(texto);
      avisar($('avisoFicha'), 'Texto copiado al portapapeles. Ya lo puedes pegar en Miravia, TikTok Shop o WhatsApp.');
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = texto; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
      avisar($('avisoFicha'), 'Texto copiado al portapapeles.');
    }
  });

  $('btnImprimir').addEventListener('click', () => window.print());

  $('btnGuardar').addEventListener('click', () => {
    if (!actual) return;
    actual.id = 'f' + Date.now();
    actual.guardado = new Date().toISOString();
    catalogo.unshift(actual);
    guardarCatalogo();
    avisar($('avisoFicha'), `«${actual.nombre}» guardado en el catálogo. Lo tienes abajo del todo.`);
  });

  $('btnExportar').addEventListener('click', () => {
    const limpio = catalogo.map(f => {
      const c = Object.assign({}, f);
      delete c.imagen;              // el JSON va ligero, sin la foto
      return c;
    });
    const blob = new Blob([JSON.stringify(limpio, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'catalogo-royale-cordonets.json';
    a.click();
  });

  $('btnVaciar').addEventListener('click', () => {
    if (!confirm('¿Seguro que quieres vaciar todo el catálogo guardado?')) return;
    catalogo = []; guardarCatalogo();
  });

  /* ---------- Catálogo en pantalla ---------- */
  function pintarCatalogo() {
    $('cuenta').textContent = catalogo.length ? `(${catalogo.length} ${catalogo.length === 1 ? 'ficha' : 'fichas'})` : '';
    $('btnExportar').disabled = !catalogo.length;
    $('btnVaciar').disabled = !catalogo.length;
    $('catalogo').innerHTML = catalogo.map((f, i) => `
      <article class="mini">
        ${f.imagen ? `<img src="${f.imagen}" alt="">` : `<div style="height:150px;display:grid;place-items:center;font-size:30px">👟</div>`}
        <div class="cuerpo">
          <b>${esc(f.nombre)}</b>
          <small>${esc(f.colorPrincipal)}${f.colorSecundario ? ' + ' + esc(f.colorSecundario) : ''} · ${f.tallas.length} tallas</small>
          <div class="acciones">
            <button class="btn mini" data-ver="${i}">Ver</button>
            <button class="btn mini" data-copiar="${i}">Copiar</button>
            <button class="btn mini" data-borrar="${i}">Borrar</button>
          </div>
        </div>
      </article>`).join('');
  }

  $('catalogo').addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.ver !== undefined) {
      const f = catalogo[+b.dataset.ver];
      actual = f; fotoActual = f.imagen || fotoActual;
      if (f.imagen) { $('preview').src = f.imagen; $('preview').style.display = 'block'; $('vacio').style.display = 'none'; }
      pintarFicha(f); pintarEditor(f);
      $('resultado').style.display = 'grid';
      $('resultado').scrollIntoView({ behavior: 'smooth' });
    }
    if (b.dataset.copiar !== undefined) {
      const f = catalogo[+b.dataset.copiar];
      const texto = fichaATexto(f);
      try {
        await navigator.clipboard.writeText(texto);
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = texto; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove();
      }
      avisar($('avisoFicha'), `Texto de «${f.nombre}» copiado al portapapeles.`);
    }
    if (b.dataset.borrar !== undefined) {
      catalogo.splice(+b.dataset.borrar, 1);
      guardarCatalogo();
    }
  });

  /* ---------- Texto plano para pegar ---------- */
  function fichaATexto(f) {
    return [
      f.nombre.toUpperCase(),
      f.subtitulo,
      '',
      f.descripcion,
      '',
      'BENEFICIOS',
      ...f.beneficios.map(b => `${b.ic} ${b.t}: ${b.d}`),
      '',
      'TABLA DE TALLAS (largo interior del pie)',
      'Talla EU | Largo interior | Ancho | Edad orientativa',
      ...f.tallas.map(t => `${t.talla} | ${t.cm} cm | ${t.ancho} cm | ${t.edad}`),
      '',
      'MATERIALES: ' + f.materiales.join(' · '),
      'CUIDADOS: ' + f.cuidados.join(' · '),
      '',
      'Royale Cordonets · Gandia (Valencia)',
      f.keywords.map(k => '#' + k.replace(/\s+/g, '')).join(' ')
    ].join('\n');
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  /* ---------- Foto de ejemplo ---------- */
  $('btnEjemplo').addEventListener('click', () => {
    // Zapatilla dibujada en un canvas: sirve para probar la app sin subir nada.
    const cv = document.createElement('canvas');
    cv.width = 640; cv.height = 420;
    const c = cv.getContext('2d');
    c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, 640, 420);
    // cuerpo
    c.fillStyle = '#C9A98B';
    c.beginPath();
    c.moveTo(120, 250); c.lineTo(300, 250); c.quadraticCurveTo(430, 250, 480, 300);
    c.lineTo(500, 320); c.lineTo(150, 320); c.quadraticCurveTo(115, 300, 120, 250);
    c.closePath(); c.fill();
    // puntera celeste
    c.fillStyle = '#9CC9DE';
    c.beginPath();
    c.moveTo(370, 250); c.quadraticCurveTo(450, 255, 480, 300);
    c.lineTo(500, 320); c.lineTo(370, 320); c.closePath(); c.fill();
    // suela
    c.fillStyle = '#F2E4CF';
    c.fillRect(120, 320, 380, 26);
    // cordones
    c.strokeStyle = '#FFFFFF'; c.lineWidth = 6;
    for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(250 + i * 30, 258); c.lineTo(265 + i * 30, 300); c.stroke(); }
    fotoActual = cv.toDataURL('image/png');
    $('preview').src = fotoActual;
    $('preview').style.display = 'block';
    $('vacio').style.display = 'none';
    $('btnGenerar').disabled = false;
    generar();
  });

  /* ---------- Arranque ---------- */
  const sel = $('fMax');
  for (let t = 16; t <= 27; t++) {
    const o = document.createElement('option');
    o.value = t; o.textContent = t === 27 ? 'Talla 16 a 27' : `Talla 16 a ${t}`;
    if (t === 27) o.selected = true;
    sel.appendChild(o);
  }
  cargarCatalogo();
  pintarCatalogo();

})();
