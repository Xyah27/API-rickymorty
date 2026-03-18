# Rick & Morty Explorer 🛸

Aplicación móvil desarrollada con **Ionic 8 + Angular 19** que consume la API pública de [Rick and Morty](https://rickandmortyapi.com/) para explorar personajes, episodios y ubicaciones del universo de la serie.

## ¿Qué hace la app?

- **Inicio (Tab 1):** Carrusel interactivo de personajes con swiper y mapa de ubicación del usuario integrado con Mapbox GL.
- **Personajes (Tab 2):** Listado paginado con scroll infinito de todos los personajes de la API. Permite marcar favoritos con estrella y ver el detalle completo en un modal.
- **Favoritos (Tab 3):** Muestra los personajes marcados como favoritos, persistidos localmente con Ionic Storage.
- **Episodios (Tab 4):** Listado paginado de episodios con tarjetas expandibles que cargan los personajes de cada episodio desde la API. Al tocar un personaje se abre su detalle en modal.
- **Escáner QR (Tab 5):** Escáner QR en tiempo real usando la cámara web del dispositivo y la librería jsQR. Escanea continuamente y guarda cada código junto con la geolocalización del usuario, mostrando la ubicación en un mapa Mapbox.

## Trabajo con API externa

La app se integra con la **Rick and Morty API REST** (`rickandmortyapi.com/api`), consumiendo los endpoints de:
- `/character` — listado paginado y búsqueda por IDs
- `/episode` — listado paginado con info de personajes vinculados

Se implementó paginación con scroll infinito, carga lazy de personajes por episodio, y manejo reactivo del estado con `BehaviorSubject` y `Set<number>` para los favoritos.

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| **Ionic 8** | Framework UI móvil con componentes standalone |
| **Angular 19** | Framework frontend (standalone components, signals-ready) |
| **TypeScript** | Lenguaje principal |
| **Rick and Morty API** | API REST pública para datos de personajes y episodios |
| **Mapbox GL JS** | Mapas interactivos con estilo dark y marcadores |
| **Ionic Storage** | Persistencia local de favoritos y escaneos QR |
| **jsQR** | Decodificación de códigos QR desde frames de video |
| **Capacitor** | Bridge nativo para Android/iOS |
| **SCSS** | Estilos con tema personalizado Rick & Morty (verde portal #8BCF21) |

## Paleta de colores Rick & Morty

| Color | Hex | Uso |
|---|---|---|
| Verde Portal | `#8BCF21` | Color primario, botones, acentos |
| Verde Oscuro | `#2F9331` | Gradientes, color secundario |
| Azul Rick | `#83D2E4` | Color terciario, íconos de ubicación |
| Teal | `#477385` | Color secundario |
| Crema | `#E5D29F` | Títulos de sección, warnings |
| Charcoal | `#1a1c1e` | Fondo principal |

## Configuración

1. Clonar el repositorio
2. `npm install`
3. Copiar `src/environments/environment.example.ts` → `src/environments/environment.ts` y agregar tu token de Mapbox
4. `ionic serve`

## Autor

Juan José — Desarrollo de Aplicaciones Móviles
