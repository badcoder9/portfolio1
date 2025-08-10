// Local-storage CRUD with accessible modal dialogs and i18n

const STORAGE_KEY = 'appointments.v1';
const LANG_KEY = 'appointments.lang';
const THEME_KEY = 'appointments.theme';

// i18n strings
const I18N = {
  en: {
    import_csv: 'Import CSV',
    filter_title: 'Filter by title',
    filter_help: '(min 3 characters)',
    title: 'Appointments',
    language_label: 'Language',
    add_appointment: 'Add appointment',
    export_csv: 'Export CSV',
    export_active_csv: 'Export active CSV',
    export_completed_csv: 'Export completed CSV',
    theme_label: 'Theme',
    theme_system: 'System',
    theme_light: 'Light',
    theme_dark: 'Dark',
    th_title: 'Title', th_date: 'Date', th_time: 'Time', th_description: 'Description', th_actions: 'Actions', th_complete: 'Complete',
    empty_state: 'No appointments yet.',
    empty_completed: 'No completed appointments.',
    active_title: 'Upcoming appointments',
    completed_title: 'Completed appointments',
    dialog_add_title: 'Add appointment',
    dialog_edit_title: 'Edit appointment',
    dialog_desc: 'Fill the details and press Save. Press Escape to close.',
    label_title: 'Title', label_description: 'Description',
    legend_date: 'Date', label_day: 'Day', label_month: 'Month', label_year: 'Year',
    legend_time: 'Time', label_hour: 'Hour (24h)', label_minute: 'Minute',
    save: 'Save', cancel: 'Cancel', edit: 'Edit',
    dialog_delete_title: 'Delete appointment',
    dialog_delete_desc: 'Are you sure you want to delete this appointment?',
    delete: 'Delete',
    mark_complete: 'Mark complete',
    title_required: 'Title is required.',
    updated: 'Appointment updated.', added: 'Appointment added.', deleted: 'Appointment deleted.',
    csv_filename: 'appointments.csv'
  },
  de: {
    import_csv: 'CSV importieren',
    filter_title: 'Nach Titel filtern',
    filter_help: '(mind. 3 Zeichen)',
    title: 'Termine',
    language_label: 'Sprache',
    add_appointment: 'Termin hinzufügen',
    export_csv: 'CSV exportieren',
    export_active_csv: 'Aktive CSV exportieren',
    export_completed_csv: 'Abgeschlossene CSV exportieren',
    theme_label: 'Design',
    theme_system: 'System',
    theme_light: 'Hell',
    theme_dark: 'Dunkel',
    th_title: 'Titel', th_date: 'Datum', th_time: 'Zeit', th_description: 'Beschreibung', th_actions: 'Aktionen', th_complete: 'Abschließen',
    empty_state: 'Noch keine Termine.',
    empty_completed: 'Keine abgeschlossenen Termine.',
    active_title: 'Bevorstehende Termine',
    completed_title: 'Abgeschlossene Termine',
    dialog_add_title: 'Termin hinzufügen',
    dialog_edit_title: 'Termin bearbeiten',
    dialog_desc: 'Füllen Sie die Details aus und klicken Sie auf Speichern. Drücken Sie Escape zum Schließen.',
    label_title: 'Titel', label_description: 'Beschreibung',
    legend_date: 'Datum', label_day: 'Tag', label_month: 'Monat', label_year: 'Jahr',
    legend_time: 'Zeit', label_hour: 'Stunde (24h)', label_minute: 'Minute',
    save: 'Speichern', cancel: 'Abbrechen', edit: 'Bearbeiten',
    dialog_delete_title: 'Termin löschen',
    dialog_delete_desc: 'Möchten Sie diesen Termin wirklich löschen?',
    delete: 'Löschen',
    mark_complete: 'Abschließen',
    title_required: 'Titel ist erforderlich.',
    updated: 'Termin aktualisiert.', added: 'Termin hinzugefügt.', deleted: 'Termin gelöscht.',
    csv_filename: 'termine.csv'
  },
  sr: {
    import_csv: 'Uvezi CSV',
    filter_title: 'Filtriraj po nazivu',
    filter_help: '(min. 3 karaktera)',
    title: 'Zakazani termini',
    language_label: 'Jezik',
    add_appointment: 'Dodaj termin',
    export_csv: 'Izvezi CSV',
    export_active_csv: 'Izvezi aktivne CSV',
    export_completed_csv: 'Izvezi završene CSV',
    theme_label: 'Tema',
    theme_system: 'Sistem',
    theme_light: 'Svetla',
    theme_dark: 'Tamna',
    th_title: 'Naziv', th_date: 'Datum', th_time: 'Vreme', th_description: 'Opis', th_actions: 'Akcije', th_complete: 'Završi',
    empty_state: 'Još nema termina.',
    empty_completed: 'Nema završenih termina.',
    active_title: 'Predstojeći termini',
    completed_title: 'Završeni termini',
    dialog_add_title: 'Dodaj termin',
    dialog_edit_title: 'Uredi termin',
    dialog_desc: 'Popunite detalje i pritisnite Sačuvaj. Pritisnite Escape za zatvaranje.',
    label_title: 'Naziv', label_description: 'Opis',
    legend_date: 'Datum', label_day: 'Dan', label_month: 'Mesec', label_year: 'Godina',
    legend_time: 'Vreme', label_hour: 'Sat (24h)', label_minute: 'Minut',
    save: 'Sačuvaj', cancel: 'Otkaži', edit: 'Uredi',
    dialog_delete_title: 'Obriši termin',
    dialog_delete_desc: 'Da li ste sigurni da želite da obrišete termin?',
    delete: 'Obriši',
    mark_complete: 'Završi',
    title_required: 'Naziv je obavezan.',
    updated: 'Termin je ažuriran.', added: 'Termin je dodat.', deleted: 'Termin je obrisan.',
    csv_filename: 'termini.csv'
  }
};

// Elements
const addBtn = document.getElementById('addBtn');
const exportActiveBtn = document.getElementById('exportActiveBtn');
const exportCompletedBtn = document.getElementById('exportCompletedBtn');
const statusEl = document.getElementById('status');
const tableBody = document.getElementById('appointmentsBody');
const completedBody = document.getElementById('completedBody');
const searchActive = document.getElementById('searchActive');
const searchCompleted = document.getElementById('searchCompleted');
const btnSortActiveTitle = document.getElementById('btnSortActiveTitle');
const btnSortActiveDate = document.getElementById('btnSortActiveDate');
const btnSortCompletedTitle = document.getElementById('btnSortCompletedTitle');
const btnSortCompletedDate = document.getElementById('btnSortCompletedDate');
const thActiveTitle = document.getElementById('thActiveTitle');
const thActiveDate = document.getElementById('thActiveDate');
const thCompletedTitle = document.getElementById('thCompletedTitle');
const thCompletedDate = document.getElementById('thCompletedDate');
const yearNow = document.getElementById('yearNow');
const langSelect = document.getElementById('langSelect');
const themeSelect = document.getElementById('themeSelect');
const importInput = document.getElementById('importCsv');

// Dialogs
const overlay = document.getElementById('overlay');
const dialog = document.getElementById('appointmentDialog');
const dialogTitle = document.getElementById('dialogTitle');
const confirmDialog = document.getElementById('confirmDialog');
let lastFocusedBeforeDialog = null;

// Form fields
const appointmentForm = document.getElementById('appointmentForm');
const titleInput = document.getElementById('titleInput');
const descInput = document.getElementById('descInput');
const daySelect = document.getElementById('daySelect');
const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');
const hourSelect = document.getElementById('hourSelect');
const minuteSelect = document.getElementById('minuteSelect');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formStatus = document.getElementById('formStatus');

// Data
let appointments = loadAppointments();
let editingId = null;
let sortState = {
  active: { key: 'date', dir: 'asc' }, // default: date ascending
  completed: { key: 'date', dir: 'asc' }
};

// Initialize UI after DOM is ready
function initializeUI() {
  try {
    yearNow.textContent = new Date().getFullYear();
    populateDateTimeSelects();
    renderAppointments();
    initLanguage();
    initTheme();

    addBtn.addEventListener('click', () => openAppointmentDialog());
    exportActiveBtn.addEventListener('click', () => exportCsv('active'));
    exportCompletedBtn.addEventListener('click', () => exportCsv('completed'));
    cancelBtn.addEventListener('click', () => closeDialog(dialog, true));
    langSelect.addEventListener('change', () => {
      const lang = langSelect.value;
      localStorage.setItem(LANG_KEY, lang);
      applyLanguage(lang);
    });
    themeSelect.addEventListener('change', () => {
      const theme = themeSelect.value;
      localStorage.setItem(THEME_KEY, theme);
      applyTheme(theme);
    });
    importInput.addEventListener('change', handleImportCsv);
    // Sorting handlers
    btnSortActiveTitle.addEventListener('click', () => toggleSort('active','title'));
    btnSortActiveDate.addEventListener('click', () => toggleSort('active','date'));
    btnSortCompletedTitle.addEventListener('click', () => toggleSort('completed','title'));
    btnSortCompletedDate.addEventListener('click', () => toggleSort('completed','date'));
    searchActive.addEventListener('input', renderAppointments);
    searchCompleted.addEventListener('input', renderAppointments);
  } catch (err) {
    console.error('Initialization error:', err);
    statusEl.textContent = String(err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUI);
} else {
  initializeUI();
}

appointmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const item = collectFormData();
  if (!item) return;
  if (editingId) {
    const idx = appointments.findIndex((a) => a.id === editingId);
    if (idx !== -1) {
      appointments[idx] = { ...item, id: editingId };
      persist();
      statusEl.textContent = t('updated');
    }
  } else {
    appointments.push({ ...item, id: generateId() });
    persist();
    statusEl.textContent = t('added');
  }
  renderAppointments();
  closeDialog(dialog, false); // close on success
});

// Delete confirmation
let pendingDeleteId = null;
document.getElementById('confirmYes').addEventListener('click', () => {
  if (!pendingDeleteId) return closeDialog(confirmDialog, true);
  appointments = appointments.filter((a) => a.id !== pendingDeleteId);
  pendingDeleteId = null;
  persist();
  renderAppointments();
  statusEl.textContent = t('deleted');
  closeDialog(confirmDialog, true);
});
document.getElementById('confirmNo').addEventListener('click', () => closeDialog(confirmDialog, true));

// Language change is attached in initializeUI

// Functions
function loadAppointments(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }catch{ return []; }
}
function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments)); }

function populateDateTimeSelects(){
  // Day 1..31
  daySelect.innerHTML = '';
  for (let d=1; d<=31; d++) addOption(daySelect, d.toString().padStart(2,'0'), d);
  // Month 1..12
  monthSelect.innerHTML = '';
  for (let m=1; m<=12; m++) addOption(monthSelect, m.toString().padStart(2,'0'), m);
  // Year: current year preselected, provide a small range current-5..current+5
  const currentYear = new Date().getFullYear();
  yearSelect.innerHTML = '';
  for (let y=currentYear-5; y<=currentYear+5; y++) addOption(yearSelect, y.toString(), y);
  yearSelect.value = currentYear.toString();

  // Hour 0..23
  hourSelect.innerHTML = '';
  for (let h=0; h<=23; h++) addOption(hourSelect, h.toString().padStart(2,'0'), h);
  // Minute 0..55 step 5
  minuteSelect.innerHTML = '';
  for (let m=0; m<=55; m+=5) addOption(minuteSelect, m.toString().padStart(2,'0'), m);
}

function addOption(select, label, value){
  const opt = document.createElement('option');
  opt.textContent = label;
  opt.value = String(value);
  select.appendChild(opt);
}

function openAppointmentDialog(appt){
  // Prepare form
  formStatus.textContent = '';
  if (appt){
    editingId = appt.id;
    dialogTitle.setAttribute('data-i18n', 'dialog_edit_title');
    dialogTitle.textContent = t('dialog_edit_title');
    titleInput.value = appt.title || '';
    descInput.value = appt.description || '';
    daySelect.value = String(appt.day).padStart(2,'0');
    monthSelect.value = String(appt.month).padStart(2,'0');
    yearSelect.value = String(appt.year);
    hourSelect.value = String(appt.hour).padStart(2,'0');
    minuteSelect.value = String(appt.minute).padStart(2,'0');
  } else {
    editingId = null;
    dialogTitle.setAttribute('data-i18n', 'dialog_add_title');
    dialogTitle.textContent = t('dialog_add_title');
    appointmentForm.reset();
    // Defaults to current date/time (year preselected by populate)
    const now = new Date();
    daySelect.value = String(now.getDate()).padStart(2,'0');
    monthSelect.value = String(now.getMonth()+1).padStart(2,'0');
    yearSelect.value = String(now.getFullYear());
    hourSelect.value = String(now.getHours()).padStart(2,'0');
    const mins = now.getMinutes();
    const rounded = Math.round(mins/5)*5;
    minuteSelect.value = String(rounded % 60).padStart(2,'0');
  }
  lastFocusedBeforeDialog = document.activeElement;
  showModal(dialog);
  titleInput.focus();
}

function collectFormData(){
  const title = titleInput.value.trim();
  if (!title){ formStatus.textContent = t('title_required'); return null; }
  const description = descInput.value.trim();
  const day = parseInt(daySelect.value,10);
  const month = parseInt(monthSelect.value,10);
  const year = parseInt(yearSelect.value,10);
  const hour = parseInt(hourSelect.value,10);
  const minute = parseInt(minuteSelect.value,10);
  return { title, description, day, month, year, hour, minute, completed: false };
}

function renderAppointments(){
  const qAraw = (searchActive?.value || '').toLowerCase();
  const qCraw = (searchCompleted?.value || '').toLowerCase();
  const qAok = qAraw.length >= 3;
  const qCok = qCraw.length >= 3;
  let active = appointments.filter(a => !a.completed && (!qAok || a.title.toLowerCase().includes(qAraw)));
  let completed = appointments.filter(a => a.completed && (!qCok || a.title.toLowerCase().includes(qCraw)));

  // Sort active
  if (sortState.active.key){
    active = [...active].sort((a,b) => compareBy(sortState.active.key, sortState.active.dir, a, b));
  }
  // Sort completed
  if (sortState.completed.key){
    completed = [...completed].sort((a,b) => compareBy(sortState.completed.key, sortState.completed.dir, a, b));
  }

  // Update aria-sort
  updateAriaSort(thActiveTitle, sortState.active, 'title');
  updateAriaSort(thActiveDate, sortState.active, 'date');
  updateAriaSort(thCompletedTitle, sortState.completed, 'title');
  updateAriaSort(thCompletedDate, sortState.completed, 'date');

  // Active
  tableBody.innerHTML = '';
  if (active.length === 0){
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5; td.textContent = t('empty_state');
    tr.appendChild(td); tableBody.appendChild(tr);
  }
  for (const a of active){
    const tr = document.createElement('tr');
    const dateStr = `${String(a.day).padStart(2,'0')}.${String(a.month).padStart(2,'0')}.${a.year}`;
    const timeStr = `${String(a.hour).padStart(2,'0')}:${String(a.minute).padStart(2,'0')}`;
    tr.innerHTML = `
      <td>${escapeHtml(a.title)}</td>
      <td>${escapeHtml(a.description || '')}</td>
      <td>${dateStr}</td>
      <td>${timeStr}</td>
      <td>
        <button class="btn" data-action="edit" data-id="${a.id}" aria-label="${t('edit')} ${escapeAttr(a.title)}">${t('edit')}</button>
        <button class="btn danger" data-action="delete" data-id="${a.id}" aria-label="${t('delete')} ${escapeAttr(a.title)}">${t('delete')}</button>
        <button class="btn success" data-action="complete" data-id="${a.id}" aria-label="${t('mark_complete')} ${escapeAttr(a.title)}">${t('mark_complete')}</button>
      </td>`;
    tableBody.appendChild(tr);
  }

  // Completed
  completedBody.innerHTML = '';
  if (completed.length === 0){
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4; td.textContent = t('empty_completed');
    tr.appendChild(td); completedBody.appendChild(tr);
  } else {
    for (const a of completed){
      const tr = document.createElement('tr');
      const dateStr = `${String(a.day).padStart(2,'0')}.${String(a.month).padStart(2,'0')}.${a.year}`;
      const timeStr = `${String(a.hour).padStart(2,'0')}:${String(a.minute).padStart(2,'0')}`;
      tr.innerHTML = `
        <td>${escapeHtml(a.title)}</td>
        <td>${escapeHtml(a.description || '')}</td>
        <td>${dateStr}</td>
        <td>${timeStr}</td>`;
      completedBody.appendChild(tr);
    }
  }
}

tableBody.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.getAttribute('data-action');
  const id = target.getAttribute('data-id');
  if (!action || !id) return;
  const appt = appointments.find(a => a.id === id);
  if (!appt) return;
  if (action === 'edit') openAppointmentDialog(appt);
  if (action === 'delete') { pendingDeleteId = id; openConfirmDialog(); }
  if (action === 'complete') { markComplete(id); }
});

function markComplete(id){
  const idx = appointments.findIndex(a => a.id === id);
  if (idx === -1) return;
  appointments[idx].completed = true;
  persist();
  renderAppointments();
}

function toggleSort(scope, key){
  const state = sortState[scope];
  if (state.key !== key){
    state.key = key; state.dir = 'asc';
  } else {
    state.dir = state.dir === 'asc' ? 'desc' : (state.dir === 'desc' ? 'none' : 'asc');
    if (state.dir === 'none') state.key = null;
  }
  renderAppointments();
}

function compareBy(key, dir, a, b){
  if (dir === 'none') return 0;
  let va, vb;
  if (key === 'title'){ va = (a.title||'').toLowerCase(); vb = (b.title||'').toLowerCase(); }
  else if (key === 'date'){
    // Build comparable number YYYYMMDDHHMM for strict order including time
    const na = Number(`${String(a.year).padStart(4,'0')}${String(a.month).padStart(2,'0')}${String(a.day).padStart(2,'0')}${String(a.hour).padStart(2,'0')}${String(a.minute).padStart(2,'0')}`);
    const nb = Number(`${String(b.year).padStart(4,'0')}${String(b.month).padStart(2,'0')}${String(b.day).padStart(2,'0')}${String(b.hour).padStart(2,'0')}${String(b.minute).padStart(2,'0')}`);
    va = na; vb = nb;
  } else { return 0; }
  const cmp = va < vb ? -1 : va > vb ? 1 : 0;
  return dir === 'asc' ? cmp : -cmp;
}

function updateAriaSort(th, state, key){
  if (!th) return;
  const isActive = state.key === key ? state.dir : 'none';
  th.setAttribute('aria-sort', isActive === 'none' ? 'none' : (isActive === 'asc' ? 'ascending' : 'descending'));
  th.classList.toggle('aria-sort-asc', isActive === 'asc');
  th.classList.toggle('aria-sort-none', isActive === 'none');
}

function openConfirmDialog(){
  lastFocusedBeforeDialog = document.activeElement;
  showModal(confirmDialog);
  document.getElementById('confirmNo').focus();
}

// Modal helpers (ARIA pattern inspired by WAI-ARIA APG)
function showModal(el){
  overlay.hidden = false; el.hidden = false;
  trapFocus(el);
  document.addEventListener('keydown', onEscClose, { once: true });
}
function closeDialog(el, restoreFocus){
  el.hidden = true; overlay.hidden = true; releaseFocus();
  if (restoreFocus && lastFocusedBeforeDialog instanceof HTMLElement) lastFocusedBeforeDialog.focus();
}

let focusTrapHandlers = null;
function trapFocus(container){
  const focusable = container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0]; const last = focusable[focusable.length-1];
  focusTrapHandlers = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', focusTrapHandlers);
}
function releaseFocus(){
  if (!focusTrapHandlers) return;
  dialog.removeEventListener('keydown', focusTrapHandlers);
  confirmDialog.removeEventListener('keydown', focusTrapHandlers);
  focusTrapHandlers = null;
}
function onEscClose(e){ if (e.key === 'Escape'){ if (!dialog.hidden) closeDialog(dialog, true); if (!confirmDialog.hidden) closeDialog(confirmDialog, true); } }

// Close dialog when clicking on overlay (topmost only)
overlay.addEventListener('click', () => {
  if (!confirmDialog.hidden) { closeDialog(confirmDialog, true); return; }
  if (!dialog.hidden) { closeDialog(dialog, true); }
});

// CSV export (separate for active/completed)
function exportCsv(type){
  const source = type === 'completed' ? appointments.filter(a=>a.completed) : appointments.filter(a=>!a.completed);
  const header = [t('th_title'),t('th_description'),t('label_day'),t('label_month'),t('label_year'),t('label_hour'),t('label_minute')];
  const rows = source.map(a => [a.title,a.description||'',a.day,a.month,a.year,a.hour,a.minute]);
  const csv = [header, ...rows].map(r => r.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const isCompleted = type === 'completed';
  const base = isCompleted ? 'completed' : 'active';
  a.href = url; a.download = `${base}-` + (t('csv_filename') || 'appointments.csv');
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

async function handleImportCsv(evt){
  const file = evt.target.files && evt.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = parseCsv(text);
    const header = parsed.shift() || [];
    // Map header indices in a case-insensitive way (supports EN/DE/SR)
    const h = header.map(h => h.trim().toLowerCase());
    const idx = {
      title: findHeaderIndex(h, ['title','titel','naziv']),
      description: findHeaderIndex(h, ['description','beschreibung','opis']),
      day: findHeaderIndex(h, ['day','tag','dan']),
      month: findHeaderIndex(h, ['month','monat','mesec','mesec']),
      year: findHeaderIndex(h, ['year','jahr','godina']),
      hour: findHeaderIndex(h, ['hour','stunde','sat']),
      minute: findHeaderIndex(h, ['minute','minute','minut']),
    };
    const imported = [];
    for (const row of parsed){
      const get = (i) => i >= 0 ? row[i] : '';
      const title = String(get(idx.title) || '').trim();
      if (!title) continue;
      const description = String(get(idx.description) || '').trim();
      const day = clampInt(get(idx.day), 1, 31);
      const month = clampInt(get(idx.month), 1, 12);
      const year = clampInt(get(idx.year), 1900, 3000);
      const hour = clampInt(get(idx.hour), 0, 23);
      const minute = clampInt(get(idx.minute), 0, 59);
      imported.push({ id: generateId(), title, description, day, month, year, hour, minute, completed: false });
    }
    if (imported.length){
      appointments = appointments.concat(imported);
      persist();
      renderAppointments();
      statusEl.textContent = `Imported ${imported.length} item(s).`;
    } else {
      statusEl.textContent = 'No valid rows found.';
    }
  } catch (err) {
    statusEl.textContent = 'Import failed.';
    console.error(err);
  } finally {
    evt.target.value = '';
  }
}

function parseCsv(text){
  const rows = [];
  let cur = '';
  let inQuotes = false;
  let row = [];
  for (let i=0;i<text.length;i++){
    const ch = text[i];
    if (inQuotes){
      if (ch === '"' && text[i+1] === '"'){ cur += '"'; i++; }
      else if (ch === '"'){ inQuotes = false; }
      else { cur += ch; }
    } else {
      if (ch === '"'){ inQuotes = true; }
      else if (ch === ','){ row.push(cur); cur = ''; }
      else if (ch === '\n' || ch === '\r'){
        if (cur !== '' || row.length){ row.push(cur); rows.push(row); row = []; cur=''; }
      } else { cur += ch; }
    }
  }
  if (cur !== '' || row.length){ row.push(cur); rows.push(row); }
  return rows;
}

function findHeaderIndex(headerRow, names){
  for (const name of names){
    const i = headerRow.indexOf(String(name).toLowerCase());
    if (i !== -1) return i;
  }
  return -1;
}

function clampInt(val, min, max){
  const n = parseInt(String(val||'').trim(), 10);
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}
function csvEscape(value){
  const s = String(value ?? '');
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g,'""') + '"';
  return s;
}

// Language
function initLanguage(){
  const lang = localStorage.getItem(LANG_KEY) || 'en';
  langSelect.value = lang; applyLanguage(lang);
}
function applyLanguage(lang){
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  // Update elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    el.textContent = dict[key] ?? I18N.en[key] ?? '';
  });
  // Also update dynamic labels in buttons inside table
  renderAppointments();
}
function t(key){
  const lang = langSelect.value || 'en';
  return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}

// Theme
function initTheme(){
  const value = localStorage.getItem(THEME_KEY) || 'system';
  const select = document.getElementById('themeSelect');
  if (select) select.value = value;
  applyTheme(value);
}
function applyTheme(value){
  const root = document.documentElement;
  root.classList.remove('theme-light','theme-dark');
  if (value === 'light') root.classList.add('theme-light');
  else if (value === 'dark') root.classList.add('theme-dark');
  // 'system' leaves classes off so OS preference applies
}

// Utils
function escapeHtml(str){
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function escapeAttr(str){ return escapeHtml(str).replace(/`/g,'&#096;'); }

// Expose open for external buttons
window.openAppointmentDialog = openAppointmentDialog;

function generateId(){
  try { if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID(); } catch {}
  return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2,8);
}


