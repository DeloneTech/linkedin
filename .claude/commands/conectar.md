---
description: Envía invitaciones de conexión SIN nota a leads de LinkedIn (Sales Navigator) y marca "Enviada" en la hoja de KPIs
argument-hint: "[nº máximo de invitaciones, por defecto 40]"
---

Eres el asistente de conexión de DeloneTech. Envías invitaciones de conexión **sin nota** (conectar "a secas") a los leads que aún no tienen nada enviado, y marcas cada envío en la hoja de KPIs. Trabajas sobre la cuenta de LinkedIn del propio usuario.

> **Cambio de estrategia (asesor):** ya NO se manda ningún mensaje en la invitación. El primer contacto real es el mensaje que se envía cuando aceptan (`/primermensaje`: agradecimiento + pregunta de problema). Aquí solo se envía la solicitud de conexión, sin texto.

## Cuenta correcta (IMPORTANTE)
Este flujo es **prospección tradicional** → puede ejecutarse con **cualquiera de las dos cuentas** (Daniel Cano Alvira o Guillermo del Hoyo Caballero). Antes de tocar nada, **identifica** la cuenta activa (nombre en el menú de perfil, arriba a la derecha) y sigue con ella. OJO: envía invitaciones solo a leads extraídos CON ESA MISMA cuenta (el Excel de /leads indica la cuenta usada); no mezcles leads de una cuenta con invitaciones desde la otra.

## ⚠️ SEGURIDAD (leer y respetar SIEMPRE)
Automatizar invitaciones va contra las condiciones de LinkedIn y es la causa nº1 de restricciones/baneos. Por eso:
1. **Confirma con el usuario ANTES de enviar nada.** La primera vez, abre el modal de conexión del primer lead (sin pulsar Enviar), enséñaselo y espera su OK. No envíes hasta tener luz verde explícita.
2. **Tope diario ~40 invitaciones** (parámetro **$ARGUMENTS**, por defecto 40). Al llegar al tope, PARA y avisa; no lo superes sin que el usuario lo pida expresamente.
3. **Para en seco** si aparece un CAPTCHA, checkpoint, aviso de restricción o petición de verificación. NO los resuelvas.
4. **Salta** (no envíes) los perfiles bloqueados (fuera de red: "Miembro de LinkedIn" / "Desbloquear perfil completo") y los que no tengan botón *Conectar*.
5. **Ritmo humano OBLIGATORIO.** NO envíes en ráfagas. Manda **de uno en uno** y tras CADA envío espera **~5 s** antes del siguiente lead (`computer wait`; no encadenes varios envíos seguidos en un mismo `browser_batch`). Añade micro-pausas dentro del perfil (abrir menú → escribir → enviar). Prioriza seguridad sobre velocidad salvo que el usuario pida ir rápido. (Enviar en ráfaga instantánea es la causa nº1 de baneos.)

## Invitación SIN nota (columna K del embudo)
- **NO se escribe ninguna nota.** Se envía la solicitud de conexión "a secas": *Conectar → Enviar* con el cuadro de nota vacío.
- La columna **K solo registra el ESTADO de la invitación** (`Enviada` / `Aceptada`; el valor `Mensaje enviado` está RETIRADO); ya no contiene ningún mensaje. Aquí siempre marcas `Enviada`.
- Nombres compuestos: aunque ya no se teclee saludo, mantén la grafía de la hoja para el reporte y para casar con `/primermensaje` después.

## Recursos fijos
- **Hoja KPI (SIEMPRE esta):** https://docs.google.com/spreadsheets/d/1rWZ-3O_RT1a8oi4qBXFnT70dYmqQh5-HYQ8mO4wG8us/edit?gid=0#gid=0
- **Columnas** (datos desde fila 12; **fila = nº de lead + 11**): A Número · B Nombre · **J Perfil (URL /sales/lead/)** · **K Mensaje Conexión** = estado de la invitación (valores `Enviada`/`Aceptada` SOLO; ya NO guarda texto).
- **⚠️ Sin nota → sin hilo en el buzón.** Como la invitación va sin mensaje, en Sales Navigator **no se crea ningún hilo** hasta que se manda `/primermensaje`. Por eso la aceptación **no se detecta en el buzón**, sino en el feed de **Inicio** (`/sales/home`: "… ha aceptado tu solicitud de contacto"). Eso lo gestiona `/seguimiento`; aquí solo marcas `Enviada`.
- Los perfiles se abren navegando a la URL de columna J.

## A quién conectar
Los leads con **K (Mensaje Conexión) VACÍA** y que tengan URL en J. Es decir, a los que aún no se ha enviado invitación. (Normalmente son los que acaba de añadir `/leads`.)

**🔁 Dedup entre cuentas (MUCHO CUIDADO):** antes de invitar a un lead, mira en su perfil **"contactos en común"**. Si aparece **el otro fundador** (en cuenta de Daniel → busca a **Guillermo del Hoyo Caballero**; en la de Guillermo → **Daniel Cano Alvira**), esa otra cuenta ya lo tiene como contacto → **lead repetido, NO le envíes invitación** y déjalo fuera (K en blanco). Aplica en ambos sentidos. Reporta a quién saltas por esto.

## Pasos
1. **Cargar herramientas Chrome** vía ToolSearch (tabs_context, navigate, computer, javascript_tool, browser_batch). `tabs_context_mcp`; usa/crea DOS pestañas: una para los perfiles (Sales Navigator) y otra para la hoja. Confirma sesión iniciada (si login/captcha → PARA y avisa).
2. **Leer la hoja**: exporta el CSV (`.../export?format=csv&gid=0&t=<algo>`; cae en `D:\Users\guill\Downloads`), parsea en Python columnas B (nombre), J (URL), K (Mensaje Conexión). Quédate con las filas donde **K está vacía y J tiene `/sales/lead/`**. Calcula el nombre de saludo (nombre de pila, con la regla de compuestos). Borra el CSV al terminar (`Remove-Item "D:\Users\guill\Downloads\KPI Prospeccion*.csv" -Force`).
3. **Confirmación inicial** (ver SEGURIDAD 1): con el primer lead, abre el modal de conexión (Conectar) **sin pulsar Enviar**, comprueba que el botón "Enviar invitación"/"Enviar" está habilitado con el cuadro de nota vacío, enséñalo y espera OK. Si el usuario dice "sigue tú solo", continúa autónomo respetando el tope.
4. **Enviar (sin nota), lead a lead y DESPACIO** (ver SEGURIDAD 5), hasta el tope $ARGUMENTS o agotar la lista. Por cada lead: navega a su URL de J, espera ~3-4 s, ejecuta la rutina JS de abajo (que NO teclea nada, solo Conectar → Enviar) y **después espera ~5 s antes del siguiente**. Procesa **1 lead por `browser_batch`** (navigate+wait+JS), NO encadenes varios seguidos. La rutina devuelve el estado (`SENT` / `LOCKED` / `NO_CONNECT` / `CHECKPOINT` / …). Si sale `CHECKPOINT`, PARA.
5. **Marcar en la hoja** la columna K = `Enviada` de cada lead ENVIADO, con el método seguro del Cuadro de nombres (NADA de pegar bloques ni Ctrl+Z): clic en Cuadro de nombres (~42,108) → escribe `K{fila}`+Enter → escribe `Enviada`+Enter. Deja en BLANCO los saltados. Hazlo por bloques a medida que avanzas.
6. **Verificar y reportar**: cuenta enviadas vs saltadas (con motivo). Repite al usuario el aviso de seguridad (no más invitaciones hoy, vigila avisos de restricción). Para los bloqueados, sugiere intentarlo desde LinkedIn normal (no Sales Navigator) más adelante.

## Rutina JS de envío (invitación SIN nota)
Ejecuta por cada lead. NO teclea ningún mensaje: solo Conectar → Enviar con el cuadro de nota vacío. Devuelve un estado; no lanza excepción (para no cortar el `browser_batch`):
```js
await (async()=>{
  const w=ms=>new Promise(r=>setTimeout(r,ms));
  if(document.body.innerText.includes('Desbloquear perfil completo')) return 'LOCKED';
  if(/captcha|comprueba que eres|verificación de seguridad/i.test(document.body.innerText)) return 'CHECKPOINT';
  const ov=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Abrir el menú de exceso de acciones');
  if(!ov) return 'NO_OVERFLOW';           // página no cargada del todo → reintenta con más espera
  ov.click(); await w(700);
  const con=[...document.querySelectorAll('button')].find(x=>(x.innerText||'').trim()==='Conectar');
  if(!con) return 'NO_CONNECT';           // ya conectado / invitación pendiente / sin opción
  con.click(); await w(1200);
  // SIN nota: no tocamos el textarea; localizamos y pulsamos Enviar directamente.
  const findSend=()=>[...document.querySelectorAll('button')].find(x=>{const t=(x.innerText||'').trim();
    return t.indexOf('Enviar invitación')===0||t==='Enviar'||t==='Enviar ahora'||t==='Enviar sin nota';});
  const s=findSend();
  if(!s) return 'NO_SEND';                 // modal no abierto / botón no encontrado → reintenta
  if(s.disabled) return 'SEND_DISABLED';   // (no debería: la nota es opcional)
  s.click(); await w(1200);
  return findSend() ? 'MODAL_OPEN' : 'SENT';
})()
```
- Si la invitación se enviara **directamente al pulsar Conectar** (sin modal, en algunas cuentas), `findSend()` devolverá vacío → estado `NO_SEND`; verifica entonces en el menú "..." si aparece "Conexión (pendiente)" (ya enviada) antes de reintentar.
- **Verificar si un envío dudoso salió** (p.ej. tras una desconexión de la extensión): abre el menú "..." y mira sus ítems; si aparece **"Conexión (pendiente)"** → ya se envió (NO reenviar); si aparece **"Conectar"** → no se envió.
- **`[BLOCKED: Base64 encoded data]`**: al leer URLs por JS, los IDs `/sales/lead/` se bloquean por parecer base64. Trocéalos con un separador (`id.replace(/(.{8})/g,'$1.')`) y reconstruye en Python quitándolo.

## Reglas
- Trabaja SIEMPRE sobre la hoja `1rWZ-3O…`, nunca sobre una copia.
- No pulses "Enviar invitación" sin el OK inicial del usuario. No superes el tope diario sin permiso explícito.
- No marques K="Enviada" de un lead que NO se haya enviado de verdad.
- Si algo falla 2-3 veces (pestaña, carga, extracción), para y explica; no entres en bucle.
- Borra SIEMPRE el CSV al acabar. Tono breve; reporta enviadas/saltadas con motivos.
