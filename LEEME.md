# Envíos al CD — PANISA (PWA) · V.2026.28

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

## Tránsito en Ingreso Pedidos (V.2026.11)
Zona "Último cálculo": el .xlsm de la entrega anterior del mismo proveedor (si la
carpeta de cálculos está vinculada, se carga solo). Se copia a la OC Table por
tienda + ítem:
- Misma semana: S–X (lun–sáb), AA–AB (vie/sáb anteriores) y AB2.
- Semana nueva: vie/sáb del último cálculo → AA/AB, S–X vacías, AB2 = ese sábado.
Si el último cálculo no tenía su propio envío en la columna de su día, se usa su H.

## Envío de la semana (V.2026.12)
- Sugerido envío reconoce entregas de sábado (columna X); antes "Env SAct" quedaba vacío.
- Las fechas de la fila 2 (S2..X2, AA2) se calculan desde AB2 como en Excel.
- Al guardar, Enviar se escribe en H y además en la columna del día de la entrega (S..X).

## V.2026.13
- Ingreso Pedidos: "Procesar otro pedido" limpia el último cálculo; al soltar el PDF se elige
  el del proveedor correcto (también si cambiás de PDF sin reiniciar).
- QR Garita: botón "Generar PDF con todas las citas" (una hoja por cita en un solo PDF).
- Sugerido envío: DOH = (INV + tránsito + Enviar) / venta diaria (también para el tope de 14 días).
- Resumen de envío (como "Hoja Fragua MOD") uniendo las OC cargadas: imagen para descargar,
  copiar o enviar por WhatsApp. Unidades por parrilla: S19 12, 5HM4 15, SR16 12, 10HD7 7,
  10HR3 10, 5HD2 18, S13 18, S26 10, 6PC4 14, S25 10, 5CHD 20, 1CHD 50; 12 parrillas por viaje.

## V.2026.14 — Generador QR Entrega
Dos secciones (Formularios y OC Listado, hasta 4 cada una, en cualquier orden; se pueden soltar
varios a la vez). Se leen vendor, OC y cita del Formulario y la OC del OC Listado, se emparejan por
número de OC y se asignan a las pestañas 1–4 del Generador ordenadas por vendor y cita. Si un archivo
está en la sección equivocada, se detecta y se usa igual.

## V.2026.15 — Comprobador QR
Se pueden soltar o elegir varios PDF (o varios Excel) a la vez en una casilla: el primero queda en
esa casilla y los demás ocupan las casillas vacías de la misma sección (máximo 4).

## V.2026.16 — Sugerido envío
Columna Vta Sem en verde claro, DEV en rojo claro y cierre de cada tabla con línea doble y la fila
"Fin de la tabla · N filas · archivo".

## V.2026.17 — Sugerido envío
Filtro por producto, orden, "Solo las que cambié" y los botones de llenado son independientes en
cada orden de compra.

## V.2026.18 — Panel lateral
Debajo de los módulos: "Próximas entregas" (hoy y las 2 siguientes fechas con OC en el Control OC:
fecha, proveedor, OC y cita) y un calendario mensual (semana de lunes a domingo, hoy resaltado,
punto verde en los días con entrega; al pasar el mouse muestra las OC y citas de ese día).

## V.2026.19 — Panel lateral
Próximas entregas: 4 fechas, con PANISA 1 y PANISA 2 siempre visibles ("-" si no hay).
Calendario: verde = entregado (hoy y antes), amarillo = calculado (hay Excel en la carpeta de
cálculos, incluida la última fecha calculada), rojo = próxima entrega con OC y cita pero sin calcular.

## V.2026.20 — Nombres de los cálculos
Se reconocen los nombres nuevos "MM_DD Mes AAAA PANISA N.xlsm" (ej. "11_02 Noviembre 2026 PANISA 1.xlsm"),
en la carpeta o en subcarpetas, y siguen funcionando los viejos "DD_Mes_AAAA_Panisa_N.xlsm".

## V.2026.21 — Actualización del panel lateral
Entregas y calendario se actualizan solos al volver a la ventana de la app (como mucho cada 20 s),
cada 5 minutos y después de "Guardar Excel con Enviar". El botón ↻ fuerza la lectura en el momento.

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

## V.2026.22 — Orden de columnas y panel compacto
- Sugerido envío: arrastrá cualquier encabezado de la tabla para cambiar el orden de las columnas. Aplica a las dos OC y se recuerda en este navegador. Tienda queda fija como primera columna.
- Cuando el orden fue cambiado aparece el enlace «Orden original» para volver al orden de fábrica.
- Panel izquierdo más compacto (título, logo y menú) para que el calendario quepa sin desplazarse.

## V.2026.23 — Formato de tienda
- Sugerido envío: la columna Tienda muestra «Número Formato Nombre» (p. ej. «21 P VISTA HERMOSA»), con el formato tomado de la columna B de OC Table. Se quitó la columna F aparte, que quedaba repetida.

## V.2026.24 — Correo por Gmail y orden del resumen
- Correo a CEDI: la tarjeta Enviar tiene un selector Outlook | Gmail (se recuerda). Outlook funciona igual que antes.
- Gmail: «Crear borrador en Gmail con adjuntos» inicia sesión con Google (Google Identity Services, permiso gmail.compose), sube el correo completo con la API de Gmail (borrador, nunca envía solo) y lo abre en Gmail. También «Abrir en Gmail sin adjuntos».
- Configuración única: pegar el ID de cliente de Google Cloud; la app muestra el origen a autorizar. Requiere abrir la app desde https (GitHub Pages). Guía: «Conectar Gmail a Envíos al CD».
- Sugerido envío: la tabla resumen por ítem usa el mismo orden que los botones de filtro.

## V.2026.25 — Hoja para Fragua (PDF) e impresión de QR sin encabezados
- Sugerido envío: tarjeta «Hoja para Fragua (PDF)» con un botón por OC (PANISA 1 / PANISA 2) y «Las dos OC en un PDF».
  - Por OC: cuadros por tienda (16 por hoja, ordenados por código de despacho de Lista Store Nbr), en 2 copias, y una hoja de resumen por clave con dos copias para cortar.
  - Cada cuadro: correlativo, código de despacho, número de tienda, formato y nombre completo (la letra se achica para que entre); 12 claves en el orden del Excel; cantidad = Enviar. Clave en gris = la tienda no la tiene en la OC. X = tienda de la OC sin envío.
  - Resumen: RESTAR, total pedido, a entregar, parrillas + unidades, viajes + parrillas + unidades, parrillas; hora, rampa, cita y orden. Sin cuadro de fechas.
  - Unidades por parrilla y rampa se leen de «Hoja Fragua MOD» (con valores por defecto si no están).
- Inicio: nueva «Carpeta de PDF completos» (con permiso de escritura). El PDF se guarda ahí como «MM_DD Mes AAAA Fragua PANISA 1.pdf» (o «PANISA 1 y 2») y se abre para imprimir; sin carpeta se descarga.
- Generador QR Entrega y QR Garita: la hoja de impresión ya no deja lugar para el encabezado y pie del navegador (fecha, título, dirección blob:), aunque esa opción esté activada.

## V.2026.26 — Ajustes de la Hoja para Fragua y avisos en Sugerido
- Rampa: casilla en la tarjeta «Hoja para Fragua (PDF)», 2053 por defecto; el cambio se recuerda. Ya no se lee de la hoja del Excel.
- Unidades por parrilla: se buscan en «Hoja Fragua MOD» por clave (columna E) aunque la tabla esté en otras filas.
- Cuadros: las claves de la OC con decisión 0 muestran «0» (antes quedaban en blanco).
- Resumen por clave: columna «CONTEO» en blanco para apuntes a mano, entre «VIAJES + PARR + UNI» y «PARRILLAS».
- Sugerido envío: punto verde junto a OC cuando Enviar = 100% del pedido; aviso en naranja de las tiendas que reciben una sola clave con menos de 5 unidades (lista y filas marcadas, se actualiza al editar).

## V.2026.27 — Ajustes de cuadros y CONTEO
- Cuadros: si toda la tienda va en 0, solo la X (sin ceros). Si la tienda lleva otras claves, las claves en 0 muestran «0».
- Resumen: la columna CONTEO queda como espacio libre, sin líneas verticales.

## V.2026.28 — QR Garita al final del PDF de las dos OC
- «Las dos OC en un PDF» agrega al final las hojas de QR Garita de las citas de esas OC.
- Busca los PDF cuyo nombre tenga «QR Garita» y el número de cita en la carpeta de archivos generados y en la de PDF completos (prefiere el que trae las dos citas; si hay varios, el más reciente).
- Si no los encuentra, pregunta y deja elegir el PDF a mano, o seguir sin QR Garita.
- Los PDF de una sola OC no cambian.
