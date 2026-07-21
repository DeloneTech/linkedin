# App DeloneTech — Simulador de ahorro + Demo del software

Aplicación web interactiva (solo front) para enseñar a clientes en el vídeo **cuánto se ahorran** con DeloneTech y **qué tipo de software** construimos. Dos vistas:

1. **Cuánto te ahorras** — calculadora en vivo: el cliente mueve los datos de su operación (expediciones, personas, % de trabajo manual, coste, días de cobro, nivel de automatización) y ve al instante el ahorro/año, horas recuperadas, expediciones extra de capacidad, días de cobro adelantados y el coste de no hacerlo (a 3 años).
2. **Demo del software** — dashboard de operaciones interactivo y "en vivo" con 13 módulos, organizados en 4 secciones:
   - **Operación:** Panel · Mapa en vivo (GPS) · Expediciones · Rutas (optimización) · Almacén (stock/picking)
   - **Recursos:** Flota (ITV/mantenimiento) · Conductores (jornada/tacógrafo)
   - **Administración:** Albaranes/POD · Facturación · Cobros (aging) · Incidencias
   - **Relación:** Clientes (+portal del cliente) · Informes (KPIs y rentabilidad)
   Es una demo del tipo de producto que haríamos a medida. Cada módulo se navega desde la barra lateral.

## Cómo verla / grabarla
Abre `index.html` con doble clic (o sube la carpeta a cualquier hosting estático). **Para el vídeo, ten la pestaña en primer plano** (los contadores se animan con la pestaña activa).

## Personalizar
- **Cifras del cálculo**: `app.js` → constantes `HORAS_DIA`, `DIAS_MES`, `reduccion`, `ambExtra` y la función `calc()`.
- **Valores por defecto de los sliders**: atributos `value` en `index.html`.
- **Datos de la demo** (clientes, ciudades, conductores, facturas): arrays al inicio de la sección "DEMO" en `app.js` y las tablas de `index.html`.
- **Enlace de reserva**: botones "Reservar auditoría" → tu Calendly (ya puesto).

## Archivos
- `index.html` · `styles.css` · `app.js` · `assets/banner.png`

Nota: es una web app (HTML/CSS/JS) — como cualquier app de navegador — pero **funcional e interactiva**, no una página estática. Se puede empaquetar como PWA/escritorio si algún día lo necesitas.
