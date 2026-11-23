let swapped = false, timer;
const URLS = { real: 'https://forum.example/thread/42', fake: 'https://forum-login.example/login' };
function win(title, evil, ...kids){ const w = el('div', 'win' + (evil ? ' evil' : '')); w.append(el('div', 'bar', title)); const b = el('div', 'body'); b.append(...kids); w.append(b); return w; }
function draw(mode, msg){
  const orig = swapped
    ? win(URLS.fake, true, el('span', 'tag', 'FAKE PAGE (simulation)'), el('p', '', 'Session expired. Please sign in again.'), el('p', 'mono', 'Email: [ ______ ]  Password: [ ______ ]'))
    : win(URLS.real, false, el('strong', '', 'Forum thread: Best study tips'), el('p', '', 'Sara: here is my guide, Read it. (the link)'));
  const nw = win('https://guide.example/tips  (new tab)', false, el('p', '', 'A friendly guide... while its script runs in the background.'));
  const label = el('p', 'mono', 'window.opener in the new tab = ' + (mode === 'vulnerable' ? 'Window { original tab }' : 'null'));
  const res = el('p', msg && msg.bad ? 'no' : 'ok', msg ? msg.text : '');
  show(el('strong', '', 'Original tab'), orig, el('strong', '', 'New tab'), nw, label, res);
}
function attempt(mode, wait){
  const go = () => {
    if (mode === 'vulnerable') { swapped = true; draw(mode, { bad: true, text: 'Attack worked: window.opener.location was changed to the fake login page.' }); }
    else draw(mode, { bad: false, text: "Blocked: TypeError: Cannot set properties of null (setting 'location'). rel=noopener removed the handle." });
  };
  clearTimeout(timer);
  if (wait) { draw(mode, { bad: false, text: 'You are reading the new tab... the original tab is about to change.' }); timer = setTimeout(go, 2000); } else go();
}
window.onModeChange = function(mode){ swapped = false; clearTimeout(timer); draw(mode); };
window.runPayload = function(name, mode){
  if (name === 'inspect') draw(mode, { bad: mode === 'vulnerable', text: mode === 'vulnerable' ? 'The new page can reach the original tab.' : 'No handle: the new page cannot reach the original tab.' });
  if (name === 'redirect') attempt(mode, false);
  if (name === 'delay') attempt(mode, true);
};
window.onModeChange('vulnerable');
