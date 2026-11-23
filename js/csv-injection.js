const PAYLOADS = { link: '=HYPERLINK("https://attacker.example","Click me")', math: '=1+1' };
const BASE = { name: 'Yousef', email: 'yousef@mail.example' };
function exportCsv(customers, mode){
  const rows = customers.map(c => {
    const name = mode === 'fixed' && /^[=+\-@\t\r]/.test(c.name) ? "'" + c.name : c.name;
    return `"${name.replace(/"/g, '""')}",${c.email}`;
  });
  return ['name,email', ...rows].join('\n');
}
function evalCell(v){
  if (!/^[=+\-@]/.test(v)) return { t: v };
  const h = v.match(/^=HYPERLINK\("([^"]+)","([^"]+)"\)$/i);
  if (h) return { t: h[2], link: h[1] };
  const inner = v.slice(1).replace(/^SUM\((.*)\)$/i, '$1');
  if (/^\d+(\+\d+)*$/.test(inner)) return { t: String(inner.split('+').reduce((a, b) => a + Number(b), 0)), formula: true };
  return { t: v };
}
function unquote(c){ return c.startsWith('"') ? c.slice(1, c.lastIndexOf('",')).replace(/""/g, '"') : c; }
let lastCsv = '';
function draw(mode, payload){
  const csv = exportCsv(payload ? [BASE, { name: payload, email: 'x@mail.example' }] : [BASE], mode);
  const table = el('table'); const head = el('tr'); ['name', 'email'].forEach(h => head.append(el('th', '', h))); table.append(head);
  lastCsv = csv;
  let hit = false;
  csv.split('\n').slice(1).forEach(line => {
    const tr = el('tr'); const name = unquote(line); const r = evalCell(name);
    const td = el('td'); if (r.link) {
      const a = el('a', 'xl-link', r.t); a.href = 'attacker.html'; a.target = '_blank'; a.rel = 'noopener noreferrer';
      td.append(a, el('div', 'no', 'Click the link: it opens ' + r.link + ' (a local simulated page, not a real site)')); hit = true;
    } else { td.textContent = r.t; if (r.formula) hit = true; }
    tr.append(td, el('td', '', line.slice(line.lastIndexOf('",') + 2))); table.append(tr);
  });
  const res = payload ? (hit ? el('p', 'no', 'Attack worked: the spreadsheet ran the cell as a formula.') : el('p', 'ok', 'Blocked: the cell is shown as plain text.')) : el('p', '', '');
  show(el('strong', '', 'Exported CSV file'), el('div', 'mono win body', csv), el('strong', '', 'Simulated spreadsheet'), table, res);
}
window.onModeChange = function(mode){ draw(mode); };
window.runPayload = function(name, mode){ draw(mode, PAYLOADS[name]); };
document.getElementById('dl').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lastCsv + '\n'], { type: 'text/csv' }));
  a.download = 'report.csv'; document.body.append(a); a.click(); a.remove();
});
window.onModeChange('vulnerable');
