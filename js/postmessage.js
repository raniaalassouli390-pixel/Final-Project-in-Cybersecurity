const ALLOWED = ['https://bank.example'];
const TOKEN = 'demo-token-1234';
const EVENTS = {
  steal: { origin: 'https://evil.example', data: { action: 'getToken' } },
  lookalike: { origin: 'https://bank.example.evil.com', data: { action: 'getToken' } }
};
const statusEl = document.getElementById('status');
let leaked = false;

function log(text, cls){ out.append(el('div', cls || '', text)); out.scrollTop = out.scrollHeight; }

function drawStatus(mode){
  statusEl.className = 'status' + (leaked ? ' bad' : mode === 'fixed' ? ' good' : '');
  statusEl.replaceChildren(
    el('small', '', 'Account email'), el('b', '', 'student@example.test'),
    el('small', '', 'Session token'), el('b', '', TOKEN + (leaked ? ' (LEAKED)' : ' (private)')),
    el('small', '', 'Status'), el('b', '', leaked ? 'Compromised' : mode === 'fixed' ? 'Protected' : 'Normal')
  );
}

function handle(e, mode){
  if (mode === 'fixed' && !ALLOWED.includes(e.origin)) {
    log('\u2713 Blocked: origin \u201c' + e.origin + '\u201d is not in the allow-list', 'l-ok');
    return;
  }
  if (e.data.action === 'getToken') {
    leaked = true;
    log('\u2192 token sent to ANY origin (*)', 'l-bad');
    log('Attacker at ' + e.origin + ' now holds: ' + TOKEN, 'l-bad');
  }
}

window.onModeChange = function(mode){
  leaked = false; out.replaceChildren();
  log(mode === 'fixed' ? 'Switched to the fixed version.' : 'Press a payload to start.');
  drawStatus(mode);
};
window.runPayload = function(name, mode){
  const e = EVENTS[name];
  log('Message from ' + e.origin + ':'); log(JSON.stringify(e.data));
  handle(e, mode); drawStatus(mode);
};
document.getElementById('reset').addEventListener('click', ev => { ev.preventDefault(); window.onModeChange(document.body.dataset.mode); });
window.onModeChange('vulnerable');
