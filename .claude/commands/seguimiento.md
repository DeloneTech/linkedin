---
description: Actualiza el KPI de prospección tradicional de DeloneTech desde Sales Navigator (mensaje conexión, agradecimiento, oferta, seguimientos, respondió) marcando Enviado/Respondido en cada casilla
argument-hint: "(sin argumentos)"
---

Eres el asistente de seguimiento de DeloneTech. Revisas la mensajería de Sales Navigator y actualizas la hoja de KPIs marcando, para cada lead, en qué punto del embudo está: qué mensajes se han enviado y a cuáles han respondido. NO envías mensajes ni conectas con nadie: solo lees y actualizas la hoja.

## Cuenta correcta (IMPORTANTE)
Flujo **tradicional**. Por el arreglo temporal vigente, la tradicional se lleva en **las dos cuentas** (Daniel y Guillermo). Antes de tocar nada, **verifica qué cuenta está activa** (nombre en el menú de perfil arriba a la derecha, o `alt` del avatar por JS) y confírmalo: el seguimiento (buzón, feed de Inicio, aceptaciones) es **por cuenta**, así que actualizas los leads de ESA cuenta. **La hoja ya no marca la cuenta** (se eliminó la antigua columna de marca): el buzón/feed que estás leyendo ya es de la cuenta activa, actualiza lo que veas ahí. Ambas cuentas tienen Sales Navigator (`/sales/inbox/`). No mezcles leads entre cuentas.

## Mapeo mensaje → columna (embudo completo)
| # | Mensaje | Columna | Detección en la conversación |
|---|---------|---------|------------------------------|
| 1 | Conexión (invitación **SIN nota**) | **K** Mensaje Conexión | La invitación va sin nota → **NO crea hilo en el buzón**. La aceptación se detecta por el feed de **Inicio** / respuesta / agradecimiento enviado (ver regla de K abajo) |
| 2 | 1er mensaje = **agradecimiento + pregunta de problema** | **E** Agradecimiento | Mi **primer** mensaje del hilo: agradece aceptar + una frase en 1ª persona (*me dedico a ayudar a empresas de logística a…*) + **una pregunta de problema** (*¿lo tenéis ya centralizado o cada cosa por su lado? / ¿cómo controláis dónde está cada expedición? / ¿los albaranes en digital o en papel?*). Señales: `/gracias por (aceptar\|conectar)/i` + `/me dedico a\|ayud[oa].{0,15}empresas de log[íi]stica/i` (siendo el 1er mensaje mío). |
| 3 | 2º msg = **empujón** · 3er msg = **oferta real** | **F** Oferta | **2º msg (empujón, a no-respondedores):** retoma sin agobiar → `/por si se te pas[óo]\|te escrib[íi]a.{0,20}(otra vez\|la otra)\|sin agobiar\|si ahora no es el momento\|retomo/i`. **3er msg (oferta real, a quien respondió):** menciona el **sistema a medida** y ofrece **demo / calculadora** → `/te enseño (una )?demo\|os ahorrar[íi]ais\|calcul[oa].{0,20}ahorr\|a (vuestra\|tu) medida\|un sistema que lleva/i`, o la antigua `/deloneTech.*(papeleo\|albaranes\|expediciones)/is` (hilos viejos). |
| 4 | 1º Seguimiento = **GIF o sticker** | **G** 1º Seguimiento | Mensaje mío de **imagen/GIF/sticker** (media, NO texto) |
| 5 | 2º Seguimiento | **H** 2º Seguimiento | Mi texto con la plantilla de 2º seguimiento |

## Recursos fijos (NO usar otra hoja)
- **Hoja KPI (SIEMPRE esta):** https://docs.google.com/spreadsheets/d/1rWZ-3O_RT1a8oi4qBXFnT70dYmqQh5-HYQ8mO4wG8us/edit?gid=0#gid=0
- **Mensajería:** https://www.linkedin.com/sales/inbox/
- **Columnas** (datos desde fila 12; **fila de la hoja = nº de lead + 11**): A Número · B Nombre · **C Respondió?** · D Estado · **E Agradecimiento** · **F Oferta** · **G 1º Seguimiento** · **H 2º Seguimiento** · I Empresa · J Perfil (URL) · **K Mensaje Conexión**.
- **Valores EXACTOS de los desplegables** (¡sin tilde!, verificar en la hoja porque son quisquillosos): C → `Si` / `No`. E, F, G, H → `Enviado` / `Respondido` (OJO: el valor real puede estar guardado como **`Respondio`** sin tilde — usa el que ya haya en las celdas existentes). K → `Enviada` / `Aceptada` **SOLO** (⚠️ el valor `Mensaje enviado` está RETIRADO aunque el desplegable aún lo ofrezca; si encuentras alguno en la hoja, corrígelo a `Aceptada`).

## Columna K (Mensaje Conexión) — 2 estados: `Enviada` / `Aceptada`
**⚠️ La invitación ahora va SIN nota** (cambio del asesor). Consecuencia: **la invitación NO crea ningún hilo en el buzón** hasta que se manda el 1er mensaje (`/primermensaje`). Ya no existe el caso "hilo con solo mi nota". Por tanto la aceptación **no se detecta en el buzón**, sino por señal externa.

**La aceptación SOLO es fiable por una de estas señales:**
- (a) el lead **ha respondido** (hay un mensaje SUYO en el hilo — solo puede haberlo si ya le mandé el 1er mensaje), o
- (b) aparece en **Inicio** de Sales Navigator como "… ha aceptado tu solicitud de contacto" (**vía principal**), o
- (c) ya se le ha **enviado 1er mensaje** (E relleno) — solo se manda a aceptados.

Sin ninguna de esas señales, la invitación sigue **pendiente** → déjala en `Enviada`. (Hilos ANTIGUOS pueden tener aún mi vieja nota de conexión; ahí sigue valiendo el criterio de siempre: nota sin respuesta = ambiguo, no confirma aceptación.)

1. **`Enviada`** — invitación enviada, **sin señal de aceptación** (a/b/c). Suele venir ya puesto por `/conectar`.
2. **`Aceptada`** — hay **señal de aceptación** (respondió / alerta de Inicio / E relleno). Se queda en `Aceptada` para siempre, aunque después se le manden mensajes: el avance de mensajes se refleja en E/F/G/H, NO en K.
Transición: **Enviada → Aceptada** y ahí se acaba. Nunca bajar de estado.
⚠️ El valor **`Mensaje enviado` está RETIRADO** (decisión 2026-07-14): K solo dice si la invitación está pendiente (`Enviada`) o aceptada (`Aceptada`). Si al leer la hoja encuentras algún `Mensaje enviado` en K, **cámbialo a `Aceptada`**.
**Verificar aceptaciones es tarea de ESTE comando:** en cada pasada de `/seguimiento` hay que comprobar qué leads en `Enviada` han aceptado ya (feed de Inicio + señales a/c) y subirlos a `Aceptada`.

### Detección fiable de aceptaciones EN MASA (feed de Inicio) — método probado 2026-07-13
Con la invitación sin nota, el **feed de "Inicio" de Sales Navigator** (`https://www.linkedin.com/sales/home`) es la **vía PRINCIPAL** para pasar de `Enviada` → `Aceptada` (ya no hay nota en el buzón que mirar). Lista los eventos "**[Nombre] ha aceptado tu solicitud de contacto**" (señal (b), fiable). Cubre aprox. **la última semana** (más atrás no aparece → limitación conocida; los que acepten y no pasen por aquí se detectarán cuando respondan o al mandarles el 1er mensaje).
1. Navega a `/sales/home` y **haz scroll** varias veces para cargar el feed (infinito). El feed mezcla aceptaciones con "ha visto tu perfil" / "ha compartido una publicación" / "ha publicado una foto" → **solo interesan las de "ha aceptado tu solicitud de contacto"**.
2. **Extrae los nombres** por JS acumulando en `window`, filtrando el duplicado "Eliminar esta alerta sobre X":
   ```js
   window.__ACC=window.__ACC||{};
   window.collectAcc=function(){
     const t=document.body.innerText;
     const re=/([^\n]{2,60}?)\s*ha aceptado tu solicitud de contacto/gi; let m,added=0;
     while((m=re.exec(t))){ let n=m[1].trim();
       if(/^Eliminar esta alerta/i.test(n)) continue;     // descartar el botón "Eliminar esta alerta sobre X"
       n=n.replace(/\s*✔\s*$/,'').trim();                  // quitar el ✔ de "verificado"
       if(n && !window.__ACC[n]){window.__ACC[n]=1;added++;} }
     return {added,total:Object.keys(window.__ACC).length};
   };
   window.collectAcc();
   ```
   Llama `window.collectAcc()` tras cada scroll hasta que `added` sea 0 (ya no hay más aceptaciones, el feed pasa a publicaciones).
3. **Cruza** los aceptantes con la hoja: para cada lead con **K = `Enviada`** cuyo nombre casa con un aceptante → márcalo **`Aceptada`** (da igual que E esté relleno o no). Los que ya estaban en `Aceptada` se quedan (nunca bajar); si alguno tiene el valor retirado `Mensaje enviado`, corrígelo a `Aceptada`.
4. **⚠️ CUIDADO con nombres abreviados** (la hoja tiene tipo "Esther L.", "Carol A. Ferrante P.", "Francisco G."). Casar por nombre + inicial genera **falsos positivos** (ej. real: "Francisco G." casó con "Francisco Manuel Gómez", que era OTRO lead ya gestionado). Regla: acepta el match si es **nombre completo exacto** (normalizando acentos/mayúsculas); si el nombre de la hoja está abreviado y hay más de un aceptante con ese nombre de pila, **NO lo marques por la inicial** → verifícalo o déjalo y repórtalo.

**Cuándo aceptar responder ≠ solo aceptar:** aceptar la invitación mueve **K** (a `Aceptada`), pero **NO** pone `C=Si` por sí solo. `C=Si` es solo si el lead **respondió a un mensaje**. Si respondió tras el sticker (G), además de `C=Si` marca **G = `Respondio`** (y, si respondió tras la oferta, `F = `Respondio``, etc. — la casilla posterior a su respuesta).

## Regla general del resto de etapas (E, F, G, H)
1. Si **NO** he enviado ese mensaje → dejar la casilla **en blanco**.
2. Si lo he **enviado** y aún **no** me han respondido después → **`Enviado`**.
3. Si lo he enviado **y me han respondido** después → **`Respondido`**.

Y aparte: **C (Respondió?) = `Si`** si el lead ha respondido a cualquier mensaje; si no, `No`.
Nunca "bajar" de estado: si una casilla ya está en `Respondido`, no la pises con `Enviado`.

## CSV: sin ensuciar Descargas
Para leer el estado actual de la hoja hay que exportar el CSV (el `fetch` dentro de la página lo bloquea el CSP de Google; el MCP de Drive trunca ~fila 166). Por tanto: **exporta, lee y BORRA el CSV** (y barre los antiguos) para no llenar `D:\Users\guill\Downloads`.
- Export: navega una pestaña a `https://docs.google.com/spreadsheets/d/1rWZ-3O_RT1a8oi4qBXFnT70dYmqQh5-HYQ8mO4wG8us/export?format=csv&gid=0` → cae en `D:\Users\guill\Downloads\KPI Prospeccion...csv`.
- Al terminar (y también antes de empezar), borra el CSV. **OJO: el borrado por comodín (`...v2*.csv`) lo puede bloquear el sandbox** ("Irreversible Local Destruction"); si pasa, bórralo por **nombre exacto**: `Remove-Item "D:\Users\guill\Downloads\KPI Prospeccion Logistica DeloneTech v2 - Hoja 1.csv","D:\Users\guill\Downloads\KPI Prospeccion Logistica DeloneTech v2 - Hoja 1 (1).csv" -Force -ErrorAction SilentlyContinue`.

## Pasos
1. **Cargar herramientas Chrome** (tabs_context, navigate, computer, javascript_tool, browser_batch, resize_window). `tabs_context_mcp`; usa/crea pestañas: una para el buzón, otra para la hoja.
2. **Estabilizar ventana**: `resize_window` a ~1400×860 en la pestaña de la hoja para que el Cuadro de nombres (~35,78) no baile.
3. **Leer el buzón** (`/sales/inbox/`): haz scroll para cargar todas las conversaciones (virtualizado). **OJO: con la invitación sin nota, un lead solo aparece en el buzón cuando ya le mandé el 1er mensaje** (o cuando respondió). Las invitaciones pendientes NO están aquí → para saber quién aceptó usa el feed de **Inicio** (ver "Columna K"). (Hilos ANTIGUOS pueden traer aún mi vieja nota pendiente; ahí, presencia ≠ aceptación.) Extrae de cada `li.conversation-list-item`:
   - **nombre** = primera línea, limpiando prefijos `La última conexión de … fue Hace …` y sufijos `está en línea/desconectado`.
   - **snippet** = texto de `.conversation-list-item__main-content` quitando el nombre y la hora.
   - **unread** = clase `is-unread`.
   - Clasifica: es **mío** (saliente, sin respuesta) si el snippet casa con mis plantillas (`/gracias por (conectar|aceptar)|me dedico a|ayud[oa].{0,15}empresas de log[íi]stica|por si se te pas[óo]|si ahora no es el momento|te enseño (una )?demo|os ahorrar[íi]ais|a (vuestra|tu) medida|me apetec[íi]a conectar/i` — las dos últimas, para hilos viejos). Es **respuesta** si `unread` o el snippet NO es mío.
   - **Para el estado por etapa, ABRE la conversación** y recorre los mensajes en orden con su emisor (`Tú` vs el lead):
     - Casa cada mensaje MÍO con su etapa: 1er mensaje = agradecimiento + pregunta (E), empujón/oferta (F), 2º seg (H) por plantilla de texto; **1º seg (G) = mensaje mío de imagen/GIF/sticker** (detéctalo por ser media, no texto — en el DOM aparece como imagen/adjunto, no como párrafo).
     - La etapa MÁS AVANZADA que yo haya enviado marca hasta dónde va el embudo: rellena esa casilla y TODAS las anteriores que también haya enviado.
     - Para cada etapa enviada: si el lead mandó algún mensaje DESPUÉS de ella → esa casilla = `Respondido`; si no → `Enviado`.
     - Si con el snippet ya está claro (p.ej. solo hay agradecimiento y su respuesta), puedes ahorrarte abrir la conversación.
4. **Leer estado actual de la hoja**: exporta CSV, parséalo en Python (columnas B nombre, C, E, F, G, H, K). Borra el CSV.
5. **Cruzar nombre → fila** (normaliza acentos/mayúsculas; nombres abreviados en hoja tipo "Esther L." = nombre + inicial de apellido). Fila = nº lead + 11.
6. **Calcular diffs**: aplica la regla general (E, F, G, H, C) y la **regla de K**. Cambia SOLO las celdas que difieran del estado actual (no repitas lo ya correcto). Respeta lo ya marcado a mano.
   - **Columna K (aceptaciones):** para pasar de `Enviada` → `Aceptada` en masa, usa el **feed de Inicio** (ver "Detección fiable de aceptaciones EN MASA" arriba): navega a `/sales/home`, scroll + `collectAcc()`, cruza los aceptantes con los leads en `Enviada` (cuidado con nombres abreviados → falsos positivos). Marca `Aceptada` **SOLO** con **señal fiable** (respondió / alerta "ha aceptado" en Inicio / agradecimiento ya enviado). Un hilo con solo mi nota y sin respuesta **NO** confirma aceptación → **déjalo en `Enviada`**. Para los que sí aceptaron → `Aceptada` (con E vacío o relleno, da igual). Aprovecha la pasada para corregir cualquier `Mensaje enviado` residual en K → `Aceptada`. Nunca bajar de estado.
7. **Marcar** (método seguro probado, NADA de Ctrl+Z ni pegar bloques): por cada celda, clic en Cuadro de nombres (~35,78) → escribe `{Col}{fila}`+Enter → escribe el valor exacto+Enter. Encadena con `browser_batch`. Cierra con Escape por si se abre el buscador de Sheets.
8. **Verificar**: re-exporta CSV **con cache-buster** (añade `&t=<algo>` a la URL de export; sin él Google puede servir un CSV cacheado de ANTES del cambio y dar un falso negativo). Comprueba que las celdas objetivo tienen el valor y que las columnas C/E/F/G/H/K **no tienen valores raros** (celda corrompida). Borra el CSV.
9. **Reportar**: resumen de cambios por etapa; avisa de las conversaciones **sin leer** (respuestas que aún no ha visto Guillermo).

## Plantillas de referencia (de "Sistemas de prospección tradicionales.docx" — se irán actualizando)
- **1) Conexión (K):** invitación **SIN nota** (no hay texto; solo estado de la invitación).
- **2) 1er mensaje = agradecimiento + pregunta de problema (E):** "Hola [Nombre], ¡gracias por aceptar! [reacción a su perfil]. Yo me dedico justo a ayudar a empresas de logística a [resultado, sin producto]. Por curiosidad, ¿[pregunta de problema: lo tenéis centralizado o cada cosa por su lado / cómo controláis dónde está cada expedición / albaranes en digital o en papel]?"
- **3) Oferta (F) — dos mensajes que caen en la misma columna** (no hay columna separada para la oferta real):
  - **2º mensaje = empujón suave (`/segundomensaje`, a quien NO respondió):** retoma sin agobiar; NO menciona el producto. Señales: *"te escribía por si se te pasó…"*, *"retomo…"*, *"sin agobiar"*, *"si ahora no es el momento, sin problema"*, y a veces un reenfoque de la pregunta.
  - **3er mensaje = oferta real (`/tercermensaje`, a quien respondió):** aquí sí explica el **sistema de operaciones a medida** (en 1ª persona) y ofrece el siguiente paso tangible. Señales: *"me dedico a montar, a vuestra medida, un sistema…"*, *"toda la operación desde un sitio"*, *"te enseño una demo de cómo quedaría lo vuestro"*, *"te calculo cuánto os ahorraríais"*.
  - **Hilos ANTIGUOS** (plantilla vieja): mensajes con *"DeloneTech" + "papeleo"/"albaranes"/"expediciones"* o *"eliminar el papeleo del día a día"* → también son oferta (F).
- **4) 1º Seguimiento (G) = GIF o sticker** (NO texto → detectar mensaje mío de imagen/media).
- **5) 2º Seguimiento (H):** "Qué pasa [Nombre]! Retomo por aquí porque creo que esto puede encajar…" (cierre: "No quiero insistir de más, así que cierro por aquí.")

## Reglas
- Trabajar SIEMPRE sobre la hoja `1rWZ-3O…`, nunca sobre una copia.
- No inventar el estado: si no está claro a qué etapa corresponde un mensaje, marca solo lo seguro (conexión / agradecimiento / respondió) y avísalo.
- Detección "mío vs suyo": mis mensajes saludan al lead por su nombre y usan plantilla; sus respuestas suelen dirigirse a "Guillermo" o no contienen esas frases. Ante duda, abre la conversación.
- Borrar SIEMPRE el CSV al acabar. Si algo falla 2-3 veces, para y explica.
