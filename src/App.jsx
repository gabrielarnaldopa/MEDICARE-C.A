import React, { useState, useRef, useEffect } from "react";
import {
  Activity, LayoutDashboard, MessageSquare, Package, Users, FileText, Settings,
  Send, Phone, MapPin, Bot, Search, Plus, TrendingUp, Clock, CheckCheck,
  UserCheck, Pause, Sparkles, Building2, ShoppingCart, X
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

/* ------------------------------- DATOS DEMO ------------------------------- */

const VENDEDORES = [
  { id: 1, nombre: "María Fernández", zona: "Caracas Este", municipios: ["Chacao", "Baruta", "El Hatillo"], tel: "+58 414-1112233", activos: 4, estado: "disponible" },
  { id: 2, nombre: "Carlos Mendoza", zona: "Caracas Oeste", municipios: ["Libertador", "Catia", "El Valle"], tel: "+58 412-2223344", activos: 2, estado: "disponible" },
  { id: 3, nombre: "Ana Rodríguez", zona: "Caracas Sureste", municipios: ["Sucre", "Petare", "Filas de Mariche"], tel: "+58 424-3334455", activos: 5, estado: "ocupado" },
  { id: 4, nombre: "José Pérez", zona: "Valencia / Carabobo", municipios: ["Valencia", "Naguanagua", "San Diego"], tel: "+58 416-4445566", activos: 3, estado: "disponible" },
  { id: 5, nombre: "Luisa Gómez", zona: "Maracay / Aragua", municipios: ["Girardot", "Mario B. Iragorry", "Santiago Mariño"], tel: "+58 426-5556677", activos: 1, estado: "disponible" },
];

const INVENTARIO_INICIAL = [
  { sku: "MOV-001", nombre: "Silla de ruedas estándar", cat: "Movilidad", precio: 120, stock: 14 },
  { sku: "MOV-002", nombre: "Andador plegable de aluminio", cat: "Movilidad", precio: 55, stock: 9 },
  { sku: "MOV-003", nombre: "Bastón ortopédico ajustable", cat: "Movilidad", precio: 15, stock: 40 },
  { sku: "DIA-001", nombre: "Tensiómetro digital de brazo", cat: "Diagnóstico", precio: 35, stock: 22 },
  { sku: "DIA-002", nombre: "Oxímetro de pulso", cat: "Diagnóstico", precio: 18, stock: 6 },
  { sku: "DIA-003", nombre: "Glucómetro + 50 tiras", cat: "Diagnóstico", precio: 28, stock: 17 },
  { sku: "DIA-004", nombre: "Termómetro infrarrojo", cat: "Diagnóstico", precio: 22, stock: 0 },
  { sku: "RES-001", nombre: "Nebulizador ultrasónico", cat: "Respiratorio", precio: 42, stock: 11 },
  { sku: "RES-002", nombre: "Concentrador de oxígeno 5L", cat: "Respiratorio", precio: 650, stock: 4 },
  { sku: "RES-003", nombre: "Aspirador de secreciones", cat: "Respiratorio", precio: 130, stock: 5 },
  { sku: "MOB-001", nombre: "Cama clínica manual 3 movimientos", cat: "Mobiliario clínico", precio: 480, stock: 3 },
  { sku: "MOB-002", nombre: "Colchón antiescaras", cat: "Mobiliario clínico", precio: 95, stock: 8 },
];

const COTIZACIONES = [
  { id: "1042", cliente: "Inversiones La Salud, C.A", fecha: "15/06/2026", items: 3, total: 1680, estado: "Enviada", vendedor: "Luisa Gómez" },
  { id: "1041", cliente: "Carmen Salazar", fecha: "15/06/2026", items: 1, total: 120, estado: "Aceptada", vendedor: "María Fernández" },
  { id: "1040", cliente: "Clínica Santa Rosa", fecha: "14/06/2026", items: 5, total: 3250, estado: "Pendiente", vendedor: "José Pérez" },
  { id: "1039", cliente: "Roberto Díaz", fecha: "14/06/2026", items: 2, total: 692, estado: "Enviada", vendedor: "—" },
  { id: "1038", cliente: "Pedro Morales", fecha: "13/06/2026", items: 1, total: 28, estado: "Aceptada", vendedor: "Ana Rodríguez" },
];

const CONV_INICIAL = [
  {
    id: 1, nombre: "Carmen Salazar", tel: "+58 414-1234567", zona: "Caracas Este",
    vendedor: "María Fernández", hora: "2:14 p. m.",
    mensajes: [
      { de: "cliente", texto: "Buenas tardes, necesito información sobre sillas de ruedas", hora: "2:08 p. m." },
      { de: "bot", texto: "¡Hola! 😊 Bienvenida a MEDICARE. Soy Sofía, con gusto la ayudo. Tenemos varios modelos de sillas de ruedas. ¿Sería para uso en casa, para traslados frecuentes, o ambos?", hora: "2:08 p. m." },
      { de: "cliente", texto: "Para mi mamá, la usaría en casa principalmente", hora: "2:10 p. m." },
      { de: "bot", texto: "Perfecto. Para uso en casa le recomiendo nuestra Silla de ruedas estándar, cómoda y resistente, en $120. ¿En qué zona se encuentra para asignarle un asesor que coordine la entrega?", hora: "2:11 p. m." },
      { de: "cliente", texto: "Estoy en Chacao", hora: "2:13 p. m." },
      { de: "sistema", texto: "Sofía detectó la zona Caracas Este y asignó la conversación a María Fernández", hora: "2:14 p. m." },
      { de: "bot", texto: "¡Excelente! La pongo en contacto con María Fernández, asesora de la zona Caracas Este. Ella le dará los detalles de entrega y formas de pago. Un momento por favor 🙌", hora: "2:14 p. m." },
    ],
  },
  {
    id: 2, nombre: "Roberto Díaz", tel: "+58 412-9876543", zona: null,
    vendedor: null, hora: "1:52 p. m.",
    mensajes: [
      { de: "cliente", texto: "Hola, cuánto cuesta un concentrador de oxígeno?", hora: "1:49 p. m." },
      { de: "bot", texto: "¡Hola! Soy Sofía de MEDICARE 👋 Tenemos el Concentrador de oxígeno 5L en $650, ideal para uso domiciliario continuo. ¿Es para un paciente en casa? Así le confirmo disponibilidad y entrega.", hora: "1:50 p. m." },
      { de: "cliente", texto: "Sí, para mi papá. Necesito 2 unidades", hora: "1:52 p. m." },
      { de: "bot", texto: "Entendido, 2 unidades del Concentrador 5L serían $1.300. Para coordinar la entrega, ¿me indica en qué ciudad o municipio se encuentra?", hora: "1:52 p. m." },
    ],
  },
  {
    id: 3, nombre: "Inversiones La Salud, C.A", tel: "+58 424-5551212", zona: "Maracay / Aragua",
    vendedor: "Luisa Gómez", hora: "12:30 p. m.",
    mensajes: [
      { de: "cliente", texto: "Buenos días, somos una clínica en Maracay. Necesitamos cotizar camas clínicas", hora: "12:20 p. m." },
      { de: "bot", texto: "¡Buenos días! Con gusto. ¿Cuántas unidades necesitan y qué tipo de cama? Manejamos la Cama clínica manual 3 movimientos en $480 c/u.", hora: "12:21 p. m." },
      { de: "cliente", texto: "3 camas manuales y 1 colchón antiescaras", hora: "12:25 p. m." },
      { de: "sistema", texto: "Sofía generó la cotización #1042 por $1.680", hora: "12:28 p. m." },
      { de: "bot", texto: "Listo ✅ Le preparé la cotización #1042:\n• 3x Cama clínica manual — $1.440\n• 1x Colchón antiescaras — $95\nTotal estimado: $1.535 + envío. Los conecto con Luisa Gómez, asesora de Aragua, para condiciones por volumen.", hora: "12:30 p. m." },
    ],
  },
  {
    id: 4, nombre: "Pedro Morales", tel: "+58 416-3334455", zona: "Caracas Sureste",
    vendedor: "Ana Rodríguez", hora: "11:05 a. m.",
    mensajes: [
      { de: "cliente", texto: "Necesito un glucómetro urgente", hora: "10:58 a. m." },
      { de: "bot", texto: "¡Hola! Tenemos el Glucómetro + 50 tiras en $28. ¿Le indico la zona para coordinar entrega?", hora: "10:59 a. m." },
      { de: "cliente", texto: "Petare. Pero tengo unas dudas sobre las tiras compatibles", hora: "11:02 a. m." },
      { de: "sistema", texto: "Ana Rodríguez tomó el control de la conversación. Sofía está en pausa.", hora: "11:05 a. m." },
      { de: "agente", texto: "Hola Pedro, soy Ana de MEDICARE. Las tiras del kit son las originales de la marca y vienen incluidas. ¿Le gustaría que le lleve unas adicionales?", hora: "11:05 a. m." },
    ],
  },
  {
    id: 5, nombre: "Lucía Herrera", tel: "+58 414-7778899", zona: null,
    vendedor: null, hora: "10:40 a. m.",
    mensajes: [
      { de: "cliente", texto: "Hola buenas, tienen nebulizadores para niños?", hora: "10:39 a. m." },
      { de: "bot", texto: "¡Hola! 😊 Sí, contamos con el Nebulizador ultrasónico en $42, silencioso y muy práctico para niños. ¿Es para uso en casa?", hora: "10:40 a. m." },
    ],
  },
];

const DATOS_ZONA = [
  { zona: "Caracas Este", conversaciones: 14 },
  { zona: "Caracas Oeste", conversaciones: 9 },
  { zona: "C. Sureste", conversaciones: 11 },
  { zona: "Valencia", conversaciones: 7 },
  { zona: "Maracay", conversaciones: 6 },
];

const ACTIVIDAD = [
  { icon: UserCheck, txt: "Sofía asignó a Carmen Salazar → María Fernández (Caracas Este)", t: "hace 5 min", color: "text-emerald-600" },
  { icon: FileText, txt: "Nueva cotización #1042 generada (Inversiones La Salud)", t: "hace 22 min", color: "text-blue-600" },
  { icon: Pause, txt: "Ana Rodríguez intervino el chat con Pedro Morales", t: "hace 1 h", color: "text-amber-600" },
  { icon: ShoppingCart, txt: "Consulta de inventario respondida: Concentrador de O₂", t: "hace 1 h", color: "text-slate-500" },
  { icon: MessageSquare, txt: "Nuevo lead entrante: Lucía Herrera (Baruta)", t: "hace 2 h", color: "text-emerald-600" },
];

/* ----------------------------- COMPONENTES UI ----------------------------- */

const inicialesDe = (n) => n.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

function Avatar({ nombre, color = "bg-slate-200 text-slate-600" }) {
  return (
    <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold ${color}`}>
      {inicialesDe(nombre)}
    </div>
  );
}

function Badge({ children, tono }) {
  const map = {
    verde: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    azul: "bg-blue-50 text-blue-700 ring-blue-600/20",
    ambar: "bg-amber-50 text-amber-700 ring-amber-600/20",
    rojo: "bg-red-50 text-red-700 ring-red-600/20",
    gris: "bg-slate-100 text-slate-600 ring-slate-500/20",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${map[tono]}`}>{children}</span>;
}

function KpiCard({ icon: Icon, label, valor, sub, tono }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${tono}`}><Icon size={18} /></div>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{valor}</div>
      {sub && <div className="mt-1 text-xs font-medium text-emerald-600">{sub}</div>}
    </div>
  );
}

/* --------------------------------- APP ------------------------------------ */

export default function App() {
  const [vista, setVista] = useState("conversaciones");
  const [conversaciones, setConversaciones] = useState(CONV_INICIAL);
  const [convActivaId, setConvActivaId] = useState(1);
  const [intervenidas, setIntervenidas] = useState({ 4: true });
  const [texto, setTexto] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [inventario, setInventario] = useState(INVENTARIO_INICIAL);
  const [busqInv, setBusqInv] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevo, setNuevo] = useState({ nombre: "", cat: "Movilidad", precio: "", stock: "" });
  const [cfg, setCfg] = useState({ nombre: "Sofía", tono: "Cercano y amable", autoresp: true, autoasign: true, escalar: 3, bienvenida: "¡Hola! 😊 Soy Sofía, tu asistente de MEDICARE. ¿En qué puedo ayudarte hoy?" });
  const [guardado, setGuardado] = useState(false);

  const finRef = useRef(null);
  const convActiva = conversaciones.find((c) => c.id === convActivaId);
  const estaIntervenida = !!intervenidas[convActivaId];

  useEffect(() => { finRef.current?.scrollIntoView({ behavior: "smooth" }); }, [convActiva?.mensajes.length, convActivaId]);

  const horaActual = () => new Date().toLocaleTimeString("es-VE", { hour: "numeric", minute: "2-digit", hour12: true });

  const estadoConv = (c) => {
    if (intervenidas[c.id]) return { label: "Atendida por ti", tono: "ambar" };
    if (c.vendedor) return { label: c.vendedor, tono: "azul" };
    return { label: "Sofía atendiendo", tono: "verde" };
  };

  const enviar = () => {
    if (!texto.trim()) return;
    setConversaciones((prev) => prev.map((c) => c.id === convActivaId
      ? { ...c, mensajes: [...c.mensajes, { de: "agente", texto, hora: horaActual() }] } : c));
    setTexto("");
  };

  const intervenir = () => {
    const activar = !estaIntervenida;
    setIntervenidas((p) => ({ ...p, [convActivaId]: activar }));
    setConversaciones((prev) => prev.map((c) => c.id === convActivaId
      ? { ...c, mensajes: [...c.mensajes, { de: "sistema", texto: activar ? "Tomaste el control de la conversación. Sofía está en pausa." : "Devolviste la conversación a Sofía. Respuesta automática reactivada.", hora: horaActual() }] }
      : c));
  };

  const agregarProducto = () => {
    if (!nuevo.nombre.trim()) return;
    const pref = { Movilidad: "MOV", Diagnóstico: "DIA", Respiratorio: "RES", "Mobiliario clínico": "MOB" }[nuevo.cat];
    setInventario((p) => [...p, { sku: `${pref}-${String(p.length + 1).padStart(3, "0")}`, nombre: nuevo.nombre, cat: nuevo.cat, precio: Number(nuevo.precio) || 0, stock: Number(nuevo.stock) || 0 }]);
    setNuevo({ nombre: "", cat: "Movilidad", precio: "", stock: "" });
    setMostrarForm(false);
  };

  const guardarCfg = () => { setGuardado(true); setTimeout(() => setGuardado(false), 2200); };

  const NAV = [
    { id: "resumen", label: "Resumen", icon: LayoutDashboard },
    { id: "conversaciones", label: "Conversaciones", icon: MessageSquare },
    { id: "inventario", label: "Inventario", icon: Package },
    { id: "vendedores", label: "Vendedores y zonas", icon: Users },
    { id: "cotizaciones", label: "Cotizaciones", icon: FileText },
    { id: "configuracion", label: "Configuración del bot", icon: Settings },
  ];

  const titulos = {
    resumen: ["Resumen", "Vista general de la actividad del bot"],
    conversaciones: ["Conversaciones", "Chats de WhatsApp atendidos por Sofía"],
    inventario: ["Inventario", "Productos disponibles para responder y cotizar"],
    vendedores: ["Vendedores y zonas", "Asignación automática por cercanía"],
    cotizaciones: ["Cotizaciones", "Cotizaciones generadas desde el chat"],
    configuracion: ["Configuración del bot", "Personalidad y reglas de Sofía"],
  };

  const convFiltradas = conversaciones.filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  const invFiltrado = inventario.filter((p) => p.nombre.toLowerCase().includes(busqInv.toLowerCase()));

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-slate-900 text-slate-300">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
          <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white"><Activity size={20} /></div>
          <div>
            <div className="text-base font-bold tracking-tight text-white leading-none">MEDICARE</div>
            <div className="text-xs text-slate-400 mt-0.5">C.A · Equipos médicos</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((n) => {
            const activo = vista === n.id;
            return (
              <button key={n.id} onClick={() => setVista(n.id)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${activo ? "bg-emerald-500 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
                <n.icon size={18} />{n.label}
              </button>
            );
          })}
        </nav>
        <div className="m-3 rounded-xl bg-slate-800 p-4">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-emerald-400" />
            <span className="text-sm font-semibold text-white">Sofía</span>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> En línea
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">Asistente de ventas conectado a WhatsApp vía n8n.</p>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="shrink-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">{titulos[vista][0]}</h1>
            <p className="text-sm text-slate-500">{titulos[vista][1]}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Bot activo
            </span>
            <Avatar nombre="Admin Medicare" color="bg-slate-800 text-white" />
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {/* ----- CONVERSACIONES ----- */}
          {vista === "conversaciones" && (
            <div className="flex h-full">
              {/* lista */}
              <div className="w-80 shrink-0 border-r border-slate-200 bg-white flex flex-col">
                <div className="p-3 border-b border-slate-100">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar conversación"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:bg-white" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {convFiltradas.map((c) => {
                    const est = estadoConv(c);
                    const activa = c.id === convActivaId;
                    const ultimo = c.mensajes[c.mensajes.length - 1];
                    return (
                      <button key={c.id} onClick={() => setConvActivaId(c.id)}
                        className={`w-full text-left px-3 py-3 border-b border-slate-50 flex gap-3 transition-colors ${activa ? "bg-emerald-50" : "hover:bg-slate-50"}`}>
                        <Avatar nombre={c.nombre} color={c.nombre.includes("C.A") ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-slate-900">{c.nombre}</span>
                            <span className="shrink-0 text-xs text-slate-400">{c.hora}</span>
                          </div>
                          <p className="truncate text-xs text-slate-500 mt-0.5">{ultimo.de === "cliente" ? "" : "Tú: "}{ultimo.texto}</p>
                          <div className="mt-1.5"><Badge tono={est.tono}>{est.label}</Badge></div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* hilo */}
              {convActiva && (
                <div className="flex-1 flex flex-col bg-stone-100">
                  <div className="shrink-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar nombre={convActiva.nombre} color={convActiva.nombre.includes("C.A") ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{convActiva.nombre}</span>
                          {convActiva.nombre.includes("C.A") && <Building2 size={14} className="text-blue-500" />}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Phone size={11} /> {convActiva.tel}
                          {convActiva.zona && <><span className="mx-1">·</span><MapPin size={11} /> {convActiva.zona}</>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {convActiva.vendedor
                        ? <div className="text-xs text-slate-400">Asignado a</div>
                        : <div className="text-xs text-slate-400">Asignación</div>}
                      <div className="text-sm font-semibold text-slate-700">{convActiva.vendedor || "Pendiente"}</div>
                    </div>
                  </div>

                  {/* mensajes */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                    {convActiva.mensajes.map((m, i) => {
                      if (m.de === "sistema") return (
                        <div key={i} className="flex justify-center my-3">
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700 ring-1 ring-inset ring-amber-600/20 text-center max-w-md">{m.texto}</span>
                        </div>
                      );
                      const propio = m.de === "bot" || m.de === "agente";
                      return (
                        <div key={i} className={`flex ${propio ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-md rounded-2xl px-3.5 py-2 text-sm shadow-sm whitespace-pre-line ${
                            m.de === "cliente" ? "bg-white text-slate-800 rounded-tl-sm"
                            : m.de === "bot" ? "bg-emerald-100 text-slate-800 rounded-tr-sm"
                            : "bg-emerald-600 text-white rounded-tr-sm"}`}>
                            {(m.de === "bot" || m.de === "agente") && (
                              <div className={`mb-0.5 flex items-center gap-1 text-xs font-semibold ${m.de === "bot" ? "text-emerald-700" : "text-emerald-100"}`}>
                                {m.de === "bot" ? <><Sparkles size={11} /> Sofía</> : <><UserCheck size={11} /> Asesor</>}
                              </div>
                            )}
                            <span>{m.texto}</span>
                            <div className={`mt-0.5 flex items-center justify-end gap-1 text-[10px] ${m.de === "agente" ? "text-emerald-100" : "text-slate-400"}`}>
                              {m.hora}{propio && <CheckCheck size={12} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={finRef} />
                  </div>

                  {/* composer */}
                  <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
                    {estaIntervenida ? (
                      <div className="flex items-center gap-2">
                        <input value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => e.key === "Enter" && enviar()}
                          placeholder="Escribe como asesor…"
                          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white" />
                        <button onClick={enviar} className="h-10 w-10 shrink-0 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700"><Send size={17} /></button>
                        <button onClick={intervenir} className="shrink-0 rounded-full px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100">Devolver a Sofía</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-2.5 ring-1 ring-inset ring-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Bot size={16} className="text-emerald-500" /> Sofía está respondiendo automáticamente
                        </div>
                        <button onClick={intervenir} className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">
                          <Pause size={13} /> Intervenir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----- RESUMEN ----- */}
          {vista === "resumen" && (
            <div className="h-full overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard icon={MessageSquare} label="Conversaciones hoy" valor="47" sub="↑ 12% vs. ayer" tono="bg-emerald-50 text-emerald-600" />
                <KpiCard icon={TrendingUp} label="Leads nuevos" valor="18" sub="↑ 5 nuevos" tono="bg-blue-50 text-blue-600" />
                <KpiCard icon={FileText} label="Cotizaciones" valor="9" sub="↑ 3 esta mañana" tono="bg-violet-50 text-violet-600" />
                <KpiCard icon={UserCheck} label="Asignadas a vendedor" valor="66%" sub="31 de 47" tono="bg-amber-50 text-amber-600" />
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">Conversaciones por zona</h3>
                  <p className="text-xs text-slate-500 mb-4">Distribución de chats según la zona detectada por Sofía</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={DATOS_ZONA} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="zona" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                        <Bar dataKey="conversaciones" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Actividad reciente</h3>
                  <div className="space-y-4">
                    {ACTIVIDAD.map((a, i) => (
                      <div key={i} className="flex gap-3">
                        <div className={`mt-0.5 ${a.color}`}><a.icon size={16} /></div>
                        <div className="min-w-0">
                          <p className="text-sm text-slate-700 leading-snug">{a.txt}</p>
                          <span className="text-xs text-slate-400">{a.t}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----- INVENTARIO ----- */}
          {vista === "inventario" && (
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-72">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={busqInv} onChange={(e) => setBusqInv(e.target.value)} placeholder="Buscar producto"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-400" />
                </div>
                <button onClick={() => setMostrarForm(true)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                  <Plus size={16} /> Agregar producto
                </button>
              </div>

              {mostrarForm && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-900">Nuevo producto</h4>
                    <button onClick={() => setMostrarForm(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} placeholder="Nombre del producto"
                      className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
                    <select value={nuevo.cat} onChange={(e) => setNuevo({ ...nuevo, cat: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 bg-white">
                      <option>Movilidad</option><option>Diagnóstico</option><option>Respiratorio</option><option>Mobiliario clínico</option>
                    </select>
                    <div className="flex gap-2">
                      <input value={nuevo.precio} onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })} placeholder="$" type="number"
                        className="w-1/2 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
                      <input value={nuevo.stock} onChange={(e) => setNuevo({ ...nuevo, stock: e.target.value })} placeholder="Stock" type="number"
                        className="w-1/2 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button onClick={agregarProducto} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Guardar producto</button>
                  </div>
                </div>
              )}

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">SKU</th><th className="px-4 py-3">Producto</th><th className="px-4 py-3">Categoría</th>
                      <th className="px-4 py-3 text-right">Precio</th><th className="px-4 py-3 text-center">Stock</th><th className="px-4 py-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invFiltrado.map((p) => (
                      <tr key={p.sku} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{p.sku}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{p.nombre}</td>
                        <td className="px-4 py-3 text-slate-500">{p.cat}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">${p.precio.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center text-slate-600">{p.stock}</td>
                        <td className="px-4 py-3 text-center">
                          {p.stock === 0 ? <Badge tono="rojo">Agotado</Badge> : p.stock <= 6 ? <Badge tono="ambar">Stock bajo</Badge> : <Badge tono="verde">En stock</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ----- VENDEDORES ----- */}
          {vista === "vendedores" && (
            <div className="h-full overflow-y-auto p-6">
              <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50/50 p-4 flex gap-3">
                <MapPin className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-blue-900">Cuando un cliente indica su ubicación, Sofía la compara con las zonas y asigna automáticamente al vendedor disponible más cercano. Si la zona no existe, escala al coordinador.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {VENDEDORES.map((v) => (
                  <div key={v.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Avatar nombre={v.nombre} color="bg-slate-800 text-white" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-900">{v.nombre}</h4>
                          <Badge tono={v.estado === "disponible" ? "verde" : "ambar"}>{v.estado}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5"><MapPin size={12} /> {v.zona}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {v.municipios.map((m) => <span key={m} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{m}</span>)}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <span className="flex items-center gap-1 text-slate-500"><Phone size={12} /> {v.tel}</span>
                      <span className="font-semibold text-slate-700">{v.activos} chats activos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----- COTIZACIONES ----- */}
          {vista === "cotizaciones" && (
            <div className="h-full overflow-y-auto p-6">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">N°</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3 text-center">Ítems</th><th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3">Vendedor</th><th className="px-4 py-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {COTIZACIONES.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">#{q.id}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{q.cliente}</td>
                        <td className="px-4 py-3 text-slate-500">{q.fecha}</td>
                        <td className="px-4 py-3 text-center text-slate-600">{q.items}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">${q.total.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-600">{q.vendedor}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge tono={q.estado === "Aceptada" ? "verde" : q.estado === "Enviada" ? "azul" : "ambar"}>{q.estado}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ----- CONFIGURACIÓN ----- */}
          {vista === "configuracion" && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-2xl space-y-5">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Identidad del asistente</h3>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nombre del asistente</label>
                  <input value={cfg.nombre} onChange={(e) => setCfg({ ...cfg, nombre: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 mb-4" />
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Tono de conversación</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Cercano y amable", "Formal y profesional", "Directo y breve"].map((t) => (
                      <button key={t} onClick={() => setCfg({ ...cfg, tono: t })}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${cfg.tono === t ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{t}</button>
                    ))}
                  </div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Mensaje de bienvenida</label>
                  <textarea value={cfg.bienvenida} onChange={(e) => setCfg({ ...cfg, bienvenida: e.target.value })} rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 resize-none" />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900">Reglas de atención</h3>
                  {[
                    { k: "autoresp", t: "Respuesta automática", d: "Sofía responde sin intervención humana" },
                    { k: "autoasign", t: "Asignación automática por zona", d: "Asigna al vendedor más cercano según ubicación" },
                  ].map((r) => (
                    <div key={r.k} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-800">{r.t}</div>
                        <div className="text-xs text-slate-500">{r.d}</div>
                      </div>
                      <button onClick={() => setCfg({ ...cfg, [r.k]: !cfg[r.k] })}
                        className={`relative h-6 w-11 rounded-full transition-colors ${cfg[r.k] ? "bg-emerald-500" : "bg-slate-300"}`}>
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${cfg[r.k] ? "left-5" : "left-0.5"}`} />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <div className="text-sm font-medium text-slate-800">Escalar a humano</div>
                      <div className="text-xs text-slate-500">Avisar a un vendedor tras esta cantidad de mensajes sin resolver</div>
                    </div>
                    <input type="number" value={cfg.escalar} onChange={(e) => setCfg({ ...cfg, escalar: e.target.value })}
                      className="w-16 rounded-lg border border-slate-200 px-3 py-2 text-sm text-center outline-none focus:border-emerald-400" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={guardarCfg} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Guardar cambios</button>
                  {guardado && <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600"><CheckCheck size={16} /> Cambios guardados</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
