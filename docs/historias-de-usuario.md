# Novastyle — Historias de Usuario (Frontend)

> Alcance de este documento: **landing page pública, solo frontend**. Todos los datos provienen de
> mocks tipados. La integración con Strapi se hará después reemplazando la capa de acceso a datos,
> sin tocar los componentes.
>
> El **panel de administración queda fuera de alcance** — se documentará en una fase 2.
>
> Fuente: prototipo de Figma Make `Novastyle` (8CqIAyIoxrxogVfTNCMGfU).

---

## 1. Análisis del prototipo

El prototipo **no es solo una landing**: contiene dos aplicaciones.

### A. Landing pública (`/`)

Orden de secciones según `LandingPage.tsx`:

| # | Sección | Fondo | Contenido |
|---|---------|-------|-----------|
| 1 | `Navbar` | transparente → crema al scroll | Logo, 5 enlaces, buscador, carrito (badge "2"), hamburguesa móvil |
| 2 | `Hero` | `#F7F4EF` | Titular a 2 columnas, 2 CTA, 3 stats, imagen con card flotante, marquee inferior |
| 3 | `Collections` | `#F7F4EF` | 3 cards de colección (imagen 3:4, tag, nombre, conteo, descripción) |
| 4 | `Catalog` | `#EDEAE3` | 6 filtros de categoría + grilla de 8 productos, wishlist, "Cargar más" |
| 5 | `About` | `#1A1714` (oscuro) | Historia a 2 columnas, 3 stats, imagen + cita, 3 valores con íconos |
| 6 | `Newsletter` | `#C8A97A` (dorado) | Form de email con estado de éxito |
| 7 | `Footer` | `#1A1714` | 4 columnas de enlaces, redes, legales |

### B. Panel de administración (`/admin/*`) — FASE 2, fuera de alcance

El prototipo incluye un panel completo que **no se implementa todavía**. Se registra aquí solo como
inventario, para dimensionar la fase 2:

| Ruta | Vista | Contenido |
|------|-------|-----------|
| `/admin/login` | `AdminLogin` | Split screen: branding oscuro + form. Credenciales demo hardcodeadas |
| `/admin` | `Dashboard` | 4 stat cards, gráfico de área (recharts), acciones rápidas, tabla de últimos pedidos |
| `/admin/productos` | `Products` | Tabla + buscador + modal CRUD |
| `/admin/colecciones` | `Collections` | Grid de cards + modal CRUD + toggle activa/oculta |
| `/admin/pedidos` | `Orders` | Tabla + buscador + filtros de estado + cambio de estado inline |
| `/admin/suscriptoras` | `Subscribers` | Tabla + filtros + exportar CSV |

Layout compartido: sidebar fijo (240px) en desktop, overlay en móvil, topbar con notificaciones y avatar.

Estimación aproximada de la fase 2: **~23 puntos**, 7 historias. Nota: sin backend, todo el CRUD
viviría en estado de React y se perdería al recargar — conviene hacerlo *después* de Strapi, no antes.

### C. Componente descartado

`Testimonials.tsx` existe y está completo en el bundle, pero **no está montado** en `LandingPage.tsx`.
Decisión tomada: **no se implementa.** No genera HU. Si más adelante se quisiera recuperar, el
componente sigue en el bundle de Figma.

---

## 2. Sistema de diseño extraído

### Tipografías

| Familia | Uso |
|---------|-----|
| **Playfair Display** (serif) | Titulares H1–H3, precios, cifras de stats |
| **DM Sans** (sans) | Cuerpo, botones, labels de formulario |
| **DM Mono** (mono) | Micro-texto en mayúsculas con `tracking` amplio: tags, etiquetas, fechas, IDs |

Ese tercer nivel en DM Mono es la firma visual del diseño — aparece en todas las secciones como
`text-[9px]`/`text-[10px]`, `tracking-widest`, `uppercase`.

### Paleta (modo claro)

| Token | Valor | Uso |
|-------|-------|-----|
| `background` | `#F7F4EF` | Crema base |
| `foreground` | `#1A1714` | Casi negro — texto y fondos oscuros |
| `card` | `#EDEAE3` | Beige de cards y sección Catálogo |
| `muted` | `#E2DDD5` | Placeholders de imagen |
| `muted-foreground` | `#6B6459` | Texto secundario |
| `accent` | `#C8A97A` | **Dorado** — etiquetas, hover de botones, sección Newsletter |
| `destructive` | `#C0392B` | Errores, eliminar |

### Reglas visuales

- **Esquinas rectas.** Aunque `--radius` está definido en `0.625rem`, ningún componente de la landing
  ni del admin usa `rounded-*`. La estética es completamente cuadrada. Los `ui/*` de shadcn sí traen
  bordes redondeados — si se usan, hay que neutralizarlos.
- Imágenes en `aspect-[3/4]` (productos y colecciones), `aspect-[4/3]` (About).
- Hover de imagen: `scale-105` con `duration-700`.
- Secciones a `py-24 px-6`, contenedor `max-w-7xl mx-auto`.
- Scrollbars ocultas globalmente.
- Animación `marquee` de 20s definida en `globals.css`.
- Precios siempre `S/ 000.00`.

---

## 3. Stack técnico

**Se mantiene el que ya está en el repo: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4.**

### Qué se aprovecha del bundle de Figma

| Del prototipo | Decisión |
|---|---|
| Vite + `react-router` | ❌ Se descarta. El App Router de Next cubre el ruteo por sistema de archivos |
| Tailwind v4 | ✅ Ya instalado |
| `motion/react` | ✅ Equivale a `framer-motion` ^12, ya instalado. Cambia el import a `framer-motion` |
| `lucide-react` | ✅ Ya instalado |
| `theme.css` | ✅ Se copia casi íntegro a `app/globals.css` — conserva los colores exactos |
| `fonts.css` (`@import` de Google) | ⚠️ Se reemplaza por `next/font/google` (auto-hospedado, sin request externo, sin layout shift) |
| `recharts` | ⏸ No se instala. Solo hará falta en la fase 2 (Dashboard del admin) |

### Sobre shadcn/ui — corrección importante

El bundle trae ~40 componentes de `ui/`, pero **ni la landing ni el admin los usan**. Todas las
pantallas están escritas con HTML plano + Tailwind (`<button>`, `<img>`, `<input>` directos).

→ **No hace falta instalar shadcn/ui ni Radix.** Es código muerto en el bundle. Solo se justificaría en
la fase 2, si se quieren los modales del admin sobre `Dialog` de Radix para ganar accesibilidad
(foco atrapado, `Esc`, `aria-modal`).

### Estructura de rutas propuesta

```
app/
  layout.tsx                 // fuentes + <html lang="es">
  page.tsx                   // landing
  globals.css                // theme.css portado
components/
  nav/                       // Navbar
  sections/                  // Hero, Collections, Catalog, About, Newsletter, Footer
  ui/                        // Button y primitivos propios
lib/
  mock-data.ts               // ← única fuente de datos por ahora
  types.ts
  data.ts                    // funciones de acceso; hoy leen el mock
  strapi.ts                  // ← se implementa después; los componentes no cambian
```

> `app/admin/` se añadirá en la fase 2. La landing no depende de esa carpeta.

### La capa de datos (clave para que el backend entre sin dolor)

Ningún componente debe tener el array de datos adentro. Todos consumen funciones:

```ts
// lib/data.ts
export async function getProducts(): Promise<Product[]>
export async function getCollections(): Promise<Collection[]>
```

Hoy devuelven el mock. Mañana devuelven el `fetch` a Strapi. **Los componentes no se tocan.**

---

## 4. Inconsistencias detectadas en el prototipo

Hay que resolverlas antes o durante la implementación — no son bugs de código, son decisiones de contenido.

| # | Problema | Dónde | Propuesta |
|---|---|---|---|
| 1 | `id="catálogo"` y `href="#catálogo"` con tilde | `Catalog.tsx`, `Hero.tsx`, `Navbar.tsx` | Usar `id="catalogo"` sin tilde. Los IDs con acentos dan problemas al codificarse en la URL |
| 2 | Enlace "Novedades" apunta a `#novedades`, que no existe | `Navbar.tsx` | Apuntar a `#catalogo` o crear la sección |
| 3 | Hero anuncia "Vestido Carmesí — S/ 89.90"; el catálogo lo lista a S/ 229.00 | `Hero.tsx` vs `Catalog.tsx` | Unificar precio |
| 4 | Español rioplatense (voseo y "talles") en varios textos | `Footer.tsx`, `Newsletter.tsx`, `About.tsx` | Ver **4.1 Localización a Perú** — es obligatorio, no opcional |
| 5 | Carrito muestra badge fijo "2" sin funcionalidad | `Navbar.tsx` | Decidir: ocultar el badge o implementar carrito (fuera de alcance actual) |
| 6 | Botón de buscador sin comportamiento | `Navbar.tsx` | Ver HU-05 |
| 7 | "Nació en 2022" vs. "3 años vistiendo sueños" vs. "© 2026" | `About.tsx`, `Hero.tsx` | Con 2022 como origen, en 2026 son **4 años**. Corregir el stat del Hero |
| 8 | *(descartado)* Testimonios con ciudades argentinas | `Testimonials.tsx` | Ya no aplica: la sección no se implementa |
| 9 | *(fase 2)* Credenciales demo visibles en pantalla de login | `Login.tsx` | Aceptable en demo académica; quitar antes de cualquier despliegue real |
| 10 | *(fase 2)* El dropdown de estado en Pedidos abre con `group-hover` | `Orders.tsx` | No funciona con teclado ni en táctil |

---

## 4.1 Localización a Perú (obligatorio)

**Novastyle es una marca peruana**: producción en Lima, precios en soles, dominio `.pe`. El prototipo
lo dice explícitamente ("Hecho en Perú", "la moda peruana", "el taller de casa de Valentina, en Lima",
`hola@novastyle.pe`), pero **se le filtraron giros rioplatenses** — probablemente del modelo que generó
el texto en Figma Make.

Al implementar cada sección hay que aplicar estos reemplazos. **No se copia el texto del bundle tal cual.**

| Sección | Texto del prototipo | Texto correcto |
|---|---|---|
| Footer | "Moda consciente, hecha a mano, diseñada **para vos**." | "…diseñada **para ti**." |
| Footer → Info | "**Talles** y medidas" | "**Tallas** y medidas" |
| Newsletter | "**Cancelás** cuando quieras" | "**Cancelas** cuando quieras" |
| About → valores | "**Talles** del XS al 3XL" | "**Tallas** del XS al 3XL" |

### Regla general

- **Tuteo, nunca voseo.** "tú/tu/ti", nunca "vos/tuyo rioplatense". Verbos: "cancelas", no "cancelás"; "eliges", no "elegís".
- **"Talla", no "talle".** En Perú se dice talla.
- Moneda siempre **S/** con dos decimales (`S/ 189.00`).
- Ciudades de ejemplo: **Lima, Arequipa, Trujillo, Cusco, Piura, Chiclayo, Ica**.
- Contacto y correos sobre el dominio **`.pe`**.

### Refuerzos de identidad peruana a conservar

Estos textos del prototipo son correctos y **no deben perderse** al implementar:

| Sección | Texto |
|---|---|
| Hero | "Colección Verano 2026 · **Hecho en Perú**" |
| About | "…la certeza de que **la moda peruana** podía ser diferente" |
| About | "el taller de casa de Valentina, **en Lima**" |
| About | "**Producción local** — cada prenda se confecciona a mano por talleristas locales" |
| Hero (stat) | "100% **Producción local**" |
| Footer | `hola@novastyle.pe` |

La metadata de [app/layout.tsx](../app/layout.tsx) ya cumple ("Lo último en moda y accesorios **en Perú**") — mantenerla al aplicar HU-03.

---

## 5. Historias de Usuario

**Prioridad:** `Must` (imprescindible) · `Should` (importante) · `Could` (deseable)
**Estimación:** puntos de historia (1 = ~medio día)

---

### ÉPICA 1 — Fundaciones

#### HU-01 · Sistema de diseño y layout base
**Must · 3 pts**

> Como desarrollador frontend, quiero el tema visual y las tipografías configuradas globalmente,
> para que todas las secciones se construyan sobre la misma base sin repetir estilos.

**Criterios de aceptación**
- `app/globals.css` contiene los tokens de `theme.css` (colores, `--radius`, `@theme inline`).
- Playfair Display, DM Sans y DM Mono se cargan con `next/font/google` y se exponen como variables CSS.
- DM Sans es la fuente por defecto del `<body>`.
- La animación `marquee` y la ocultación de scrollbar están en el CSS global.
- `<html lang="es">`.
- Se pueden usar `bg-background`, `text-accent`, etc. como clases de Tailwind.

---

#### HU-02 · Capa de datos mock tipada
**Must · 2 pts**

> Como desarrollador, quiero que todos los datos vengan de funciones tipadas y no de arrays dentro
> de los componentes, para poder conectar Strapi después sin reescribir la UI.

**Criterios de aceptación**
- `lib/types.ts` define `Product` y `Collection`. (`Order` y `Subscriber` llegarán con la fase 2.)
- `lib/mock-data.ts` contiene los datos exactos del prototipo: 8 productos y 3 colecciones.
- `lib/data.ts` expone funciones `async` (`getProducts()`, `getCollections()`, …) que devuelven esos mocks.
- Ningún componente de `components/` declara un array de datos de negocio.
- Los precios se formatean con un único helper `formatPrice(n): "S/ 189.00"`.

---

#### HU-03 · Metadata y SEO
**Must · 1 pt**

> Como responsable de marketing, quiero que la landing tenga título, descripción e imagen social
> correctos, para que se vea bien al compartirla.

**Criterios de aceptación**
- `title`: "Novastyle — Moda consciente hecha en Perú".
- `description` acorde a la propuesta de valor, **mencionando Perú explícitamente**. La actual de `app/layout.tsx` ya cumple y puede conservarse.
- Open Graph con imagen, título y descripción.
- `lang="es"`, favicon presente.
- El `/admin` lleva `robots: noindex`.

---

### ÉPICA 2 — Landing pública

#### HU-04 · Barra de navegación
**Must · 3 pts**

> Como visitante, quiero una barra de navegación siempre accesible, para llegar a cualquier sección
> sin hacer scroll manual.

**Criterios de aceptación**
- Fija arriba (`fixed top-0 z-50`).
- Transparente al inicio; al superar 40px de scroll pasa a `#F7F4EF/95` con `backdrop-blur`, borde inferior y sombra, con transición de 300ms.
- Logo "NOVASTYLE" en Playfair, mayúsculas, `tracking-widest`.
- Enlaces (desktop ≥768px): Novedades, Colecciones, Catálogo, Sobre nosotras, Contacto.
- **Todos los `href` apuntan a un `id` que existe en la página, sin tildes** (resuelve inconsistencias #1 y #2).
- Íconos de búsqueda y carrito a la derecha.
- <768px: los enlaces se colapsan en hamburguesa; el panel se despliega debajo y se cierra al elegir una opción.
- El menú móvil se cierra con `Esc` y devuelve el foco al botón hamburguesa.

---

#### HU-05 · Buscador de productos
**Should · 3 pts**

> Como visitante, quiero buscar una prenda por nombre, para no recorrer todo el catálogo.

**Criterios de aceptación**
- Al pulsar la lupa se abre un overlay con un campo de texto enfocado automáticamente.
- Filtra sobre nombre y categoría mientras se escribe (sin botón "buscar").
- Muestra hasta 5 resultados con miniatura, nombre y precio.
- Al elegir un resultado, cierra el overlay y hace scroll al producto en el catálogo.
- Sin resultados → mensaje "No encontramos prendas con ese nombre".
- Cierra con `Esc` o clic fuera.

> *Nota: el prototipo tiene el botón pero no el comportamiento. Esta HU define lo que falta.*

---

#### HU-06 · Sección Hero
**Must · 3 pts**

> Como visitante que llega por primera vez, quiero entender de inmediato qué vende Novastyle y qué
> la diferencia, para decidir si sigo explorando.

**Criterios de aceptación**
- Ocupa `min-h-screen`, dos columnas en ≥1024px, una sola columna debajo.
- Columna izquierda: etiqueta "Colección Verano 2026 · Hecho en Perú" (DM Mono, dorado), titular "Moda que *cuenta* una historia" en Playfair con `clamp(3rem, 7vw, 6.5rem)`, párrafo, 2 CTA, 3 stats separados por borde superior.
- CTA primario "Ver catálogo" (fondo oscuro → dorado al hover, flecha que se desplaza); secundario "Ver colecciones" (borde).
- Columna derecha: imagen a `next/image` con `priority`, degradado inferior y card flotante "Nuevo ingreso" con nombre y precio.
- **El precio de la card coincide con el del catálogo** (resuelve inconsistencia #3).
- Marquee inferior con texto en bucle a 20s, sin scroll horizontal en el `body`.
- Entradas animadas escalonadas (0.1s / 0.3s / 0.6s).
- El marquee respeta `prefers-reduced-motion`.
- Se conserva "Colección Verano 2026 · **Hecho en Perú**" y el stat "100% Producción local" (ver 4.1).
- El stat de antigüedad dice **"4 años"**, coherente con "nació en 2022" de About (resuelve inconsistencia #7).

---

#### HU-07 · Sección Colecciones
**Must · 2 pts**

> Como visitante, quiero ver las colecciones por temporada, para explorar según la ocasión que me interesa.

**Criterios de aceptación**
- Encabezado: etiqueta "Temporadas" + título "Nuestras colecciones" + enlace "Ver todo" (solo desktop) hacia el catálogo.
- 3 cards en grilla: 1 columna en móvil, 3 en ≥768px.
- Cada card: imagen `aspect-[3/4]`, tag superpuesto arriba a la izquierda, nombre en Playfair, conteo de prendas en DM Mono, descripción.
- Hover: `scale-105` en la imagen + velo oscuro al 10%.
- Aparición animada al entrar en viewport, escalonada 0.12s, una sola vez.
- Al hacer clic en una colección, el catálogo se filtra por ella y hace scroll (enlaza con HU-08).

---

#### HU-08 · Catálogo virtual con filtros
**Must · 5 pts**

> Como visitante interesado, quiero ver todas las prendas y filtrarlas por categoría, para encontrar
> rápido lo que busco.

**Criterios de aceptación**
- Encabezado con etiqueta "Catálogo virtual", título "Todas las prendas" y contador dinámico "N artículos encontrados".
- Filtros: Todos, Vestidos, Blusas, Pantalones, Accesorios, Outerwear. El activo se invierte (fondo oscuro, texto crema).
- Grilla: 2 columnas en móvil, 3 en ≥768px, 4 en ≥1024px.
- Card de producto: imagen `aspect-[3/4]`, nombre, color en DM Mono mayúsculas, precio en Playfair.
- Tag superpuesto cuando existe ("Nuevo", "Popular", "Últimas unidades", "Edición limitada").
- Producto agotado: imagen al 60% de opacidad, badge "Agotado", precio tachado, sin botón de carrito.
- Al hover aparecen los botones de wishlist y carrito deslizándose desde la derecha.
- El corazón de wishlist alterna estado (relleno rojo) y persiste durante la sesión.
- Al cambiar de filtro, las cards reordenan con animación (`layout`), no con salto brusco.
- Botón "Cargar más prendas": muestra 8 más por clic; **desaparece cuando ya no quedan productos** (en el prototipo siempre está visible).
- Sin resultados → estado vacío con mensaje, no una grilla en blanco.

---

#### HU-09 · Sección Sobre nosotras
**Must · 3 pts**

> Como visitante, quiero conocer la historia y los valores de la marca, para confiar antes de comprar.

**Criterios de aceptación**
- Fondo `#1A1714`, texto claro, `py-24`.
- Dos columnas en ≥1024px. Izquierda: etiqueta, titular "Nació de un sueño, *creció con amor*", 2 párrafos, 3 stats con borde superior.
- Derecha: imagen `aspect-[4/3]` con card dorada superpuesta (`-bottom-6 -left-6`) con la cita, más 3 valores (Materiales conscientes / Producción local / Diseño inclusivo) con ícono en recuadro.
- La card superpuesta no se desborda ni se corta en móvil.
- Animaciones de entrada laterales (izquierda −30px, derecha +30px), una sola vez.
- Contraste de `text-white/50` sobre `#1A1714` verificado ≥4.5:1; subir opacidad si no cumple.
- **Localización aplicada (ver 4.1):** "Tallas del XS al 3XL", nunca "talles". Se conservan las menciones a "moda peruana", "en Lima" y "producción local".

---

#### HU-10 · Newsletter
**Must · 2 pts**

> Como visitante interesada, quiero suscribirme para enterarme de nuevos ingresos y preventas.

**Criterios de aceptación**
- Fondo dorado `#C8A97A`, contenido centrado, `max-w-3xl`.
- Campo de email + botón "Suscribirme" con flecha animada; en móvil se apilan.
- Validación de formato de email antes de enviar; error visible y asociado al campo (`aria-describedby`).
- Al enviar correctamente, el formulario se sustituye por el mensaje de éxito con check.
- El estado de éxito es anunciado por lectores de pantalla (`role="status"`).
- Sin backend: el envío se simula. **Queda un punto de integración marcado con `TODO: POST /api/subscribers`.**
- **Localización aplicada (ver 4.1):** el texto legal inferior dice "Cancelas cuando quieras", en tuteo.

---

#### HU-11 · Footer
**Must · 2 pts**

> Como visitante, quiero encontrar datos de contacto, enlaces de ayuda y redes al final de la página.

**Criterios de aceptación**
- Fondo `#1A1714`, 4 columnas en ≥768px (marca ocupa 2 en móvil), 2 columnas en móvil.
- Columna de marca: logo, tagline, íconos de Instagram y Facebook con hover dorado.
- Columnas Tienda / Info / Contacto con sus enlaces.
- Barra inferior: copyright + Términos, Privacidad, Cookies.
- Los enlaces reales apuntan a algún destino; los pendientes se marcan explícitamente como tal (no `href="#"` silencioso).
- **Localización aplicada (ver 4.1):** tagline "…diseñada para ti" y enlace "Tallas y medidas". Se conserva `hola@novastyle.pe`.

---

### ÉPICA 3 — Calidad transversal

#### HU-12 · Responsive verificado
**Must · 3 pts**

> Como visitante en cualquier dispositivo, quiero que la página se vea correcta en mi pantalla.

**Criterios de aceptación**
- Verificado en 360px, 768px, 1024px y 1440px.
- El `body` nunca hace scroll horizontal (el marquee y las tablas scrollean en su propio contenedor).
- Ninguna imagen se deforma; se respetan los `aspect-ratio`.
- Áreas táctiles ≥44×44px en móvil.
- Los titulares con `clamp()` no se desbordan en 360px.

---

#### HU-13 · Accesibilidad
**Should · 3 pts**

> Como usuaria con lector de pantalla o navegación por teclado, quiero poder usar el sitio completo.

**Criterios de aceptación**
- Toda la landing es recorrible con `Tab` en orden lógico, con foco siempre visible.
- Todas las imágenes tienen `alt` descriptivo (o `alt=""` si son decorativas).
- Los botones solo de ícono tienen `aria-label`.
- Jerarquía de encabezados correcta: un solo `h1` (el del Hero), `h2` por sección.
- Contraste de texto ≥4.5:1 en fondos claros y oscuros.
- `prefers-reduced-motion` desactiva marquee, parallax y animaciones de entrada.
- Los estados hover-only tienen equivalente accesible por teclado.

---

#### HU-14 · Rendimiento
**Should · 2 pts**

> Como visitante con conexión lenta, quiero que la página cargue rápido.

**Criterios de aceptación**
- Todas las imágenes usan `next/image` con `sizes` correcto.
- Solo la imagen del Hero lleva `priority`; el resto es lazy.
- CLS ≈ 0: todo contenedor de imagen tiene dimensiones o `aspect-ratio` reservado.
- Las fuentes se auto-hospedan vía `next/font` (sin request a Google Fonts).
- Las secciones sin interactividad se mantienen como Server Components; `"use client"` solo donde hay estado (Navbar, Catalog, Newsletter, todo el admin).

---

## 6. Resumen y orden sugerido

| Épica | HU | Puntos |
|---|---|---|
| 1 · Fundaciones | HU-01 → HU-03 | 6 |
| 2 · Landing | HU-04 → HU-11 | 23 |
| 3 · Calidad | HU-12 → HU-14 | 8 |
| **Total** | **14 HU** | **37 pts** |

*(El panel de administración — ~7 HU, ~23 pts — se documentará en la fase 2.)*

### Orden recomendado

1. **Sprint 1 — Fundaciones + estructura:** HU-01, HU-02, HU-03, HU-04
2. **Sprint 2 — Contenido principal:** HU-06, HU-07, HU-08
3. **Sprint 3 — Cierre de landing:** HU-09, HU-10, HU-11, HU-05
4. **Sprint 4 — Calidad:** HU-12, HU-13, HU-14

### Puntos de integración con Strapi (marcar con `TODO` al implementar)

| Qué | Dónde |
|---|---|
| `GET /products` | `lib/data.ts` → `getProducts()` |
| `GET /collections` | `lib/data.ts` → `getCollections()` |
| `POST /subscribers` | HU-10, envío del newsletter |

*(Auth y CRUD del admin quedan para la fase 2.)*
