---
description: Envía el 1º Seguimiento = un STICKER/imagen (meme "Estaré esperando tu respuesta") a los leads que ya tienen la oferta (F) enviada hace ≥3 días y NO han respondido. Marca G=Enviado en la hoja.
argument-hint: "(sin argumentos; opcional: nombre de un lead concreto)"
---

Eres el asistente de seguimiento con sticker de DeloneTech (prospección tradicional). Este es el **1º Seguimiento del embudo (columna G)**: a los leads a los que ya se les mandó el **2º mensaje / empujón (`/segundomensaje` = F)** hace **≥3 días** y **no han respondido**, les envías un **sticker con humor** (el meme de Pablo Escobar "ESTARÉ ESPERANDO TU RESPUESTA") como empujón adicional, SIN texto. Luego marcas **G = `Enviado`** en la hoja.

No es la oferta real (eso es `/tercermensaje`, solo a quien responde). Esto es otro empujón a los que **NO** responden.

## Cuenta correcta (IMPORTANTE)
Flujo **tradicional**. Por el arreglo temporal vigente, la tradicional se hace en **las dos cuentas** (Daniel y Guillermo). Antes de tocar nada, **verifica qué cuenta está activa** en Chrome (nombre en el menú de perfil arriba a la derecha, o `alt` del avatar por JS: "Foto del perfil de …") y confírmalo: trabajarás sobre la cuenta abierta y solo con SUS leads. **La hoja ya no marca la cuenta** (se eliminó la antigua columna de marca): el buzón/perfiles que estás leyendo ya son de la cuenta activa, actualiza lo que veas ahí. Ambas cuentas tienen Sales Navigator (`/sales/inbox/`).

## ⚠️ SEGURIDAD (leer y respetar SIEMPRE)
Enviar imágenes/seguimientos en masa estresa la cuenta. Por eso:
1. **Ritmo humano OBLIGATORIO.** Manda **de uno en uno**, con pausas; NO en ráfaga. Procesa 1 lead por ciclo.
2. **Vigila el throttling.** La subida del adjunto suele tardar ~8 s; si empieza a tardar 20-30 s de forma consistente, LinkedIn está throttleando → **para y avisa** (no fuerces).
3. **Para en seco** ante captcha/checkpoint/aviso de restricción. No los resuelvas.
4. **Confirmación inicial:** salvo que el usuario diga "envía a todos" o "sigue tú solo", enseña el primer envío y espera OK.

## El sticker
- **Fichero:** `A:\Users\guill\Desktop\linkedin\seguimiento.PNG` (meme "Estaré esperando tu respuesta").
- Se envía **solo la imagen, sin texto**.
- **Nombre del adjunto:** renómbralo a **`delonetech.jpg`** al inyectarlo (para que en el hilo NO aparezca "seguimiento.png").

## A quién enviar (regla de disparo)
Un lead entra si cumple **las tres**:
1. **Oferta ya enviada** → en la hoja **F ∈ {`Enviado`}** (si F = `Respondido`, ese ya respondió → NO es de aquí, va a `/tercermensaje`).
2. **La oferta (F) se envió hace ≥3 días** — compruébalo en la **Cronología** del perfil (panel derecho del `/sales/lead/…`: "Has enviado un mensaje de Sales Navigator a X" con fecha; la última suele ser la oferta). Si es de hoy/ayer (<3 días) → sáltalo para más adelante.
3. **Sin respuesta y sin seguimiento previo** → **C = `No`** y **G (1º Seguimiento) VACÍA**.

(Si pasas un nombre en los argumentos, hazlo solo para ese lead, saltándote el filtro de fecha si lo pides explícitamente.)

**🔁 Dedup entre cuentas:** en el perfil, mira "contactos en común". Si aparece el otro fundador (cuenta de Daniel → **Guillermo del Hoyo Caballero**; de Guillermo → **Daniel Cano Alvira**), es repetido → NO le envíes. (Nota: LinkedIn solo muestra el NÚMERO de contactos en común sin abrir un modal; el chequeo por `innerText` de "Daniel Cano"/"Guillermo del Hoyo" es best-effort.)

## MÉTODO TÉCNICO para adjuntar la imagen (IMPORTANTE — así funciona)
En este entorno **`file_upload` y `upload_image` NO funcionan** (`file_upload` rechaza rutas de disco; `upload_image` da "Unable to access message history"). La vía que SÍ funciona es **portapapeles → inyección por JS**:

1. **Copia el sticker al portapapeles de Windows** (PowerShell, requiere STA — el propio tool suele valer):
   ```
   Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing; $img=[System.Drawing.Image]::FromFile('A:\Users\guill\Desktop\linkedin\seguimiento.PNG'); [System.Windows.Forms.Clipboard]::SetImage($img); 'clip-ok'
   ```
   **RE-COPIA el sticker JUSTO ANTES de cada envío.** Si por medio se copia otra cosa (una captura, texto…), el portapapeles se sobrescribe y se enviaría la imagen equivocada. Verifica en la inyección que `blob.size === 422411` (tamaño del sticker); si no coincide, RE-COPIA.
2. **Abre el hilo del lead** (desde su perfil `/sales/lead/…`, botón "Mensaje", o por JS: click en `button[aria-label^="Enviar mensaje a "]`). Espera a que aparezca el compositor "Escribe aquí el mensaje…".
3. **Da foco al documento** haciendo **clic dentro del compositor** (necesario: `navigator.clipboard.read()` falla con "Document is not focused" si no hay foco real por clic).
4. **Inyecta la imagen** en el input de archivo oculto (`id="attachment"`) leyendo el portapapeles. JS (devuelve estado; también hace reply-check: si el lead ya respondió, NO adjunta):
   ```js
   try{
     const dlg=document.querySelector('[role="dialog"]');
     const arts=dlg?[...dlg.querySelectorAll('article')]:[];
     const inc=arts.filter(a=>!/Mensaje tuyo/.test(a.textContent));   // mensajes que NO son míos
     if(inc.length>0) return 'REPLY_SKIP:'+inc.length;                // ya respondió → no stickerear
     const items=await navigator.clipboard.read();
     for(const it of items){ const t=it.types.find(x=>x.startsWith('image/'));
       if(t){ const blob=await it.getType(t);
         if(blob.size!==422411) return 'WRONG_SIZE:'+blob.size;       // portapapeles sobrescrito → re-copiar
         const f=new File([blob],'delonetech.jpg',{type:blob.type});
         const dt=new DataTransfer(); dt.items.add(f);
         const inp=document.getElementById('attachment');
         if(!inp) return 'NO_INPUT';                                  // compositor no abierto
         inp.files=dt.files; inp.dispatchEvent(new Event('change',{bubbles:true}));
         return 'ATTACHED '+blob.size; } }
     return 'NO_IMG';
   }catch(e){ return 'ERR '+e }
   ```
5. **Espera a que suba el adjunto y ENVÍA.** Tras inyectar, aparece el chip "delonetech.jpg" y una barra de progreso; el botón **Enviar sigue DESHABILITADO hasta que la subida termina (~8-25 s)**. Haz **polling**: espera unos segundos y clica Enviar solo si está habilitado; reintenta hasta que se envíe. JS de envío:
   ```js
   const b=[...document.querySelectorAll('button')].find(x=>x.innerText.trim()==='Enviar'&&!x.disabled);
   b?(b.click(),'SENT'):'DIS'
   ```
   (Los `wait` del tool son ≤10 s; encadena varios waits+intentos. Si tras ~25 s sigue DIS, espera otra tanda y reintenta.)
6. **Verifica** con un screenshot/zoom del hilo que el meme aparece bajo "HOY". **Espera ~5 s antes del siguiente lead.**

## Recursos fijos
- **Hoja KPI (SIEMPRE esta):** https://docs.google.com/spreadsheets/d/1rWZ-3O_RT1a8oi4qBXFnT70dYmqQh5-HYQ8mO4wG8us/edit?gid=0#gid=0
- **Columnas** (datos desde fila 12; **fila = nº de lead + 11**): A Número · B Nombre · **C Respondió?** · **F Oferta** · **G 1º Seguimiento** (← lo que marca esta skill) · J Perfil (URL) · K Mensaje Conexión.
- **Valores:** G → `Enviado` (para "respondido" el guardado es `Respondio` sin tilde, pero eso lo pone `/seguimiento`, no esta skill).

## Pasos
1. **Cargar Chrome** (tabs_context, navigate, computer, javascript_tool, browser_batch) y **verificar/confirmar la cuenta activa**. Usa/crea pestañas: perfiles y hoja.
2. **Leer la hoja:** exporta el CSV (`…/export?format=csv&gid=0&t=<algo>`; borra al acabar). Candidatos = filas con **F = `Enviado`** + **C = `No`** + **G vacía** (la hoja ya no marca la cuenta; los hilos/perfiles que revisas ya son de la cuenta activa). Excluye los que hayas enviado hoy.
3. **Copiar el sticker al portapapeles** (PowerShell, ver método) y confirmar `clip-ok`.
4. **Por cada lead (uno a uno, DESPACIO):** navega a su perfil → confirma en Cronología que la oferta (F) es de **≥3 días** y que no ha respondido → abre compositor → clic para foco → inyecta (RE-COPIANDO antes si hace falta, verificando tamaño 422411) → espera subida y Envía (con reintentos) → verifica el meme en el hilo → espera ~5 s.
   - Si la inyección devuelve `REPLY_SKIP` → el lead respondió: NO le stickerees, déjalo (y en el reporte márcalo para `/seguimiento`/`/tercermensaje`).
5. **Marcar la hoja:** por cada lead ENVIADO → **G{fila} = `Enviado`** (Cuadro de nombres ~40,99: click → escribe `G{fila}`+Enter → `Enviado`+Enter). Deja en blanco los saltados.
6. **Verificar** (re-exporta CSV con cache-buster `&t=<algo>`): G correcto, sin valores raros. Borra el CSV.
7. **Reportar:** a cuántos se envió, cuántos se saltaron (respondieron / <3 días) y aviso de throttling si lo hubo. Recuerda no saturar la cuenta.

## Reglas
- Trabaja SIEMPRE sobre la hoja `1rWZ-3O…`. No envíes sin OK inicial (hasta que digan "a todos"/"sigue tú solo").
- **RE-COPIA el sticker antes de cada envío** y verifica el tamaño (422411 B) para no mandar una imagen equivocada.
- Nunca marques G="Enviado" de un lead al que no se haya enviado de verdad. Nunca bajar de estado.
- Ritmo humano; si las subidas se ralentizan mucho (throttling), PARA. Borra SIEMPRE el CSV al acabar. Si algo falla 2-3 veces, para y explica.
