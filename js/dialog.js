// Minimal accessible modal helper inspired by ARIA dialog pattern:
// - Sets aria-modal, traps focus, restores focus to trigger, closes on ESC and close/cancel buttons.
window.Dialog = (function(){
  function getFocusable(root){
    return [...root.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(el => el.offsetParent !== null || el === document.activeElement);
  }

  function create(backdropEl, dialogEl){
    let lastFocus = null;
    function open(){
      lastFocus = document.activeElement;
      backdropEl.hidden = false;
      dialogEl.hidden = false;
      document.body.style.overflow = "hidden";
      // Trap focus
      const focusables = getFocusable(dialogEl);
      (focusables[0] || dialogEl).focus();
      document.addEventListener('keydown', onKeydown, true);
      document.addEventListener('focus', onFocus, true);
    }
    function close(){
      dialogEl.hidden = true;
      backdropEl.hidden = true;
      document.body.style.overflow = "";
      document.removeEventListener('keydown', onKeydown, true);
      document.removeEventListener('focus', onFocus, true);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function onKeydown(e){
      if (e.key === 'Escape'){
        e.stopPropagation();
        close();
      } else if (e.key === 'Tab'){
        const f = getFocusable(dialogEl);
        if (f.length === 0){ e.preventDefault(); return; }
        const index = f.indexOf(document.activeElement);
        let nextIndex = index;
        if (e.shiftKey) nextIndex = index <= 0 ? f.length - 1 : index - 1;
        else nextIndex = index === f.length - 1 ? 0 : index + 1;
        if (index === -1){
          e.preventDefault();
          f[0].focus();
        } else if ((e.shiftKey && index === 0) || (!e.shiftKey && index === f.length - 1)){
          e.preventDefault();
          f[nextIndex].focus();
        }
      }
    }
    function onFocus(e){
      if (!dialogEl.hidden && !dialogEl.contains(e.target)){
        const f = getFocusable(dialogEl);
        (f[0] || dialogEl).focus();
        e.stopPropagation();
      }
    }
    backdropEl.addEventListener('click', () => close());
    const closeBtn = dialogEl.querySelector('.dialog-close');
    if (closeBtn) closeBtn.addEventListener('click', close);

    return { open, close, el: dialogEl };
  }

  return { create };
})();
