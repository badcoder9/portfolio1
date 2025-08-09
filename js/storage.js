window.Store = (function(){
  const APPTS_KEY = "appointments";
  const LANG_KEY  = "preferredLanguage";

  function loadAppointments(){
    try {
      const raw = localStorage.getItem(APPTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  function saveAppointments(list){
    localStorage.setItem(APPTS_KEY, JSON.stringify(list));
  }
  function upsertAppointment(appt){
    const list = loadAppointments();
    const idx = list.findIndex(a => a.id === appt.id);
    if (idx >= 0) list[idx] = appt;
    else list.push(appt);
    saveAppointments(list);
    return list;
  }
  function deleteAppointment(id){
    const list = loadAppointments().filter(a => a.id !== id);
    saveAppointments(list);
    return list;
  }
  function setLanguage(lang){ localStorage.setItem(LANG_KEY, lang); }
  function getLanguage(){ return localStorage.getItem(LANG_KEY) || "en"; }

  return {
    loadAppointments, saveAppointments, upsertAppointment, deleteAppointment,
    setLanguage, getLanguage
  };
})();
