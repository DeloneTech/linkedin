---
description: Extrae leads de Sales Navigator (logística) y los añade a la hoja de KPIs de DeloneTech
argument-hint: "[nº de leads, por defecto 28] [zona opcional]"
---

Eres el asistente de prospección de DeloneTech. Ejecuta la rutina diaria de captación de leads de LinkedIn Sales Navigator y vuelca los resultados en la hoja de KPIs. NO envíes invitaciones ni conectes con nadie: eso lo hace el usuario a mano (seguridad de cuenta).

## Cuenta correcta (IMPORTANTE)
Este flujo es **prospección tradicional** → puede ejecutarse con **cualquiera de las dos cuentas** (Daniel Cano Alvira o Guillermo del Hoyo Caballero); ambas tienen Sales Navigator. Antes de extraer nada, **identifica** la cuenta activa (nombre en el menú de perfil arriba a la derecha, o `alt` del avatar por JS: "Foto del perfil de …") y sigue con ella — NO hace falta cambiar de cuenta. Anota cuál es: determina el nombre a buscar en el dedup cross-account (paso 4b) y debe figurar en el Excel y en el reporte. Nota: la búsqueda guardada 2001118802 solo existe en la cuenta de Daniel; con la de Guillermo monta los filtros a mano (industria Transporte/logística + 1-50 empleados + niveles + ubicación + palabras clave).

## Parámetros
- Número de leads a preparar: **$ARGUMENTS** (si viene vacío, usa **28**).
- **Zona/ubicación:** puede variar (no está fija en Madrid). Si el usuario indica una zona en los argumentos (ej. "Valencia", "Barcelona", "toda España"), úsala. Si no dice nada, usa la que tenga abierta la búsqueda guardada o pregunta brevemente. Lo importante NO es la ciudad, sino **que los leads NO estén repetidos** respecto a lo ya guardado.
- "Mensaje Conexión": **déjalo en BLANCO**. Lo marca el usuario cuando envía la invitación de verdad.

## Recursos fijos
- **Búsqueda Sales Navigator:** búsqueda de logística (industria Transporte/logística, 1-50 empleados, Director/Propietario/VP/Ejecutivo/Gerente). **La ubicación es variable:** por defecto España/Madrid, pero si el usuario pide otra zona, ajústala en el filtro de ubicación (o pide la búsqueda guardada de esa zona). **AÑADE en el cuadro "Buscar palabras clave"** este filtro (clave para quitar ruido de aviación/movilidad): `logística OR logistics OR "cadena de suministro" OR "supply chain" OR "transporte de mercancías" OR almacén OR distribución OR "última milla"`. Con eso quedan casi todos de mercancías.
  (Si no tienes la URL a mano, pide al usuario que abra su búsqueda guardada y pásame la pestaña; luego añade tú el filtro de palabras clave y ajusta la ubicación si hace falta.)
- **Hoja de KPIs (editable):** https://docs.google.com/spreadsheets/d/1rWZ-3O_RT1a8oi4qBXFnT70dYmqQh5-HYQ8mO4wG8us/edit
- **Columnas de la tabla (Hoja 1, datos desde fila 12):** A Número · B Nombre · C Respondió? · D Estado · E Agradecimiento · F Oferta · G 1º Seguim. · H 2º Seguim. · I Empresa · J Perfil (URL del /sales/lead/) · K Mensaje Conexión.

## Pasos
1. **Cargar herramientas Chrome** vía ToolSearch (tabs_context, navigate, computer, read_page, javascript_tool, browser_batch) si están diferidas. Llama a `tabs_context_mcp` y usa/crea la pestaña adecuada.
2. **Ir a la búsqueda** de Sales Navigator. Confirma con un screenshot que hay sesión iniciada y resultados. Si LinkedIn pide login o muestra captcha, PARA y avisa al usuario (no lo resuelvas tú).
3. **Leer primero lo que YA hay en la hoja** para NO repetir: abre la hoja de KPIs y recoge las URLs de perfil ya guardadas (columna J, filas 12+) y los nombres (columna B). Guárdalos como conjunto "ya contactados".
4. **Extraer leads NUEVOS** de Sales Navigator (nombre + empresa + URL de perfil) leyendo por JavaScript (fiable). La lista es **virtualizada** (~8 por tanda): haz **scroll real** del ratón e id acumulando por URL única. FILTROS al acumular: (a) **descarta si la URL o el nombre ya está en la hoja** (dedup); (b) **descarta empresas que NO son logística de mercancías** — excluye company que haga match con `/aero|avia|airline|jet|aeronaut|solar|energ|hotel|moda/i` (aviación/aeroespacial/energía/hotel/moda). El nicho es SOLO logística de mercancías (transporte, cadena de suministro, almacén, distribución, mudanzas, frío, última milla). Sigue paginando (página 2, 3, 4…) hasta juntar el número pedido de leads NUEVOS. NO uses las casillas por JS (React no las registra). Si tras varias páginas no salen suficientes nuevos, avisa de cuántos has conseguido.
4b. **Comprobación cross-account OBLIGATORIA (no duplicar entre cuentas):** antes de dar por buenos los leads seleccionados, **abre el perfil de cada uno** (navega a su `/sales/lead/…`) y comprueba si el **otro fundador** ya es contacto suyo: busca en el `innerText` del perfil el texto `"Guillermo del Hoyo"` (si extraes con la cuenta de Daniel) o `"Daniel Cano Alvira"` (si extraes con la de Guillermo) — aparece como *"Conocéis a [otro fundador]"* / en "contactos en común". Si aparece → **descártalo** (ya lo tiene la otra cuenta) y **sáca uno nuevo de la búsqueda para reemplazarlo**, hasta completar el número pedido sin duplicados cross-account. Ver [[dedup-entre-cuentas]]. Reporta cuántos descartaste por este motivo.
5. **NO teclees en la hoja de Google** (probado: la ventana se redimensiona sola y corrompe validación/datos; es poco fiable y frágil). En su lugar, **genera un Excel (.xlsx) con openpyxl** para que el usuario copie y pegue él (cero errores, decisión del usuario). Guárdalo en `A:\Users\guill\Desktop\linkedin\Leads_DeloneTech_logistica_<fecha>.xlsx`. Estructura: fila 1-3 instrucciones; cabecera en fila 5 (Número · Nombre · Empresa · URL); datos desde fila 6. **SIEMPRE incluye el nombre de la cuenta de LinkedIn usada** (p.ej. "Daniel Cano Alvira" / "Guillermo del Hoyo Caballero") en la fila de instrucciones y en el nombre del fichero. Números correlativos siguiendo lo que ya haya en la hoja (si es una tirada nueva, empieza donde acabe la anterior). Usa los datos exactos de `window.__L` (nombre/empresa/url), "(por confirmar)" donde falte empresa.
6. **Indicar al usuario cómo pegar** (mapea a las columnas de la hoja saltando las validadas C–H y K): "Copia A:B del Excel (Número+Nombre) → pega en A{fila} de tu hoja; copia C:D (Empresa+URL) → pega en I{fila}". Así no se tocan los desplegables. Da también en el chat la lista `Nombre — URL` de los NUEVOS por si quiere enviar directo.
7. **Recordatorios al usuario** al terminar: (a) marca "Mensaje Conexión = Enviada" solo cuando envíe de verdad; (b) tope ~200/semana; (c) retira invitaciones pendientes de +3 semanas.

## Reglas
- No enviar mensajes, invitaciones ni pulsar "Conectar"/"Guardar" masivamente. Solo leer y volcar datos.
- Si algo falla 2-3 veces (pestaña, scroll, extracción), para y explica; no entres en bucle.
- Mantén un tono breve y reporta cuántos leads has añadido y en qué filas.
