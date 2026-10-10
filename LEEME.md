# Generador de fichas · Royale Cordonets

App web para subir la foto de una zapatilla barefoot y obtener la ficha de producto lista
para copiar en Miravia, TikTok Shop, WhatsApp o imprimir en PDF.

## Qué genera

Con solo subir la foto:

1. **Nombre del modelo** (Nube, Bruma, Cumbre, Marina…) según el tipo de calzado.
2. **Descripción bonita para madres y padres**, en tu voz de mamá experta.
3. **Tabla de tallas 16-27** con largo interior en cm, ancho orientativo y edad.
4. **3 beneficios** del calzado respetuoso, elegidos según el color y el estilo.

Además: materiales y cuidados, hashtags para redes, copia al portapapeles e impresión a PDF.

## Cómo usarla

1. Abre la app (la URL la sirve este espacio de trabajo).
2. Arrastra la foto de la zapatilla (mejor fondo blanco o liso).
3. Revisa la ficha: todo es editable, cambia el texto que quieras.
4. «Copiar texto» para pegar en Miravia/TikTok Shop, o «Imprimir / PDF».
5. «Guardar en el catálogo» para dejarla en la lista de abajo y descargar el JSON.

## Cómo detecta el color

Lee los píxeles de la foto, descarta el fondo claro y las sombras neutras, y agrupa el
color restante en tonos. El más frecuente es el principal; si hay un segundo con peso
suficiente, la ficha se escribe como bicolor. También distingue brillos metálicos,
tonos oscuros y claros, y el lado hacia el que apunta la puntera.

## Tallas y medidas (largo interior del pie)

| Talla | Largo | Ancho | Talla | Largo | Ancho |
|---|---|---|---|---|---|
| 16 | 9,6 cm | 6,2 cm | 22 | 13,5 cm | 7,5 cm |
| 17 | 10,2 cm | 6,5 cm | 23 | 14,2 cm | 7,7 cm |
| 18 | 10,9 cm | 6,7 cm | 24 | 14,9 cm | 7,9 cm |
| 19 | 11,5 cm | 6,9 cm | 25 | 15,5 cm | 8,1 cm |
| 20 | 12,2 cm | 7,1 cm | 26 | 16,2 cm | 8,3 cm |
| 21 | 12,9 cm | 7,3 cm | 27 | 16,9 cm | 8,5 cm |

Las medidas están en `app/engine.js` (objeto `CM_TALLA`). Si tu proveedor da otras,
se cambian ahí y toda la app queda actualizada.

## Archivos

- `app/index.html` — estructura de la interfaz.
- `app/style.css` — diseño dulce en crema y celeste.
- `app/engine.js` — medidas, banco de nombres, descripciones y beneficios.
- `app/app.js` — interacción: subir foto, editar, copiar, guardar, catálogo.
