// =========================================================
// FIXORA — LÓGICA INTERACTIVA DEL PROTOTIPO (MÁQUINA DE ESTADOS)
// Basado en Plan de Negocio y Especificación Funcional v2.1
// =========================================================

let currentRole = 'client'; // 'client' | 'technician' | 'admin'
let currentBookingFilter = 'all';

// Base de datos simulada de Técnicos
const technicians = [
  {
    id: 1,
    code: 'TEC-014',
    name: 'Ing. Carlos Ramírez',
    specialty: 'Refrigeración',
    zone: 'Playa Norte / Centro',
    rating: 4.9,
    completed: 84,
    visitFee: 150,
    verified: true,
    mostHired: true,
    isAd: false,
    bio: 'Especialista en aire acondicionado inverter, cuartos fríos y mantenimiento preventivo.'
  },
  {
    id: 2,
    code: 'TEC-029',
    name: 'Mtro. Héctor Gómez',
    specialty: 'Electricidad',
    zone: 'Justo Sierra / Petrolera',
    rating: 4.8,
    completed: 61,
    visitFee: 120,
    verified: true,
    mostHired: false,
    isAd: true, // Plan Premium (RN-08: etiquetado como publicidad)
    bio: 'Instalaciones residenciales 110V/220V, centros de carga, detección de cortos y tierras físicas.'
  },
  {
    id: 3,
    code: 'TEC-042',
    name: 'Téc. Luis Ángel Chan',
    specialty: 'Plomería',
    zone: 'Centro / Aviación',
    rating: 4.9,
    completed: 92,
    visitFee: 130,
    verified: true,
    mostHired: true,
    isAd: false,
    bio: 'Hidroneumáticos, bombas de agua, detección de fugas ocultas y tubería termofusión.'
  },
  {
    id: 4,
    code: 'TEC-055',
    name: 'Ing. Sofía Castellanos',
    specialty: 'Computación',
    zone: 'Playa Norte / Reforma',
    rating: 5.0,
    completed: 47,
    visitFee: 180,
    verified: true,
    mostHired: false,
    isAd: false,
    bio: 'Reparación de laptops, redes empresariales, recuperación de datos y mantenimiento térmico.'
  },
  {
    id: 5,
    code: 'TEC-068',
    name: 'Mtro. Roberto Díaz',
    specialty: 'Carpintería',
    zone: 'Tacubaya / Centro',
    rating: 4.7,
    completed: 39,
    visitFee: 150,
    verified: true,
    mostHired: false,
    isAd: false,
    bio: 'Ajuste de puertas, cocinas integrales, closets a medida y restauración de muebles.'
  }
];

// Órdenes de Servicio (Tabla bookings + payment_status según Sección 7)
let bookings = [
  {
    id: 101,
    code: 'ORD-2026-0412',
    clientName: 'Joaquín Méndez',
    clientPhone: '938-112-4490',
    techId: 1,
    techName: 'Ing. Carlos Ramírez',
    specialty: 'Refrigeración',
    description: 'Minisplit de 1.5 ton gotea agua hacia el interior y hace ruido en turbina.',
    approxZone: 'Col. Playa Norte',
    fullAddress: 'Calle 42 #118 entre 25 y 27, Playa Norte',
    date: '2026-11-18',
    status: 'quoted', // pending | accepted | quoted | confirmed | in_progress | awaiting_confirmation | completed | disputed | cancelled | refunded
    paymentStatus: 'none', // none | held | released | refunded
    serviceAmount: 650,
    materialsAmount: 200,
    visitFeeAmount: 150,
    commissionRate: 0.10,
    disputeReason: ''
  },
  {
    id: 102,
    code: 'ORD-2026-0409',
    clientName: 'Joaquín Méndez',
    clientPhone: '938-112-4490',
    techId: 3,
    techName: 'Téc. Luis Ángel Chan',
    specialty: 'Plomería',
    description: 'Cambio de presurizador automático y revisión de válvula check en azotea.',
    approxZone: 'Col. Centro',
    fullAddress: 'Calle 22 #84, Col. Centro',
    date: '2026-11-16',
    status: 'awaiting_confirmation',
    paymentStatus: 'held',
    serviceAmount: 500,
    materialsAmount: 350,
    visitFeeAmount: 130,
    commissionRate: 0.10,
    disputeReason: ''
  },
  {
    id: 103,
    code: 'ORD-2026-0395',
    clientName: 'María Fernanda Ruiz',
    clientPhone: '938-198-7721',
    techId: 1,
    techName: 'Ing. Carlos Ramírez',
    specialty: 'Refrigeración',
    description: 'Carga de gas refrigerante R410A y limpieza de condensador.',
    approxZone: 'Fracc. Reforma',
    fullAddress: 'Av. Periférica #310, Fracc. Reforma',
    date: '2026-11-15',
    status: 'disputed',
    paymentStatus: 'held',
    serviceAmount: 700,
    materialsAmount: 300,
    visitFeeAmount: 150,
    commissionRate: 0.10,
    disputeReason: 'El equipo volvió a perder presión a las 12 horas de la recarga.'
  },
  {
    id: 104,
    code: 'ORD-2026-0380',
    clientName: 'Joaquín Méndez',
    clientPhone: '938-112-4490',
    techId: 4,
    techName: 'Ing. Sofía Castellanos',
    specialty: 'Computación',
    description: 'Cambio de pasta térmica y limpieza interna de ASUS Vivobook.',
    approxZone: 'Col. Playa Norte',
    fullAddress: 'Calle 42 #118, Playa Norte',
    date: '2026-11-10',
    status: 'completed',
    paymentStatus: 'released',
    serviceAmount: 450,
    materialsAmount: 100,
    visitFeeAmount: 0,
    commissionRate: 0.10,
    disputeReason: ''
  }
];

// Libro mayor inmutable (ledger_entries)
let ledgerEntries = [
  { id: 1, order: 'ORD-2026-0380', type: 'charge', direction: 'IN', amount: 550.00, key: 'idem_pay_0380_a1', date: '2026-11-10 10:15' },
  { id: 2, order: 'ORD-2026-0380', type: 'commission', direction: 'IN', amount: 45.00, key: 'idem_com_0380_b2', date: '2026-11-10 14:30' },
  { id: 3, order: 'ORD-2026-0380', type: 'payout', direction: 'OUT', amount: 505.00, key: 'idem_out_0380_c3', date: '2026-11-10 14:30' },
  { id: 4, order: 'ORD-2026-0409', type: 'charge', direction: 'IN', amount: 980.00, key: 'idem_pay_0409_d4', date: '2026-11-16 09:00' },
  { id: 5, order: 'ORD-2026-0395', type: 'charge', direction: 'IN', amount: 1150.00, key: 'idem_pay_0395_e5', date: '2026-11-15 11:20' }
];

// =========================================================
// NAVEGACIÓN Y CAMBIO DE ROL
// =========================================================
function navigate(viewName) {
  document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(`view-${viewName}`);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`nav-${viewName}`);
  if (activeBtn) activeBtn.classList.add('active');

  if (viewName === 'explore') renderExploreTechs();
  if (viewName === 'dashboard') renderDashboard();
  if (viewName === 'admin') renderAdmin();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchRole(newRole) {
  currentRole = newRole;
  document.getElementById('roleSwitcher').value = newRole;
  showToast('Cambio de Rol Activo', `Ahora visualizas FIXORA como: ${newRole.toUpperCase()}`);
  if (newRole === 'admin') {
    navigate('admin');
  } else {
    navigate('dashboard');
  }
}

// =========================================================
// RENDERIZADO DE TÉCNICOS (LANDING Y EXPLORADOR)
// =========================================================
function createTechCardHTML(tech) {
  return `
    <div class="bg-white border-4 border-navy p-5 shadow-[6px_6px_0px_#0F172A] flex flex-col justify-between">
      <div class="border-2 border-dashed border-navy p-4 h-full flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start gap-2">
            <span class="font-mono text-xs font-bold bg-navy text-white px-2 py-0.5">${tech.code}</span>
            <div class="flex flex-col items-end gap-1">
              ${tech.mostHired ? '<span class="stamp stamp-yellow text-[10px]">MÁS CONTRATADO</span>' : ''}
              ${tech.isAd ? '<span class="font-mono text-[10px] bg-slate-200 border border-navy px-1.5 py-0.5 font-bold">PUBLICIDAD (RN-08)</span>' : ''}
            </div>
          </div>

          <h3 class="text-xl font-extrabold uppercase mt-3">${tech.name}</h3>
          <div class="font-mono text-xs font-bold text-blueprint mt-0.5">${tech.specialty.toUpperCase()} • ★ ${tech.rating.toFixed(1)} (${tech.completed} trabajos)</div>
          
          <p class="font-mono text-xs text-slate-600 mt-3 leading-relaxed">${tech.bio}</p>
        </div>

        <div class="mt-4 pt-3 border-t-2 border-dashed border-navy">
          <div class="flex justify-between font-mono text-xs mb-3">
            <span class="text-slate-500">ZONA: <strong>${tech.zone}</strong></span>
            <span>VISITA: <strong class="bg-safety px-1">$${tech.visitFee}.00</strong></span>
          </div>
          <button onclick="openNewRequestModal(${tech.id})" class="w-full bg-safety hover:bg-safetyHover text-navy font-extrabold text-xs py-2.5 border-2 border-navy shadow-[3px_3px_0px_#0F172A] active:translate-x-[1px] active:translate-y-[1px] uppercase">
            Solicitar Orden de Servicio →
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderLandingTechs() {
  const container = document.getElementById('landingTechGrid');
  if (container) {
    container.innerHTML = technicians.slice(0, 3).map(createTechCardHTML).join('');
  }
}

function renderExploreTechs() {
  const spec = document.getElementById('filterSpecialty').value;
  const zone = document.getElementById('filterZone').value.toLowerCase();
  const sort = document.getElementById('filterSort').value;

  let filtered = technicians.filter(t => {
    const matchSpec = !spec || t.specialty === spec;
    const matchZone = !zone || t.zone.toLowerCase().includes(zone);
    return matchSpec && matchZone;
  });

  if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  if (sort === 'completed') filtered.sort((a, b) => b.completed - a.completed);
  if (sort === 'fee_asc') filtered.sort((a, b) => a.visitFee - b.visitFee);

  const container = document.getElementById('exploreTechGrid');
  container.innerHTML = filtered.length
    ? filtered.map(createTechCardHTML).join('')
    : `<div class="col-span-3 bg-white border-4 border-navy p-8 text-center font-mono text-sm">No se encontraron técnicos con esos filtros.</div>`;
}

function searchFromHero() {
  const spec = document.getElementById('heroSpecialty').value;
  const zone = document.getElementById('heroZone').value;
  document.getElementById('filterSpecialty').value = spec;
  document.getElementById('filterZone').value = zone;
  navigate('explore');
}

function resetFilters() {
  document.getElementById('filterSpecialty').value = '';
  document.getElementById('filterZone').value = '';
  document.getElementById('filterSort').value = 'rating';
  renderExploreTechs();
}

// =========================================================
// RENDERIZADO DEL DASHBOARD Y MÁQUINA DE ESTADOS
// =========================================================
function getStatusBadge(status) {
  const map = {
    pending: { label: 'PENDIENTE DE RESPUESTA (48H)', cls: 'bg-slate-200 text-navy' },
    accepted: { label: 'ACEPTADA • POR COTIZAR', cls: 'bg-blue-100 text-blueprint' },
    quoted: { label: 'COTIZADA • ESPERANDO PAGO (72H)', cls: 'bg-safety text-navy' },
    confirmed: { label: 'CONFIRMADA • CITA AGENDADA', cls: 'bg-blueprint text-white' },
    in_progress: { label: 'EN EJECUCIÓN', cls: 'bg-indigo-600 text-white' },
    awaiting_confirmation: { label: 'TERMINADO • CONFIRMAR EN 48H', cls: 'bg-amber-300 text-navy' },
    completed: { label: 'COMPLETADA Y LIQUIDADA', cls: 'bg-emerald-500 text-navy' },
    disputed: { label: 'EN DISPUTA • MEDIACIÓN ACTIVA', cls: 'bg-red-600 text-white' },
    cancelled: { label: 'CANCELADA', cls: 'bg-slate-400 text-white' },
    refunded: { label: 'REEMBOLSADA', cls: 'bg-purple-600 text-white' }
  };
  const info = map[status] || { label: status, cls: 'bg-slate-200' };
  return `<span class="font-mono text-xs font-extrabold px-2.5 py-1 border-2 border-navy ${info.cls}">${info.label}</span>`;
}

function getPaymentStamp(paymentStatus) {
  if (paymentStatus === 'held') return `<span class="stamp stamp-yellow">PAGO RETENIDO</span>`;
  if (paymentStatus === 'released') return `<span class="stamp stamp-green">PAGO LIBERADO</span>`;
  if (paymentStatus === 'refunded') return `<span class="stamp stamp-red">REEMBOLSADO</span>`;
  return `<span class="font-mono text-xs text-slate-500 border border-dashed border-slate-400 px-2 py-1">SIN COBRO AÚN</span>`;
}

function renderDashboard() {
  const isTech = currentRole === 'technician';
  document.getElementById('dashRoleBadge').textContent = isTech ? 'MESA DE TRABAJO TÉCNICO' : 'EXPEDIENTE CLIENTE';
  document.getElementById('dashTitle').textContent = isTech ? 'Órdenes Asignadas (Ing. Carlos Ramírez)' : 'Mis Órdenes de Servicio';
  document.getElementById('btnNewRequest').classList.toggle('hidden', isTech);
  document.getElementById('dashPlanBadge').classList.toggle('hidden', !isTech);

  // KPIs por rol
  const kpiContainer = document.getElementById('dashKpiGrid');
  if (isTech) {
    kpiContainer.innerHTML = `
      <div class="bg-white border-2 border-navy p-4 shadow-[4px_4px_0px_#0F172A]">
        <span class="font-mono text-[11px] text-slate-500">SOLICITUDES POR COTIZAR</span>
        <div class="font-mono text-2xl font-extrabold mt-1">${bookings.filter(b => ['pending', 'accepted'].includes(b.status)).length}</div>
      </div>
      <div class="bg-white border-2 border-navy p-4 shadow-[4px_4px_0px_#0F172A]">
        <span class="font-mono text-[11px] text-slate-500">EN EJECUCIÓN / ACTIVAS</span>
        <div class="font-mono text-2xl font-extrabold mt-1 text-blueprint">${bookings.filter(b => ['confirmed', 'in_progress'].includes(b.status)).length}</div>
      </div>
      <div class="bg-white border-2 border-navy p-4 shadow-[4px_4px_0px_#0F172A]">
        <span class="font-mono text-[11px] text-slate-500">SALDO RETENIDO EN GARANTÍA</span>
        <div class="font-mono text-2xl font-extrabold mt-1 text-amber-600">$1,930.00</div>
      </div>
      <div class="bg-white border-2 border-navy p-4 shadow-[4px_4px_0px_#0F172A]">
        <span class="font-mono text-[11px] text-slate-500">NETO LIBERADO (MES)</span>
        <div class="font-mono text-2xl font-extrabold mt-1 text-emerald-700">$14,850.00</div>
      </div>
    `;
  } else {
    kpiContainer.innerHTML = `
      <div class="bg-white border-2 border-navy p-4 shadow-[4px_4px_0px_#0F172A]">
        <span class="font-mono text-[11px] text-slate-500">ÓRDENES ACTIVAS</span>
        <div class="font-mono text-2xl font-extrabold mt-1">${bookings.filter(b => !['completed', 'cancelled', 'refunded'].includes(b.status)).length}</div>
      </div>
      <div class="bg-white border-2 border-navy p-4 shadow-[4px_4px_0px_#0F172A]">
        <span class="font-mono text-[11px] text-slate-500">POR APROBAR / CONFIRMAR</span>
        <div class="font-mono text-2xl font-extrabold mt-1 text-blueprint">${bookings.filter(b => ['quoted', 'awaiting_confirmation'].includes(b.status)).length}</div>
      </div>
      <div class="bg-white border-2 border-navy p-4 shadow-[4px_4px_0px_#0F172A]">
        <span class="font-mono text-[11px] text-slate-500">PAGOS EN RESGUARDO</span>
        <div class="font-mono text-2xl font-extrabold mt-1 text-amber-600">$980.00</div>
      </div>
      <div class="bg-white border-2 border-navy p-4 shadow-[4px_4px_0px_#0F172A]">
        <span class="font-mono text-[11px] text-slate-500">SERVICIOS COMPLETADOS</span>
        <div class="font-mono text-2xl font-extrabold mt-1 text-emerald-700">${bookings.filter(b => b.status === 'completed').length}</div>
      </div>
    `;
  }

  // Filtrado de lista
  let list = bookings;
  if (currentBookingFilter === 'active') {
    list = bookings.filter(b => ['pending', 'accepted', 'quoted', 'confirmed', 'in_progress', 'awaiting_confirmation'].includes(b.status));
  } else if (currentBookingFilter === 'action') {
    list = bookings.filter(b => ['pending', 'accepted', 'quoted', 'awaiting_confirmation', 'disputed'].includes(b.status));
  } else if (currentBookingFilter === 'completed') {
    list = bookings.filter(b => ['completed', 'refunded'].includes(b.status));
  }

  const container = document.getElementById('bookingsList');
  container.innerHTML = list.map(b => renderBookingTicket(b, isTech)).join('');
}

function renderBookingTicket(b, isTech) {
  const total = b.serviceAmount + b.materialsAmount + b.visitFeeAmount;
  const commission = b.serviceAmount * b.commissionRate;
  const netTech = total - commission;
  const contactUnlocked = ['confirmed', 'in_progress', 'awaiting_confirmation', 'completed', 'disputed'].includes(b.status);

  // Botones de acción según estado y rol
  let actionsHTML = '';

  if (!isTech) {
    // ACCIONES DEL CLIENTE
    if (b.status === 'quoted') {
      actionsHTML = `
        <button onclick="transitionBooking(${b.id}, 'confirmed')" class="bg-safety hover:bg-safetyHover text-navy font-extrabold text-xs px-4 py-2.5 border-2 border-navy shadow-[3px_3px_0px_#0F172A] uppercase">
          Autorizar Pago ($${total.toFixed(2)}) y Confirmar →
        </button>
        <button onclick="transitionBooking(${b.id}, 'cancelled')" class="bg-white hover:bg-slate-100 text-navy font-mono font-bold text-xs px-3 py-2.5 border-2 border-navy uppercase">
          Cancelar sin cargo
        </button>
      `;
    } else if (b.status === 'awaiting_confirmation') {
      actionsHTML = `
        <button onclick="transitionBooking(${b.id}, 'completed')" class="bg-emerald-400 hover:bg-emerald-500 text-navy font-extrabold text-xs px-4 py-2.5 border-2 border-navy shadow-[3px_3px_0px_#0F172A] uppercase">
          ✓ Confirmar Trabajo Terminado (Liberar Pago)
        </button>
        <button onclick="openDisputeModal(${b.id})" class="bg-red-600 text-white font-mono font-bold text-xs px-3 py-2.5 border-2 border-navy uppercase">
          Abrir Disputa
        </button>
      `;
    } else if (b.status === 'completed') {
      actionsHTML = `
        <button onclick="openNewRequestModal(${b.techId})" class="bg-blueprint text-white font-mono font-bold text-xs px-4 py-2 border-2 border-navy uppercase">
          ↻ Volver a Solicitar al Mismo Técnico
        </button>
      `;
    } else if (b.status === 'pending') {
      actionsHTML = `
        <button onclick="transitionBooking(${b.id}, 'cancelled')" class="bg-white text-navy font-mono font-bold text-xs px-3 py-2 border-2 border-navy uppercase">
          Cancelar Solicitud
        </button>
      `;
    }
  } else {
    // ACCIONES DEL TÉCNICO
    if (b.status === 'pending') {
      actionsHTML = `
        <button onclick="openQuoteModal(${b.id})" class="bg-safety hover:bg-safetyHover text-navy font-extrabold text-xs px-4 py-2.5 border-2 border-navy shadow-[3px_3px_0px_#0F172A] uppercase">
          Aceptar y Cotizar Presupuesto →
        </button>
        <button onclick="transitionBooking(${b.id}, 'cancelled')" class="bg-white text-navy font-mono font-bold text-xs px-3 py-2.5 border-2 border-navy uppercase">
          Rechazar
        </button>
      `;
    } else if (b.status === 'confirmed') {
      actionsHTML = `
        <button onclick="transitionBooking(${b.id}, 'in_progress')" class="bg-blueprint text-white font-extrabold text-xs px-4 py-2.5 border-2 border-navy shadow-[3px_3px_0px_#0F172A] uppercase">
          ▶ Iniciar Ejecución en Sitio
        </button>
      `;
    } else if (b.status === 'in_progress') {
      actionsHTML = `
        <button onclick="transitionBooking(${b.id}, 'awaiting_confirmation')" class="bg-safety hover:bg-safetyHover text-navy font-extrabold text-xs px-4 py-2.5 border-2 border-navy shadow-[3px_3px_0px_#0F172A] uppercase">
          ✓ Marcar Trabajo Terminado (Inicia 48h)
        </button>
      `;
    }
  }

  return `
    <div class="bg-white border-4 border-navy p-5 sm:p-6 shadow-[8px_8px_0px_#0F172A]">
      <div class="border-2 border-dashed border-navy p-4 sm:p-5">
        <!-- Encabezado del Ticket -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-navy pb-4">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-mono text-base font-extrabold bg-navy text-white px-2.5 py-0.5">#${b.code}</span>
              ${getStatusBadge(b.status)}
            </div>
            <h3 class="text-xl font-extrabold uppercase mt-2">${b.specialty} — ${isTech ? 'Cliente: ' + b.clientName : 'Técnico: ' + b.techName}</h3>
          </div>
          <div>
            ${getPaymentStamp(b.paymentStatus)}
          </div>
        </div>

        <!-- Cuerpo del Ticket -->
        <div class="grid lg:grid-cols-12 gap-6 py-4 font-mono text-xs">
          <div class="lg:col-span-7 space-y-2.5">
            <div>
              <span class="text-slate-500 font-bold">DESCRIPCIÓN DE FALLA:</span>
              <p class="text-navy font-semibold mt-0.5 bg-slate-50 p-2.5 border border-slate-300">${b.description}</p>
            </div>
            <div class="grid sm:grid-cols-2 gap-2">
              <div><span class="text-slate-500">FECHA SOLICITADA:</span> <strong>${b.date}</strong></div>
              <div><span class="text-slate-500">ZONA:</span> <strong>${b.approxZone}</strong></div>
            </div>

            <!-- Privacidad RN-09 -->
            <div class="p-2.5 border-2 ${contactUnlocked ? 'border-emerald-700 bg-emerald-50' : 'border-dashed border-slate-400 bg-slate-100'}">
              ${contactUnlocked
                ? `<strong>DATOS DE CONTACTO DESBLOQUEADOS (RN-09):</strong><br/>Dirección: ${b.fullAddress} | Tel: ${b.clientPhone}`
                : `<strong>PRIVACIDAD ACTIVA (RN-09):</strong> Dirección exacta y teléfono ocultos hasta confirmar presupuesto y retener pago.`
              }
            </div>

            ${b.status === 'disputed' ? `
              <div class="p-3 bg-red-100 border-2 border-red-700 text-red-900">
                <strong>MOTIVO DE DISPUTA ABIERTA:</strong> ${b.disputeReason}
              </div>
            ` : ''}
          </div>

          <!-- Desglose Financiero (D-02) -->
          <div class="lg:col-span-5 bg-paper border-2 border-navy p-4 flex flex-col justify-between">
            <div>
              <div class="font-bold border-b border-navy pb-1.5 mb-2 uppercase">Desglose de Orden (D-02)</div>
              ${total > 0 ? `
                <div class="space-y-1">
                  <div class="flex justify-between"><span>Mano de obra (comisionable):</span><span>$${b.serviceAmount.toFixed(2)}</span></div>
                  <div class="flex justify-between"><span>Materiales / refacciones:</span><span>$${b.materialsAmount.toFixed(2)}</span></div>
                  <div class="flex justify-between"><span>Tarifa de visita:</span><span>$${b.visitFeeAmount.toFixed(2)}</span></div>
                  <div class="border-t-2 border-dashed border-navy pt-1.5 mt-1.5 flex justify-between font-extrabold text-sm">
                    <span>TOTAL ORDEN:</span>
                    <span>$${total.toFixed(2)} MXN</span>
                  </div>
                  ${isTech ? `
                    <div class="mt-2 pt-2 border-t border-slate-300 text-[11px] space-y-0.5">
                      <div class="flex justify-between text-red-700"><span>Comisión FIXORA (10%):</span><span>-$${commission.toFixed(2)}</span></div>
                      <div class="flex justify-between font-extrabold text-emerald-800"><span>TU NETO A RECIBIR:</span><span>$${netTech.toFixed(2)} MXN</span></div>
                    </div>
                  ` : ''}
                </div>
              ` : `<div class="text-slate-500 py-4 text-center">Pendiente de cotización por el técnico.</div>`}
            </div>
          </div>
        </div>

        <!-- Pie con Botones de Acción -->
        <div class="pt-3 border-t-2 border-dashed border-navy flex flex-wrap justify-between items-center gap-3">
          <span class="font-mono text-[11px] text-slate-500">POLÍTICA: Cancelación >24h reembolso 100% (Sec. 3.1)</span>
          <div class="flex flex-wrap gap-2">
            ${actionsHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}

function filterBookings(filter) {
  currentBookingFilter = filter;
  document.querySelectorAll('.booking-filter-btn').forEach(btn => {
    btn.classList.remove('bg-navy', 'text-safety');
    btn.classList.add('bg-white', 'text-navy');
  });
  event.target.classList.remove('bg-white', 'text-navy');
  event.target.classList.add('bg-navy', 'text-safety');
  renderDashboard();
}

// =========================================================
// TRANSICIONES DE LA MÁQUINA DE ESTADOS
// =========================================================
function transitionBooking(id, nextStatus) {
  const b = bookings.find(item => item.id === id);
  if (!b) return;

  const total = b.serviceAmount + b.materialsAmount + b.visitFeeAmount;
  const commission = b.serviceAmount * b.commissionRate;
  const net = total - commission;

  b.status = nextStatus;

  if (nextStatus === 'confirmed') {
    b.paymentStatus = 'held';
    ledgerEntries.unshift({
      id: ledgerEntries.length + 1,
      order: b.code,
      type: 'charge',
      direction: 'IN',
      amount: total,
      key: `idem_pay_${b.id}_${Date.now().toString().slice(-4)}`,
      date: '2026-11-16 13:35'
    });
    showToast('Pago Autorizado y Retenido', `Se resguardaron $${total.toFixed(2)} MXN. Datos de contacto desbloqueados.`);
  } else if (nextStatus === 'completed') {
    b.paymentStatus = 'released';
    ledgerEntries.unshift(
      {
        id: ledgerEntries.length + 1,
        order: b.code,
        type: 'commission',
        direction: 'IN',
        amount: commission,
        key: `idem_com_${b.id}_${Date.now().toString().slice(-4)}`,
        date: '2026-11-16 13:40'
      },
      {
        id: ledgerEntries.length + 2,
        order: b.code,
        type: 'payout',
        direction: 'OUT',
        amount: net,
        key: `idem_out_${b.id}_${Date.now().toString().slice(-4)}`,
        date: '2026-11-16 13:40'
      }
    );
    showToast('Servicio Completado', `Pago liberado al técnico ($${net.toFixed(2)} MXN netos).`);
  } else {
    showToast('Estado Actualizado', `La orden #${b.code} pasó a estado: ${nextStatus.toUpperCase()}`);
  }

  renderDashboard();
}

// =========================================================
// MODALES: NUEVA SOLICITUD, COTIZACIÓN Y DISPUTA
// =========================================================
function openNewRequestModal(preselectedTechId = 1) {
  const select = document.getElementById('reqTechId');
  select.innerHTML = technicians.map(t =>
    `<option value="${t.id}" ${t.id === preselectedTechId ? 'selected' : ''}>${t.name} (${t.specialty} — Visita $${t.visitFee})</option>`
  ).join('');
  document.getElementById('modalNewRequest').classList.remove('hidden');
  document.getElementById('modalNewRequest').classList.add('flex');
}

function submitNewBooking(e) {
  e.preventDefault();
  const techId = parseInt(document.getElementById('reqTechId').value);
  const tech = technicians.find(t => t.id === techId);
  const newCode = `ORD-2026-0${Math.floor(420 + Math.random() * 500)}`;

  bookings.unshift({
    id: Date.now(),
    code: newCode,
    clientName: 'Joaquín Méndez',
    clientPhone: '938-112-4490',
    techId: tech.id,
    techName: tech.name,
    specialty: document.getElementById('reqSpecialty').value,
    description: document.getElementById('reqDescription').value,
    approxZone: document.getElementById('reqApproxZone').value,
    fullAddress: document.getElementById('reqFullAddress').value,
    date: document.getElementById('reqDate').value,
    status: 'pending',
    paymentStatus: 'none',
    serviceAmount: 0,
    materialsAmount: 0,
    visitFeeAmount: tech.visitFee,
    commissionRate: 0.10,
    disputeReason: ''
  });

  closeModal('modalNewRequest');
  showToast('Orden Emitida', `Solicitud #${newCode} enviada en estado PENDING (48h).`);
  navigate('dashboard');
}

function openQuoteModal(bookingId) {
  const b = bookings.find(item => item.id === bookingId);
  document.getElementById('quoteBookingId').value = b.id;
  document.getElementById('quoteBookingCode').textContent = `#${b.code}`;
  document.getElementById('quoteVisitAmt').value = b.visitFeeAmount || 150;
  recalcQuotePreview();
  document.getElementById('modalQuote').classList.remove('hidden');
  document.getElementById('modalQuote').classList.add('flex');
}

function recalcQuotePreview() {
  const s = parseFloat(document.getElementById('quoteServiceAmt').value) || 0;
  const m = parseFloat(document.getElementById('quoteMaterialsAmt').value) || 0;
  const v = parseFloat(document.getElementById('quoteVisitAmt').value) || 0;
  const total = s + m + v;
  const com = s * 0.10;
  const net = total - com;

  document.getElementById('prevTotalClient').textContent = `$${total.toFixed(2)}`;
  document.getElementById('prevCommission').textContent = `-$${com.toFixed(2)}`;
  document.getElementById('prevNetTech').textContent = `$${net.toFixed(2)} MXN`;
}

function submitQuote(e) {
  e.preventDefault();
  const id = parseInt(document.getElementById('quoteBookingId').value);
  const b = bookings.find(item => item.id === id);
  b.serviceAmount = parseFloat(document.getElementById('quoteServiceAmt').value) || 0;
  b.materialsAmount = parseFloat(document.getElementById('quoteMaterialsAmt').value) || 0;
  b.visitFeeAmount = parseFloat(document.getElementById('quoteVisitAmt').value) || 0;
  b.status = 'quoted';

  closeModal('modalQuote');
  showToast('Presupuesto Enviado', `Cotización enviada al cliente para #${b.code}.`);
  renderDashboard();
}

function openDisputeModal(bookingId) {
  document.getElementById('disputeBookingId').value = bookingId;
  document.getElementById('modalDispute').classList.remove('hidden');
  document.getElementById('modalDispute').classList.add('flex');
}

function submitDispute(e) {
  e.preventDefault();
  const id = parseInt(document.getElementById('disputeBookingId').value);
  const b = bookings.find(item => item.id === id);
  b.status = 'disputed';
  b.disputeReason = document.getElementById('disputeReason').value;

  closeModal('modalDispute');
  showToast('Disputa Registrada', `Pago congelado en #${b.code}. Un administrador revisará el caso.`);
  renderDashboard();
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  m.classList.add('hidden');
  m.classList.remove('flex');
}

// =========================================================
// PANEL ADMIN: RESOLUCIÓN DE DISPUTAS Y LEDGER
// =========================================================
function renderAdmin() {
  const disputed = bookings.filter(b => b.status === 'disputed');
  document.getElementById('kpi-disputes').textContent = disputed.length;

  const dispContainer = document.getElementById('adminDisputesContainer');
  if (!disputed.length) {
    dispContainer.innerHTML = `<div class="font-mono text-xs text-slate-500 p-4 border-2 border-dashed border-slate-300">No hay disputas abiertas en este momento.</div>`;
  } else {
    dispContainer.innerHTML = disputed.map(b => {
      const total = b.serviceAmount + b.materialsAmount + b.visitFeeAmount;
      return `
        <div class="border-2 border-navy p-4 bg-red-50 flex flex-col lg:flex-row justify-between gap-4">
          <div class="font-mono text-xs space-y-1">
            <div class="font-extrabold text-sm">#${b.code} — ${b.specialty} ($${total.toFixed(2)} MXN RETENIDOS)</div>
            <div><strong>Cliente:</strong> ${b.clientName} | <strong>Técnico:</strong> ${b.techName}</div>
            <div class="text-red-800"><strong>Motivo:</strong> "${b.disputeReason}"</div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="resolveDispute(${b.id}, 'refunded')" class="bg-navy text-safety font-mono font-bold text-xs px-3 py-2 border-2 border-navy uppercase">
              Reembolsar 100% al Cliente
            </button>
            <button onclick="resolveDispute(${b.id}, 'completed')" class="bg-emerald-500 text-navy font-mono font-bold text-xs px-3 py-2 border-2 border-navy uppercase">
              Liberar Pago al Técnico
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Renderizar tabla ledger_entries
  const tbody = document.getElementById('ledgerTableBody');
  tbody.innerHTML = ledgerEntries.map(entry => `
    <tr class="border-b border-slate-300 hover:bg-yellow-50">
      <td class="p-2.5 border-x border-slate-300 font-bold">#${entry.id}</td>
      <td class="p-2.5 border-x border-slate-300 font-bold text-blueprint">${entry.order}</td>
      <td class="p-2.5 border-x border-slate-300 uppercase">${entry.type}</td>
      <td class="p-2.5 border-x border-slate-300">
        <span class="px-1.5 py-0.5 font-bold ${entry.direction === 'IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${entry.direction}</span>
      </td>
      <td class="p-2.5 border-x border-slate-300 font-bold">$${entry.amount.toFixed(2)}</td>
      <td class="p-2.5 border-x border-slate-300 text-slate-500">${entry.key}</td>
      <td class="p-2.5 border-x border-slate-300">${entry.date}</td>
    </tr>
  `).join('');
}

function resolveDispute(bookingId, resolutionStatus) {
  const b = bookings.find(item => item.id === bookingId);
  const total = b.serviceAmount + b.materialsAmount + b.visitFeeAmount;

  if (resolutionStatus === 'refunded') {
    b.status = 'refunded';
    b.paymentStatus = 'refunded';
    ledgerEntries.unshift({
      id: ledgerEntries.length + 1,
      order: b.code,
      type: 'refund',
      direction: 'OUT',
      amount: total,
      key: `idem_ref_${b.id}_${Date.now().toString().slice(-4)}`,
      date: '2026-11-16 13:45'
    });
    showToast('Disputa Resuelta: Reembolso', `Se reembolsaron $${total.toFixed(2)} MXN al cliente.`);
  } else {
    transitionBooking(bookingId, 'completed');
  }
  renderAdmin();
}

// =========================================================
// UTILIDADES DE AUTH, PLANES Y TOAST
// =========================================================
function toggleAuthMode(mode) {
  const isReg = mode === 'register';
  document.getElementById('registerRoleBox').classList.toggle('hidden', !isReg);
  document.getElementById('registerNameBox').classList.toggle('hidden', !isReg);
  document.getElementById('tab-login').className = `flex-1 py-2.5 font-mono text-xs font-extrabold uppercase ${!isReg ? 'bg-navy text-safety' : 'bg-white text-navy'}`;
  document.getElementById('tab-register').className = `flex-1 py-2.5 font-mono text-xs font-extrabold uppercase ${isReg ? 'bg-navy text-safety' : 'bg-white text-navy'}`;
  document.getElementById('authSubmitBtn').textContent = isReg ? 'Crear Expediente →' : 'Entrar a la Plataforma →';
}

function toggleTechFields(show) {
  document.getElementById('techExtraFields').classList.toggle('hidden', !show);
}

function handleAuthSubmit(e) {
  e.preventDefault();
  showToast('Sesión Iniciada', 'Token Sanctum verificado. Bienvenido a FIXORA.');
  navigate('dashboard');
}

function selectPlan(planName, price) {
  showToast('Suscripción Actualizada', `Plan ${planName.toUpperCase()} ($${price} MXN/mes) activado en tu cuenta.`);
}

function showToast(title, msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 4200);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderLandingTechs();
  navigate('landing');
});
