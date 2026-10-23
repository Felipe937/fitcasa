# Hallazgos fuera de alcance — Página #apoya (FitCasa)

> **NOTA**: Estos hallazgos se documentan según el requisito del encargo. NO se ha modificado ningún archivo para corregirlos. Se propone la corrección mínima y se espera decisión.

---

## (a) Política de privacidad (§7) vs scripts de terceros

**Evidencia:**
- `src/pages/PrivacidadPage.tsx` §7: "No utilizamos scripts ni cookies de terceros que rastreen tu actividad."
- `src/pages/ApoyaPage.tsx:6-9`: Carga SDK de PayPal desde `paypal.com` con `client-id` expuesto en el código
- `src/pages/ApoyaPage.tsx:10`: Enlace a `ko-fi.com/spaceyisus`
- `src/data/productos.ts`: 4 URLs de Amazon con parámetros de afiliado (`tag=yisusrecomien-20`)

**Problema:** La política afirma que no hay scripts/cookies de terceros, pero la página #apoya carga el SDK de PayPal (script de terceros), enlaza a Ko-fi (tercero) y usa enlaces de afiliado de Amazon (terceros con tracking).

**Corrección mínima propuesta:** Actualizar §7 de la política para mencionar explícitamente: PayPal (SDK para botón de donación), Ko-fi (enlace externo), Amazon (enlaces de afiliado con parámetros de tracking). Añadir que estos servicios tienen sus propias políticas de privacidad.

---

## (b) Texto de divulgación vs realidad de enlaces

**Evidencia:**
- `src/pages/ApoyaPage.tsx:400-403`: "Algunos enlaces pueden ser de afiliado **cuando se configuren**. Si compras a través de ellos, FITCASA podría recibir una comisión... Los enlaces de compra se publicarán **solo cuando estén verificados**..."
- `src/data/productos.ts:60`: Comentario: "URLs pendientes de verificación"
- `src/data/productos.ts:70,80,90,100`: 4 productos en `PRODUCTOS_APOYA` **ya tienen** `urlAmazon` completa con parámetros de afiliado activos

**Problema:** El texto dice "cuando se configuren" y "pendientes de verificación", pero los enlaces ya están configurados y activos.

**Corrección mínima propuesta:** Cambiar el texto a: "Algunos enlaces son de afiliado. Si compras a través de ellos, FitCasa podría recibir una comisión sin coste adicional para ti. Los enlaces se publican tras verificación del producto y la región correspondiente."

---

## (c) Categorización y textos incorrectos en productos

**Evidencia:**
- `src/data/productos.ts:82-91`: Rodillo (`triggerpoint-grid-foam-roller`) categorizado como `peso` (categoría de mancuernas) — hereda `porQueEsUtil` y `recomendacionUso` de mancuernas (líneas 87-88: "Aporta resistencia externa suficiente para estimular musculatura dorsal sin sobrecargar la zona lumbar" — incorrecto para un rodillo)
- `src/data/productos.ts:92-101`: Bloque con correa (`gaiam-yoga-block-strap`) categorizado como `peso` — hereda textos de mancuernas
- `src/data/productos.ts:74-81`: Esterilla 6mm (`gaiam-essentials-yoga-mat`) dice "6 mm" pero catálogo (`CATALOGO_EQUIPAMIENTO` línea 18) dice "mínimo 10-15 mm"

**Problema:** Rodillo y bloque usan categoría `peso` (incorrecta) y heredan textos de mancuernas. Esterilla contradice la recomendación del catálogo.

**Corrección mínima propuesta:**
1. Añadir categorías `rodillo` y `bloque` al tipo `Equipment` en `src/types/index.ts`
2. Mover rodillo y bloque a sus categorías propias con textos específicos
3. Cambiar esterilla a 10-15mm o actualizar catálogo

---

## (d) URLs de Amazon con parámetros de sesión

**Evidencia:**
- `src/data/productos.ts:70`: `?__mk_es_US=...&crid=1S6L3BM1PVNKQ&dib=eyJ2IjoiMSJ9...&dib_tag=se&keywords=...&qid=1792504315&sprefix=...&sr=8-1&linkCode=ll2&tag=yisusrecomien-20&linkId=c086d668c04fb80649e0018d4dda069d&language=es_US&gaOptInStatus=true&ref_=as_li_ss_tl`
- Parámetros `dib`, `qid`, `crid`, `sprefix`, `sr`, `ref_` son de sesión de búsqueda, no URLs canónicas de producto

**Problema:** URLs no canónicas, pueden romperse, incluyen tracking de sesión innecesario.

**Corrección mínima propuesta:** Usar URLs canónicas limpias: `https://www.amazon.com/dp/{ASIN}?tag=yisusrecomien-20&linkCode=ogi` (o similar según Programa Afiliados de Amazon).

---

## (e) Falta de CSP / _headers — riesgo de bloqueo de paypal.com

**Evidencia:**
- Repositorio no tiene `public/_headers` (Netlify) ni `next.config.js` con CSP (no es Next.js)
- `index.html` no tiene `<meta http-equiv="Content-Security-Policy">`
- Vite no genera CSP por defecto

**Problema:** Si se despliega con CSP estricta (ej. Netlify con headers por defecto, o servidor con CSP), el script de PayPal (`https://www.paypal.com/sdk/js...`) y las imágenes de `paypal.com` podrían bloquearse.

**Corrección mínima propuesta:** Añadir `public/_headers` (para Netlify) o configurar headers en servidor:
```
Content-Security-Policy: script-src 'self' https://www.paypal.com; frame-src https://www.paypal.com; img-src 'self' data: https://www.paypal.com; connect-src 'self' https://www.paypal.com
```

---

## (f) Datos personales de cobro en repositorio público

**Evidencia (no reproducidos según instrucciones):**
- `src/pages/ApoyaPage.tsx:62-64`: Constantes `DAVIPLATA_KEY`, `DAVIPLATA_NAME` con datos reales
- `public/images/daviplata-bre-b-qr.png`: QR con datos de cuenta real
- Archivo PDF en raíz: "¡Escanea este QR desde tu banco o billetera digital para Pasarme Plata!.pdf"

**Problema:** Llave DaviPlata/Bre-B, nombre completo del titular, y QR expuestos en repo público y en historial de Git.

**Corrección mínima propuesta:**
1. **Inmediato**: Rotar llave DaviPlata / generar QR nuevo
2. **Código**: Mover datos a variables de entorno (`VITE_DAVIPLATA_KEY`, `VITE_DAVIPLATA_NAME`, `VITE_QR_IMAGE_URL`)
3. **Git**: Reescribir historial (`git filter-repo` o `BFG Repo-Cleaner`) para eliminar credenciales de commits previos
4. **Despliegue**: Configurar variables en plataforma de hosting (Netlify/Vercel/Cloudflare Pages)
5. **PDF**: Eliminar del repo y del historial

---

## Resumen de correcciones mínimas propuestas

| Hallazgo | Archivo(s) | Acción mínima |
|----------|------------|---------------|
| (a) Política vs realidad | `src/pages/PrivacidadPage.tsx` | Actualizar §7 listando PayPal, Ko-fi, Amazon |
| (b) Divulgación engañosa | `src/pages/ApoyaPage.tsx:400-403` | Cambiar texto a reflejo de realidad actual |
| (c) Productos mal categorizados | `src/data/productos.ts`, `src/types/index.ts` | Añadir categorías `rodillo`/`bloque`, textos propios |
| (d) URLs sucias | `src/data/productos.ts` | Usar URLs canónicas limpias con ASIN + tag |
| (e) Sin CSP | `public/_headers` (nuevo) | Añadir headers CSP permitiendo paypal.com |
| (f) Datos personales expuestos | `src/pages/ApoyaPage.tsx`, `public/images/`, raíz PDF | Variables de entorno + limpieza historial Git + rotar credenciales |

---

**Estado:** Pendiente de decisión para cada hallazgo. No se ha aplicado ninguna corrección.