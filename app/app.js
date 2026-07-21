/* ===== DeloneTech · App ===== */
(function () {
  "use strict";
  var euro = function (n) { return Math.round(n).toLocaleString("es-ES"); };
  var num = function (n) { return Math.round(n).toLocaleString("es-ES"); };

  /* ---------- Cambio de vista (tabs) ---------- */
  document.querySelectorAll(".tab").forEach(function (t) {
    t.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (x) { x.classList.remove("is-active"); });
      t.classList.add("is-active");
      document.querySelectorAll(".view").forEach(function (v) { v.classList.remove("is-active"); });
      document.getElementById("view-" + t.dataset.view).classList.add("is-active");
      if (t.dataset.view === "demo") startDemo();
    });
  });

  /* ==================================================
     CALCULADORA DE AHORRO
  ================================================== */
  var HORAS_DIA = 8, DIAS_MES = 22;
  var reduccion = 0.45; // nivel automatización
  var ambExtra = { 0.30: 0.30, 0.45: 0.40, 0.60: 0.50 }; // % expediciones extra según nivel

  var el = {
    exp: document.getElementById("i_exp"), admin: document.getElementById("i_admin"),
    manual: document.getElementById("i_manual"), coste: document.getElementById("i_coste"),
    dias: document.getElementById("i_dias"), ticket: document.getElementById("i_ticket"),
    fuel: document.getElementById("i_fuel")
  };
  var out = {
    exp: document.getElementById("o_exp"), admin: document.getElementById("o_admin"),
    manual: document.getElementById("o_manual"), coste: document.getElementById("o_coste"),
    dias: document.getElementById("o_dias"), ticket: document.getElementById("o_ticket"),
    fuel: document.getElementById("o_fuel")
  };

  function fillTrack(input) {
    var p = (input.value - input.min) / (input.max - input.min) * 100;
    input.style.setProperty("--p", p + "%");
  }

  // contador animado (con fallback anti-throttle: si rAF se congela en 2º plano, forzamos el valor final)
  function animate(id, to, suffix, dur) {
    var node = document.getElementById(id);
    var from = parseFloat((node.textContent || "0").replace(/\./g, "").replace(/[^\d-]/g, "")) || 0;
    var start = null; dur = dur || 650;
    var done = false;
    function finish() { if (!done) { done = true; node.textContent = num(to) + (suffix || ""); } }
    function step(ts) {
      if (done) return;
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      node.textContent = num(from + (to - from) * e) + (suffix || "");
      if (p < 1) requestAnimationFrame(step); else finish();
    }
    requestAnimationFrame(step);
    setTimeout(finish, dur + 80); // garantiza el valor final aunque rAF esté throttled
  }

  var MARGEN = 0.12;   // margen sobre el importe de expedición (para el margen por más capacidad)
  var ERR_REC = 0.015; // % de facturación recuperada por menos errores/albaranes perdidos
  var FUEL_RED = 0.15; // % de ahorro en combustible por optimización de rutas
  var TIPO_FIN = 0.06; // coste financiero anual del dinero pendiente de cobro

  function calc() {
    var exp = +el.exp.value, admin = +el.admin.value, manual = +el.manual.value / 100,
        coste = +el.coste.value, dias = +el.dias.value, ticket = +el.ticket.value, fuel = +el.fuel.value;

    // etiquetas
    out.exp.textContent = num(exp);
    out.admin.textContent = admin;
    out.manual.textContent = (manual * 100).toFixed(0) + "%";
    out.coste.textContent = num(coste) + " €";
    out.dias.textContent = dias;
    out.ticket.textContent = num(ticket) + " €";
    out.fuel.textContent = num(fuel) + " €";

    // --- operativa base ---
    var horasManualesMes = admin * HORAS_DIA * DIAS_MES * manual;
    var horasAhorradas = horasManualesMes * reduccion;
    var costeHora = coste / (HORAS_DIA * DIAS_MES);
    var expExtra = exp * ambExtra[reduccion];
    var diasAntes = Math.min(15, Math.round(dias * 0.33));
    var docs = Math.round(exp * 1.4);
    var facturacionMes = exp * ticket;

    // --- componentes de impacto (mensuales, salvo el financiero que es anual) ---
    var mAdmin = horasAhorradas * costeHora;              // menos trabajo administrativo
    var mCap = expExtra * ticket * MARGEN;               // margen por mover más sin contratar
    var mErr = facturacionMes * ERR_REC;                 // menos errores / albaranes perdidos
    var mFuel = fuel * FUEL_RED;                          // rutas y combustible
    var aFin = facturacionMes * 12 * (diasAntes / 365) * TIPO_FIN; // cobrar antes (anual)

    var totalAnio = (mAdmin + mCap + mErr + mFuel) * 12 + aFin;
    var totalMes = totalAnio / 12;
    var personas = horasAhorradas / (HORAS_DIA * DIAS_MES);

    // --- pintar ---
    animate("r_year", totalAnio, "");
    animate("r_month", totalMes, "");
    animate("r_cost", totalAnio * 3, ""); // coste de seguir igual a 3 años vista
    document.getElementById("r_personas").textContent = personas.toFixed(1).replace(".", ",");

    animate("b_admin", mAdmin * 12, " €");
    animate("b_cap", mCap * 12, " €");
    animate("b_err", mErr * 12, " €");
    animate("b_fuel", mFuel * 12, " €");
    animate("b_fin", aFin, " €");

    animate("r_hours", horasAhorradas, "");
    animate("r_extra", expExtra, "");
    document.getElementById("r_cobro").textContent = diasAntes;
    animate("r_docs", docs, "");

    // gráfico barras (horas admin: hoy vs con delone)
    var maxH = Math.max(horasManualesMes, 1);
    document.getElementById("bar_now").style.height = "100%";
    document.getElementById("bar_del").style.height = ((horasManualesMes - horasAhorradas) / maxH * 100) + "%";
    document.getElementById("cap_now").textContent = num(horasManualesMes) + " h";
    document.getElementById("cap_del").textContent = num(horasManualesMes - horasAhorradas) + " h";
  }

  Object.values(el).forEach(function (input) {
    fillTrack(input);
    input.addEventListener("input", function () { fillTrack(input); calc(); });
  });
  document.querySelectorAll("#seg_auto button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("#seg_auto button").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on"); reduccion = +b.dataset.r; calc();
    });
  });
  calc();

  /* ==================================================
     DEMO DEL SOFTWARE
  ================================================== */
  var demoStarted = false, demoTimer = null;
  var CLIENTES = ["Cibeles Logistics","DUPLA Logistics","MACAR Transportes","Truck One","INNOVATRANS","Grupo AMYGO","Transgesa","World Pack","Asenga Logística","SEALOG"];
  var CIUDADES = ["Madrid","Guadalajara","Toledo","Alcalá","Getafe","Móstoles","Coslada","Valencia","Zaragoza","Sevilla"];
  var CONDUCTORES = ["J. Ramírez","M. Ortega","L. Fdez","A. Soto","P. Gil","R. Nieto","C. Vera"];
  var ESTADOS = [
    { t: "En ruta", c: "ruta" }, { t: "Entregada", c: "ok" },
    { t: "En reparto", c: "wait" }, { t: "Incidencia", c: "inc" }
  ];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function code() { return "EXP-" + (24000 + Math.floor(Math.random() * 900)); }
  function eta() { var h = 10 + Math.floor(Math.random() * 8); var m = pick(["00","15","30","45"]); return h + ":" + m; }

  function row(full) {
    var e = pick(ESTADOS);
    var c = "<td>" + code() + "</td><td>" + pick(CLIENTES) + "</td>";
    if (full) c += "<td>" + pick(CIUDADES) + " → " + pick(CIUDADES) + "</td><td>" + pick(CONDUCTORES) + "</td><td>" + eta() + "</td>";
    else c += "<td>" + pick(CIUDADES) + "</td><td>" + pick(CONDUCTORES) + "</td>";
    c += '<td><span class="badge badge--' + e.c + '">' + e.t + "</span></td>";
    return c;
  }

  function fillTable(id, n, full) {
    var tb = document.querySelector("#" + id + " tbody");
    tb.innerHTML = "";
    for (var i = 0; i < n; i++) { var tr = document.createElement("tr"); tr.innerHTML = row(full); tb.appendChild(tr); }
  }

  // ---- mapa de Madrid (Leaflet) ----
  var mapInited = false, gmap = null;
  function initMap() {
    if (typeof L === "undefined") return;
    if (mapInited) { setTimeout(function () { if (gmap) gmap.invalidateSize(); }, 90); return; }
    mapInited = true;
    gmap = L.map("map", { zoomControl: true, attributionControl: true, scrollWheelZoom: false })
      .setView([40.42, -3.70], 11);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", maxZoom: 19, attribution: "© OpenStreetMap · © CARTO" }).addTo(gmap);
    function veh(lat, lng, cls, label) {
      L.marker([lat, lng], { icon: L.divIcon({ className: "", html: '<span class="mkr ' + cls + '"></span>', iconSize: [13, 13], iconAnchor: [6, 6] }) })
        .addTo(gmap).bindTooltip(label, { direction: "top", offset: [0, -6] });
    }
    // base
    L.marker([40.4168, -3.7038], { interactive: false, icon: L.divIcon({ className: "", html: '<span class="map__hub">◉ Base Madrid</span>', iconSize: [90, 16], iconAnchor: [45, 8] }) }).addTo(gmap);
    // vehículos por el área metropolitana
    veh(40.3057, -3.7329, "mkr--ruta", "2847-KLM · Getafe → Toledo");
    veh(40.4520, -3.6050, "mkr--ruta", "6120-BTR · M-40");
    veh(40.4818, -3.3643, "mkr--ruta", "7788-QRS · Corredor Henares");
    veh(40.2860, -3.7960, "mkr--stop", "4471-PLK · descanso conductor");
    veh(40.4300, -3.7150, "mkr--load", "9034-JHG · cargando en base");
    veh(40.5470, -3.6420, "mkr--ruta", "1290-DTR · S.S. de los Reyes");
    veh(40.2100, -3.8600, "mkr--ruta", "3055-FGH → Toledo");
    setTimeout(function () { gmap.invalidateSize(); }, 130);
  }

  function startDemo() {
    if (demoStarted) return; demoStarted = true;
    fillTable("tbl_live", 6, false);
    fillTable("tbl_full", 9, true);
    // barra facturación
    var af = document.getElementById("auto_fact"), ab = document.getElementById("auto_bar");
    var target = 62, cur = 0;
    (function up() { if (cur <= target) { af.textContent = cur; ab.style.width = (cur / 90 * 100) + "%"; cur += 2; setTimeout(up, 30); } })();

    // navegación sidebar
    document.querySelectorAll(".nav").forEach(function (nv) {
      nv.addEventListener("click", function () {
        document.querySelectorAll(".nav").forEach(function (x) { x.classList.remove("is-active"); });
        nv.classList.add("is-active");
        document.querySelectorAll(".pane").forEach(function (p) { p.classList.remove("is-active"); });
        document.getElementById("p-" + nv.dataset.panel).classList.add("is-active");
        if (nv.dataset.panel === "mapa") initMap();
      });
    });

    // "tiempo real": cada 2,2s refresca una fila del panel + mueve KPIs
    demoTimer = setInterval(function () {
      var tb = document.querySelector("#tbl_live tbody");
      var tr = document.createElement("tr"); tr.innerHTML = row(false); tr.classList.add("flash");
      tb.insertBefore(tr, tb.firstChild);
      if (tb.children.length > 6) tb.removeChild(tb.lastChild);
      setTimeout(function () { tr.classList.remove("flash"); }, 900);
      // mover KPIs suavemente
      var kh = document.getElementById("k_hoy"), kr = document.getElementById("k_ruta"), ke = document.getElementById("k_ent");
      kh.textContent = +kh.textContent + 1;
      kr.textContent = Math.max(20, +kr.textContent + (Math.random() < .5 ? 1 : -1));
      ke.textContent = +ke.textContent + (Math.random() < .6 ? 1 : 0);
    }, 2200);
  }
  // por si el usuario abre directamente la pestaña demo
  document.addEventListener("visibilitychange", function () {});
})();
