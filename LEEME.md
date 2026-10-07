# Envíos al CD — PANISA (PWA) · V.2026.5

Una sola app con las herramientas de entregas al CD, en este orden:

1. **Generador QR Entrega** — Formularios + OC Listado → Generador QR
2. **Comprobador QR** — PDF de QR vs. Consolidado / OC Listado
3. **QR Garita** — citas del día desde Control OC FBD POD
4. **Ingreso Pedidos** — OC en PDF → plantilla CD PANISA (.xlsm)
5. **Sugerido envío** — Sugerido (I) y tu decisión en Enviar (H) de la pestaña OC Table
6. **Correo a CEDI** — formulario de entrega con QR y Consolidado adjuntos

Las herramientas son las mismas versiones validadas (sin cambios en su lógica);
la app solo las reúne y les agrega la **biblioteca de plantillas**.

## Plantillas vinculadas
En *Inicio → Plantillas* vinculas una vez:
- CD PANISA (una por Vendor Number; el número se lee de dentro del Excel)
- Inventario diario (opcional)
- Generador de QR
- Control OC FBD POD

En Chrome/Edge de PC se guarda un **vínculo** al archivo, así que cuando lo
actualizas en Excel (semanal o diario) la app lee la versión nueva sin volver a
subirlo. Si lo guardas con otro nombre (ej. V16), usa "Cambiar".
En otros navegadores se guarda una copia.

Cargas automáticas:
- Al abrir *QR de garita* se carga Control OC.
- Al abrir *Automatizador* se carga el Generador de QR.
- En *Ingreso de pedidos*, al soltar el PDF se lee el Supplier Number y se carga
  la plantilla CD PANISA de ese vendor (y el inventario si está vinculado).
  La verificación PDF ↔ Excel de la herramienta sigue activa.

## Formulario de Entrega (V.2026.2)
Al procesar un pedido en *Ingreso de pedidos*, en la pestaña "Formulario de
Entrega" de la plantilla se escriben:
- **D8** = Purchase Order Number del PDF
- **D6** = CITA de esa OC en la tabla PANISA del Control OC
Si la OC todavía no tiene cita (o no está en PANISA), D6 queda sin cambios y se
avisa. El Control OC se carga solo si está vinculado.

## Sugerido de envío (V.2026.3)
Busca el Excel de cálculo ("DD_Mes_AAAA_Panisa_N.xlsm") en la carpeta vinculada
por número de OC (vía Control OC) o por fecha de entrega, y calcula la columna I
de "OC Table" solo para las filas con Pedido OC (F):
- Venta semanal esperada = promedio de [máx(Prom 4 semanas K, Venta sem. ant. M)]
  y [promedio FCST Q, R]
- Stock = INV (G, negativos = 0) + envíos de los 2 días previos a la entrega
- Sugerido = lo que falta para 10 días, en múltiplos de 5, nunca más que F
- Days on Hand del Excel (AD) nunca mayor a 14 (única excepción: tienda sin
  inventario con venta muy baja recibe el mínimo de 5)
Columna **Enviar** (V.2026.4): arranca con el sugerido y se edita en la tabla
(Enter pasa a la siguiente tienda; flechas ↑ ↓ de 5 en 5). Nunca acepta más
que el Pedido OC. Los cambios sin guardar se recuperan si se cierra la app.
Si el archivo ya trae valores fijos en Enviar, se cargan como tu decisión.
"Guardar Excel con Enviar" escribe H = Enviar e I = Sugerido como valores en
las filas de datos (reemplaza las fórmulas de esas dos columnas), deja los
totales y el resto del libro igual, y marca el libro para que Excel recalcule
todo al abrirlo (TOTAL A ENVIAR, Fill Rate, DI, etc.).

## Correo del día
Replica la pestaña **eMAIL** del Control OC para la fecha de entrega elegida
(la misma de QR de garita): Asunto = K1, cuerpo = K3:K11, Para = K13, CC = K14.
Las fórmulas de K1 y K5 se recalculan con la fecha (OC, citas, día y hora de la
tabla PANISA), así que no hace falta cambiar la fecha en Excel. Si editas el
texto de esas celdas en Excel, la app usa el texto nuevo.

Adjuntos: los PDF "Generador QR - Orden de Compra <OC> Cita <cita>.pdf" y el
"Generador QR - OC ... CITA ....xlsx" de las OC de esa fecha. Se toman de la
carpeta vinculada (y subcarpetas), del Excel guardado desde el Automatizador, o
los arrastras a mano.

"Abrir en Outlook con adjuntos" descarga un borrador .eml (X-Unsent) que Outlook
clásico abre listo para enviar. Revisa el campo **De** antes de enviar.

## Cómo publicarla (para instalarla y usarla sin internet)
Una PWA necesita una dirección web (https o localhost). Sube **el contenido de
`dist/`** a cualquiera de estas opciones:

- **GitHub Pages**: repositorio nuevo → sube los archivos de `dist/` →
  Settings → Pages → Branch `main` / root. Queda en `https://<usuario>.github.io/<repo>/`.
- **Netlify Drop**: arrastra la carpeta `dist/` a https://app.netlify.com/drop

Son archivos estáticos: tus Excel y PDF **nunca** se suben; todo se procesa en
el navegador. Luego abre la dirección en Chrome/Edge → botón "Instalar la app".
Una vez instalada puedes hacer clic derecho en un PDF/Excel → *Abrir con* →
Envíos CD, y la app te pregunta en qué herramienta cargarlo.

Uso sin internet: en Inicio, "Preparar para usar sin internet" descarga una vez
Python/openpyxl, PDF.js y jsQR.

También puedes abrir `dist/index.html` con doble clic: funciona, pero sin
instalación ni modo sin internet.

## Actualizar una herramienta
Reemplaza el archivo en `src/tools/` (ingreso, entregas, comprobador, garita),
ejecuta `python build.py` y vuelve a subir `dist/`. La app instalada muestra
"Actualizar a la versión nueva".
