// Shared by every lab page. Each page defines window.runPayload(name, mode).
const out = document.getElementById('out');
function setMode(mode){
  document.body.dataset.mode = mode;
  document.querySelectorAll('.switch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  document.querySelectorAll('[data-show]').forEach(el => el.hidden = el.dataset.show !== mode);
  out.textContent = 'Press a payload to see what happens.'; if (window.onModeChange) window.onModeChange(mode);
}
document.querySelectorAll('.switch button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
document.querySelectorAll('.payloads button').forEach(b => b.addEventListener('click', () => window.runPayload(b.dataset.payload, document.body.dataset.mode)));
setMode('vulnerable');
function el(tag, cls, text){ const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
function show(...nodes){ out.replaceChildren(...nodes); }
