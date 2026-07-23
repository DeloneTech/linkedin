# LinkedIn leads extractor

/leads [nº, por defecto 28] [zona]
Rutina diaria de captación en Sales Navigator (logística, España). Extrae leads, elimina duplicados entre las dos cuentas y genera el Excel. No envía nada, eso se hace manualmente. Funciona con cualquiera de las dos cuentas (Daniel o Guillermo) e identifica cuál se ha utilizado.

/caballo [nº, por defecto 28]
Modelo "Caballo de Troya". Extrae leads de logística en Madrid agrupados por nombre de pila para que un único vídeo (ej. "Hola David, soy Guillermo…") sirva para todo el grupo. Optimiza para usar el menor número posible de nombres distintos. Solo funciona con la cuenta de Guillermo y prepara el Outbound Tracker.

Envío (embudo tradicional)

Orden del proceso: Invitación → E → F → G, con C como desvío para quienes responden.

/conectar [máx, por defecto 40]
Envía solicitudes de conexión sin nota a los leads a los que aún no se les ha enviado nada y marca "Enviada" en la hoja. Solo trabaja con leads extraídos desde esa misma cuenta.

/primermensaje (columna E)
Primer contacto para quienes aceptaron la invitación hace al menos 1 día. Utiliza la plantilla corta de Santino De Vita: agradecimiento + una pregunta sobre un problema relacionado con la empresa del lead (no con su biografía). Descarta perfiles que no sean del sector. Deja los mensajes preparados sin enviarlos; la columna E se marca cuando confirmas el envío.

/segundomensaje (columna F)
Seguimiento suave para quienes recibieron el primer mensaje hace al menos 2 días y no respondieron. Retoma la conversación aportando algo de valor o haciendo una segunda pregunta ligera, sin hacer todavía el pitch.

/sticker (columna G)
Primer seguimiento para quienes recibieron el segundo mensaje hace al menos 3 días y siguen sin responder. Envía únicamente el meme de Pablo Escobar "Estaré esperando tu respuesta", sin texto adicional.

/tercermensaje (columna C)
Oferta real, únicamente para quienes han mostrado interés respondiendo. Aquí se explica el sistema de operaciones a medida y se propone una demo junto con una calculadora de ahorro. Nunca se utiliza en frío ni se inventan clientes o resultados.

Seguimiento

/seguimiento
Lee la mensajería de Sales Navigator y actualiza la hoja de KPIs indicando en qué punto del embudo se encuentra cada lead (enviado/respondido). Solo actualiza la cuenta que esté activa.

/seguimiento-caballo
Versión para el modelo Caballo de Troya. Lee los mensajes de LinkedIn normal (no Sales Navigator) y mueve los leads entre las fases Initiate → Engaged → Calendly → Booked según el vídeo enviado, reacciones y respuestas. Solo disponible para la cuenta de Guillermo.

Contenido

/post [idea opcional]
Sin argumentos genera los tres posts del día: uno para Dani, uno para Guillermo y uno para la empresa. Si se indica una idea, construye el contenido alrededor de ella utilizando los documentos de estrategia y prompts maestros.

Importante

Antes de ejecutar cualquier acción, comprueba qué cuenta de LinkedIn está activa. En los flujos de Caballo de Troya debe detenerse si no está la cuenta correcta.
Se mantiene una separación estricta entre preparar acciones y enviarlas. Varias automatizaciones dejan el trabajo listo, pero el envío siempre se confirma manualmente por seguridad de la cuenta.
