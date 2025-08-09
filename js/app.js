(function(){
  // Elements
  const langSelect = document.getElementById('language-select');
  const addBtn = document.getElementById('add-appointment-btn');
  const exportBtn = document.getElementById('export-csv-btn');
  const tbody = document.getElementById('appointments-tbody');
  const emptyState = document.getElementById('empty-state');

  // Dialogs
  const appointmentDialog = Dialog.create(
    document.getElementById('appointment-backdrop'),
    document.getElementById('appointment-dialog')
  );
  const confirmDialog = Dialog.create(
    document.getElementById('confirm-backdrop'),
    document.getElementById('confirm-dialog')
  );

  // Form fields
  const form = document.getElementById('appointment-form');
  const idInput = document.getElementById('appointment-id');
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('description');
  const daySelect = document.getElementById('day');
  const monthSelect = document.getElementById('month');
  const yearSelect = document.getElementById('year');
  const hourSelect = document.getElementById('hour');
  const minuteSelect = document.getElementById('minute');
  const cancelBtn = document.getElementById('cancel-btn');
  const dialogTitle = document.getElementById('appointment-dialog-title');

  // Confirm dialog
  const confirmCancel = document.getElementById('confirm-cancel');
  const confirmDelete = document.getElementById('confirm-delete');

  let currentLang = Store.getLanguage();
  let strings = I18N.getStrings(currentLang);
  let months = I18N.getMonths(currentLang);

  // Init language UI
  function applyLanguage(lang){
    currentLang = lang;
    Store.setLanguage(lang);
    strings = I18N.getStrings(lang);
    months = I18N.getMonths(lang);

    // Update lang attribute
    document.documentElement.lang = lang;

    // Update text nodes with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key]) el.textContent = strings[key];
    });

    // Update month select options while preserving selection
    const prevMonth = monthSelect.value;
    populateMonthOptions(monthSelect, months);
    if (prevMonth) monthSelect.value = prevMonth;

    // Update table and buttons that include text
    renderTable();
  }

  // Populate selects
  function populateDayOptions(select){
    select.innerHTML = '';
    for (let d=1; d<=31; d++){
      const opt = document.createElement('option');
      opt.value = String(d);
      opt.textContent = String(d);
      select.appendChild(opt);
    }
  }
  function populateMonthOptions(select, monthNames){
    select.innerHTML = '';
    for (let m=1; m<=12; m++){
      const opt = document.createElement('option');
      opt.value = String(m);
      opt.textContent = monthNames[m-1];
      select.appendChild(opt);
    }
  }
  function populateYearOptions(select){
    select.innerHTML = '';
    const now = new Date();
    const start = now.getFullYear();
    const end = start + 5;
    for (let y=start; y<=end; y++){
      const opt = document.createElement('option');
      opt.value = String(y);
      opt.textContent = String(y);
      select.appendChild(opt);
    }
    select.value = String(start); // preselect current year
  }
  function populateHourOptions(select){
    select.innerHTML = '';
    for (let h=0; h<=23; h++){
      const opt = document.createElement('option');
      opt.value = String(h).padStart(2,'0');
      opt.textContent = String(h).padStart(2,'0');
      select.appendChild(opt);
    }
  }
  function populateMinuteOptions(select){
    select.innerHTML = '';
    for (let m=0; m<=55; m+=5){
      const opt = document.createElement('option');
      opt.value = String(m).padStart(2,'0');
      opt.textContent = String(m).padStart(2,'0');
      select.appendChild(opt);
    }
  }

  function resetFormToNow(){
    form.reset();
    idInput.value = "";
    // Date defaults: today
    const now = new Date();
    daySelect.value = String(now.getDate());
    monthSelect.value = String(now.getMonth()+1);
    yearSelect.value = String(now.getFullYear());
    // Time defaults: next 5-min slot
    const minute = now.getMinutes();
    const next = Math.ceil(minute / 5) * 5;
    const nextMin = (next === 60) ? 0 : next;
    const hour = (next === 60) ? (now.getHours()+1) % 24 : now.getHours();
    hourSelect.value = String(hour).padStart(2,'0');
    minuteSelect.value = String(nextMin).padStart(2,'0');
    clearErrors();
  }

  function clearErrors(){
    ['title','day','month','year','hour','minute'].forEach(k=>{
      const el = document.getElementById(`${k}-error`);
      if (el) el.textContent = '';
    });
    [titleInput, daySelect, monthSelect, yearSelect, hourSelect, minuteSelect].forEach(el=>{
      el.setAttribute('aria-invalid','false');
    });
  }

  // Validation
  function validateForm(){
    let valid = true;
    clearErrors();
    if (!titleInput.value.trim()){
      setError(titleInput, 'title-error', strings.validationTitle);
      valid = false;
    }
    const y = parseInt(yearSelect.value,10);
    const m = parseInt(monthSelect.value,10);
    const d = parseInt(daySelect.value,10);
    const hh = parseInt(hourSelect.value,10);
    const mm = parseInt(minuteSelect.value,10);

    const dt = new Date(y, m-1, d, hh, mm, 0, 0);
    if (!(dt && dt.getFullYear()===y && dt.getMonth()===m-1 && dt.getDate()===d)){
      setError(daySelect, 'day-error', strings.validationDate);
      setError(monthSelect, 'month-error', '');
      setError(yearSelect, 'year-error', '');
      valid = false;
    }
    if (isNaN(hh) || isNaN(mm)){
      setError(hourSelect, 'hour-error', strings.validationTime);
      setError(minuteSelect, 'minute-error', '');
      valid = false;
    }
    return { valid, dt };
  }

  function setError(input, errId, message){
    input.setAttribute('aria-invalid','true');
    const e = document.getElementById(errId);
    if (e) e.textContent = message;
  }

  // Rendering
  function renderTable(){
    const list = Store.loadAppointments().sort((a,b)=> a.iso - b.iso);
    tbody.innerHTML = '';

    if (list.length === 0){
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
    }

    list.forEach(appt=>{
      const tr = document.createElement('tr');

      const tdTitle = document.createElement('td');
      tdTitle.textContent = appt.title;

      const tdDesc = document.createElement('td');
      tdDesc.textContent = appt.description || '';

      const dt = new Date(appt.iso);
      const tdDate = document.createElement('td');
      const tdTime = document.createElement('td');

      tdDate.textContent = formatDate(dt, currentLang);
      tdTime.textContent = `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;

      const tdActions = document.createElement('td');
      tdActions.className = 'row-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn';
      editBtn.textContent = strings.edit;
      editBtn.setAttribute('aria-label', `${strings.edit} “${appt.title}”`);
      editBtn.addEventListener('click', ()=>{
        openEdit(appt);
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'btn danger';
      delBtn.textContent = strings.delete;
      delBtn.setAttribute('aria-label', `${strings.delete} “${appt.title}”`);
      delBtn.addEventListener('click', ()=>{
        openDelete(appt.id);
      });

      tdActions.append(editBtn, delBtn);
      tr.append(tdTitle, tdDesc, tdDate, tdTime, tdActions);
      tbody.appendChild(tr);
    });
  }

  function formatDate(dt, lang){
    const y = dt.getFullYear();
    const m = dt.getMonth() + 1;
    const d = dt.getDate();
    // Use localized month name: D Month YYYY
    const name = I18N.getMonths(lang)[m-1];
    return `${d} ${name} ${y}`;
  }

  // Open/close flows
  function openAdd(){
    dialogTitle.textContent = strings.addDialogTitle;
    resetFormToNow();
    appointmentDialog.open();
    titleInput.focus();
  }

  function openEdit(appt){
    dialogTitle.textContent = strings.editDialogTitle;
    clearErrors();
    idInput.value = appt.id;
    titleInput.value = appt.title;
    descInput.value = appt.description || '';
    const dt = new Date(appt.iso);
    daySelect.value = String(dt.getDate());
    monthSelect.value = String(dt.getMonth()+1);
    yearSelect.value = String(dt.getFullYear());
    hourSelect.value = String(dt.getHours()).padStart(2,'0');
    minuteSelect.value = String(dt.getMinutes()).padStart(2,'0');
    appointmentDialog.open();
    titleInput.focus();
  }

  let deleteTargetId = null;
  function openDelete(id){
    deleteTargetId = id;
    confirmDialog.open();
  }

  // CSV export
  function exportCSV(){
    const list = Store.loadAppointments().sort((a,b)=> a.iso - b.iso);
    const header = ['Title','Description','Date','Time','ISODateTime'];
    const rows = [header];
    list.forEach(a=>{
      const dt = new Date(a.iso);
      const dateStr = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
      const timeStr = `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
      rows.push([
        a.title,
        a.description || '',
        dateStr,
        timeStr,
        dt.toISOString()
      ]);
    });
    const csv = rows.map(r=> r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\r\n');
    const blob = new Blob(["\uFEFF"+csv], { type: "text/csv;charset=utf-8" }); // BOM for Excel
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "appointments.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Submit handler
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const { valid, dt } = validateForm();
    if (!valid) return;
    const id = idInput.value || `appt_${Date.now()}`;
    const appt = {
      id,
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
      iso: dt.getTime()
    };
    Store.upsertAppointment(appt);
    renderTable();
    appointmentDialog.close();
    form.reset();
  });

  // Cancel/close
  cancelBtn.addEventListener('click', ()=> appointmentDialog.close());

  // Confirm dialog controls
  confirmCancel.addEventListener('click', ()=> confirmDialog.close());
  confirmDelete.addEventListener('click', ()=>{
    if (deleteTargetId){
      Store.deleteAppointment(deleteTargetId);
      renderTable();
    }
    deleteTargetId = null;
    confirmDialog.close();
  });

  // Add/open
  addBtn.addEventListener('click', openAdd);

  // Export
  exportBtn.addEventListener('click', exportCSV);

  // Initialize selects (once)
  populateDayOptions(daySelect);
  populateMonthOptions(monthSelect, months);
  populateYearOptions(yearSelect);
  populateHourOptions(hourSelect);
  populateMinuteOptions(minuteSelect);

  // Initialize language selector and apply
  langSelect.value = currentLang;
  applyLanguage(currentLang);
  langSelect.addEventListener('change', (e)=> applyLanguage(e.target.value));

  // Ensure default “current” selections on initial add only (on open)
  // The form stays hidden by default; no changes until user opens it.
  // Render table initially
  renderTable();
})();
